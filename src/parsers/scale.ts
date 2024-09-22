const scaleMap = new Map<number, string>([
  [10, '1'],
  [20, '2'],
  [30, '3'],
  [40, '4'],
  [45, '5 weak'],
  [50, '5 strong'],
  [55, '6 weak'],
  [60, '6 strong'],
  [70, '7'],
]);

export default function parseScale(scale: number): string | undefined {
  return scaleMap.get(scale);
}
