import translate from '../translate';
import parseScale from './parseScale';

interface Point {
  pref: string;
  scale: number;
}

export default function parsePoints(points: Point[]): string {
  const scaleMap: { [key: string]: Set<string> } = {};
  for (const point of points) {
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
