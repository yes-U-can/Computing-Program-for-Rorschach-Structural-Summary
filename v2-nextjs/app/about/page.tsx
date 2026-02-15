import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type AboutPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'About',
  description: 'About this service and its purpose.',
  alternates: {
    canonical: '/about',
    languages: buildLanguageAlternates('/about'),
  },
};

const CONTENT: Record<Language, { title: string; subtitle: string; points: string[] }> = {
  en: {
    title: 'About',
    subtitle: 'What this service does and who it is for.',
    points: [
      'This service is an online calculator for Rorschach Structural Summary scoring support.',
      'It is intended for learning, training, and professional workflow support.',
      'Results are provided as an aid and do not replace independent clinical judgment or diagnosis.',
    ],
  },
  ko: {
    title: '서비스 소개',
    subtitle: '이 서비스의 목적과 사용 대상을 안내합니다.',
    points: [
      '본 서비스는 Rorschach Structural Summary 채점 보조를 위한 온라인 계산 도구입니다.',
      '학습, 수련, 실무 워크플로우 보조를 목적으로 제공합니다.',
      '결과는 참고용이며, 독립적인 임상 판단이나 진단을 대체하지 않습니다.',
    ],
  },
  ja: {
    title: 'サービス紹介',
    subtitle: '本サービスの目的と対象ユーザーを説明します。',
    points: [
      '本サービスは、Rorschach Structural Summaryの採点支援のためのオンライン計算ツールです。',
      '学習、研修、実務ワークフローの補助を目的として提供しています。',
      '結果は参考情報であり、独立した臨床判断や診断を代替するものではありません。',
    ],
  },
  es: {
    title: 'Acerca de',
    subtitle: 'Que hace este servicio y para quien esta pensado.',
    points: [
      'Este servicio es una calculadora en linea para apoyar la puntuacion del Sumario Estructural de Rorschach.',
      'Esta orientado a aprendizaje, formacion y apoyo al flujo de trabajo profesional.',
      'Los resultados son de apoyo y no reemplazan el juicio clinico independiente ni el diagnostico.',
    ],
  },
  pt: {
    title: 'Sobre',
    subtitle: 'O que este servico faz e para quem ele foi criado.',
    points: [
      'Este servico e uma calculadora online para apoiar a pontuacao do Sumario Estrutural de Rorschach.',
      'Ele e destinado a aprendizado, treinamento e apoio ao fluxo de trabalho profissional.',
      'Os resultados sao de apoio e nao substituem julgamento clinico independente nem diagnostico.',
    ],
  },
};

export default async function AboutPage({ searchParams }: AboutPageProps) {
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
          <ul className="mt-6 space-y-3 text-slate-700">
            {content.points.map((point) => (
              <li key={point} className="rounded-md bg-slate-50 px-4 py-3">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
