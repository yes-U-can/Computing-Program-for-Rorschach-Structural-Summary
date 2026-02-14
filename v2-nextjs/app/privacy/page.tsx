'use client';

import { useTranslation } from '@/hooks/useTranslation';

type Section = {
  title: string;
  body: string[];
};

type PrivacyContent = {
  pageTitle: string;
  intro: string;
  sections: Section[];
};

const privacyByLang: Record<string, PrivacyContent> = {
  ko: {
    pageTitle: '개인정보처리방침',
    intro: '이 페이지는 본 서비스에서 계정, API 키, AI 채팅 데이터가 어떻게 처리되는지 설명합니다.',
    sections: [
      { title: '1. 수집하는 개인정보 항목', body: ['Google OAuth 로그인 시 이름, 이메일, 프로필 이미지가 수집될 수 있습니다.'] },
      { title: '2. 수집 목적', body: ['로그인/세션 관리, API 키 관리, AI 채팅 기능 제공을 위해 사용됩니다.'] },
      { title: '3. API 키 암호화', body: ['저장된 API 키는 AES-256-CBC 방식으로 암호화되어 저장되며 평문으로 저장되지 않습니다.'] },
      { title: '4. 채팅 이력 저장', body: ['채팅 연속성 제공을 위해 메시지가 데이터베이스에 저장될 수 있습니다.'] },
      { title: '5. 사용자 권리', body: ['사용자는 서비스 내 제공 기능 범위에서 열람, 정정, 삭제를 요청할 수 있습니다.'] },
      { title: '6. 문의', body: ['개인정보 관련 문의는 서비스 운영자에게 연락해 주세요.'] },
    ],
  },
  en: {
    pageTitle: 'Privacy Policy',
    intro: 'This page explains how account, API key, and AI chat data are handled in this service.',
    sections: [
      { title: '1. Personal Data Collected', body: ['Google OAuth may collect name, email, and profile image for authentication.'] },
      { title: '2. Purpose of Collection', body: ['Collected data is used for login/session management, API key management, and AI chat features.'] },
      { title: '3. API Key Encryption', body: ['Saved API keys are encrypted before storage using AES-256-CBC and are not stored as plaintext.'] },
      { title: '4. Chat History Storage', body: ['Chat messages can be stored in the database to provide session history and continuity.'] },
      { title: '5. User Rights', body: ['Users may request access, correction, and deletion of account-related data within available product flows.'] },
      { title: '6. Contact', body: ['For privacy-related inquiries, contact the service operator.'] },
    ],
  },
  ja: {
    pageTitle: 'プライバシーポリシー',
    intro: 'このページでは、本サービスにおけるアカウント、APIキー、AIチャットデータの取り扱いを説明します。',
    sections: [
      { title: '1. 収集する個人情報', body: ['Google OAuth認証時に、氏名・メールアドレス・プロフィール画像を収集する場合があります。'] },
      { title: '2. 利用目的', body: ['ログイン/セッション管理、APIキー管理、AIチャット機能の提供に利用します。'] },
      { title: '3. APIキーの暗号化', body: ['保存されたAPIキーはAES-256-CBCで暗号化され、平文では保存されません。'] },
      { title: '4. チャット履歴の保存', body: ['チャットの継続性提供のため、メッセージがデータベースに保存される場合があります。'] },
      { title: '5. 利用者の権利', body: ['利用者は、サービスで提供される範囲内で閲覧・訂正・削除を要求できます。'] },
      { title: '6. お問い合わせ', body: ['プライバシーに関するお問い合わせは運営者までご連絡ください。'] },
    ],
  },
  es: {
    pageTitle: 'Política de Privacidad',
    intro: 'Esta página describe cómo se gestionan los datos de cuenta, clave API y chat con IA.',
    sections: [
      { title: '1. Datos personales recopilados', body: ['Google OAuth puede recopilar nombre, correo electrónico e imagen de perfil para autenticación.'] },
      { title: '2. Finalidad del tratamiento', body: ['Los datos se usan para inicio de sesión, gestión de API keys y funciones de chat con IA.'] },
      { title: '3. Cifrado de claves API', body: ['Las claves API se cifran con AES-256-CBC y no se guardan en texto plano.'] },
      { title: '4. Historial de chat', body: ['Los mensajes de chat pueden almacenarse para continuidad e historial de sesión.'] },
      { title: '5. Derechos del usuario', body: ['El usuario puede solicitar acceso, corrección y eliminación de datos.'] },
      { title: '6. Contacto', body: ['Para consultas de privacidad, contacte al operador del servicio.'] },
    ],
  },
  pt: {
    pageTitle: 'Política de Privacidade',
    intro: 'Esta página descreve como os dados de conta, chave de API e chat com IA são tratados.',
    sections: [
      { title: '1. Dados pessoais coletados', body: ['Google OAuth pode coletar nome, e-mail e imagem de perfil para autenticação.'] },
      { title: '2. Finalidade da coleta', body: ['Os dados são usados para login, gerenciamento de API keys e recursos de chat com IA.'] },
      { title: '3. Criptografia de chaves API', body: ['As chaves API são criptografadas com AES-256-CBC e não ficam em texto puro.'] },
      { title: '4. Histórico de chat', body: ['Mensagens podem ser armazenadas para continuidade e histórico da sessão.'] },
      { title: '5. Direitos do usuário', body: ['O usuário pode solicitar acesso, correção e exclusão dos dados.'] },
      { title: '6. Contato', body: ['Para questões de privacidade, entre em contato com o operador do serviço.'] },
    ],
  },
};

export default function PrivacyPage() {
  const { language } = useTranslation();
  const content = privacyByLang[language] ?? privacyByLang.en;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">{content.pageTitle}</h1>
      <p className="mt-4 text-slate-600">{content.intro}</p>
      <div className="mt-8 space-y-6">
        {content.sections.map((section) => (
          <section key={section.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-800">{section.title}</h2>
            <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
              {section.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
