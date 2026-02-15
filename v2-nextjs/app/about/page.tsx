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

type Section = {
  heading: string;
  paragraphs: string[];
};

type AboutContent = {
  title: string;
  subtitle: string;
  sections: Section[];
  disclaimer: string;
};

const CONTENT: Record<Language, AboutContent> = {
  ko: {
    title: '서비스 소개',
    subtitle: '로샤(Rorschach) 심리검사의 구조요약 계산과 AI 해석 보조를 지원하는 무료 웹 도구입니다.',
    sections: [
      {
        heading: '이 서비스는 무엇인가요?',
        paragraphs: [
          '본 서비스는 로샤 심리검사 Exner 종합체계(CS)의 구조요약(Structural Summary)을 자동 계산해주는 온라인 도구입니다. 임상심리전문가, 상담심리사, 수련생 등 로샤 검사를 실무에서 활용하는 전문가들을 위해 만들어졌습니다.',
          '채점 결과 입력만으로 구조요약의 모든 변수 — 위치, 결정인, 형태질, 특수점수, 6대 특수지표(PTI, DEPI, CDI, S-CON, HVI, OBS) 등 — 를 즉시 산출하며, 계산 결과를 바탕으로 AI에게 해석을 요청할 수 있는 기능도 제공합니다.',
        ],
      },
      {
        heading: '왜 만들었나요?',
        paragraphs: [
          '로샤 검사는 심리평가에서 매우 중요한 도구이지만, 구조요약 계산 과정이 복잡하고 시간이 많이 소요됩니다. 기존의 채점 보조 도구들은 대부분 유료로 제공되어 왔습니다.',
          '그러나 로샤 검사 자체는 MMPI와 달리 저작권이 있는 검사가 아닙니다. 계산 수식은 공개된 학술 자료에 기반하며, 이를 소프트웨어로 구현하는 데에 라이선스 제한이 없습니다. 그럼에도 전문가들이 유료 도구에 의존해야 하는 상황이 안타까워, 처음부터 무료 공개를 목표로 이 프로젝트를 시작했습니다.',
          '나아가, 구조요약 계산을 넘어 AI 기반 해석 보조라는 새로운 가능성을 탐색하고 있습니다. 전문가가 직접 자신의 API 키를 사용하여 GPT-4o, Gemini, Claude 등의 LLM에 채점 결과를 전달하고, 해석에 참고할 수 있는 응답을 받을 수 있습니다.',
        ],
      },
      {
        heading: '누가 만들었나요?',
        paragraphs: [
          '본 프로젝트는 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP)의 주관으로 개발되었습니다. 임상심리 전문가의 도메인 지식과, 소프트웨어 엔지니어링 및 디자인 역량을 갖춘 개발자의 협업으로 탄생했습니다.',
          '채점 로직은 Exner 종합체계의 공식 참고 자료에 기반하여 직접 구현되었으며, 레거시 버전(Google Apps Script)에서 현재의 Next.js 웹앱으로 이전하는 과정에서 계산 결과의 1:1 일치를 교차 검증하였습니다.',
        ],
      },
      {
        heading: '앞으로의 방향',
        paragraphs: [
          '본 서비스는 단순한 계산기를 넘어, 로샤 해석을 돕는 AI 플랫폼으로 발전하고자 합니다. 전문가들이 자신만의 해석 노하우를 체계화한 "스킬북(Skill Book)"을 만들고, 이를 공유하거나 거래할 수 있는 마켓플레이스를 준비하고 있습니다.',
          '문화권마다 다른 로샤 해석의 특성을 반영하여, 다양한 언어와 문화적 맥락에 맞는 해석 가이드가 축적되는 생태계를 지향합니다.',
        ],
      },
    ],
    disclaimer: '본 서비스의 모든 결과는 참고 자료로서 제공되며, 독립적인 임상 판단이나 공식 진단을 대체하지 않습니다.',
  },
  en: {
    title: 'About',
    subtitle: 'A free web tool for Rorschach Structural Summary calculation and AI-assisted interpretation.',
    sections: [
      {
        heading: 'What is this service?',
        paragraphs: [
          'This service is an online tool that automatically computes the Structural Summary of the Rorschach Inkblot Test based on the Exner Comprehensive System (CS). It is built for clinical psychologists, counseling psychologists, and trainees who use the Rorschach in their professional practice.',
          'Simply enter your coded responses and the tool instantly calculates all Structural Summary variables — location, determinants, form quality, special scores, and the six special indices (PTI, DEPI, CDI, S-CON, HVI, OBS). You can also ask an AI assistant to help interpret the results.',
        ],
      },
      {
        heading: 'Why was it created?',
        paragraphs: [
          'The Rorschach test is one of the most important tools in psychological assessment, but computing the Structural Summary is complex and time-consuming. Most existing scoring tools have been offered as paid software.',
          'Unlike the MMPI, the Rorschach test itself is not a proprietary instrument. The scoring formulas are based on published academic literature, and there are no licensing restrictions on implementing them in software. Despite this, professionals have had to rely on paid tools — which is why this project was started with the goal of being free and open from day one.',
          'Beyond calculation, we are exploring AI-assisted interpretation as a new frontier. Professionals can use their own API keys to send scoring results to LLMs like GPT-4o, Gemini, or Claude and receive contextual feedback to inform their clinical work.',
        ],
      },
      {
        heading: 'Who built it?',
        paragraphs: [
          'This project was developed under the auspices of the Seoul Institute of Clinical Psychology (SICP). It is a collaboration between a clinical psychology domain expert and a developer with expertise in software engineering and design.',
          'The scoring logic was implemented directly from official Exner CS reference materials. During the migration from the legacy version (Google Apps Script) to the current Next.js web application, calculation outputs were cross-verified to ensure 1:1 parity.',
        ],
      },
      {
        heading: 'What comes next?',
        paragraphs: [
          'This service aims to grow beyond a simple calculator into an AI platform for Rorschach interpretation. We are preparing a "Skill Book" system where professionals can systematize their interpretation expertise and share or trade it in a marketplace.',
          'We envision an ecosystem where interpretation guides tailored to different languages and cultural contexts can accumulate, reflecting the cultural diversity inherent in Rorschach interpretation.',
        ],
      },
    ],
    disclaimer: 'All outputs provided by this service are for reference only and do not replace independent clinical judgment or formal diagnosis.',
  },
  ja: {
    title: 'サービス紹介',
    subtitle: 'ロールシャッハ心理検査の構造要約計算とAI解釈支援を提供する無料Webツールです。',
    sections: [
      {
        heading: 'このサービスとは？',
        paragraphs: [
          '本サービスは、ロールシャッハ・インクブロットテストのExner包括システム(CS)に基づく構造要約(Structural Summary)を自動計算するオンラインツールです。臨床心理士、カウンセラー、研修生など、ロールシャッハを実務で活用する専門家のために作られました。',
          'コーディングされた反応を入力するだけで、位置、決定因、形態水準、特殊スコア、6つの特殊指標(PTI、DEPI、CDI、S-CON、HVI、OBS)など、構造要約のすべての変数を即座に算出します。また、AIアシスタントに結果の解釈を依頼することもできます。',
        ],
      },
      {
        heading: 'なぜ作られたのか？',
        paragraphs: [
          'ロールシャッハテストは心理評価において非常に重要なツールですが、構造要約の計算は複雑で時間がかかります。既存の採点支援ツールのほとんどは有料で提供されてきました。',
          'MMPIとは異なり、ロールシャッハテスト自体は著作権のある検査ではありません。採点式は公開された学術文献に基づいており、ソフトウェアへの実装にライセンス制限はありません。それにもかかわらず専門家が有料ツールに頼らざるを得ない状況を変えるため、当初から無料公開を目標にこのプロジェクトを開始しました。',
        ],
      },
      {
        heading: '誰が作ったのか？',
        paragraphs: [
          '本プロジェクトはソウル臨床心理研究所(SICP)の主管のもと開発されました。臨床心理の専門知識とソフトウェアエンジニアリング・デザインの専門性を持つ開発者の協業により誕生しました。',
        ],
      },
      {
        heading: '今後の方向性',
        paragraphs: [
          '本サービスは単なる計算機を超え、ロールシャッハ解釈を支援するAIプラットフォームへと発展することを目指しています。専門家が自身の解釈ノウハウを体系化した「スキルブック」を作成し、共有・取引できるマーケットプレイスを準備しています。',
        ],
      },
    ],
    disclaimer: '本サービスのすべての結果は参考情報として提供されるものであり、独立した臨床判断や公式な診断に代わるものではありません。',
  },
  es: {
    title: 'Acerca de',
    subtitle: 'Herramienta web gratuita para el calculo del Sumario Estructural de Rorschach y asistencia de interpretacion con IA.',
    sections: [
      {
        heading: 'Que es este servicio?',
        paragraphs: [
          'Este servicio es una herramienta en linea que calcula automaticamente el Sumario Estructural del Test de Rorschach basado en el Sistema Comprehensivo de Exner (CS). Esta disenado para psicologos clinicos, psicologos consejeros y estudiantes en formacion que utilizan el Rorschach en su practica profesional.',
          'Simplemente ingrese sus respuestas codificadas y la herramienta calcula instantaneamente todas las variables del Sumario Estructural, incluyendo los seis indices especiales (PTI, DEPI, CDI, S-CON, HVI, OBS). Tambien puede solicitar a un asistente de IA que ayude a interpretar los resultados.',
        ],
      },
      {
        heading: 'Por que fue creado?',
        paragraphs: [
          'El test de Rorschach es una de las herramientas mas importantes en la evaluacion psicologica, pero calcular el Sumario Estructural es complejo y consume mucho tiempo. La mayoria de las herramientas de puntuacion existentes han sido software de pago.',
          'A diferencia del MMPI, el test de Rorschach en si no es un instrumento con derechos de autor. Las formulas de puntuacion se basan en literatura academica publicada. Este proyecto se inicio con el objetivo de ser gratuito y abierto desde el primer dia.',
        ],
      },
      {
        heading: 'Quien lo construyo?',
        paragraphs: [
          'Este proyecto fue desarrollado bajo los auspicios del Seoul Institute of Clinical Psychology (SICP), en colaboracion entre un experto en psicologia clinica y un desarrollador con experiencia en ingenieria de software y diseno.',
        ],
      },
      {
        heading: 'Que viene despues?',
        paragraphs: [
          'Este servicio aspira a crecer mas alla de una simple calculadora hacia una plataforma de IA para la interpretacion de Rorschach. Estamos preparando un sistema de "Skill Books" donde los profesionales pueden sistematizar su experiencia interpretativa y compartirla o comercializarla en un mercado.',
        ],
      },
    ],
    disclaimer: 'Todos los resultados proporcionados por este servicio son solo de referencia y no reemplazan el juicio clinico independiente ni el diagnostico formal.',
  },
  pt: {
    title: 'Sobre',
    subtitle: 'Ferramenta web gratuita para calculo do Sumario Estrutural de Rorschach e assistencia de interpretacao com IA.',
    sections: [
      {
        heading: 'O que e este servico?',
        paragraphs: [
          'Este servico e uma ferramenta online que calcula automaticamente o Sumario Estrutural do Teste de Rorschach baseado no Sistema Compreensivo de Exner (CS). Foi criado para psicologos clinicos, psicologos conselheiros e estagiarios que utilizam o Rorschach em sua pratica profissional.',
          'Basta inserir suas respostas codificadas e a ferramenta calcula instantaneamente todas as variaveis do Sumario Estrutural, incluindo os seis indices especiais (PTI, DEPI, CDI, S-CON, HVI, OBS). Voce tambem pode solicitar a um assistente de IA que ajude a interpretar os resultados.',
        ],
      },
      {
        heading: 'Por que foi criado?',
        paragraphs: [
          'O teste de Rorschach e uma das ferramentas mais importantes na avaliacao psicologica, mas calcular o Sumario Estrutural e complexo e demorado. A maioria das ferramentas de pontuacao existentes tem sido software pago.',
          'Diferente do MMPI, o teste de Rorschach em si nao e um instrumento proprietario. As formulas de pontuacao sao baseadas em literatura academica publicada. Este projeto foi iniciado com o objetivo de ser gratuito e aberto desde o primeiro dia.',
        ],
      },
      {
        heading: 'Quem construiu?',
        paragraphs: [
          'Este projeto foi desenvolvido sob os auspicios do Seoul Institute of Clinical Psychology (SICP), em colaboracao entre um especialista em psicologia clinica e um desenvolvedor com experiencia em engenharia de software e design.',
        ],
      },
      {
        heading: 'O que vem a seguir?',
        paragraphs: [
          'Este servico aspira crescer alem de uma simples calculadora para uma plataforma de IA para interpretacao de Rorschach. Estamos preparando um sistema de "Skill Books" onde profissionais podem sistematizar sua experiencia interpretativa e compartilha-la ou comercializa-la em um marketplace.',
        ],
      },
    ],
    disclaimer: 'Todos os resultados fornecidos por este servico sao apenas para referencia e nao substituem julgamento clinico independente nem diagnostico formal.',
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
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{content.subtitle}</p>

          <div className="mt-8 space-y-10">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-slate-800">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-[15px] leading-7 text-slate-700">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-lg bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {content.disclaimer}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
