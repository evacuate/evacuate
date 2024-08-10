export default function createMessage(
  time: string,
  info: string | undefined,
  scale: string,
  points: string,
  isDev: boolean,
): string {
  if (isDev) {
    return [
      `${time} ${info}`,
      '### This information is a test distribution ###',
      `Maximum Seismic Intensity ${scale}`,
      '',
      `${points}`,
      '#evacuate',
    ].join('\n');
  } else {
    return [
      `${time} ${info}`,
      `Maximum Seismic Intensity ${scale}`,
      '',
      `${points}`,
      '#evacuate',
    ].join('\n');
  }
}
