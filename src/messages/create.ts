import type { MessageAttachment } from '@slack/web-api';
import env from '~/env';
import { getHashtags } from '~/utils/hashtags';
import translate from '~/translate';
import { MessageKey } from '~/types/translate';

const SLACK_MESSAGE_COLOR = '#228BFF';

function createMessageBody(
  time: string,
  info: string | undefined,
  body: string[],
  isDev: boolean,
): string {
  const message = [`${time} ${info}`];

  if (isDev) {
    message.push(
      translate('message', MessageKey.TEST_DISTRIBUTION, env.LANGUAGE),
    );
  }

  message.push(...body, getHashtags().join(' '));

  return message.join('\n');
}

export function createEarthquakeMessage(
  time: string,
  info: string | undefined,
  scale: string,
  points: string,
  isDev: boolean,
): string {
  const body = [
    `${translate('message', MessageKey.MAX_SEISMIC_INTENSITY, env.LANGUAGE)} ${scale}`,
    '',
    `${points}`,
  ];

  return createMessageBody(time, info, body, isDev);
}

export function createTsunamiMessage(
  time: string,
  info: string | undefined,
  area: string,
  isDev: boolean,
): string {
  const body = [
    translate('message', MessageKey.NEW_INFORMATION, env.LANGUAGE),
    '',
    `${area}`,
  ];

  return createMessageBody(time, info, body, isDev);
}

export function createSlackMessage(text: string): MessageAttachment[] {
  if (!text.trim()) {
    throw new Error('Input text is empty or whitespace');
  }

  const maxSeismicIntensity = translate(
    'message',
    MessageKey.MAX_SEISMIC_INTENSITY,
    env.LANGUAGE,
  );
  const lines = text.split('\n').filter((line) => line.trim() !== '');

  if (lines.length === 0) {
    throw new Error('No valid lines found in input text');
  }

  const maxLine = lines.find((line) => line.startsWith(maxSeismicIntensity));

  if (!maxLine) {
    throw new Error('Maximum Seismic Intensity information not found');
  }

  const max = Number.parseInt(
    maxLine.replace(`${maxSeismicIntensity} `, ''),
    10,
  );

  if (Number.isNaN(max)) {
    throw new Error('Invalid Maximum Seismic Intensity value');
  }

  const area = new Map<string, string>();

  const seismicIntensityLabel = translate(
    'message',
    MessageKey.SEISMIC_INTENSITY,
    env.LANGUAGE,
  );
  const pattern = new RegExp(`\\[${seismicIntensityLabel} ([^\\]]+)\\] (.+)`);

  for (const line of lines.slice(2)) {
    const match = line.match(pattern);
    if (match) {
      const intensity = match[1];
      const regions = match[2];
      area.set(intensity, regions);
    }
  }

  const attachments: MessageAttachment[] = [
    {
      fallback: `${lines[0]}: ${maxSeismicIntensity} ${max}`,
      color: SLACK_MESSAGE_COLOR,
      title: lines[0],
      text: `${maxSeismicIntensity} ${max}`,
      fields: [
        ...Array.from(area.entries()).map(([intensity, regions]) => ({
          title: `${seismicIntensityLabel} ${intensity}`,
          value: regions,
          short: true,
        })),
      ],
    },
  ];

  return attachments;
}
