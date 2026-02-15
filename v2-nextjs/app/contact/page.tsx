import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to contact the service operator.',
  alternates: {
    canonical: '/contact',
    languages: buildLanguageAlternates('/contact'),
  },
};

const CONTENT: Record<Language, { title: string; subtitle: string; labels: { email: string; note: string } }> = {
  en: {
    title: 'Contact',
    subtitle: 'For service and privacy-related inquiries, use the channel below.',
    labels: {
      email: 'Contact Email',
      note: 'Replace this with your actual support email before AdSense review.',
    },
  },
  ko: {
    title: '문의하기',
    subtitle: '서비스 및 개인정보 관련 문의는 아래 채널로 접수해 주세요.',
    labels: {
      email: '문의 이메일',
      note: '애드센스 심사 전 실제 운영 이메일로 교체해 주세요.',
    },
  },
  ja: {
    title: 'お問い合わせ',
    subtitle: 'サービスおよびプライバシー関連のお問い合わせは以下の窓口をご利用ください。',
    labels: {
      email: 'お問い合わせメール',
      note: 'AdSense審査の前に実際の運用メールアドレスへ変更してください。',
    },
  },
  es: {
    title: 'Contacto',
    subtitle: 'Para consultas del servicio y privacidad, use el siguiente canal.',
    labels: {
      email: 'Correo de contacto',
      note: 'Reemplace esto por su correo real de soporte antes de la revision de AdSense.',
    },
  },
  pt: {
    title: 'Contato',
    subtitle: 'Para duvidas sobre o servico e privacidade, use o canal abaixo.',
    labels: {
      email: 'Email de contato',
      note: 'Substitua por seu email real de suporte antes da revisao do AdSense.',
    },
  },
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const content = CONTENT[activeLang];

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6">
          <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
          <p className="mt-3 text-slate-600">{content.subtitle}</p>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{content.labels.email}</p>
            <p className="mt-1 text-base font-semibold text-slate-800">support@example.com</p>
          </div>

          <p className="mt-4 text-sm text-amber-700">{content.labels.note}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
