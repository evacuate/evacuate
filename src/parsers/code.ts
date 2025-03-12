import env from '~/env';
import translate from '~/translate';

const codeMap = new Map<number, string>([
  [551, translate('code', 551, env.LANGUAGE)],
  [552, translate('code', 552, env.LANGUAGE)],
  [554, translate('code', 554, env.LANGUAGE)],
  [556, translate('code', 556, env.LANGUAGE)],
  [561, translate('code', 561, env.LANGUAGE)],
  [9611, translate('code', 9611, env.LANGUAGE)],
]);

export default function parseCode(code: number): string | undefined {
  return codeMap.get(code);
}
