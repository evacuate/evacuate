import translate from '../translate';
import parseScale from './parseScale';

interface Point {
  pref: string;
  scale: number;
}

export default function parsePoints(points: Point[]): string {
  const highestScaleMap = new Map<string, string>();
  const scaleMap = new Map<string, Set<string>>();
  const parsedPoints = points.map((point) => ({
    pref: point.pref,
    scale: parseScale(point.scale),
  }));

  for (const { pref, scale } of parsedPoints) {
    if (scale !== undefined) {
      const currentHighestScale = highestScaleMap.get(pref);
      if (!currentHighestScale || scale > currentHighestScale) {
        highestScaleMap.set(pref, scale);
      }
    }
  }

  for (const { pref, scale } of parsedPoints) {
    if (scale !== undefined && scale === highestScaleMap.get(pref)) {
      if (!scaleMap.has(scale)) {
        scaleMap.set(scale, new Set());
      }
      scaleMap.get(scale)!.add(translate(pref));
    }
  }

  return Array.from(scaleMap.entries())
    .map(
      ([scale, regions]) =>
        `[Seismic Intensity ${scale}] ${Array.from(regions).join(', ')}`,
    )
    .join('\n');
}
