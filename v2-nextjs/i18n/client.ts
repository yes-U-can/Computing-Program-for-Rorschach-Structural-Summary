import type { Language } from './config';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

const translations: Record<Language, typeof ko> = {
  ko,
  en,
  ja,
  es,
  pt
};

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'result.core.R') returns obj.result.core.R
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key itself if path not found
    }
  }

  return typeof current === 'string' ? current : path;
}

/**
 * Get translation for a key in the specified language, with optional interpolation
 */
export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  const langTranslations = translations[language] || translations.ko;
  let result = getNestedValue(langTranslations as unknown as Record<string, unknown>, key);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return result;
}

/**
 * Get all translations for a language
 */
export function getTranslations(language: Language): typeof ko {
  return translations[language] || translations.ko;
}
