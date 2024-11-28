import { AtpAgent } from '@atproto/api';
import pino from 'pino';
import WebSocket from 'ws';
import env from '~/env';
import serve from '~/routes';

// Import other proprietary functions
import { handleEarthquake, handleTsunami } from '~/messages/handle';
import { availableServices } from '~/services';

// Import Types
import type { JMAQuake, JMATsunami } from '~/types';

const BLUESKY_EMAIL = env.BLUESKY_EMAIL;
const BLUESKY_PASSWORD = env.BLUESKY_PASSWORD;
const NODE_ENV: 'development' | 'production' = env.NODE_ENV ?? 'development';

const isDev: boolean = NODE_ENV === 'development';

const agent = new AtpAgent({
  service: 'https://bsky.social',
});

const RECONNECT_DELAY: number = 5000; // 5 seconds
let isFirstRun = true; // Flag to check if it's the initial run

async function initLogger() {
  if (NODE_ENV === 'production' && env.PRODUCTION_LOGGING !== false) {
    console.log('Using New Relic Pino Enricher');
    const nrPino = (await import('@newrelic/pino-enricher')).default;
    return pino(nrPino());
  }
  return pino();
}

const loggerPromise = initLogger();

export async function getLogger() {
  return await loggerPromise;
}

// Initialize the HTTP server
async function initServer(): Promise<void> {
  try {
    await serve();
    const logger = await getLogger();
    logger.info('HTTP server started successfully');
  } catch (error) {
    const logger = await getLogger();
    logger.error('Failed to start HTTP server:', error);
    process.exit(1);
  }
}

async function initWebSocket(): Promise<void> {
  try {
    if (BLUESKY_EMAIL !== undefined && BLUESKY_PASSWORD !== undefined) {
      await agent.login({
        identifier: BLUESKY_EMAIL,
        password: BLUESKY_PASSWORD,
      });
    }

    // Log the services that are available
    const logger = await getLogger();
    logger.info(
      `Make a submission for the following services: ${availableServices().join(', ')}`,
    );

    if (agent.session !== undefined && isFirstRun) {
      logger.info('Logged in successfully.');
      logger.info(`Now running in ${NODE_ENV} mode.`);
      isFirstRun = false; // Set the flag to false after the first run
    }

    const url = isDev
      ? 'wss://api-realtime-sandbox.p2pquake.net/v2/ws'
      : 'wss://api.p2pquake.net/v2/ws';

    const socket = new WebSocket(url);

    // WebSocket event listeners
    socket.onopen = () => {
      onOpen();
    };

    socket.onmessage = (message) => {
      onMessage(message.data);
    };

    socket.onerror = (error) => {
      onError(error.message);
    };

    socket.onclose = (events) => {
      onClose(events.code, events.reason);
    };
  } catch (error) {
    const logger = await getLogger();
    logger.error('Error during login or WebSocket initialization: ', error);
  }
}

// Initialize the WebSocket connection
void (async () => {
  await initServer();
  await initWebSocket();
})();

async function onMessage(message: WebSocket.Data): Promise<void> {
  const logger = await getLogger();
  if (isDev) logger.debug('Message received from server.');
  const earthQuakeData = JSON.parse(message.toString() as string) as
    | JMAQuake
    | JMATsunami;

  if (earthQuakeData.code === 551) {
    handleEarthquake(earthQuakeData as JMAQuake, agent, isDev);
  } else if (earthQuakeData.code === 552) {
    handleTsunami(earthQuakeData as JMATsunami, agent, isDev);
  } else {
    if (isDev) {
      logger.warn(
        'Unknown message code: ',
        (earthQuakeData as JMAQuake | JMATsunami).code,
      );
    }
  }
}

async function onError(error: string): Promise<void> {
  const logger = await getLogger();
  logger.error('WebSocket connection error:', error);
}

async function onClose(code: number, reason: string): Promise<void> {
  const logger = await getLogger();
  logger.info('WebSocket connection closed:', {
    code,
    reason: reason.toString(),
  });

  // Attempt to reconnect after a delay
  setTimeout(() => {
    logger.info('Attempting to reconnect...');
    void initWebSocket();
  }, RECONNECT_DELAY);
}

async function onOpen(): Promise<void> {
  const logger = await getLogger();
  logger.info('WebSocket connection opened.');
}
