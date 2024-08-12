import translate from '../translate';
import parseScale from './parseScale';

interface Point {
  pref: string;
  scale: number;
}

export default function parsePoints(points: Point[]): string {
  // const highestScaleMap: { [key: string]: string } = {};
  const highestScaleMap = new Map<string, string>();
  const finalPoints = new Set<Point>();

  // Find the largest scale for each pref
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      if (
        !highestScaleMap.has(pref) ||
        scale > (highestScaleMap.get(pref) ?? -Infinity)
      ) {
        highestScaleMap.set(pref, scale);
      }
    }
  }

  // Add only the largest scale to the list
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined && scale === highestScaleMap.get(pref)) {
      finalPoints.add(point);
    }
  }

  // Group by scale
  const scaleMap = new Map<string, Set<string>>();
  for (const point of finalPoints) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      if (!scaleMap.has(scale)) {
        scaleMap.set(scale, new Set());
      }
      scaleMap.get(scale)?.add(translate(pref));
    }
  }

  const pointsInfo: string[] = [];
  for (const [scale, regionsSet] of scaleMap.entries()) {
    const regions = Array.from(regionsSet).join(', ');
    pointsInfo.push(`[Seismic Intensity ${scale}] ${regions}`);
  }

  return pointsInfo.reverse().join('\n');
}
