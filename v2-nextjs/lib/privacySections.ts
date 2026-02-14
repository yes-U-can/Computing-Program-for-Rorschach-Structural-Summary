import type { Language } from '@/types';

export type PrivacySection = {
  slug: string;
  title: string;
  body: string[];
};

const BASE_SECTIONS: Array<{ slug: string; index: number }> = [
  { slug: 'service-mode', index: 1 },
  { slug: 'data-collected', index: 2 },
  { slug: 'purpose-of-use', index: 3 },
  { slug: 'api-key-encryption', index: 4 },
  { slug: 'ai-chat-and-third-parties', index: 5 },
  { slug: 'retention-and-deletion', index: 6 },
  { slug: 'security', index: 7 },
  { slug: 'user-rights', index: 8 },
  { slug: 'policy-changes', index: 9 },
  { slug: 'contact', index: 10 },
];

type LangDict = Record<string, { title: string; body: string[] }>;

const EN: LangDict = {
  'service-mode': {
    title: 'Service Mode (Guest and Logged-in Use)',
    body: [
      'This service is designed so core functions, including scoring and structural-summary calculation, can be used in guest mode without creating an account.',
      'Features that require account-level persistence and sync, such as API-key management, personal knowledge-source storage, and account-linked AI chat history, are available only when logged in.',
      'Google sign-in is optional and is used to identify the account owner and maintain continuity across sessions and devices.',
      'Some data created in guest mode may remain only in the local browser environment and may not be synchronized like account-linked data.',
      'The service separates guest and logged-in operation modes to keep data handling aligned with each feature scope.',
      'If product capabilities change, the scope of each mode may be updated and material changes will be communicated through policy updates or service notice.',
    ],
  },
  'data-collected': {
    title: 'Data Collected',
    body: [
      'When Google login is used, OAuth-based account identifiers (for example, name, email address, and profile image) may be processed for authentication and account display.',
      'When users register AI API keys, protected key data and minimal related metadata may be stored to support account-based model access.',
      'When users add knowledge sources or chat messages, related content may be stored to provide requested functionality and continuity of experience.',
      'Limited technical logs (for example, access time, error events, and feature usage traces) may be generated for security operations and service reliability.',
      'In guest mode, browser-side local storage may hold settings, recent inputs, and temporary outputs for convenience.',
      'Where retention is required by law or dispute handling, specific records may be preserved for the required period and removed when no longer needed.',
    ],
  },
  'purpose-of-use': {
    title: 'Purpose of Processing',
    body: [
      'Data is processed to provide core authentication operations, including login/session management, account identification, and access control.',
      'Data is processed for API-key registration, protected key handling, model-call routing, and related AI feature delivery.',
      'Stored user context, such as knowledge sources and conversation history, may be used to improve response quality and maintain continuity.',
      'Technical processing supports error diagnosis, abuse prevention, operational monitoring, and service stability/security management.',
      'Data may also be processed to comply with legal obligations and to handle disputes or user-rights requests.',
      'Data is not processed for incompatible new purposes without appropriate legal basis and notice where required.',
    ],
  },
  'api-key-encryption': {
    title: 'API Key Handling and Encryption',
    body: [
      'User-provided API keys are encrypted before storage and are not intentionally retained as plaintext in persistent storage.',
      'Runtime decryption occurs only when necessary to execute the model call requested by the user and only within the minimum required scope.',
      'Access to key material is restricted by least-privilege controls to reduce unnecessary internal exposure.',
      'Logging and monitoring flows are designed to avoid recording full key values and may apply masking where applicable.',
      'Users remain responsible for issuance, rotation, revocation, and quota/billing management of their own provider keys.',
      'If key compromise is suspected, users should immediately revoke and replace affected keys with the provider.',
    ],
  },
  'ai-chat-and-third-parties': {
    title: 'AI Chat and Third-Party Model Providers',
    body: [
      'When users request AI chat, prompt payloads may include structural-summary output and user-provided context (for example, saved knowledge sources) to improve response quality.',
      'Model inference may be performed by a user-selected third-party provider (for example, OpenAI, Google, or Anthropic), and relevant request data may be transmitted to that provider.',
      'The exact data transmitted depends on user input, feature selection, and whether contextual augmentation is enabled.',
      'Processing by third-party providers, including retention and cross-border transfer practices, is governed by each provider policy and terms.',
      'The service aims to transmit only data needed to fulfill the requested function, following a data-minimization approach where practical.',
      'Users should avoid entering sensitive information they do not want shared with external model providers.',
    ],
  },
  'retention-and-deletion': {
    title: 'Retention and Deletion',
    body: [
      'Personal and related service data is retained only for periods necessary to provide requested features and operate the service.',
      'When retention is mandated by applicable law, records may be preserved for the required statutory period before secure disposal.',
      'Retention may be temporarily extended where reasonably necessary for dispute resolution, abuse investigation, or security incident response.',
      'Users may request deletion of account-linked data through available in-product controls or official support channels.',
      'Deletion requests are processed after identity/eligibility checks and may take additional time to propagate through backup systems.',
      'Browser local-storage data remains on user devices until removed by user action or browser controls.',
    ],
  },
  security: {
    title: 'Security Measures',
    body: [
      'Reasonable administrative, technical, and organizational safeguards are applied to reduce risks of unauthorized access, alteration, disclosure, and loss.',
      'Controls may include access restriction, encrypted handling of sensitive fields, secure transport practices, and environment-level hardening.',
      'Operational security procedures may include monitoring, anomaly detection, and response workflows for suspicious activity.',
      'Internal access is managed with least-privilege principles and controlled change-management practices where possible.',
      'No internet service can guarantee absolute security; users should also protect account credentials and API keys on their side.',
      'Security controls are reviewed and improved over time based on risk, incidents, and operational needs.',
    ],
  },
  'user-rights': {
    title: 'User Rights',
    body: [
      'Where applicable by law, users may request access, correction, deletion, restriction, objection, or portability of personal data.',
      'Requests can be submitted through available in-product controls or official support/contact channels.',
      'Identity verification may be required before actioning requests to protect account and data security.',
      'Certain requests may be limited where legal obligations, third-party rights, or technical constraints apply.',
      'Users may withdraw consent for specific processing activities, though some features may become unavailable as a result.',
      'If users disagree with outcomes, they may pursue available legal or regulatory complaint channels under applicable law.',
    ],
  },
  'policy-changes': {
    title: 'Policy Changes',
    body: [
      'This privacy policy may be updated to reflect product changes, legal updates, security practices, and operational adjustments.',
      'For material changes, the service will provide reasonable notice before or at the time the changes take effect.',
      'Notice methods may include in-service announcements, updated effective dates, or policy-page revision indicators.',
      'Where useful, summaries of key changes and rationale may be provided to improve readability.',
      'If immediate updates are required by law or urgent security needs, notice may follow as soon as reasonably practicable.',
      'Continued use of the service after effective changes may be treated as acceptance of the updated policy where legally permitted.',
    ],
  },
  contact: {
    title: 'Contact',
    body: [
      'For privacy-related questions, data-rights requests, consent-withdrawal requests, or incident reports, contact the service operator through the official support/contact channel.',
      'To process requests accurately, users may be asked to provide minimum identifying details and a clear description of the request scope.',
      'Submitted reports and requests are reviewed under internal procedures, and progress or outcomes are communicated where appropriate.',
      'Potentially urgent security matters (for example, suspected key exposure or account takeover) may receive prioritized handling.',
      'Response times may vary depending on legal review needs, request complexity, and verification requirements.',
      'Where required by law, records of request handling may be retained for compliance and audit purposes.',
    ],
  },
};

