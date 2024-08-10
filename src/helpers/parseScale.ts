export default function parseScale(scale: number): string | undefined {
  switch (scale) {
    case 10:
      return '1';
    case 20:
      return '2';
    case 30:
      return '3';
    case 40:
      return '4';
    case 45:
      return '5 weak';
    case 50:
      return '5 strong';
    case 55:
      return '6 weak';
    case 60:
      return '6 strong';
    case 70:
      return '7';
    default:
      return undefined;
  }
}
