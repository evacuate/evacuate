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
import type { JMAQuake, JMATsunami } from '~/types';
import { ValidationError } from '~/types/errors';

export async function handleEarthquake(
  earthquakeData: JMAQuake,
  agent: AtpAgent | undefined,
  isDev = false,
): Promise<void> {
  const logger = await getLogger();
  const validationErrors: Record<string, string[]> = {};

  // Validate required fields
  if (!earthquakeData.earthquake.time) {
    validationErrors.time = ['Earthquake time is required'];
  }

  if (!earthquakeData.earthquake.maxScale) {
    validationErrors.scale = ['Intensity scale is required'];
  }

  if (Object.keys(validationErrors).length > 0) {
    throw new ValidationError(
      'Failed to validate earthquake data',
      validationErrors,
    );
  }

  // Parse data
  const time = earthquakeData.earthquake.time;
  const info = earthquakeData.earthquake.hypocenter?.name ?? 'Unknown location';
  const scaleStr = parseScale(earthquakeData.earthquake.maxScale);

  if (!scaleStr) {
    logger.warn(
      'Invalid intensity scale value:',
      earthquakeData.earthquake.maxScale,
    );
    return;
  }

  // Convert scale string to number for comparison
  const scale = Number(scaleStr.split(' ')[0]);
  if (isNaN(scale)) {
    logger.warn('Failed to parse scale value:', scaleStr);
    return;
  }

  // Skip if scale is below minimum
  const minimumScale = env.EARTHQUAKE_MINIMUM_SCALE;
  if (scale < minimumScale) {
    logger.info('Skipping earthquake alert due to low intensity scale', {
      scale,
      minimumScale,
    });
    return;
  }

  // Create and send message
  const text = createEarthquakeMessage(
    time,
    info,
    scaleStr,
    'No detailed points information available',
    isDev,
  );
  await sendMessage(text, agent);
  logger.info('Earthquake alert sent successfully');
}

export async function handleTsunami(
  tsunamiData: JMATsunami,
  agent: AtpAgent | undefined,
  isDev = false,
): Promise<void> {
  const logger = await getLogger();
  const validationErrors: Record<string, string[]> = {};

  // Validate required fields
  if (!tsunamiData.tsunami.time) {
    validationErrors.time = ['Tsunami time is required'];
  }

  if (!tsunamiData.tsunami.info?.areas?.length) {
    validationErrors.areas = ['Tsunami forecast areas are required'];
  }

  if (Object.keys(validationErrors).length > 0) {
    throw new ValidationError(
      'Failed to validate tsunami data',
      validationErrors,
    );
  }

  // Parse data
  const time = tsunamiData.tsunami.time;
  const info = parseCode(tsunamiData.code);
  const areas = parseArea(tsunamiData.tsunami.info.areas);

  // Create and send message
  const text = createTsunamiMessage(time, info, areas.join(', '), isDev);
  await sendMessage(text, agent);
  logger.info('Tsunami alert sent successfully');
}
