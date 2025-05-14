import type { AtpAgent } from '@atproto/api';
import env from '~/env';
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
import { generateEarthquakeMap } from '~/utils/mapGenerator';
import type { JMAQuake, JMATsunami } from '~/types';

export async function handleEarthquake(
  earthquakeData: JMAQuake,
  agent: AtpAgent,
  isDev: boolean,
  shouldSend: boolean = true,
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
    const minimumScale = env.EARTHQUAKE_MINIMUM_SCALE ?? 0;
    const numericScale = Number(maxScale);

    if (isNaN(numericScale)) {
      logger.warn('Invalid earthquake scale value:', scale);
      return;
    }

    if (numericScale < minimumScale) {
      if (env.ENABLE_LOGGER) {
        logger.info(
          `Skipping earthquake alert - Scale ${numericScale} below minimum ${minimumScale}`,
        );
      }
      return;
    }

    // Generate map image if enabled
    let mapImageBuffer: Buffer | null = null;
    if (env.ENABLE_MAP_GENERATION) {
      try {
        mapImageBuffer = await generateEarthquakeMap(earthquakeData);
      } catch (error) {
        logger.error('Failed to generate earthquake map:', error);
      }
    }

    const text = createEarthquakeMessage(time, info, scale, points, isDev);

    if (shouldSend) {
      await sendMessage(text, agent, mapImageBuffer);
      if (env.ENABLE_LOGGER) {
        logger.info('Earthquake alert received and posted successfully.');
      }
    }
  } else {
    if (env.ENABLE_LOGGER) {
      logger.warn('Earthquake scale is undefined.');
    }
  }
}

export async function handleTsunami(
  tsunamiData: JMATsunami,
  agent: AtpAgent,
  isDev: boolean,
  shouldSend: boolean = true,
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

    if (shouldSend) {
      await sendMessage(text, agent);
      logger.info('Tsunami alert received and posted successfully.');
    }
  } else {
    if (env.ENABLE_LOGGER) {
      logger.warn('Tsunami area is undefined.');
    }
  }
}
