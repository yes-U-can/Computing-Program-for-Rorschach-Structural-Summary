'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '@/i18n/config';

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1.5">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            language === lang
              ? 'bg-slate-200 border border-slate-300 text-slate-800 shadow-sm'
              : 'bg-slate-50 border border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          {LANGUAGE_NAMES[lang]}
        </button>
      ))}
    </div>
  );
}
