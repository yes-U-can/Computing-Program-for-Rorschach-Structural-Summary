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

  const LANGUAGE_FLAGS: Record<(typeof SUPPORTED_LANGUAGES)[number], string> = {
    ko: '\uD83C\uDDF0\uD83C\uDDF7',
    en: '\uD83C\uDDFA\uD83C\uDDF8',
    ja: '\uD83C\uDDEF\uD83C\uDDF5',
    es: '\uD83C\uDDEA\uD83C\uDDF8',
    pt: '\uD83C\uDDF5\uD83C\uDDF9',
  };

  return (
    <div className="flex items-center gap-1.5">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          aria-label={LANGUAGE_NAMES[lang]}
          title={LANGUAGE_NAMES[lang]}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium ${
            language === lang
              ? 'border-[var(--brand-200)] bg-[color-mix(in_srgb,var(--brand-200)_28%,white)] text-[var(--brand-700)] shadow-sm'
              : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[var(--brand-500)]'
          }`}
        >
          <span className="sm:hidden" aria-hidden="true">{LANGUAGE_FLAGS[lang]}</span>
          <span className="hidden sm:inline">{LANGUAGE_NAMES[lang]}</span>
        </button>
      ))}
    </div>
  );
}