const KO: LangDict = {
  'service-mode': {
    title: '서비스 이용 방식(비로그인/로그인)',
    body: [
      '본 서비스는 비로그인(게스트) 상태에서도 구조요약 계산, 결과 확인 등 핵심 기능을 이용할 수 있도록 설계되어 있습니다.',
      '다만 계정 단위로 저장/동기화가 필요한 기능(예: API 키 관리, 개인 지식 소스 관리, 계정 연동 채팅 기록)은 로그인 상태에서만 제공됩니다.',
      'Google 로그인을 선택하는 경우, 사용자는 동일한 계정으로 여러 기기에서 설정 및 데이터를 이어서 사용할 수 있습니다.',
      '비로그인 상태에서 생성된 일부 데이터는 브라우저 환경에 한정되어 유지될 수 있으며, 계정 데이터처럼 서버 간 동기화되지는 않을 수 있습니다.',
      '서비스는 기능 제공을 위해 비로그인/로그인 모드를 구분하여 동작하며, 각 모드에서 처리되는 정보 범위가 다를 수 있습니다.',
      '향후 기능 변경으로 모드별 제공 범위가 달라질 수 있으며, 중요한 변경은 정책 또는 서비스 공지를 통해 안내합니다.',
    ],
  },
  'data-collected': {
    title: '수집 및 처리 정보',
    body: [
      'Google 로그인을 사용하는 경우 인증 및 계정 식별을 위해 OAuth 제공자로부터 전달되는 기본 식별정보(예: 이름, 이메일 주소, 프로필 이미지)가 처리될 수 있습니다.',
      '사용자가 입력한 AI API 키는 원문 그대로 장기 보관하지 않고, 암호화된 형태의 키 데이터와 최소한의 관련 메타데이터가 저장될 수 있습니다.',
      '사용자가 등록한 개인 지식 소스(문서/텍스트/링크 등) 및 채팅 메시지/응답은 해당 기능 제공과 사용자 경험 개선을 위해 저장될 수 있습니다.',
      '서비스 안정성 확보를 위해 접속 시점, 오류 정보, 기능 사용 이력 등 운영/보안 목적의 기술 로그가 제한적으로 생성될 수 있습니다.',
      '비로그인 환경에서는 브라우저 로컬 저장소(Local Storage 등)에 설정값, 최근 입력값, 임시 결과가 저장될 수 있습니다.',
      '법령상 요구되거나 분쟁 대응에 필요한 경우, 관련 기록의 일부가 별도로 보관될 수 있으며 보관 사유가 소멸하면 지체 없이 정리합니다.',
    ],
  },
  'purpose-of-use': {
    title: '처리 목적',
    body: [
      '수집된 정보는 로그인/세션 유지, 계정 식별, 권한 검증, 계정 설정 제공 등 기본 인증 기능 제공을 위해 처리됩니다.',
      'API 키 등록/암호화/복호화, 모델 호출 라우팅, 호출 실패 처리 등 AI 기능 제공에 필요한 기술적 처리에 사용됩니다.',
      '사용자가 저장한 지식 소스와 채팅 맥락을 활용하여 응답 품질을 높이고, 요청한 기능을 일관되게 제공하기 위해 사용됩니다.',
      '오류 분석, 성능 최적화, 악성 요청 탐지, 비정상 접근 차단 등 서비스 안정성 및 보안 운영 목적으로 활용됩니다.',
      '관련 법령 준수, 분쟁 처리, 권리 행사 대응(열람/정정/삭제 요청 처리 등)을 위해 필요한 범위에서 처리될 수 있습니다.',
      '사전 고지된 목적과 합리적으로 양립하지 않는 새로운 목적의 처리가 필요한 경우, 법적 근거를 확보하거나 필요한 절차를 거쳐 별도로 안내합니다.',
    ],
  },
  'api-key-encryption': {
    title: 'API 키 처리 및 암호화',
    body: [
      '사용자가 입력한 API 키는 저장 전에 암호화되며, 영구 저장소에는 평문이 아닌 보호된 형태로 저장됩니다.',
      '복호화는 사용자 요청을 처리하는 실행 시점에 한해, 실제 모델 호출에 필요한 최소 범위에서만 수행됩니다.',
      '서비스는 키 접근 권한을 최소화하고, 내부 처리 단계에서 불필요한 노출이 발생하지 않도록 기술적/관리적 통제를 적용합니다.',
      '디버그 로그, 오류 추적, 모니터링 과정에서도 키 원문이 기록되지 않도록 설계하거나 마스킹 정책을 적용합니다.',
      '키 발급, 사용량 관리, 폐기 및 재발급 책임은 기본적으로 사용자에게 있으며, 유출이 의심될 경우 즉시 키를 교체해야 합니다.',
      '외부 모델 제공자 정책 변경이나 사용자의 설정 변경에 따라 키 처리 방식 일부가 조정될 수 있으며, 중요한 변경은 안내합니다.',
    ],
  },
  'ai-chat-and-third-parties': {
    title: 'AI 대화 및 제3자 모델 제공사 전송',
    body: [
      '사용자가 AI 대화를 요청하면, 요청 응답을 생성하기 위해 입력 프롬프트, 구조요약 결과, 사용자 제공 문맥 데이터가 함께 처리될 수 있습니다.',
      '모델 추론은 서비스 내부에서 직접 수행되지 않을 수 있으며, 사용자가 선택한 제3자 모델 제공사(OpenAI, Google, Anthropic 등)로 요청 데이터가 전송될 수 있습니다.',
      '전송되는 정보 범위는 사용자의 입력 내용, 선택한 기능, 대화 맥락 포함 여부 등에 따라 달라질 수 있습니다.',
      '제3자 제공사에서의 처리, 보관, 국외 이전 가능성은 각 제공사의 약관 및 개인정보처리방침에 따르므로 이용 전 확인이 필요합니다.',
      '서비스는 필요한 기능 제공 범위 내에서만 전송을 수행하며, 불필요한 데이터 전송을 줄이기 위한 최소화 원칙을 지향합니다.',
      '민감하거나 공개를 원하지 않는 정보는 사용자 판단 하에 입력을 제한하는 것이 안전하며, 제공사 정책 변경 시 처리 방식이 달라질 수 있습니다.',
    ],
  },
  'retention-and-deletion': {
    title: '보관 기간 및 삭제',
    body: [
      '개인정보 및 관련 데이터는 기능 제공에 필요한 기간 동안만 보관하며, 목적이 달성되면 지체 없이 삭제 또는 비식별화 조치를 검토합니다.',
      '다만 관련 법령에서 일정 기간 보존이 요구되는 정보는 법정 보존기간 동안 별도로 보관되며, 기간 만료 후 안전하게 파기합니다.',
      '분쟁 대응, 권리침해 조사, 보안 사고 분석 등 정당한 사유가 있는 경우 필요한 최소 범위에서 보관 기간이 연장될 수 있습니다.',
      '사용자는 서비스에서 제공하는 삭제 기능 또는 문의 채널을 통해 계정 연동 데이터의 삭제를 요청할 수 있습니다.',
      '삭제 요청이 접수되면 본인 확인 및 처리 가능 범위 확인 후 순차적으로 반영되며, 기술적 백업 사본 정리에는 추가 시간이 소요될 수 있습니다.',
      '브라우저 로컬 저장소 데이터는 사용자 기기에 남아 있을 수 있으므로, 완전한 삭제를 원하면 브라우저 설정에서 직접 삭제해야 합니다.',
    ],
  },
  security: {
    title: '보안 조치',
    body: [
      '무단 접근, 데이터 변조, 유출, 손실 위험을 낮추기 위해 접근통제, 암호화, 권한 최소화, 전송 구간 보호 등 합리적인 보호조치를 적용합니다.',
      '운영 환경에서는 로그 모니터링, 오류 탐지, 이상 징후 점검 등 보안 운영 절차를 통해 위험을 조기에 인지하고 대응합니다.',
      '관리적 측면에서는 권한 관리 기준, 내부 접근 통제, 변경 이력 관리 등 조직적 통제를 유지하도록 노력합니다.',
      '보안 사고 발생 가능성을 완전히 배제할 수는 없으므로, 사고 발생 시 피해 최소화를 위한 조사/차단/복구 절차를 수행합니다.',
      '사용자 또한 계정 비밀번호, OAuth 계정 보안, API 키 비밀 유지, 공용 기기 사용 시 로그아웃 등 기본 보안 수칙을 준수해야 합니다.',
      '인터넷 서비스 특성상 절대적 안전을 보장할 수 없으나, 서비스는 합리적 수준의 보호 역량을 지속적으로 개선합니다.',
    ],
  },
  'user-rights': {
    title: '이용자 권리',
    body: [
      '이용자는 관계 법령이 허용하는 범위에서 개인정보 열람, 정정, 삭제, 처리정지, 반대, 데이터 이동 요청 등 권리를 행사할 수 있습니다.',
      '권리 행사는 서비스 내 기능 또는 공식 문의 채널을 통해 신청할 수 있으며, 대리 신청 시 적법한 위임 증빙이 요구될 수 있습니다.',
      '요청 처리 과정에서 본인 확인이 필요할 수 있고, 제3자 권리 침해 우려 또는 법령상 제한 사유가 있는 경우 일부 요청이 제한될 수 있습니다.',
      '정정/삭제 요청이 처리된 경우 서비스 내부 데이터에는 반영되지만, 백업 시스템 반영에는 기술적 지연이 발생할 수 있습니다.',
      '이용자는 개인정보 처리에 대한 동의를 철회할 수 있으며, 동의 철회 시 일부 기능 이용이 제한될 수 있습니다.',
      '권리 행사 결과에 이의가 있는 경우 관련 법령에 따른 구제 절차 또는 감독기관 민원 절차를 이용할 수 있습니다.',
    ],
  },
  'policy-changes': {
    title: '정책 변경',
    body: [
      '본 개인정보처리방침은 서비스 기능 변경, 관련 법령 개정, 보안 정책 업데이트, 운영 구조 변경 등에 따라 수정될 수 있습니다.',
      '중요한 변경이 있는 경우 시행일 이전에 서비스 공지, 페이지 상단 안내, 변경일자 갱신 등 합리적인 방법으로 고지합니다.',
      '변경 고지에는 주요 변경 항목, 변경 사유, 적용 시점이 포함될 수 있으며, 필요한 경우 구버전 정책을 별도로 열람 가능하게 제공할 수 있습니다.',
      '법령에서 즉시 적용이 요구되는 사항은 예외적으로 사후 공지가 이루어질 수 있으나, 가능한 한 신속하게 이용자에게 안내합니다.',
      '이용자가 변경 후에도 서비스를 계속 이용하는 경우, 변경된 정책이 적용될 수 있습니다.',
      '정책 변경 내용에 동의하지 않는 경우 관련 법령 및 서비스 이용약관에 따라 계정 해지 또는 서비스 이용 중단을 선택할 수 있습니다.',
    ],
  },
  contact: {
    title: '문의처',
    body: [
      '개인정보 처리와 관련된 문의, 열람/정정/삭제 요청, 동의 철회 요청, 보안 사고 신고는 본 서비스의 공식 지원/문의 채널로 접수해 주시기 바랍니다.',
      '문의 시 본인 확인을 위해 계정 식별에 필요한 최소 정보가 요청될 수 있으며, 정확한 처리를 위해 요청 내용과 대상 데이터를 구체적으로 기재해 주십시오.',
      '신고 또는 요청이 접수되면 내부 절차에 따라 사실관계 확인 후 처리 결과 또는 진행 상황을 안내합니다.',
      '긴급한 보안 이슈(키 유출 의심, 계정 탈취 의심 등)는 일반 문의보다 우선 처리될 수 있으며, 필요한 경우 추가 인증을 요청할 수 있습니다.',
      '서비스 운영자는 합리적인 기간 내 회신을 목표로 하며, 법령상 보관/검토 의무가 있는 사안은 처리에 추가 시간이 소요될 수 있습니다.',
    ],
  },
};

