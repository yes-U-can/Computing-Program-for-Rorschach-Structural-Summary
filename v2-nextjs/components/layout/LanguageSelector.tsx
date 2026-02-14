'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from '@/i18n/config';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: (typeof SUPPORTED_LANGUAGES)[number]) => {
    setLanguage(lang);

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('lang', lang);
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(nextUrl);
  };

  return (
    <div className="flex items-center gap-1.5">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            language === lang
              ? 'border border-[var(--brand-200)] bg-[color-mix(in_srgb,var(--brand-200)_28%,white)] text-[var(--brand-700)] shadow-sm'
              : 'bg-slate-50 border border-transparent text-slate-500 hover:bg-slate-100 hover:text-[var(--brand-500)]'
          }`}
        >
          {LANGUAGE_NAMES[lang]}
        </button>
      ))}
    </div>
  );
}
