import { BskyAgent, RichText } from '@atproto/api';
import translate from './translate';
import WebSocket from 'ws';
import env from './env';
import console from 'console';

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

function parseScale(scale: number): string {
  switch (scale) {
    case 10:
      return '1';
    case 20:
      return '2';
    case 30:
      return '3';
    case 40:
      return '4';
    case 45:
      return '5 weak';
    case 50:
      return '5 strong';
    case 55:
      return '6 weak';
    case 60:
      return '6 strong';
    case 70:
      return '7';
    default:
      return 'Unknown';
  }
}

function parseCode(code: number): string | undefined {
  switch (code) {
    case 551:
      return 'Earthquake Information';
    case 552:
      return 'Tsunami Information';
    case 554:
      return 'Earthquake Early Warning Detected';
    case 556:
      return 'Earthquake Early Warning (Alert)';
    case 561:
      return 'Earthquake Detection Information';
    case 9611:
      return 'Earthquake Detection Analysis Results';
    default:
      return undefined;
  }
}

interface Point {
  pref: string;
  scale: number;
}

function parsePoints(points: Point[]): string {
  const scaleMap: { [key: string]: Set<string> } = {};
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);
    if (scale !== undefined) {
      if (!scaleMap[scale]) {
        scaleMap[scale] = new Set();
      }
      scaleMap[scale].add(translate(pref));
    }
  }

  const pointsInfo: string[] = [];
  for (const scale in scaleMap) {
    const regions = Array.from(scaleMap[scale]).join(', ');
    pointsInfo.push(`[Seismic Intensity ${scale}] ${regions}`);
  }

  return pointsInfo.join('\n');
}

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

      agent.post({
        text: rt.text,
        facets: rt.facets,
        langs: ['en', 'ja'],
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
