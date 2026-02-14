import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPrivacySections } from '@/lib/privacySections';
import type { Language } from '@/types';

type PrivacyPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy index and subpages for this service.',
  alternates: {
    canonical: '/privacy',
  },
};

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const sections = getPrivacySections(activeLang);

  const intro: Record<Language, string> = {
    en: 'This page explains how account, API key, and AI chat data are handled in this service.',
    ko: '이 페이지는 본 서비스에서 계정, API 키, AI 채팅 데이터가 어떻게 처리되는지 설명합니다.',
    ja: 'このページでは、本サービスにおけるアカウント、APIキー、AIチャットデータの取り扱いを説明します。',
    es: 'Esta pagina explica como se gestionan los datos de cuenta, clave API y chat de IA en este servicio.',
    pt: 'Esta pagina explica como os dados de conta, chave API e chat de IA sao tratados neste servico.',
  };

  const title: Record<Language, string> = {
    en: 'Privacy Policy',
    ko: '개인정보처리방침',
    ja: 'プライバシーポリシー',
    es: 'Politica de Privacidad',
    pt: 'Politica de Privacidade',
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900">{title[activeLang]}</h1>
          <p className="mt-4 text-slate-600">{intro[activeLang]}</p>

          <div className="mt-8 space-y-4">
            {sections.map((section) => (
              <section
                key={section.slug}
                className="group rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-[var(--brand-200)] hover:shadow"
              >
                <Link href={`/privacy/${section.slug}?lang=${activeLang}`} className="block">
                  <h2 className="text-lg font-semibold text-slate-800 group-hover:text-[var(--brand-700)]">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.body[0]}</p>
                </Link>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
