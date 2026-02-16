import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CopyPageButton from '@/components/common/CopyPageButton';
import { getPrivacySections } from '@/lib/privacySections';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type PrivacyPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for using this website.',
  alternates: {
    canonical: '/privacy',
    languages: buildLanguageAlternates('/privacy'),
  },
};

type PolicySection = {
  heading: string;
  items: string[];
};

type PolicyContent = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: PolicySection[];
};

const KO_CONTENT: PolicyContent = {
  title: '개인정보처리방침',
  effectiveDate: '시행일: 2026년 2월 15일',
  intro:
    '서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP)와 모오(MOW)(이하 총칭하여 "운영자")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다. 본 방침은 https://exnersicp.vercel.app 에서 제공하는 로샤 구조요약 계산 도우미(영문: Computing Program for Rorschach Structural Summary, 이하 "서비스")에 적용됩니다.',
  sections: [
    {
      heading: '제1조(개인정보의 처리 목적)',
      items: [
        '운영자는 다음의 목적을 위하여 개인정보를 처리하며, 목적 외 용도로는 이용되지 않습니다. 목적이 변경되는 경우 관련 법령에 따른 조치를 이행합니다.',
        '1. 회원 관리: Google OAuth를 통한 회원 식별 및 인증, 계정 관리 및 서비스 제공, 부정 이용 방지 및 서비스 보안 유지',
        '2. AI 해석 보조 기능 제공: 회원이 등록한 API 키 관리, AI 대화 기능 제공 및 대화 기록 관리, 회원이 등록한 지식 소스 및 스킬북 기능 제공',
        '3. 스킬북 및 크레딧 기능 운영: 스킬북 생성·관리·거래 기능 제공, 크레딧 충전·사용·정산 처리, 분쟁 처리 및 고객지원',
        '4. 서비스 운영 및 보안 관리: 부정 이용 방지, 시스템 안정성 확보 및 오류 대응',
        '5. 광고 제공(비회원 대상): Google AdSense를 통한 광고 노출',
      ],
    },
    {
      heading: '제2조(처리하는 개인정보의 항목)',
      items: [
        '운영자는 다음의 개인정보를 처리할 수 있습니다.',
        '1. 로그인 시: Google 계정 정보(이메일 주소, 이름, 프로필 이미지), Google OAuth 인증 관련 식별 정보',
        '2. AI 기능 이용 시: 회원이 등록한 API 키(암호화 저장), AI 대화 내용 및 대화 기록, 회원이 등록한 지식 소스(노트·문서 등)',
        '3. 크레딧 결제 시: 결제 처리에 필요한 최소한의 정보(실제 결제 정보는 Stripe가 직접 처리하며 운영자는 저장하지 않음)',
        '4. 서비스 이용 과정의 자동 생성 정보: 접속 로그, 이용 기록, 쿠키, IP 주소 등',
        '5. 비회원(게스트): 로그인 없이 구조요약 자동 계산 기능 이용 가능, 구조요약 입력 데이터는 서버에 저장하지 않음, 입력 데이터 일부는 이용자 브라우저 LocalStorage에 저장될 수 있음, Google AdSense 광고 제공을 위한 쿠키가 사용될 수 있음',
      ],
    },
    {
      heading: '제3조(개인정보의 보유 및 이용기간)',
      items: [
        '1. 회원 개인정보는 서비스 이용 기간 동안 보유·이용합니다.',
        '2. 정보주체가 서비스 데이터 삭제(탈퇴에 준하는 처리) 또는 개인정보 삭제를 요청하는 경우, 관련 법령상 보존의무가 없는 범위에서 지체 없이 파기합니다.',
        '3. AI 대화 기록 및 지식 소스는 계정 유지 기간 동안 보관됩니다.',
        '4. API 키는 회원이 직접 삭제하거나 서비스 데이터 삭제 요청이 완료된 경우 지체 없이 삭제합니다.',
        '5. 관계 법령에 따라 보존이 필요한 정보는 해당 법령에서 정한 보존기간 동안 보관합니다.',
      ],
    },
    {
      heading: '제4조(Google OAuth 로그인 및 계정 삭제/연결 해제 안내)',
      items: [
        '1. 본 서비스는 별도의 독립 회원가입 절차 없이 Google OAuth 로그인을 통해 계정을 식별합니다.',
        '2. 정보주체는 Google 계정 설정의 "연결된 앱" 관리 메뉴에서 본 서비스 연결 권한을 해제할 수 있습니다.',
        '3. Google 연결 해제는 Google 인증 권한 철회에 해당하며, 서비스 내 저장 데이터 삭제와는 별도로 처리될 수 있습니다.',
        '4. 계정 연동 데이터의 삭제(탈퇴에 준하는 처리)를 원하는 경우 제12조 문의처로 요청할 수 있으며, 운영자는 법령상 보존의무를 제외한 범위에서 지체 없이 조치합니다.',
      ],
    },
    {
      heading: '제5조(개인정보의 제3자 제공)',
      items: [
        '운영자는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만 다음의 경우에는 예외로 합니다.',
        '1. 정보주체의 동의를 받은 경우',
        '2. 법령에 근거가 있는 경우',
        '3. AI 해석 보조 기능 이용 시 회원이 요청한 범위 내에서 OpenAI, Google, Anthropic 등 외부 LLM 제공사에 입력 데이터가 전송되는 경우(해당 정보는 각 사업자 정책에 따라 처리될 수 있음)',
      ],
    },
    {
      heading: '제6조(개인정보 처리의 위탁)',
      items: [
        '운영자는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리를 위탁합니다.',
        '1. Vercel: 서비스 호스팅 및 서버 인프라 운영',
        '2. Stripe: 크레딧 결제 처리',
        '3. Google AdSense: 광고 제공 및 관련 쿠키 운영',
        '위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 필요한 사항을 규정하고 수탁자를 관리·감독합니다.',
      ],
    },
    {
      heading: '제7조(개인정보의 국외 이전)',
      items: [
        '1. AI 해석 보조 기능 이용 시 회원이 요청한 데이터가 OpenAI, Google, Anthropic 등 해외 소재 LLM 제공사로 전송될 수 있습니다.',
        '2. Google OAuth 로그인, Google AdSense 광고 제공 및 Stripe 결제 처리 과정에서 개인정보가 국외로 이전될 수 있습니다.',
        '3. 국외 이전되는 개인정보는 각 사업자의 개인정보처리방침 및 관련 법령에 따라 처리됩니다.',
      ],
    },
    {
      heading: '제8조(개인정보의 파기 절차 및 방법)',
      items: [
        '1. 운영자는 보유기간 경과, 처리 목적 달성 등으로 개인정보가 불필요하게 된 경우 지체 없이 파기합니다.',
        '2. 전자적 파일 형태 정보는 복구 및 재생이 불가능한 방법으로 삭제합니다.',
        '3. 종이 문서에 기록·저장된 개인정보는 분쇄 또는 소각하여 파기합니다.',
      ],
    },
    {
      heading: '제9조(정보주체의 권리·의무 및 행사방법)',
      items: [
        '1. 정보주체는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.',
        '2. 권리 행사는 이메일(mow.coding@gmail.com)로 요청할 수 있으며, 운영자는 지체 없이 조치합니다.',
        '3. 정보주체는 자신의 개인정보를 최신의 상태로 유지할 책임이 있습니다.',
      ],
    },
    {
      heading: '제10조(개인정보의 안전성 확보조치)',
      items: [
        '운영자는 개인정보의 안전성 확보를 위하여 다음과 같은 조치를 취합니다.',
        '1. API 키의 AES-256-CBC 암호화 저장',
        '2. 접근 권한 관리 및 최소 권한 부여',
        '3. 보안 업데이트 및 시스템 점검',
      ],
    },
    {
      heading: '제11조(쿠키의 설치·운영 및 거부)',
      items: [
        '1. 운영자는 서비스 운영 및 Google AdSense 광고 제공을 위하여 쿠키를 사용할 수 있습니다.',
        '2. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.',
        '3. 쿠키 저장을 거부할 경우 일부 서비스 이용이 제한될 수 있습니다.',
      ],
    },
    {
      heading: '제12조(개인정보 보호책임자 및 문의처)',
      items: [
        '운영자는 개인정보 처리 관련 업무를 총괄하고 정보주체의 불만 처리 및 피해 구제를 위하여 아래와 같이 개인정보 보호책임자(담당)를 지정합니다.',
        '책임자(개인정보 보호 업무): 모오(MOW)',
        '공동 운영 주체: 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP), 모오(MOW) / 이메일: mow.coding@gmail.com',
      ],
    },
    {
      heading: '제13조(권익침해 구제방법)',
      items: [
        '정보주체는 개인정보침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의할 수 있습니다.',
        '1. 개인정보분쟁조정위원회 (www.kopico.go.kr / 1833-6972)',
        '2. 개인정보침해신고센터 (privacy.kisa.or.kr / 118)',
        '3. 대검찰청 (www.spo.go.kr / 1301)',
        '4. 경찰청 (ecrm.cyber.go.kr / 182)',
      ],
    },
    {
      heading: '제14조(개인정보처리방침의 변경)',
      items: [
        '1. 본 방침은 관련 법령 또는 서비스 내용 변경에 따라 수정될 수 있습니다.',
        '2. 변경 시 서비스 화면을 통해 공지합니다.',
      ],
    },
    {
      heading: '부칙',
      items: ['본 개인정보처리방침은 2026년 2월 15일부터 시행합니다.'],
    },
  ],
};

