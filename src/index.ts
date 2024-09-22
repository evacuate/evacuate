import { AtpAgent } from '@atproto/api';
import nrPino from '@newrelic/pino-enricher';
import pino from 'pino';
import WebSocket from 'ws';
import env from './env';

// Import other proprietary functions
import { handleEarthquake, handleTsunami } from './messages/handle';
import { availableServices } from './services';

// Import Types
import type { JMAQuake, JMATsunami } from './types';

const logger = pino(nrPino());

const BLUESKY_EMAIL = env.BLUESKY_EMAIL;
const BLUESKY_PASSWORD = env.BLUESKY_PASSWORD;
const NODE_ENV: 'development' | 'production' = env.NODE_ENV ?? 'development';

const isDev: boolean = NODE_ENV === 'development';

const agent = new AtpAgent({
  service: 'https://bsky.social',
});

const RECONNECT_DELAY: number = 5000; // 5 seconds
let isFirstRun = true; // Flag to check if it's the initial run

async function initWebSocket(): Promise<void> {
  try {
    if (BLUESKY_EMAIL !== undefined && BLUESKY_PASSWORD !== undefined) {
      await agent.login({
        identifier: BLUESKY_EMAIL,
        password: BLUESKY_PASSWORD,
      });
    }

    // Log the services that are available
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
    logger.error('Error during login or WebSocket initialization: ', error);
  }
}

// Initialize the WebSocket connection
void (async () => {
  await initWebSocket();
})();

function onMessage(message: WebSocket.Data): void {
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

function onError(error: string): void {
  logger.error('WebSocket connection error:', error);
}

function onClose(code: number, reason: string): void {
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

function onOpen(): void {
  logger.info('WebSocket connection opened.');
}
