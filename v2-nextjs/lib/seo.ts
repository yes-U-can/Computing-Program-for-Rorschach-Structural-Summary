import { SUPPORTED_LANGUAGES, type Language } from '@/i18n/config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://exnersicp.vercel.app';

export function buildLanguageAlternates(pathname: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const languages = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((lang: Language) => [lang, `${normalized}?lang=${lang}`])
  );

  return {
    ...languages,
    'x-default': normalized,
  };
}

export function getAbsoluteUrl(pathname: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteUrl}${normalized}`;
}