const NON_KO_SERVICE_NOTES: Record<'en' | 'ja' | 'es' | 'pt', PolicySection> = {
  en: {
    heading: 'Service-Specific Disclosures',
    items: [
      'This Service is jointly operated by Seoul Institute of Clinical Psychology (SICP) and MOW. It uses Google OAuth login instead of a standalone sign-up flow.',
      'Revoking Google account connection and deleting Service-stored data are separate procedures. Users can revoke connection in Google account settings and request data deletion through the contact channel.',
      'Hosting and infrastructure are operated on Vercel.',
      'Payment processing for Credits is handled by Stripe, and payment card details are processed directly by Stripe.',
      'Advertising is provided through Google AdSense for guest users.',
      'Data may be transferred overseas through external LLM providers (OpenAI, Google, Anthropic), Google OAuth, Google AdSense, and Stripe according to each provider policy.',
    ],
  },
  ja: {
    heading: 'サービス固有の開示事項',
    items: [
      '本サービスは、ソウル臨床心理研究所（SICP）とMOWが共同で運営し、独立した会員登録ではなくGoogle OAuthログイン方式を利用します。',
      'Google連携解除とサービス内保存データ削除は別手続です。連携解除はGoogleアカウント設定で行い、データ削除は問い合わせ窓口で申請できます。',
      'ホスティングおよびインフラはVercelで運用されます。',
      'クレジット決済はStripeが処理し、カード情報はStripeが直接処理します。',
      '広告はゲスト利用者向けにGoogle AdSenseを使用します。',
      '外部LLM提供者（OpenAI、Google、Anthropic）、Google OAuth、Google AdSense、Stripeの利用により、データが海外へ移転される場合があります。',
    ],
  },
  es: {
    heading: 'Divulgaciones Especificas del Servicio',
    items: [
      'Este Servicio es operado conjuntamente por Seoul Institute of Clinical Psychology (SICP) y MOW, y utiliza inicio de sesion con Google OAuth en lugar de un registro independiente.',
      'Revocar la conexion de Google y eliminar los datos almacenados en el Servicio son procedimientos distintos. La revocacion se realiza en la cuenta de Google y la eliminacion de datos se solicita por el canal de contacto.',
      'El alojamiento y la infraestructura se operan en Vercel.',
      'El procesamiento de pagos de Creditos se realiza por Stripe, y los datos de tarjeta son procesados directamente por Stripe.',
      'La publicidad para invitados se ofrece mediante Google AdSense.',
      'Puede haber transferencia internacional de datos por proveedores LLM externos (OpenAI, Google, Anthropic), Google OAuth, Google AdSense y Stripe, conforme a sus politicas.',
    ],
  },
  pt: {
    heading: 'Divulgacoes Especificas do Servico',
    items: [
      'Este Servico e operado conjuntamente pelo Seoul Institute of Clinical Psychology (SICP) e pela MOW, e utiliza login com Google OAuth em vez de cadastro independente.',
      'Revogar a conexao do Google e excluir dados armazenados no Servico sao procedimentos distintos. A revogacao ocorre na conta Google e a exclusao de dados pode ser solicitada pelo canal de contato.',
      'A hospedagem e a infraestrutura sao operadas na Vercel.',
      'O processamento de pagamentos de Creditos e feito pela Stripe, e os dados de cartao sao processados diretamente pela Stripe.',
      'A publicidade para convidados e fornecida pelo Google AdSense.',
      'Pode ocorrer transferencia internacional de dados por provedores externos de LLM (OpenAI, Google, Anthropic), Google OAuth, Google AdSense e Stripe, conforme as politicas de cada provedor.',
    ],
  },
};

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);

  const fallbackTitle: Record<Language, string> = {
    en: 'Privacy Policy',
    ko: KO_CONTENT.title,
    ja: 'プライバシーポリシー',
    es: 'Politica de Privacidad',
    pt: 'Politica de Privacidade',
  };

  const fallbackIntro: Record<Language, string> = {
    en: 'This page explains how account, API key, and AI chat data are handled in this service.',
    ko: KO_CONTENT.intro,
    ja: 'このページでは、本サービスにおけるアカウント、APIキー、AIチャットデータの取り扱いを説明します。',
    es: 'Esta pagina explica como se gestionan los datos de cuenta, clave API y chat de IA en este servicio.',
    pt: 'Esta pagina explica como os dados de conta, chave API e chat de IA sao tratados neste servico.',
  };

  const fallbackEffectiveDate: Record<Language, string> = {
    en: 'Effective Date: February 15, 2026',
    ko: KO_CONTENT.effectiveDate,
    ja: '施行日: 2026年2月15日',
    es: 'Fecha de entrada en vigor: 15 de febrero de 2026',
    pt: 'Data de entrada em vigor: 15 de fevereiro de 2026',
  };

  const content: PolicyContent =
    activeLang === 'ko'
      ? KO_CONTENT
      : {
          title: fallbackTitle[activeLang],
          effectiveDate: fallbackEffectiveDate[activeLang],
          intro: fallbackIntro[activeLang],
          sections: [
            ...getPrivacySections(activeLang).map((section) => ({
              heading: section.title,
              items: section.body,
            })),
            NON_KO_SERVICE_NOTES[activeLang as 'en' | 'ja' | 'es' | 'pt'],
          ],
        };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto mb-3 flex max-w-4xl justify-end">
          <CopyPageButton language={activeLang} targetId="privacy-page-content" />
        </div>
        <div id="privacy-page-content" className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900">{content.title}</h1>
          <p className="mt-3 text-sm text-slate-500">{content.effectiveDate}</p>
          <p className="mt-4 text-[15px] leading-7 text-slate-700">{content.intro}</p>

          <div className="mt-8 space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-base font-bold text-slate-800">{section.heading}</h2>
                <ul className="mt-2 space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-7 text-slate-700">
                      <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
