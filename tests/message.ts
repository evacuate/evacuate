import { test } from 'vitest';

// Import Helper Functions
import parsePoints from '../src/helpers/parsePoints';
import parseScale from '../src/helpers/parseScale';
import parseCode from '../src/helpers/parseCode';
import parseArea from '../src/helpers/parseArea';

// Import Message Functions
import {
  createMessage,
  createTsunamiMessage,
} from '../src/helpers/messageCreator';

// Import Example Data
import { message, tsunami } from './example';

test('message', async ({ expect }) => {
  const earthQuakeInfo = parseCode(message[0].code);
  const points = parsePoints(message[0].points);
  const earthQuake = message[0].earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const parsedScale = parseScale(maxScale);

  if (parsedScale !== undefined) {
    const message = createMessage(
      time,
      earthQuakeInfo,
      parsedScale,
      points,
      false,
    );

    // Expected Messages
    const expectedMessage = `2024/08/10 14:18:00 Earthquake Information\nMaximum Seismic Intensity 3\n\n[Seismic Intensity 1] Fukuoka, Nagasaki, Miyazaki\n[Seismic Intensity 3] Kumamoto\n#evacuate`;

    expect(message).toBe(expectedMessage);
  }
});

test('message 1', async ({ expect }) => {
  const earthQuakeInfo = parseCode(message[1].code);
  const points = parsePoints(message[1].points);
  const earthQuake = message[1].earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const parsedScale = parseScale(maxScale);

  if (parsedScale !== undefined) {
    const message = createMessage(
      time,
      earthQuakeInfo,
      parsedScale,
      points,
      false,
    );

    // Expected Messages
    const expectedMessage = `2024/08/10 12:29:00 Earthquake Information\nMaximum Seismic Intensity 3\n\n[Seismic Intensity 1] Akita, Yamagata\n[Seismic Intensity 2] Miyagi\n[Seismic Intensity 3] Hokkaido, Aomori, Iwate\n#evacuate`;

    expect(message).toBe(expectedMessage);
  }
});

test('tsunami message', async ({ expect }) => {
  const info = parseCode(tsunami.code);
  const area = parseArea(tsunami.areas);
  const areaResult: string = area.join(', ');
  const time = tsunami.time.replace(/\.\d+$/, '');

  const message = createTsunamiMessage(time, info, areaResult, false);

  // Expected Messages
  const expectedMessage = `2024/08/08 16:52:10 Tsunami Information\nThere is new information in the following areas\n\nEhime, Kochi, Oita, Miyazaki, Kagoshima\n#evacuate`;

  expect(message).toBe(expectedMessage);
});
