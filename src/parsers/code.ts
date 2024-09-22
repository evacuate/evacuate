const codeMap = new Map<number, string>([
  [551, 'Earthquake Information'],
  [552, 'Tsunami Information'],
  [554, 'Earthquake Early Warning Detected'],
  [556, 'Earthquake Early Warning (Alert)'],
  [561, 'Earthquake Detection Information'],
  [9611, 'Earthquake Detection Analysis Results'],
]);

export default function parseCode(code: number): string | undefined {
  return codeMap.get(code);
}
