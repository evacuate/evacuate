import translate from '../translate';
import parseScale from './parseScale';

interface Point {
  pref: string;
  scale: number;
}

export default function parsePoints(points: Point[]): string {
  const highestScaleMap: { [key: string]: string } = {};
  const finalPoints: Point[] = [];

  // Find the largest scale for each pref
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      if (!highestScaleMap[pref] || scale > highestScaleMap[pref]) {
        highestScaleMap[pref] = scale;
      }
    }
  }

  // Add only the largest scale to the list
  for (const point of points) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined && scale === highestScaleMap[pref]) {
      finalPoints.push(point);
    }
  }

  // Group by scale
  const scaleMap: { [key: string]: Set<string> } = {};
  for (const point of finalPoints) {
    const pref = point.pref;
    const scale = parseScale(point.scale);

    if (scale !== undefined) {
      if (!scaleMap[scale]) {
        scaleMap[scale] = new Set();
      }
      scaleMap[scale].add(translate(pref));
    }
  }

  const pointsInfo: string[] = [];
  for (const scale in scaleMap) {
    const regions = Array.from(scaleMap[scale]).join(', ');
    pointsInfo.push(`[Seismic Intensity ${scale}] ${regions}`);
  }

  return pointsInfo.join('\n');
}
