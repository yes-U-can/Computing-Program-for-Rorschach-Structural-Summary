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
  en: {
    pageTitle: 'Privacy Policy',
    intro: 'This page explains how account, API key, and AI chat data are handled in this service.',
    sections: [
      { title: '1. Personal Data Collected', body: ['Google OAuth may collect name, email, and profile image for authentication.'] },
      { title: '2. Purpose of Collection', body: ['Collected data is used for login/session management, API key management, and AI chat features.'] },
      { title: '3. API Key Encryption', body: ['Saved API keys are encrypted before storage using AES-256-CBC and are not stored as plaintext.'] },
      { title: '4. Chat History Storage and Retention', body: ['Chat messages can be stored in the database to provide session history and continuity.'] },
      { title: '5. Analytics, Ads, and Cookies', body: ['Google Analytics/AdSense may process technical identifiers and cookie-related data as configured.'] },
      { title: '6. User Knowledge Sources', body: ['User-added knowledge sources are stored in browser localStorage and may be sent with chat requests for answer quality.'] },
      { title: '7. User Rights', body: ['Users may request access, correction, and deletion of their account-related data within available product flows.'] },
      { title: '8. Deletion Procedure', body: ['Data is deleted or anonymized according to feature scope when no longer required or upon deletion request.'] },
      { title: '9. Contact', body: ['For privacy-related inquiries, contact the service operator or designated administrator.'] },
    ],
  },
  ko: {
    pageTitle: '개인정보처리방침',
    intro: '본 페이지는 서비스 내 계정, API 키, AI 채팅 데이터의 처리 방식을 설명합니다.',
    sections: [
      { title: '1. 수집하는 개인정보 항목', body: ['Google OAuth 인증 시 이름, 이메일, 프로필 이미지가 수집될 수 있습니다.'] },
      { title: '2. 수집 목적', body: ['수집 정보는 로그인/세션 관리, API 키 관리, AI 채팅 기능 제공 목적으로 사용됩니다.'] },
      { title: '3. API 키 암호화 저장', body: ['저장된 API 키는 AES-256-CBC 방식으로 암호화되어 저장되며 평문으로 저장되지 않습니다.'] },
      { title: '4. 채팅 내역 저장 및 보존', body: ['채팅 메시지는 세션 이력과 연속성 제공을 위해 데이터베이스에 저장될 수 있습니다.'] },
      { title: '5. Analytics/광고 및 쿠키', body: ['Google Analytics/AdSense가 설정된 경우 기술 식별자 및 쿠키 관련 정보가 처리될 수 있습니다.'] },
      { title: '6. 사용자 지식 소스 처리', body: ['사용자 지식 소스는 브라우저 localStorage에 저장되며 응답 품질 향상을 위해 채팅 요청과 함께 전송될 수 있습니다.'] },
      { title: '7. 사용자 권리', body: ['사용자는 서비스에서 제공하는 범위 내에서 열람, 정정, 삭제를 요청할 수 있습니다.'] },
      { title: '8. 파기 절차', body: ['필요 목적이 달성되었거나 삭제 요청이 있는 경우 범위에 따라 삭제 또는 비식별 처리합니다.'] },
      { title: '9. 문의처', body: ['개인정보 관련 문의는 서비스 운영자 또는 관리 책임자에게 연락해 주세요.'] },
    ],
  },
  ja: {
    pageTitle: '個人情報処理方針',
    intro: 'このページでは、本サービスにおけるアカウント、APIキー、AIチャットデータの取り扱いを説明します。',
    sections: [
      { title: '1. 収集する個人情報', body: ['Google OAuth認証により、氏名、メールアドレス、プロフィール画像を取得する場合があります。'] },
      { title: '2. 利用目的', body: ['取得情報は、ログイン/セッション管理、APIキー管理、AIチャット機能提供のために利用されます。'] },
      { title: '3. APIキーの暗号化保存', body: ['保存されるAPIキーはAES-256-CBCで暗号化され、平文では保存されません。'] },
      { title: '4. チャット履歴の保存と保管', body: ['チャット履歴は、セッション継続性の提供のためにデータベースへ保存される場合があります。'] },
      { title: '5. 解析・広告・Cookie', body: ['Google Analytics/AdSense設定時、技術識別子やCookie関連情報が処理される場合があります。'] },
      { title: '6. ユーザー知識ソース', body: ['ユーザー追加の知識ソースはブラウザlocalStorageに保存され、回答品質向上のためチャット送信時に利用される場合があります。'] },
      { title: '7. ユーザーの権利', body: ['ユーザーは提供機能の範囲内で、閲覧、修正、削除を要求できます。'] },
      { title: '8. 削除手続き', body: ['目的達成後または削除要請時に、機能範囲に応じて削除または匿名化します。'] },
      { title: '9. 連絡先', body: ['個人情報に関する問い合わせは、サービス運営者または管理責任者へご連絡ください。'] },
    ],
  },
  es: {
    pageTitle: 'Política de Privacidad',
    intro: 'Esta página describe cómo se gestionan los datos de cuenta, clave API y chat con IA en este servicio.',
    sections: [
      { title: '1. Datos personales recopilados', body: ['Con Google OAuth se pueden recopilar nombre, correo electrónico e imagen de perfil para autenticación.'] },
      { title: '2. Finalidad del tratamiento', body: ['Los datos se usan para inicio de sesión/gestión de sesión, gestión de claves API y funciones de chat con IA.'] },
      { title: '3. Cifrado de claves API', body: ['Las claves API guardadas se cifran con AES-256-CBC antes de almacenarse y no se guardan en texto plano.'] },
      { title: '4. Historial de chat y retención', body: ['Los mensajes de chat pueden guardarse en base de datos para mantener continuidad e historial de sesiones.'] },
      { title: '5. Analítica, anuncios y cookies', body: ['Google Analytics/AdSense puede procesar identificadores técnicos y datos relacionados con cookies según configuración.'] },
      { title: '6. Fuentes de conocimiento del usuario', body: ['Las fuentes añadidas por el usuario se guardan en localStorage del navegador y pueden enviarse con solicitudes de chat para mejorar respuestas.'] },
      { title: '7. Derechos del usuario', body: ['El usuario puede solicitar acceso, corrección y eliminación de datos dentro de los flujos disponibles del servicio.'] },
      { title: '8. Procedimiento de eliminación', body: ['Los datos se eliminan o anonimizan cuando ya no son necesarios o tras una solicitud de eliminación.'] },
      { title: '9. Contacto', body: ['Para consultas de privacidad, contacte al operador del servicio o responsable designado.'] },
    ],
  },
  pt: {
    pageTitle: 'Política de Privacidade',
    intro: 'Esta página descreve como dados de conta, chave de API e chat com IA são tratados neste serviço.',
    sections: [
      { title: '1. Dados pessoais coletados', body: ['No Google OAuth, nome, e-mail e imagem de perfil podem ser coletados para autenticação.'] },
      { title: '2. Finalidade da coleta', body: ['Os dados são usados para login/gestão de sessão, gestão de chaves de API e recursos de chat com IA.'] },
      { title: '3. Criptografia de chaves de API', body: ['As chaves de API salvas são criptografadas com AES-256-CBC antes do armazenamento e não ficam em texto puro.'] },
      { title: '4. Histórico de chat e retenção', body: ['Mensagens de chat podem ser armazenadas em banco de dados para manter continuidade e histórico de sessão.'] },
      { title: '5. Analytics, anúncios e cookies', body: ['Google Analytics/AdSense pode processar identificadores técnicos e dados relacionados a cookies conforme configuração.'] },
      { title: '6. Fontes de conhecimento do usuário', body: ['Fontes adicionadas pelo usuário ficam no localStorage do navegador e podem ser enviadas com requisições de chat para melhorar respostas.'] },
      { title: '7. Direitos do usuário', body: ['O usuário pode solicitar acesso, correção e exclusão de dados dentro dos fluxos disponíveis no serviço.'] },
      { title: '8. Procedimento de exclusão', body: ['Os dados são excluídos ou anonimizados quando não forem mais necessários ou mediante solicitação de exclusão.'] },
      { title: '9. Contato', body: ['Para questões de privacidade, entre em contato com o operador do serviço ou responsável designado.'] },
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
