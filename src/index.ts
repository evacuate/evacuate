import { AtpAgent, RichText } from '@atproto/api';
import WebSocket from 'ws';
import env from './env';

// Import Helper Functions
import parsePoints from './helpers/parsePoints';
import parseScale from './helpers/parseScale';
import parseCode from './helpers/parseCode';
import parseArea from './helpers/parseArea';

// Import Message Functions
import { createMessage, createTsunamiMessage } from './helpers/messageCreator';

// Import Types
import { JMAQuake, JMATsunami } from './types';

const BLUESKY_EMAIL: string = env.BLUESKY_EMAIL;
const BLUESKY_PASSWORD: string = env.BLUESKY_PASSWORD!;
const NODE_ENV: 'development' | 'production' = env.NODE_ENV || 'development';

const isDev = NODE_ENV === 'development';

const agent = new AtpAgent({
  service: 'https://bsky.social',
});

(async () => {
  try {
    await agent.login({
      identifier: BLUESKY_EMAIL,
      password: BLUESKY_PASSWORD,
    });

    if (agent.session !== undefined) {
      console.log('Logged in successfully.');
    }

    const url = isDev
      ? 'wss://api-realtime-sandbox.p2pquake.net/v2/ws'
      : 'wss://api.p2pquake.net/v2/ws';

    console.log(`Now running in ${NODE_ENV} mode.`);
    const ws = new WebSocket(url);

    ws.on('open', onOpen);
    ws.on('message', (message) => onMessage(ws, message));
    ws.on('error', (error) => onError(ws, error));
    ws.on('close', (code, reason) => onClose(ws, code, reason));
  } catch (error) {
    console.error('Error during login or WebSocket initialization:', error);
  }
})();

async function onMessage(_ws: WebSocket, message: WebSocket.Data) {
  if (isDev) console.debug('Message received from server.');
  const earthQuakeData = JSON.parse(message.toString());

  // Asynchronous processing
  processMessage(earthQuakeData).catch(console.error);
}

async function processMessage(
  earthQuakeData: JMAQuake | JMATsunami,
): Promise<void> {
  const code = earthQuakeData.code;

  // Output the status code to the log
  console.log(`Received message with status code: ${code}`);

  if (code === 551) {
    const info = parseCode(code);
    const points = parsePoints(earthQuakeData.points);
    const earthQuake = earthQuakeData.earthquake;
    const time = earthQuake.time;
    const maxScale = earthQuake.maxScale;
    const scale = parseScale(maxScale ?? -1);

    if (scale !== undefined) {
      const text = createMessage(time, info, scale, points, isDev);
      const rt = new RichText({ text });
      await rt.detectFacets(agent);

      await agent.post({
        text: rt.text,
        facets: rt.facets,
        langs: ['en', 'ja'],
      });

      console.log('Earthquake alert received and posted successfully.');
    } else {
      console.warn('Earthquake scale is undefined.');
    }
  } else if (code === 552) {
    const info = parseCode(code);
    const area = parseArea(earthQuakeData.areas);
    const areaResult: string = area.join(', ');
    const time = earthQuakeData.time.replace(/\.\d+$/, '');

    if (area.length > 0) {
      const text = createTsunamiMessage(time, info, areaResult, isDev);
      const rt = new RichText({ text });
      await rt.detectFacets(agent);

      await agent.post({
        text: rt.text,
        facets: rt.facets,
        langs: ['en', 'ja'],
      });

      console.log('Tsunami alert received and posted successfully.');
    } else {
      console.warn('Tsunami area is undefined.');
    }
  } else {
    if (isDev) console.warn('Unknown message code:', code);
  }
}

function onError(_ws: WebSocket, error: Error): void {
  console.error('WebSocket encountered an error:', error);
}

function onClose(_ws: WebSocket, code: number, reason: Buffer): void {
  console.log('WebSocket connection closed:', {
    code,
    reason: reason.toString(),
  });
}

function onOpen(_ws: WebSocket): void {
  console.log('WebSocket connection opened.');
}
