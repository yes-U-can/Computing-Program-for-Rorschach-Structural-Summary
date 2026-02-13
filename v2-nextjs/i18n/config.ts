export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'es', 'pt'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: Language = 'ko';

export const LANGUAGE_NAMES: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  es: 'Español',
  pt: 'Português'
};

export const STORAGE_KEY = 'rorschach_language';
