import translate from '../translate';
import parseScale from './parseScale';

interface Point {
  pref: string;
  scale: number;
}

export default function parsePoints(points: Point[]): string {
  const highestScaleMap = new Map<string, string>();
  const finalPoints = new Set<Point>();

  // Process points to find the highest scale for each pref and populate finalPoints
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      const currentHighest = highestScaleMap.get(pref);

      if (currentHighest === undefined || scale > currentHighest) {
        highestScaleMap.set(pref, scale);
        finalPoints.add(point);
      } else if (scale === currentHighest) {
        finalPoints.add(point);
      }
    }
  }

  // Create a map to group regions by scale
  const scaleMap = new Map<string, Set<string>>();
  for (const point of finalPoints) {
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      if (!scaleMap.has(scale)) {
        scaleMap.set(scale, new Set());
      }
      scaleMap.get(scale)?.add(translate(point.pref));
    }
  }

  // Generate the output
  const pointsInfo = Array.from(scaleMap.entries())
    .sort((a, b) => {
      // Compare scales by their numerical value
      const scaleA = Array.from(scaleMap.keys()).indexOf(a[0]);
      const scaleB = Array.from(scaleMap.keys()).indexOf(b[0]);
      return scaleB - scaleA;
    })
    .map(([scale, regionsSet]) => {
      const regions = Array.from(regionsSet).join(', ');
      return `[Seismic Intensity ${scale}] ${regions}`;
    })
    .join('\n');

  return pointsInfo;
}
