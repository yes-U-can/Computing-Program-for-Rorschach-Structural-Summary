import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CopyPageButton from '@/components/common/CopyPageButton';
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
    subtitle: '로샤 구조요약 계산 도우미(Computing Program for Rorschach Structural Summary)는 로르샤흐 심리검사 Exner 종합체계(Comprehensive System, CS)의 구조요약(Structural Summary)을 자동 계산하고, AI 기반 해석 보조 기능을 제공하는 무료 웹 도구입니다. 본 서비스는 로르샤흐 검사에 기반한 계산 프로그램으로, 임상심리전문가, 상담심리사, 수련생 등 실제 현장에서 로샤 검사를 활용하는 전문가를 주요 대상으로 설계되었습니다.',
    sections: [
      {
        heading: '왜 이 서비스가 필요한가요?',
        paragraphs: [
          '로르샤흐 검사는 개인의 성격 구조와 심리 역동을 깊이 있게 이해할 수 있도록 돕는 중요한 심리평가 도구입니다. 그러나 Exner 종합체계에 따른 구조요약 계산 과정은 복잡하고 반복적인 수작업을 요구하며, 상당한 시간과 집중력을 필요로 합니다. 변수 간 관계를 정확히 산출하고 지표를 종합하는 과정에서 계산 부담과 오류 가능성도 존재합니다.',
          '로샤 구조요약 계산 도우미는 이러한 계산 부담을 줄이고, 전문가가 해석과 임상적 판단에 더 집중할 수 있도록 돕기 위해 개발되었습니다. 채점 결과를 입력하면 위치, 결정인, 형태질, 특수점수, 6대 특수지표(PTI, DEPI, CDI, S-CON, HVI, OBS)를 포함한 구조요약 핵심 변수를 자동으로 산출합니다.',
        ],
      },
      {
        heading: 'AI 해석 보조는 어디까지인가요?',
        paragraphs: [
          '본 서비스는 계산된 구조요약 결과를 바탕으로 AI 기반 해석 보조 기능을 제공합니다. 사용자는 본인의 API 키를 등록하여 OpenAI, Google, Anthropic 등의 LLM을 활용할 수 있습니다. API 키는 암호화되어 저장되며, AI 요청이 발생할 때에만 서버를 통해 해당 LLM API를 호출합니다.',
          'AI 응답은 해석을 돕기 위한 참고 자료일 뿐, 독립적인 임상 판단이나 공식 진단을 대체하지 않습니다. 최종 해석과 책임은 해당 전문가에게 있습니다. 본 서비스는 전문가의 판단을 지원하는 도구이지, 판단을 대신하는 시스템이 아닙니다.',
        ],
      },
      {
        heading: '스킬북과 AI 해석 생태계',
        paragraphs: [
          '로샤 구조요약 계산 도우미는 단순한 계산기를 넘어, 전문가 중심의 AI 해석 플랫폼으로 운영됩니다. 사용자는 자신의 해석 노하우를 체계화한 스킬북(Skill Book)을 직접 생성하고 활용할 수 있습니다.',
          '스킬북은 AI에게 전달되는 지시문(Instructions)과 참고 문서(Documents)로 구성됩니다. 전문가는 자신의 임상적 관점, 해석 기준, 개념적 틀, 참고 자료 등을 구조화하여 스킬북에 반영할 수 있으며, AI는 해당 스킬북을 기반으로 해석 보조 응답을 생성합니다. 이를 통해 동일한 구조요약이라도 전문가의 이론적 배경과 해석 스타일이 반영된 결과를 얻을 수 있습니다.',
          '또한 스킬북 스토어를 통해 다른 전문가의 스킬북을 공유하거나 거래할 수 있습니다. 다양한 임상 경험과 문화적 배경을 가진 전문가들의 해석 체계가 축적되면서, 문화권마다 다른 로르샤흐 해석 맥락을 반영한 가이드가 형성됩니다.',
          '이러한 구조를 통해 본 서비스는 단순 계산 도구를 넘어, 전문가 간 지식이 축적되고 확장되는 AI 해석 생태계를 지향합니다.',
        ],
      },
      {
        heading: '광고 및 운영 주체',
        paragraphs: [
          '비로그인 사용자에게는 Google AdSense 광고가 표시될 수 있으며, 로그인 사용자에게는 광고가 표시되지 않습니다. 로그인은 API 키 관리 및 AI 채팅 히스토리 저장을 위한 기능입니다.',
          '본 서비스는 서울임상심리연구소와 모오가 공동으로 제공합니다. 서울임상심리연구소는 서비스 기획과 임상심리학적 자문을 담당하고, 모오는 개발과 기술 운영을 담당합니다. 서비스의 운영 및 향후 개선 방향은 양측이 협의하여 결정합니다. 현재 서비스는 서울임상심리연구소를 통해 외부에 안내되고 있습니다.',
        ],
      },
    ],
    disclaimer: 'AI 응답은 해석을 돕기 위한 참고 자료일 뿐, 독립적인 임상 판단이나 공식 진단을 대체하지 않습니다. 최종 해석과 책임은 해당 전문가에게 있습니다.',
  },
  en: {
    title: 'About',
    subtitle: 'Computing Program for Rorschach Structural Summary is a free web-based tool designed to automate Structural Summary calculations under the Rorschach Comprehensive System (Exner CS) and to provide AI-assisted interpretation support. The platform is primarily intended for licensed clinical psychologists, counseling psychologists, and trainees who use the Rorschach test in professional practice.',
    sections: [
      {
        heading: 'Why is this service needed?',
        paragraphs: [
          'The Rorschach test is a powerful psychological assessment tool that allows clinicians to explore personality structure and underlying psychological dynamics. However, calculating the Structural Summary under the Exner Comprehensive System is complex, time-consuming, and detail-intensive. The process requires careful integration of multiple variables and indices, creating both cognitive burden and potential for calculation error.',
          'Computing Program for Rorschach Structural Summary was developed to reduce this computational workload so that professionals can focus more on interpretation and clinical judgment. By entering scoring data, users can instantly generate key Structural Summary variables, including Location, Determinants, Form Quality, Special Scores, and the six major indices (PTI, DEPI, CDI, S-CON, HVI, OBS).',
        ],
      },
      {
        heading: 'AI Interpretation Support — What It Is and What It Is Not',
        paragraphs: [
          'The platform provides AI-assisted interpretation support based on the calculated Structural Summary results. Users may register their own API keys to access large language models such as OpenAI, Google, and Anthropic. API keys are securely encrypted and are only used to process AI requests when initiated by the user.',
          'AI-generated responses are provided strictly as interpretive references. They do not replace independent clinical judgment or formal diagnosis. Final interpretive decisions and professional responsibility remain with the clinician. The system is designed to support professional reasoning, not to substitute it.',
        ],
      },
      {
        heading: 'Skill Books and the AI Interpretation Ecosystem',
        paragraphs: [
          'Beyond automated calculation, Computing Program for Rorschach Structural Summary operates as a clinician-centered AI interpretation platform. Users can create and apply their own Skill Books — structured representations of their interpretive frameworks and professional expertise.',
          'A Skill Book consists of Instructions and reference Documents provided to the AI model. Clinicians can encode their theoretical orientation, interpretive principles, preferred conceptual frameworks, and reference materials into a Skill Book. The AI then generates responses aligned with that structured guidance. This allows identical Structural Summary data to yield interpretations that reflect the clinician\'s theoretical perspective and style.',
          'Through the Skill Book Store, professionals can share or exchange Skill Books with others. As diverse clinical approaches and cultural contexts accumulate, the platform fosters an evolving ecosystem of interpretation guides that reflect different theoretical traditions and cultural frameworks in Rorschach interpretation.',
        ],
      },
      {
        heading: 'Advertising and Governance',
        paragraphs: [
          'Google AdSense advertisements may be displayed to non-logged-in users. Logged-in users do not see advertisements. User accounts are used for API key management and AI chat history storage.',
          'This Service is jointly provided by the Seoul Institute of Clinical Psychology (SICP) and MOW. SICP is responsible for service planning and clinical-psychological advisory input, while MOW is responsible for development and technical operations. Operational decisions and future improvement directions are determined through consultation between both parties. At present, the Service is publicly introduced through the Seoul Institute of Clinical Psychology (SICP).',
        ],
      },
    ],
    disclaimer: 'AI-generated responses are provided strictly as interpretive references. They do not replace independent clinical judgment or formal diagnosis. Final interpretive decisions and professional responsibility remain with the clinician.',
  },
  ja: {
    title: 'サービス紹介',
    subtitle: 'Computing Program for Rorschach Structural Summaryは、ロールシャッハ・テスト Exner包括システム（Comprehensive System, CS）に基づく構造要約（Structural Summary）の自動計算およびAIによる解釈支援機能を提供する無料のウェブツールです。本サービスは、臨床心理士、公認心理師、カウンセラー、研修中の専門家など、実務においてロールシャッハ検査を活用する専門家を主な対象として設計されています。',
    sections: [
      {
        heading: 'なぜこのサービスが必要なのでしょうか',
        paragraphs: [
          'ロールシャッハ検査は、人格構造や心理力動を深く理解するための重要な心理アセスメント手法です。しかし、Exner包括システムに基づく構造要約の算出は複雑で、多くの時間と注意を要する作業です。複数の変数や指標を正確に統合する必要があり、計算負担やヒューマンエラーのリスクも伴います。',
          'Computing Program for Rorschach Structural Summaryは、この計算負担を軽減し、専門家が解釈と臨床判断により集中できるよう支援するために開発されました。採点データを入力することで、位置、決定因、形態水準、特殊得点、6つの主要指標（PTI、DEPI、CDI、S-CON、HVI、OBS）を含む主要な構造要約変数を即座に算出できます。',
        ],
      },
      {
        heading: 'AIによる解釈支援について',
        paragraphs: [
          '本サービスは、算出された構造要約結果に基づき、AIによる解釈支援機能を提供します。利用者は自身のAPIキーを登録し、OpenAI、Google、Anthropicなどの大規模言語モデルを活用することができます。APIキーは暗号化して保存され、利用者がリクエストを行った場合にのみ使用されます。',
          'AIが生成する応答は、あくまで解釈を補助する参考情報として提供されるものであり、独立した臨床判断や正式な診断を代替するものではありません。最終的な判断と責任は専門家に帰属します。本サービスは専門家の思考を支援するツールであり、判断を代行するものではありません。',
        ],
      },
      {
        heading: 'スキルブックとAI解釈エコシステム',
        paragraphs: [
          'Computing Program for Rorschach Structural Summaryは、単なる計算ツールにとどまらず、専門家主導のAI解釈プラットフォームとして運営されています。利用者は、自身の解釈ノウハウを体系化したスキルブック（Skill Book）を作成し、活用することができます。',
          'スキルブックは、AIに提供される指示文（Instructions）および参照資料（Documents）で構成されます。理論的立場、解釈基準、概念枠組み、参考文献などを構造化して登録することで、AIはその枠組みに沿った解釈支援応答を生成します。同一の構造要約データであっても、専門家の理論背景や解釈スタイルが反映された結果を得ることが可能です。',
          'さらに、スキルブックストアを通じて他の専門家のスキルブックを共有または取引することができます。異なる理論的立場や文化的背景を反映した解釈ガイドが蓄積されることで、多様なロールシャッハ解釈のエコシステムが形成されます。',
        ],
      },
      {
        heading: '広告および運営主体',
        paragraphs: [
          'ログインしていない利用者にはGoogle AdSense広告が表示される場合があります。ログインユーザーには広告は表示されません。アカウントはAPIキー管理およびAIチャット履歴保存のために使用されます。',
          '本サービスは、ソウル臨床心理研究所（Seoul Institute of Clinical Psychology, SICP）とMOWが共同で提供しています。SICPはサービス企画と臨床心理学的な助言を担当し、MOWは開発と技術運用を担当します。サービス運営および今後の改善方針は、両者の協議により決定されます。現在、本サービスはソウル臨床心理研究所（SICP）を通じて対外案内されています。',
        ],
      },
    ],
    disclaimer: 'AIが生成する応答は、あくまで解釈を補助する参考情報として提供されるものであり、独立した臨床判断や正式な診断を代替するものではありません。最終的な判断と責任は専門家に帰属します。',
  },
  es: {
    title: 'Acerca de',
    subtitle: 'Computing Program for Rorschach Structural Summary es una herramienta web gratuita diseñada para automatizar el cálculo del Resumen Estructural conforme al Sistema Comprensivo de Exner (Comprehensive System, CS) del Test de Rorschach, e integrar funciones de apoyo interpretativo mediante inteligencia artificial. La plataforma está orientada principalmente a psicólogos clínicos, psicólogos orientadores y profesionales en formación que utilizan el Rorschach en su práctica profesional.',
    sections: [
      {
        heading: '¿Por qué es necesario este servicio?',
        paragraphs: [
          'El Test de Rorschach es un instrumento fundamental en la evaluación psicológica para comprender la estructura de la personalidad y la dinámica intrapsíquica. Sin embargo, el cálculo del Resumen Estructural bajo el Sistema Comprensivo de Exner es un proceso complejo, minucioso y demandante en tiempo. La integración precisa de múltiples variables e índices implica una carga técnica considerable y la posibilidad de errores de cálculo.',
          'El Computing Program for Rorschach Structural Summary fue desarrollado para reducir esta carga operativa y permitir que el profesional concentre su atención en la interpretación clínica y el juicio profesional. Al ingresar los datos de puntuación, el sistema genera automáticamente las principales variables del Resumen Estructural, incluyendo Localización, Determinantes, Calidad Formal, Puntuaciones Especiales y los seis índices principales (PTI, DEPI, CDI, S-CON, HVI, OBS).',
        ],
      },
      {
        heading: 'Alcance del apoyo interpretativo con IA',
        paragraphs: [
          'La plataforma ofrece apoyo interpretativo asistido por inteligencia artificial basado en los resultados calculados del Resumen Estructural. El usuario puede registrar su propia clave API para utilizar modelos de lenguaje de gran escala como OpenAI, Google o Anthropic. Las claves API se almacenan de forma cifrada y solo se utilizan cuando el usuario realiza una solicitud específica.',
          'Las respuestas generadas por la IA se proporcionan exclusivamente como material de referencia para apoyar el análisis interpretativo. No sustituyen el juicio clínico independiente ni constituyen un diagnóstico formal. La responsabilidad final de la interpretación recae siempre en el profesional. El sistema está diseñado para apoyar el razonamiento clínico, no para reemplazarlo.',
        ],
      },
      {
        heading: 'Skill Books y el ecosistema de interpretación con IA',
        paragraphs: [
          'Más allá del cálculo automático, el Asistente funciona como una plataforma de interpretación asistida centrada en el profesional. Los usuarios pueden crear y utilizar sus propios Skill Books, que estructuran su marco interpretativo y experiencia clínica.',
          'Un Skill Book se compone de Instrucciones y Documentos de referencia que se proporcionan al modelo de IA. El profesional puede incorporar su orientación teórica, criterios interpretativos, marcos conceptuales y materiales de apoyo dentro del Skill Book. De este modo, la IA genera respuestas alineadas con dicha estructura. Esto permite que un mismo Resumen Estructural produzca interpretaciones coherentes con la perspectiva teórica y el estilo clínico del profesional.',
          'A través de la Skill Book Store, los profesionales pueden compartir o intercambiar Skill Books con otros especialistas. La acumulación de enfoques clínicos diversos y contextos culturales distintos favorece la construcción de un ecosistema interpretativo que refleja múltiples tradiciones teóricas y marcos culturales del Rorschach.',
        ],
      },
      {
        heading: 'Publicidad y entidad operadora',
        paragraphs: [
          'A los usuarios que no han iniciado sesión se les pueden mostrar anuncios de Google AdSense. Los usuarios que han iniciado sesión no visualizan publicidad. Las cuentas se utilizan para la gestión de claves API y el almacenamiento del historial de chat con IA.',
          'Este Servicio es provisto conjuntamente por el Seoul Institute of Clinical Psychology (SICP) y MOW. SICP se encarga de la planificacion del servicio y del asesoramiento en psicologia clinica, mientras que MOW se encarga del desarrollo y de la operacion tecnica. La operacion del servicio y sus futuras mejoras se determinan mediante consulta entre ambas partes. Actualmente, el Servicio se presenta externamente a traves del Seoul Institute of Clinical Psychology (SICP).',
        ],
      },
    ],
    disclaimer: 'Las respuestas generadas por la IA se proporcionan exclusivamente como material de referencia. No sustituyen el juicio clínico independiente ni constituyen un diagnóstico formal. La responsabilidad final recae en el profesional.',
  },
  pt: {
    title: 'Sobre',
    subtitle: 'Computing Program for Rorschach Structural Summary é uma ferramenta web gratuita desenvolvida para automatizar o cálculo do Resumo Estrutural conforme o Sistema Compreensivo de Exner (Comprehensive System, CS) do Teste de Rorschach, além de oferecer suporte interpretativo assistido por inteligência artificial. A plataforma é direcionada principalmente a psicólogos clínicos, psicólogos orientadores e profissionais em formação que utilizam o Rorschach em sua prática profissional.',
    sections: [
      {
        heading: 'Por que este serviço é necessário?',
        paragraphs: [
          'O Teste de Rorschach é um instrumento fundamental na avaliação psicológica, permitindo a compreensão aprofundada da estrutura da personalidade e da dinâmica psíquica. No entanto, o cálculo do Resumo Estrutural segundo o Sistema Compreensivo de Exner é um processo complexo, detalhado e que exige tempo. A integração precisa de múltiplas variáveis e índices implica uma carga técnica significativa e a possibilidade de erros de cálculo.',
          'O Computing Program for Rorschach Structural Summary foi desenvolvido para reduzir essa carga operacional, permitindo que o profissional concentre sua atenção na interpretação clínica e no julgamento técnico. Ao inserir os dados de pontuação, o sistema gera automaticamente as principais variáveis do Resumo Estrutural, incluindo Localização, Determinantes, Qualidade Formal, Pontuações Especiais e os seis principais índices (PTI, DEPI, CDI, S-CON, HVI, OBS).',
        ],
      },
      {
        heading: 'Alcance do suporte interpretativo com IA',
        paragraphs: [
          'A plataforma oferece suporte interpretativo assistido por inteligência artificial com base nos resultados calculados do Resumo Estrutural. O usuário pode registrar sua própria chave de API para utilizar modelos de linguagem de grande escala, como OpenAI, Google ou Anthropic. As chaves de API são armazenadas de forma criptografada e utilizadas somente quando o usuário realiza uma solicitação específica.',
          'As respostas geradas pela IA são fornecidas exclusivamente como material de referência para apoiar a análise interpretativa. Elas não substituem o julgamento clínico independente nem constituem diagnóstico formal. A responsabilidade final pela interpretação permanece com o profissional. O sistema foi concebido para apoiar o raciocínio clínico, e não para substituí-lo.',
        ],
      },
      {
        heading: 'Skill Books e o ecossistema de interpretação com IA',
        paragraphs: [
          'Além do cálculo automatizado, o Assistente opera como uma plataforma de interpretação assistida centrada no profissional. Os usuários podem criar e utilizar seus próprios Skill Books, que estruturam seus referenciais interpretativos e conhecimentos clínicos.',
          'Um Skill Book é composto por Instruções e Documentos de referência fornecidos ao modelo de IA. O profissional pode incorporar sua orientação teórica, critérios interpretativos, estruturas conceituais e materiais de apoio dentro do Skill Book. Dessa forma, a IA gera respostas alinhadas a essa estrutura. Isso permite que um mesmo Resumo Estrutural produza interpretações coerentes com a perspectiva teórica e o estilo clínico do profissional.',
          'Por meio da Skill Book Store, profissionais podem compartilhar ou negociar Skill Books com outros especialistas. A incorporação de diferentes abordagens clínicas e contextos culturais contribui para a formação de um ecossistema interpretativo que reflete diversas tradições teóricas e realidades culturais do Rorschach.',
        ],
      },
      {
        heading: 'Publicidade e entidade operadora',
        paragraphs: [
          'Usuários que não estão autenticados podem visualizar anúncios do Google AdSense. Usuários autenticados não visualizam publicidade. As contas são utilizadas para gerenciamento de chaves de API e armazenamento do histórico de conversas com IA.',
          'Este Servico e fornecido conjuntamente pelo Seoul Institute of Clinical Psychology (SICP) e pela MOW. A SICP e responsavel pelo planejamento do servico e pela consultoria em psicologia clinica, enquanto a MOW e responsavel pelo desenvolvimento e pela operacao tecnica. A operacao do servico e as direcoes de melhoria futura sao definidas por consulta entre as duas partes. Atualmente, o Servico e apresentado externamente por meio do Seoul Institute of Clinical Psychology (SICP).',
        ],
      },
    ],
    disclaimer: 'As respostas geradas pela IA são fornecidas exclusivamente como material de referência. Não substituem o julgamento clínico independente nem constituem diagnóstico formal. A responsabilidade final permanece com o profissional.',
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
        <div className="mx-auto mb-3 flex max-w-4xl justify-end">
          <CopyPageButton language={activeLang} targetId="about-page-content" />
        </div>
        <div id="about-page-content" className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900">{content.title}</h1>
          <p className="mt-4 text-[15px] leading-7 text-slate-700">{content.subtitle}</p>

          <div className="mt-8 space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-base font-bold text-slate-800">{section.heading}</h2>
                <div className="mt-2 space-y-3">
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
