import { test } from 'vitest';

// Import Helper Functions
import parsePoints from '~/parsers/points';
import parseScale from '~/parsers/scale';
import parseCode from '~/parsers/code';
import parseArea from '~/parsers/area';

// Import Message Functions
import {
  createEarthquakeMessage,
  createTsunamiMessage,
  createSlackMessage,
} from '~/messages/create';

// Import Example Data
import { message, tsunami } from './example';

let messageText = '';
let message1Text = '';

test('message', async ({ expect }) => {
  const earthQuakeInfo = parseCode(message[0].code);
  const points = parsePoints(message[0].points);
  const earthQuake = message[0].earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const parsedScale = parseScale(maxScale);

  if (parsedScale !== undefined) {
    messageText = createEarthquakeMessage(
      time,
      earthQuakeInfo,
      parsedScale,
      points,
      false,
    );

    // Expected Messages
    const expectedMessage =
      '2024/08/10 14:18:00 Earthquake Information\nMaximum Seismic Intensity 3\n\n[Seismic Intensity 1] Fukuoka, Nagasaki, Miyazaki\n[Seismic Intensity 3] Kumamoto\n#evacuate';

    expect(messageText).toBe(expectedMessage);
  }
});

test('slack message', async ({ expect }) => {
  const slackMessage = createSlackMessage(messageText);

  // Expected Messages
  const expectedMessage = [
    {
      color: '#228BFF',
      fallback:
        '2024/08/10 14:18:00 Earthquake Information: Maximum Seismic Intensity 3',
      fields: [
        {
          short: true,
          title: 'Seismic Intensity 1',
          value: 'Fukuoka, Nagasaki, Miyazaki',
        },
        {
          short: true,
          title: 'Seismic Intensity 3',
          value: 'Kumamoto',
        },
      ],
      text: 'Maximum Seismic Intensity 3',
      title: '2024/08/10 14:18:00 Earthquake Information',
    },
  ];

  expect(slackMessage).toEqual(expectedMessage);
});

test('message 1', async ({ expect }) => {
  const earthQuakeInfo = parseCode(message[1].code);
  const points = parsePoints(message[1].points);
  const earthQuake = message[1].earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const parsedScale = parseScale(maxScale);

  if (parsedScale !== undefined) {
    message1Text = createEarthquakeMessage(
      time,
      earthQuakeInfo,
      parsedScale,
      points,
      false,
    );

    // Expected Messages
    const expectedMessage =
      '2024/08/10 12:29:00 Earthquake Information\nMaximum Seismic Intensity 3\n\n[Seismic Intensity 1] Akita, Yamagata\n[Seismic Intensity 2] Miyagi\n[Seismic Intensity 3] Hokkaido, Aomori, Iwate\n#evacuate';

    expect(message1Text).toBe(expectedMessage);
  }
});

test('slack message 1', async ({ expect }) => {
  const slackMessage = createSlackMessage(message1Text);

  // Expected Messages
  const expectedMessage = [
    {
      color: '#228BFF',
      fallback:
        '2024/08/10 12:29:00 Earthquake Information: Maximum Seismic Intensity 3',
      fields: [
        {
          short: true,
          title: 'Seismic Intensity 1',
          value: 'Akita, Yamagata',
        },
        {
          short: true,
          title: 'Seismic Intensity 2',
          value: 'Miyagi',
        },
        {
          short: true,
          title: 'Seismic Intensity 3',
          value: 'Hokkaido, Aomori, Iwate',
        },
      ],
      text: 'Maximum Seismic Intensity 3',
      title: '2024/08/10 12:29:00 Earthquake Information',
    },
  ];

  expect(slackMessage).toEqual(expectedMessage);
});

test('tsunami message', async ({ expect }) => {
  const info = parseCode(tsunami.code);
  const area = parseArea(tsunami.areas);
  const areaResult: string = area.join(', ');
  const time = tsunami.time.replace(/\.\d+$/, '');

  const message = createTsunamiMessage(time, info, areaResult, false);

  // Expected Messages
  const expectedMessage =
    '2024/08/08 16:52:10 Tsunami Information\nThere is new information in the following areas\n\nEhime, Kochi, Oita, Miyazaki, Kagoshima\n#evacuate';

  expect(message).toBe(expectedMessage);
});
