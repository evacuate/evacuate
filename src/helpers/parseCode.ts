export default function parseCode(code: number): string | undefined {
  switch (code) {
    case 551:
      return 'Earthquake Information';
    case 552:
      return 'Tsunami Information';
    case 554:
      return 'Earthquake Early Warning Detected';
    case 556:
      return 'Earthquake Early Warning (Alert)';
    case 561:
      return 'Earthquake Detection Information';
    case 9611:
      return 'Earthquake Detection Analysis Results';
    default:
      return undefined;
  }
}
