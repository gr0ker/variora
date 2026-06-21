import { ru } from './ru';

// Задел под мультиязычность: достаточно добавить словарь и переключить локаль.
const dictionaries = { ru };

export type Locale = keyof typeof dictionaries;

let locale: Locale = 'ru';

export function setLocale(next: Locale): void {
  locale = next;
}

export function getLocale(): Locale {
  return locale;
}

// Перевод по ключу. Если ключ не найден — возвращаем сам ключ (видно в UI, что забыли перевод).
export function t(key: string): string {
  return dictionaries[locale][key] ?? key;
}
