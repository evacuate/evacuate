import { Language, Translations } from '~/types/translate';

import en from './locales/en';
import ja from './locales/ja';
import ko from './locales/ko';
import fr from './locales/fr';
import es from './locales/es';
import de from './locales/de';
import it from './locales/it';

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
    [Language.KO]: ko,
    [Language.FR]: fr,
    [Language.ES]: es,
    [Language.DE]: de,
    [Language.IT]: it,
  };

  const translationMap = translations[language] || translations[Language.EN];
  const section = translationMap[prefix];
  const value = section[key as unknown as keyof typeof section];

  return typeof value === 'string' ? value : String(key);
}
