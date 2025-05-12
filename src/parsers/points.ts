import parseScale from '~/parsers/scale';
import env from '~/env';
import translate from '~/translate';
import { prefectureMap } from './area';

interface Point {
  pref: string;
  scale: number;
}

export default function parsePoints(points: Point[]): string {
  // Map to manage regions by seismic intensity
  const scaleMap = new Map<string, Set<string>>();

  // Track maximum seismic intensity for each prefecture
  const prefMaxScale = new Map<string, number>();

  // Collect necessary information in a single loop
  for (const point of points) {
    const scale = parseScale(point.scale);
    if (scale === undefined) continue;

    const pref = point.pref;
    const prefEnum = prefectureMap[pref];
    if (!prefEnum) continue;

    const translatedPref = translate('prefecture', prefEnum, env.LANGUAGE);
    const numericScale = Number(scale);

    // Update maximum seismic intensity for current prefecture
    const currentMax = prefMaxScale.get(pref) ?? -1;
    if (numericScale >= currentMax) {
      prefMaxScale.set(pref, numericScale);

      // Remove from previous seismic intensity region list
      for (const [oldScale, regions] of scaleMap.entries()) {
        if (Number(oldScale) < numericScale) {
          regions.delete(translatedPref);
        }
      }

      // Add to new seismic intensity region list
      if (!scaleMap.has(scale)) {
        scaleMap.set(scale, new Set());
      }
      scaleMap.get(scale)?.add(translatedPref);
    }
  }

  // Sort by seismic intensity in ascending order and generate output
  const sortedScales = Array.from(scaleMap.keys()).sort(
    (a, b) => Number(a) - Number(b),
  );

  return sortedScales
    .map((scale) => {
      const regions = Array.from(scaleMap.get(scale) || []).join(', ');
      return `[${translate('message', 'seismicIntensity', env.LANGUAGE)} ${scale}] ${regions}`;
    })
    .join('\n');
}