const JA: LangDict = {
  'service-mode': {
    title: 'サービス利用形態（ゲスト/ログイン）',
    body: [
      '本サービスは、ゲスト状態でも採点や構造要約計算などの中核機能を利用できるよう設計されています。',
      '一方、APIキー管理、個人ナレッジソース保存、アカウント連携AIチャット履歴など、アカウント単位の永続化が必要な機能はログイン時のみ利用できます。',
      'Googleログインは任意であり、同一アカウントでの継続利用や複数端末間の整合性確保に使用されます。',
      'ゲスト環境で作成された一部データはブラウザ内に限定して保持され、アカウントデータのように同期されない場合があります。',
      'サービスは機能要件に応じてゲスト/ログインの処理範囲を分離して運用します。',
      '機能変更に伴い各モードの範囲が更新される場合があり、重要な変更はポリシーまたはサービス通知で案内します。',
    ],
  },
  'data-collected': {
    title: '収集・処理する情報',
    body: [
      'Googleログインを利用する場合、認証およびアカウント表示のためにOAuth識別情報（例: 氏名、メールアドレス、プロフィール画像）を処理することがあります。',
      'ユーザーがAI APIキーを登録した場合、キー本体ではなく保護された形式のキーデータと最小限の関連メタデータが保存される場合があります。',
      'ユーザーが登録したナレッジソースやチャット内容は、要求機能の提供と利用継続性の確保のため保存されることがあります。',
      '安定運用および不正利用対策のため、アクセス時刻、エラー情報、機能利用履歴などの技術ログが限定的に生成される場合があります。',
      'ゲスト環境では、利便性向上のためにブラウザのローカルストレージへ設定値や一時データを保存する場合があります。',
      '法令対応や紛争処理に必要な場合、関連記録の一部を一定期間保持し、不要となった時点で整理します。',
    ],
  },
  'purpose-of-use': {
    title: '利用目的',
    body: [
      '収集情報は、ログイン/セッション管理、アカウント識別、アクセス制御などの基本認証機能の提供に利用されます。',
      'AI機能提供のため、APIキー登録・保護処理、モデル呼び出しルーティング、失敗時処理などの技術処理に利用されます。',
      '保存されたナレッジソースや会話文脈は、応答品質の向上および機能継続性の確保に利用される場合があります。',
      '障害解析、性能最適化、不正アクセス検知など、サービス安定性とセキュリティ運用にも利用されます。',
      '法令遵守、紛争対応、権利行使対応のため、必要な範囲で情報を処理する場合があります。',
      '利用目的と合理的に両立しない新たな目的で処理する場合は、必要な法的根拠または通知手続きを行います。',
    ],
  },
  'api-key-encryption': {
    title: 'APIキーの取り扱いと暗号化',
    body: [
      'ユーザー入力のAPIキーは保存前に暗号化され、永続ストレージへ平文で意図的に保存しません。',
      '実行時復号はユーザー要求処理に必要な最小範囲でのみ行われます。',
      'キー参照権限は最小権限原則に基づいて管理し、内部での不要な露出を抑制します。',
      'ログ/監視処理でもキー原文の記録を避ける設計またはマスキング方針を適用します。',
      'キーの発行・ローテーション・失効・利用量管理は原則としてユーザー自身の責任となります。',
      '漏えいの疑いがある場合は、速やかに提供元でキーを失効し再発行することを推奨します。',
    ],
  },
  'ai-chat-and-third-parties': {
    title: 'AIチャットと第三者モデル提供者への送信',
    body: [
      'AIチャットを要求した場合、応答生成のために入力プロンプト、構造要約結果、ユーザー提供文脈が併せて処理される場合があります。',
      'モデル推論はサービス内で直接実行されない場合があり、ユーザーが選択した第三者モデル提供者（OpenAI、Google、Anthropic等）へデータが送信されることがあります。',
      '送信範囲は入力内容、利用機能、文脈連携の有無などに応じて変動します。',
      '第三者提供者側での処理・保存・越境移転の取り扱いは、各提供者の規約およびプライバシーポリシーに従います。',
      'サービスは必要機能の範囲でデータを送信し、不要な転送を抑える最小化方針を志向します。',
      '外部提供者に共有したくない機微情報は、ユーザー判断で入力を控えることを推奨します。',
    ],
  },
  'retention-and-deletion': {
    title: '保存期間と削除',
    body: [
      '個人情報および関連データは、機能提供に必要な期間に限って保存します。',
      '法令で保存義務がある情報は、法定保存期間に従って別途保管し、期間満了後に安全に廃棄します。',
      '紛争対応や不正調査、インシデント対応に必要な場合、合理的範囲で一時的に保存期間を延長することがあります。',
      'ユーザーはサービス上の機能または公式窓口を通じて、アカウント連携データの削除を申請できます。',
      '削除処理は本人確認後に実施され、バックアップ反映には技術的遅延が生じる場合があります。',
      'ローカルストレージデータは端末側に残るため、完全削除にはブラウザ設定での削除操作が必要です。',
    ],
  },
  security: {
    title: 'セキュリティ対策',
    body: [
      '不正アクセス、改ざん、漏えい、紛失リスクを低減するため、管理的・技術的・組織的な合理的保護措置を適用します。',
      '対策にはアクセス制御、機微情報の保護処理、安全な通信経路、運用環境の強化などが含まれる場合があります。',
      '運用面では監視、異常検知、インシデント対応手順を通じて早期検知と被害抑制を図ります。',
      '内部アクセスは最小権限で管理し、変更管理や権限監査などの統制維持に努めます。',
      'ただしインターネットサービスで絶対安全を保証することはできず、ユーザー側の資格情報管理も重要です。',
      'サービスはリスク評価や運用実績に基づき、保護措置を継続的に改善します。',
    ],
  },
  'user-rights': {
    title: 'ユーザーの権利',
    body: [
      '適用法令に基づき、ユーザーは個人情報へのアクセス、訂正、削除、処理制限、異議申立て、データポータビリティ等を請求できる場合があります。',
      '請求はサービス内機能または公式問い合わせ窓口から提出できます。',
      '不正請求を防止するため、請求処理時に本人確認または追加情報提出を求める場合があります。',
      '法令上の義務、第三者の権利保護、技術的制約がある場合、一部請求に応じられないことがあります。',
      'ユーザーは同意に基づく処理について同意撤回を行えますが、その結果として一部機能が利用できなくなる場合があります。',
      '処理結果に異議がある場合、適用法令に基づく救済手段や監督機関への申立てを利用できます。',
    ],
  },
  'policy-changes': {
    title: 'ポリシー変更',
    body: [
      '本プライバシーポリシーは、機能変更、法令改正、セキュリティ方針更新、運用体制変更等に応じて改定される場合があります。',
      '重要な変更がある場合、施行前または施行時点で合理的な方法により通知します。',
      '通知方法にはサービス内告知、適用日更新、改定履歴表示などを含む場合があります。',
      '必要に応じて主な変更点や変更理由を要約して提示する場合があります。',
      '法令対応や緊急セキュリティ対応が必要な場合、例外的に事後通知となることがあります。',
      '法令上許容される範囲で、改定後の継続利用は改定内容への同意として扱われる場合があります。',
    ],
  },
  contact: {
    title: 'お問い合わせ先',
    body: [
      'プライバシーに関する問い合わせ、権利行使請求、同意撤回申請、インシデント報告は、公式サポート/問い合わせ窓口までご連絡ください。',
      '正確な対応のため、本人確認に必要な最小情報と、対象データ・希望対応内容をできるだけ具体的に記載してください。',
      '受領した問い合わせや申請は内部手順に基づき確認し、進捗または結果を案内します。',
      'キー漏えい疑い・アカウント乗っ取り疑いなど緊急度の高い事案は優先対応される場合があります。',
      '回答までの所要時間は、申請内容の複雑性、法的確認の必要性、本人確認状況によって変動します。',
      '法令遵守のため、請求処理記録を一定期間保持する場合があります。',
    ],
  },
};

