import { BskyAgent } from '@atproto/api';
import WebSocket from 'ws';

const USERNAME: string = process.env.USERNAME!;
const PASSWORD: string = process.env.PASSWORD!;

const agent = new BskyAgent({
  service: 'https://bsky.social', // Not a .app domain
});

async () => {
  await agent.login({
    identifier: USERNAME, // Username
    password: PASSWORD, // Password
  });
};

function parseScale(scale: number): string | undefined {
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
      return '5弱';
    case 50:
      return '5強';
    case 55:
      return '6弱';
    case 60:
      return '6強';
    case 70:
      return '7';
    default:
      return undefined;
  }
}

function parseCode(code: number): string | undefined {
  switch (code) {
    case 551:
      return '地震情報';
    case 552:
      return '津波情報';
    case 554:
      return '緊急地震速報 発表検出';
    case 556:
      return '緊急地震速報（警報）';
    case 561:
      return '地震感知情報';
    case 9611:
      return '地震感知情報 解析結果';
    default:
      return undefined;
  }
}

interface Point {
  pref: string;
  scale: number;
}

function parsePoints(points: Point[]): string {
  const pointsInfo: string[] = [];
  const prevPref: string[] = [];
  for (const point of points) {
    const pref = point.pref;
    if (!prevPref.includes(pref)) {
      prevPref.push(pref);
      const scale = parseScale(point.scale);
      pointsInfo.push(`${pref} 震度${scale}`);
    }
  }
  return pointsInfo.join('\n');
}

function onMessage(_ws: WebSocket, message: WebSocket.Data) {
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
      agent.post({
        text: `${time} ${earthQuakeInfo}\n最大震度${parsedScale}\n\n${points}`,
      });
    }
  }
}

function onError(_ws: WebSocket, error: Error) {
  console.error(error);
}

function onClose(_ws: WebSocket, code: number, reason: string) {
  console.log('### closed ###', code, reason);
}

function onOpen(_ws: WebSocket) {
  console.log('Opened connection');
}

const ws = new WebSocket('wss://api.p2pquake.net/v2/ws');

ws.on('open', onOpen);
ws.on('message', onMessage);
ws.on('error', onError);
ws.on('close', onClose);
