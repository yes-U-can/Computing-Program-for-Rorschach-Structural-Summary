'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, DEFAULT_LANGUAGE, STORAGE_KEY, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getTranslation, getTranslations } from '@/i18n/client';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      return savedLang;
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    return getTranslation(language, key, params);
  }, [language]);

  const contextValue: TranslationContextType = { language, setLanguage, t };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Export for use in components that need access to all translations
export { getTranslations };
