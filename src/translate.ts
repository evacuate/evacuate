import { Language, Translations } from '~/types/translate';

import en from './locales/en';
import ja from './locales/ja';

export default function translate<T extends 'code' | 'message' | 'prefecture'>(
  prefix: T,
  key: T extends 'code'
    ? keyof Translations['code']
    : T extends 'message'
      ? keyof Translations['message']
      : keyof Translations['prefecture'],
  language: Language = Language.EN,
): string {
  const translations: Record<Language, Translations> = {
    [Language.EN]: en,
    [Language.JA]: ja,
  };

  const translationMap = translations[language] || translations[Language.EN];
  const section = translationMap[prefix];
  const value = section[key as unknown as keyof typeof section];

  return typeof value === 'string' ? value : String(key);
}
