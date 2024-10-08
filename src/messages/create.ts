import type { MessageAttachment } from '@slack/web-api';

const SLACK_MESSAGE_COLOR = '#228BFF';

function createMessageBody(
  time: string,
  info: string | undefined,
  body: string[],
  isDev: boolean,
): string {
  const message = [`${time} ${info}`];

  if (isDev) {
    message.push('### This information is a test distribution ###');
  }

  message.push(...body, '#evacuate');

  return message.join('\n');
}

export function createEarthquakeMessage(
  time: string,
  info: string | undefined,
  scale: string,
  points: string,
  isDev: boolean,
): string {
  const body = [`Maximum Seismic Intensity ${scale}`, '', `${points}`];

  return createMessageBody(time, info, body, isDev);
}

export function createTsunamiMessage(
  time: string,
  info: string | undefined,
  area: string,
  isDev: boolean,
): string {
  const body = [
    'There is new information in the following areas',
    '',
    `${area}`,
  ];

  return createMessageBody(time, info, body, isDev);
}

export function createSlackMessage(text: string): MessageAttachment[] {
  if (!text.trim()) {
    throw new Error('Input text is empty or whitespace');
  }

  const lines = text.split('\n').filter((line) => line.trim() !== '');

  if (lines.length === 0) {
    throw new Error('No valid lines found in input text');
  }

  const maxLine = lines.find((line) =>
    line.startsWith('Maximum Seismic Intensity'),
  );

  if (!maxLine) {
    throw new Error('Maximum Seismic Intensity information not found');
  }

  const max = Number.parseInt(
    maxLine.replace('Maximum Seismic Intensity ', ''),
    10,
  );

  if (Number.isNaN(max)) {
    throw new Error('Invalid Maximum Seismic Intensity value');
  }

  const area = new Map<string, string>();

  for (const line of lines.slice(2)) {
    const match = line.match(/\[Seismic Intensity (\d)\] (.+)/);
    if (match) {
      const intensity = match[1];
      const regions = match[2];
      area.set(intensity, regions);
    }
  }

  const attachments: MessageAttachment[] = [
    {
      fallback: `${lines[0]}: Maximum Seismic Intensity ${max}`,
      color: SLACK_MESSAGE_COLOR,
      title: lines[0],
      text: `Maximum Seismic Intensity ${max}`,
      fields: [
        ...Array.from(area.entries()).map(([intensity, regions]) => ({
          title: `Seismic Intensity ${intensity}`,
          value: regions,
          short: true,
        })),
      ],
    },
  ];

  return attachments;
}
