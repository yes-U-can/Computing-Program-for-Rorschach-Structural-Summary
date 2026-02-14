import type { Language } from './config';
import en from './locales/en.json';

type TranslationShape = typeof en;

const translations: Record<Language, TranslationShape> = {
  ko: en,
  en,
  ja: en,
  es: en,
  pt: en,
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
  const langTranslations = translations[language] || translations.en;
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
export function getTranslations(language: Language): TranslationShape {
  return translations[language] || translations.ko;
}
