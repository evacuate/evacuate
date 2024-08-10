export function createMessage(
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

export function createTsunamiMessage(
  time: string,
  info: string | undefined,
  area: string,
  isDev: boolean,
): string {
  if (isDev) {
    return [
      `${time} ${info}`,
      '### This information is a test distribution ###',
      'There is new information in the following areas',
      '',
      `${area}`,
      '#evacuate',
    ].join('\n');
  } else {
    return [
      `${time} ${info}`,
      'There is new information in the following areas',
      '',
      `${area}`,
      '#evacuate',
    ].join('\n');
  }
}