const ES: LangDict = {
  'service-mode': {
    title: 'Modalidad de uso (invitado / con inicio de sesión)',
    body: [
      'Este servicio está diseñado para permitir el uso de funciones principales, como puntuación y cálculo del resumen estructural, incluso en modo invitado sin cuenta.',
      'Las funciones que requieren persistencia y sincronización por cuenta, como gestión de claves API, fuentes personales de conocimiento e historial de chat vinculado, están disponibles solo con sesión iniciada.',
      'El inicio de sesión con Google es opcional y se utiliza para identificar al titular de la cuenta y mantener continuidad entre sesiones y dispositivos.',
      'Parte de los datos generados en modo invitado puede permanecer solo en el navegador local y no sincronizarse como los datos de cuenta.',
      'El servicio separa el manejo de datos entre modo invitado y modo con sesión según el alcance funcional.',
      'Si cambian las funcionalidades del producto, el alcance de cada modo puede ajustarse y los cambios relevantes se comunicarán por aviso o actualización de política.',
    ],
  },
  'data-collected': {
    title: 'Datos recopilados y tratados',
    body: [
      'Si se usa inicio de sesión con Google, pueden tratarse identificadores OAuth (por ejemplo, nombre, correo electrónico e imagen de perfil) para autenticación y visualización de cuenta.',
      'Si el usuario registra claves API de IA, pueden almacenarse datos de clave protegidos junto con metadatos mínimos necesarios para la función.',
      'Si el usuario agrega fuentes de conocimiento o mensajes de chat, esos contenidos pueden almacenarse para prestar la funcionalidad solicitada y mantener continuidad.',
      'Para estabilidad y seguridad, pueden generarse registros técnicos limitados (por ejemplo, hora de acceso, errores y eventos de uso).',
      'En modo invitado, el almacenamiento local del navegador puede guardar configuración, entradas recientes y resultados temporales.',
      'Cuando la ley o la gestión de disputas lo exijan, ciertos registros podrán conservarse durante el periodo requerido y eliminarse después.',
    ],
  },
  'purpose-of-use': {
    title: 'Finalidad del tratamiento',
    body: [
      'Los datos se tratan para operaciones básicas de autenticación, incluyendo login/sesión, identificación de cuenta y control de acceso.',
      'También se utilizan para el registro y manejo protegido de claves API, enrutamiento de llamadas de modelo y prestación de funciones de IA.',
      'El contexto guardado por el usuario (por ejemplo, fuentes de conocimiento e historial conversacional) puede utilizarse para mejorar calidad y continuidad de respuesta.',
      'El tratamiento técnico incluye diagnóstico de errores, prevención de abuso, monitoreo operativo y gestión de estabilidad/seguridad.',
      'Los datos pueden tratarse además para cumplimiento normativo, gestión de disputas y atención de solicitudes de derechos del usuario.',
      'No se realizará tratamiento para finalidades nuevas incompatibles sin base legal adecuada y aviso cuando corresponda.',
    ],
  },
  'api-key-encryption': {
    title: 'Manejo y cifrado de claves API',
    body: [
      'Las claves API proporcionadas por el usuario se cifran antes del almacenamiento y no se conservan intencionalmente en texto plano en almacenamiento persistente.',
      'El descifrado en ejecución ocurre solo cuando es necesario para atender una llamada de modelo solicitada por el usuario y en el alcance mínimo requerido.',
      'El acceso interno al material de clave se restringe con criterios de mínimo privilegio para reducir exposición innecesaria.',
      'Los flujos de registro y monitoreo se diseñan para evitar guardar valores completos de clave y pueden aplicar enmascaramiento.',
      'La emisión, rotación, revocación y control de uso/costos de las claves corresponde al propio usuario frente al proveedor de modelos.',
      'Si existe sospecha de compromiso, se recomienda revocar y regenerar inmediatamente las claves afectadas.',
    ],
  },
  'ai-chat-and-third-parties': {
    title: 'Chat de IA y envío a proveedores de modelos de terceros',
    body: [
      'Cuando el usuario solicita chat de IA, la carga de prompt puede incluir resultados de resumen estructural y contexto proporcionado por el usuario para mejorar la calidad de respuesta.',
      'La inferencia puede ejecutarse en un proveedor externo elegido por el usuario (por ejemplo, OpenAI, Google o Anthropic), por lo que ciertos datos de solicitud pueden enviarse a dicho proveedor.',
      'El alcance de datos enviados depende del contenido introducido, de la función utilizada y de si el contexto ampliado está habilitado.',
      'El tratamiento por terceros, incluida conservación y posibles transferencias internacionales, se rige por las políticas y términos del proveedor correspondiente.',
      'El servicio procura transmitir solo los datos necesarios para la función solicitada, aplicando principios de minimización cuando sea posible.',
      'Se recomienda no introducir información sensible que el usuario no desee compartir con proveedores externos de modelos.',
    ],
  },
  'retention-and-deletion': {
    title: 'Conservación y eliminación',
    body: [
      'Los datos personales y relacionados con el servicio se conservan solo durante el periodo necesario para prestar funciones solicitadas y operar el servicio.',
      'Cuando la normativa aplicable exige conservación, los registros se mantienen por el plazo legal y luego se eliminan de forma segura.',
      'El periodo puede extenderse temporalmente cuando sea razonablemente necesario para disputas, investigaciones de abuso o respuesta a incidentes de seguridad.',
      'El usuario puede solicitar eliminación de datos vinculados a su cuenta mediante controles del producto o canales oficiales de soporte.',
      'Las solicitudes de eliminación se procesan tras verificación de identidad y pueden requerir tiempo adicional para reflejarse en copias de respaldo.',
      'Los datos guardados en almacenamiento local del navegador permanecen en el dispositivo hasta su eliminación manual por el usuario o por configuración del navegador.',
    ],
  },
  security: {
    title: 'Medidas de seguridad',
    body: [
      'Se aplican medidas administrativas, técnicas y organizativas razonables para reducir riesgos de acceso no autorizado, alteración, divulgación y pérdida.',
      'Las medidas pueden incluir control de acceso, protección de campos sensibles, prácticas de transporte seguro y endurecimiento del entorno operativo.',
      'La operación de seguridad puede apoyarse en monitoreo, detección de anomalías y procedimientos de respuesta ante actividad sospechosa.',
      'El acceso interno se gestiona bajo principio de mínimo privilegio y controles de cambio donde sea aplicable.',
      'Ningún servicio en internet puede garantizar seguridad absoluta; por ello, también es esencial la protección de credenciales y claves por parte del usuario.',
      'Las medidas de seguridad se revisan y mejoran de forma continua según riesgo, incidentes y necesidades operativas.',
    ],
  },
  'user-rights': {
    title: 'Derechos del usuario',
    body: [
      'Según la ley aplicable, el usuario puede solicitar acceso, rectificación, eliminación, limitación, oposición o portabilidad de sus datos personales.',
      'Las solicitudes pueden presentarse mediante funciones disponibles dentro del servicio o por canales oficiales de contacto.',
      'Para proteger la cuenta y los datos, puede requerirse verificación de identidad antes de ejecutar la solicitud.',
      'Algunas solicitudes pueden estar limitadas por obligaciones legales, derechos de terceros o restricciones técnicas justificadas.',
      'El usuario puede retirar su consentimiento para ciertos tratamientos, aunque esto puede limitar el uso de algunas funciones.',
      'Si existe desacuerdo con la respuesta, el usuario puede recurrir a mecanismos de reclamación legales o ante autoridad competente.',
    ],
  },
  'policy-changes': {
    title: 'Cambios de política',
    body: [
      'Esta política de privacidad puede actualizarse por cambios de producto, modificaciones normativas, ajustes de seguridad o cambios operativos.',
      'Cuando haya cambios materiales, el servicio proporcionará aviso razonable antes o en el momento de entrada en vigor.',
      'Los avisos pueden realizarse mediante anuncios en el servicio, actualización de fecha de vigencia o indicadores de revisión en la página de política.',
      'Cuando resulte útil, pueden mostrarse resúmenes de cambios principales y su motivo para facilitar la comprensión.',
      'Si la ley o una necesidad urgente de seguridad exige aplicación inmediata, la comunicación podrá realizarse tan pronto como sea razonablemente posible.',
      'El uso continuado del servicio tras la vigencia de cambios puede considerarse aceptación, en la medida permitida por la ley aplicable.',
    ],
  },
  contact: {
    title: 'Contacto',
    body: [
      'Para consultas de privacidad, solicitudes de derechos, retiro de consentimiento o reportes de incidentes, contacte al operador mediante el canal oficial de soporte.',
      'Para una gestión precisa, puede solicitarse información mínima de identificación y una descripción clara del alcance de la solicitud.',
      'Las solicitudes y reportes recibidos se revisan conforme a procedimientos internos, y se informa el estado o resultado cuando corresponda.',
      'Los casos de seguridad urgentes (por ejemplo, sospecha de exposición de clave o toma de cuenta) pueden recibir priorización.',
      'Los tiempos de respuesta pueden variar según complejidad, verificación requerida y revisión legal aplicable.',
      'Cuando la ley lo exija, podrá conservarse un registro de tramitación de solicitudes con fines de cumplimiento y auditoría.',
    ],
  },
};

