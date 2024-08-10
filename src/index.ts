import { BskyAgent, RichText } from '@atproto/api';
import WebSocket from 'ws';
import env from './env';

// Import Helper Functions
import parsePoints from './helpers/parsePoints';
import parseScale from './helpers/parseScale';
import parseCode from './helpers/parseCode';

// Import createMessage Function
import createMessage from './helpers/createMessage';

const EMAIL: string = env.EMAIL;
const PASSWORD: string = env.PASSWORD!;
const NODE_ENV: 'development' | 'production' = env.NODE_ENV || 'development';

const isDev = NODE_ENV === 'development';

const agent = new BskyAgent({
  service: 'https://bsky.social', // Not a .app domain
});

(async () => {
  try {
    await agent.login({
      identifier: EMAIL, // Email
      password: PASSWORD, // Password
    });

    // Check if logged in
    if (agent.session !== undefined) {
      console.log('Logged in');
    }

    // Changing URLs in the development environment
    const url = isDev
      ? 'wss://api-realtime-sandbox.p2pquake.net/v2/ws'
      : 'wss://api.p2pquake.net/v2/ws';

    const ws = new WebSocket(url);

    ws.on('open', onOpen);
    ws.on('message', (message) => onMessage(ws, message));
    ws.on('error', (error) => onError(ws, error));
    ws.on('close', (code, reason) => onClose(ws, code, reason));
  } catch (error) {
    console.error('Failed to log in or establish WebSocket connection:', error);
  }
})();

async function onMessage(_ws: WebSocket, message: WebSocket.Data) {
  const earthQuakeData = JSON.parse(message.toString());

  // Asynchronous processing
  processMessage(earthQuakeData).catch(console.error);
}

async function processMessage(earthQuakeData: any): Promise<void> {
  const code = earthQuakeData.code;
  if (code === 551) {
    const info = parseCode(code);
    const points = parsePoints(earthQuakeData.points);
    const earthQuake = earthQuakeData.earthquake;
    const time = earthQuake.time;
    const maxScale = earthQuake.maxScale;
    const scale = parseScale(maxScale);

    if (scale !== undefined) {
      const text = createMessage(time, info, scale, points, isDev);
      const rt = new RichText({ text });
      await rt.detectFacets(agent);

      await agent.post({
        text: rt.text,
        facets: rt.facets,
        langs: ['en', 'ja'],
      });

      console.log('Transmission has been completed!');
    }
  }
}

function onError(_ws: WebSocket, error: Error): void {
  console.error(error);
}

function onClose(_ws: WebSocket, code: number, reason: Buffer): void {
  console.log('### closed ###', code, reason);
}

function onOpen(_ws: WebSocket): void {
  console.log('Opened connection');
}
