import { BskyAgent, RichText } from '@atproto/api';
import WebSocket from 'ws';
import env from './env';

// Import Helper Functions
import parsePoints from './helpers/parsePoints';
import parseScale from './helpers/parseScale';
import parseCode from './helpers/parseCode';

const EMAIL: string = env.EMAIL;
const PASSWORD: string = env.PASSWORD!;

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

    const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');

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
  const code = earthQuakeData.code;
  if (code === 551) {
    const earthQuakeInfo = parseCode(code);
    const points = parsePoints(earthQuakeData.points);
    const earthQuake = earthQuakeData.earthquake;
    const time = earthQuake.time;
    const maxScale = earthQuake.maxScale;
    const parsedScale = parseScale(maxScale);

    if (parsedScale !== undefined) {
      const message = `${time} ${earthQuakeInfo}\nMaximum Seismic Intensity ${parsedScale}\n\n${points}\n#evacuate`;

      const rt = new RichText({ text: message });
      await rt.detectFacets(agent);

      // Post to bsky.social
      agent
        .post({
          text: rt.text,
          facets: rt.facets,
          langs: ['en', 'ja'],
        })
        .then(() => {
          console.log('Transmission has been completed!');
        })
        .catch((error) => {
          console.error('Failed to post:', error);
        });
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