const PT: LangDict = {
  'service-mode': {
    title: 'Modo de uso (convidado / com login)',
    body: [
      'Este serviço foi projetado para permitir o uso das funções principais, como pontuação e cálculo do resumo estrutural, mesmo no modo convidado sem conta.',
      'Recursos que exigem persistência e sincronização por conta, como gestão de chave API, fontes pessoais de conhecimento e histórico de chat vinculado, ficam disponíveis somente com login.',
      'O login Google é opcional e serve para identificar o titular da conta e manter continuidade entre sessões e dispositivos.',
      'Parte dos dados gerados em modo convidado pode permanecer apenas no navegador local e não sincronizar como dados vinculados à conta.',
      'O serviço separa o tratamento entre modo convidado e modo autenticado conforme o escopo funcional de cada recurso.',
      'Se houver mudança de funcionalidades, o escopo de cada modo pode ser ajustado e alterações relevantes serão comunicadas por aviso ou atualização de política.',
    ],
  },
  'data-collected': {
    title: 'Dados coletados e tratados',
    body: [
      'Se o login Google for utilizado, identificadores OAuth (por exemplo, nome, e-mail e imagem de perfil) podem ser tratados para autenticação e exibição da conta.',
      'Se o usuário registrar chaves API de IA, dados de chave protegidos e metadados mínimos relacionados podem ser armazenados para viabilizar a funcionalidade.',
      'Se o usuário adicionar fontes de conhecimento ou mensagens de chat, esses conteúdos podem ser armazenados para fornecer a função solicitada e manter continuidade de uso.',
      'Para estabilidade e segurança, registros técnicos limitados (como horário de acesso, erros e eventos de uso) podem ser gerados.',
      'No modo convidado, armazenamento local do navegador pode guardar configurações, entradas recentes e resultados temporários.',
      'Quando houver exigência legal ou necessidade de tratamento de disputas, certos registros podem ser mantidos pelo período aplicável e removidos depois.',
    ],
  },
  'purpose-of-use': {
    title: 'Finalidade do tratamento',
    body: [
      'Os dados são tratados para operações básicas de autenticação, incluindo login/sessão, identificação de conta e controle de acesso.',
      'Também são utilizados para registro e tratamento protegido de chave API, roteamento de chamadas de modelo e oferta de recursos de IA.',
      'Contexto salvo pelo usuário, como fontes de conhecimento e histórico conversacional, pode ser usado para melhorar qualidade e continuidade das respostas.',
      'O tratamento técnico inclui diagnóstico de falhas, prevenção de abuso, monitoramento operacional e gestão de estabilidade/segurança.',
      'Os dados podem ainda ser tratados para cumprimento legal, tratamento de disputas e atendimento de solicitações de direitos do usuário.',
      'Não haverá tratamento para finalidades novas incompatíveis sem base legal adequada e aviso quando exigido.',
    ],
  },
  'api-key-encryption': {
    title: 'Tratamento e criptografia de chave API',
    body: [
      'As chaves API fornecidas pelo usuário são criptografadas antes do armazenamento e não são intencionalmente mantidas em texto puro em armazenamento persistente.',
      'A descriptografia em execução ocorre somente quando necessária para atender uma chamada de modelo solicitada pelo usuário e no escopo mínimo exigido.',
      'O acesso interno ao material de chave é restrito com princípio de menor privilégio para reduzir exposição desnecessária.',
      'Fluxos de log e monitoramento são projetados para evitar registro do valor completo da chave, com mascaramento quando aplicável.',
      'A emissão, rotação, revogação e gestão de uso/custos das chaves permanece sob responsabilidade do próprio usuário no provedor escolhido.',
      'Em caso de suspeita de comprometimento, recomenda-se revogar e gerar imediatamente novas chaves.',
    ],
  },
  'ai-chat-and-third-parties': {
    title: 'Chat de IA e envio para provedores terceiros',
    body: [
      'Quando o usuário solicita chat de IA, a carga de prompt pode incluir resultados do resumo estrutural e contexto fornecido pelo usuário para melhorar a qualidade da resposta.',
      'A inferência pode ocorrer em provedor externo escolhido pelo usuário (por exemplo, OpenAI, Google ou Anthropic), e dados relevantes da solicitação podem ser enviados a esse provedor.',
      'O escopo de dados transmitidos varia conforme conteúdo inserido, recurso utilizado e uso de contexto ampliado.',
      'O tratamento pelo terceiro, incluindo retenção e possíveis transferências internacionais, segue as políticas e termos do respectivo provedor.',
      'O serviço busca transmitir apenas o necessário para cumprir a função solicitada, seguindo princípio de minimização de dados quando viável.',
      'Recomenda-se que o usuário evite inserir informações sensíveis que não deseje compartilhar com provedores externos.',
    ],
  },
  'retention-and-deletion': {
    title: 'Retenção e exclusão',
    body: [
      'Dados pessoais e dados relacionados ao serviço são mantidos apenas pelo período necessário para fornecer funcionalidades solicitadas e operar o serviço.',
      'Quando houver obrigação legal de guarda, os registros são mantidos pelo prazo normativo aplicável e depois eliminados com segurança.',
      'A retenção pode ser estendida temporariamente quando necessário para disputas, investigação de abuso ou resposta a incidentes de segurança.',
      'O usuário pode solicitar exclusão de dados vinculados à conta por controles do produto ou canais oficiais de suporte.',
      'Solicitações de exclusão são processadas após verificação de identidade e podem demandar tempo adicional para refletir em cópias de backup.',
      'Dados em armazenamento local do navegador permanecem no dispositivo até remoção manual pelo usuário ou pelas configurações do navegador.',
    ],
  },
  security: {
    title: 'Medidas de segurança',
    body: [
      'São aplicadas medidas administrativas, técnicas e organizacionais razoáveis para reduzir riscos de acesso não autorizado, alteração, divulgação e perda.',
      'As medidas podem incluir controle de acesso, proteção de campos sensíveis, práticas de transporte seguro e fortalecimento do ambiente operacional.',
      'A operação de segurança pode envolver monitoramento, detecção de anomalias e procedimentos de resposta para atividades suspeitas.',
      'O acesso interno é gerido com menor privilégio e controles de mudança sempre que aplicável.',
      'Nenhum serviço de internet pode garantir segurança absoluta; por isso, a proteção de credenciais e chaves pelo usuário também é essencial.',
      'As medidas de segurança são revisadas e aprimoradas continuamente com base em risco, incidentes e necessidades operacionais.',
    ],
  },
  'user-rights': {
    title: 'Direitos do usuário',
    body: [
      'Conforme a legislação aplicável, o usuário pode solicitar acesso, correção, exclusão, restrição, oposição ou portabilidade de seus dados pessoais.',
      'As solicitações podem ser enviadas por funcionalidades do serviço ou por canais oficiais de contato/suporte.',
      'Para proteção da conta e dos dados, pode ser exigida verificação de identidade antes da execução da solicitação.',
      'Algumas solicitações podem ser limitadas por obrigação legal, direitos de terceiros ou restrição técnica justificável.',
      'O usuário pode retirar consentimento para certos tratamentos, ciente de que isso pode limitar funcionalidades dependentes.',
      'Em caso de discordância sobre a resposta, o usuário pode recorrer aos meios legais e regulatórios cabíveis.',
    ],
  },
  'policy-changes': {
    title: 'Alterações da política',
    body: [
      'Esta política de privacidade pode ser atualizada por mudanças de produto, alterações legais, ajustes de segurança ou mudanças operacionais.',
      'Quando houver alterações relevantes, o serviço fornecerá aviso razoável antes ou no momento da entrada em vigor.',
      'Os avisos podem ocorrer por comunicados no serviço, atualização de data de vigência ou indicação de revisão na página da política.',
      'Quando útil, podem ser apresentados resumos das principais mudanças e respectivas justificativas.',
      'Se a lei ou uma necessidade urgente de segurança exigir aplicação imediata, a comunicação poderá ocorrer assim que razoavelmente possível.',
      'O uso continuado do serviço após a vigência das mudanças pode ser considerado aceitação, na medida permitida pela legislação aplicável.',
    ],
  },
  contact: {
    title: 'Contato',
    body: [
      'Para dúvidas de privacidade, solicitações de direitos, retirada de consentimento ou relato de incidentes, contate o operador pelo canal oficial de suporte.',
      'Para tratamento adequado, podem ser solicitadas informações mínimas de identificação e uma descrição clara do escopo do pedido.',
      'Solicitações e relatos recebidos são analisados conforme procedimentos internos, com retorno de status ou resultado quando aplicável.',
      'Casos de segurança urgentes (por exemplo, suspeita de exposição de chave ou tomada de conta) podem receber priorização.',
      'O prazo de resposta pode variar conforme complexidade, necessidade de validação e análise legal.',
      'Quando exigido por lei, registros de tratamento de solicitações podem ser mantidos para fins de conformidade e auditoria.',
    ],
  },
};

const PRIVACY_BY_LANG: Record<Language, LangDict> = {
  en: EN,
  ko: KO,
  ja: JA,
  es: ES,
  pt: PT,
};

export function getPrivacySections(lang: Language): PrivacySection[] {
  const dict = PRIVACY_BY_LANG[lang] ?? PRIVACY_BY_LANG.en;
  return BASE_SECTIONS.map(({ slug }) => {
    const localized = dict[slug] ?? PRIVACY_BY_LANG.en[slug];
    return {
      slug,
      title: localized.title,
      body: localized.body,
    };
  });
}

export function getPrivacySection(slug: string, lang: Language): PrivacySection | undefined {
  return getPrivacySections(lang).find((section) => section.slug === slug);
}

export const PRIVACY_SECTIONS: PrivacySection[] = getPrivacySections('en');
