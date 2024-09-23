function createMessageBody(
  time: string,
  info: string | undefined,
  body: string[],
  isDev: boolean,
): string {
  const message = [`${time} ${info}`];

  if (isDev) {
    message.push('### This information is a test distribution ###');
  }

  message.push(...body, '#evacuate');

  return message.join('\n');
}

export function createEarthquakeMessage(
  time: string,
  info: string | undefined,
  scale: string,
  points: string,
  isDev: boolean,
): string {
  const body = [`Maximum Seismic Intensity ${scale}`, '', `${points}`];

  return createMessageBody(time, info, body, isDev);
}

export function createTsunamiMessage(
  time: string,
  info: string | undefined,
  area: string,
  isDev: boolean,
): string {
  const body = [
    'There is new information in the following areas',
    '',
    `${area}`,
  ];

  return createMessageBody(time, info, body, isDev);
}