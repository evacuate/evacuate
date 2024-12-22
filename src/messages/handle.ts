import type { AtpAgent } from '@atproto/api';
import { getLogger } from '~/index';
import {
  createEarthquakeMessage,
  createTsunamiMessage,
} from '~/messages/create';
import sendMessage from '~/messages/send';
import parseArea from '~/parsers/area';
import parseCode from '~/parsers/code';
import parsePoints from '~/parsers/points';
import parseScale from '~/parsers/scale';
import type { JMAQuake, JMATsunami } from '~/types';
import env from '~/env';

export async function handleEarthquake(
  earthquakeData: JMAQuake,
  agent: AtpAgent,
  isDev: boolean,
): Promise<void> {
  // Get the logger
  const logger = await getLogger();

  const code = earthquakeData.code;
  const info = parseCode(code);
  const points = parsePoints(earthquakeData.points);
  const earthQuake = earthquakeData.earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const scale = parseScale(maxScale ?? -1);

  if (scale !== undefined) {
    const text = createEarthquakeMessage(time, info, scale, points, isDev);

    const minimumScale = env.EARTHQUAKE_MINIMUM_SCALE ?? 0;
    if (minimumScale > Number(scale)) {
      logger.info(
        `Earthquake scale is below the threshold (${scale} < ${minimumScale}). Skipping...`,
      );
      return;
    }

    await sendMessage(text, agent);
    logger.info('Earthquake alert received and posted successfully.');
  } else {
    logger.warn('Earthquake scale is undefined.');
  }
}

export async function handleTsunami(
  tsunamiData: JMATsunami,
  agent: AtpAgent,
  isDev: boolean,
): Promise<void> {
  // Get the logger
  const logger = await getLogger();

  const code = tsunamiData.code;
  const info = parseCode(code);
  const area = parseArea(tsunamiData.areas);
  const areaResult: string = area.join(', ');
  const time = tsunamiData.time.replace(/\.\d+$/, '');

  if (area.length > 0) {
    const text = createTsunamiMessage(time, info, areaResult, isDev);
    await sendMessage(text, agent);
    logger.info('Tsunami alert received and posted successfully.');
  } else {
    logger.warn('Tsunami area is undefined.');
  }
}
