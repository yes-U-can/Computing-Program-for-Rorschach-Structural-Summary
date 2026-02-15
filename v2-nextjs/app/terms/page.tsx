import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type TermsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of service for using this website.',
  alternates: {
    canonical: '/terms',
    languages: buildLanguageAlternates('/terms'),
  },
};

type TermsSection = {
  heading: string;
  items: string[];
};

type TermsContent = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: TermsSection[];
};

const CONTENT: Record<Language, TermsContent> = {
  ko: {
    title: '이용약관',
    effectiveDate: '시행일: 2026년 2월 15일',
    intro: '본 이용약관은 서울임상심리연구소(이하 "운영자")가 제공하는 로샤 구조요약 계산기 웹 서비스(이하 "서비스")의 이용에 관한 사항을 규정합니다. 서비스를 이용함으로써 본 약관에 동의하는 것으로 간주합니다.',
    sections: [
      {
        heading: '제1조 (서비스의 목적 및 성격)',
        items: [
          '본 서비스는 로샤(Rorschach) 심리검사 Exner 종합체계(CS)의 구조요약(Structural Summary) 계산을 보조하는 온라인 도구입니다.',
          '본 서비스의 모든 계산 결과 및 AI 응답은 참고 자료로서 제공되며, 독립적인 임상 판단이나 공식 심리평가 보고서를 대체하지 않습니다.',
          '본 서비스는 의료 행위, 심리 진단, 법적 자문을 구성하지 않습니다.',
        ],
      },
      {
        heading: '제2조 (이용자 자격)',
        items: [
          '본 서비스는 임상심리전문가, 상담심리사, 심리학 수련생 등 로샤 검사에 대한 전문적 훈련을 받았거나 받고 있는 자를 주 대상으로 합니다.',
          '비전문가의 이용을 제한하지는 않으나, 결과 해석은 반드시 자격을 갖춘 전문가의 감독 하에 이루어져야 합니다.',
        ],
      },
      {
        heading: '제3조 (피검자 정보 보호 및 윤리적 사용)',
        items: [
          '이용자는 본 서비스에 피검자(내담자)의 실명, 주민등록번호, 연락처 등 개인을 특정할 수 있는 정보를 입력하지 않아야 합니다.',
          'CSV 파일 저장 시, 피검자의 신원이 특정될 수 있는 파일명(예: 실명, 사번 등)을 사용하지 않아야 합니다. 코드명 또는 익명화된 식별자를 사용하시기 바랍니다.',
          'AI 채팅 기능 사용 시, 피검자의 신원을 특정할 수 있는 정보(이름, 나이, 소속, 상담 경위 등)를 마스킹하거나 제거한 후 전송해야 합니다.',
          'AI 채팅에 입력된 내용은 사용자가 직접 선택한 외부 LLM 제공사(OpenAI, Google, Anthropic)의 API를 통해 처리됩니다. 운영자는 해당 제공사의 데이터 처리 방식에 대해 책임을 지지 않으므로, 민감한 임상 정보의 전송에 각별히 주의하시기 바랍니다.',
          '이용자는 관련 법령(개인정보보호법, 정보통신망법 등) 및 소속 기관의 윤리 규정을 준수할 책임이 있습니다.',
        ],
      },
      {
        heading: '제4조 (계정 및 API 키)',
        items: [
          'AI 채팅 기능을 이용하려면 Google 계정으로 로그인한 후, 사용자 본인의 LLM API 키를 등록해야 합니다.',
          '등록된 API 키는 AES-256-CBC 방식으로 암호화하여 서버에 저장되며, AI 채팅 요청 시에만 복호화되어 사용됩니다.',
          'API 키 사용에 따른 비용은 전적으로 이용자 본인에게 귀속됩니다. 운영자는 API 사용량이나 관련 요금에 대해 책임을 지지 않습니다.',
          '이용자는 자신의 계정과 API 키를 안전하게 관리할 책임이 있습니다.',
        ],
      },
      {
        heading: '제5조 (지적 재산권)',
        items: [
          '본 서비스의 소프트웨어, 디자인, 콘텐츠에 대한 지적 재산권은 운영자에게 귀속됩니다.',
          '채점 계산 로직은 공개된 학술 자료(Exner 종합체계)에 기반하여 독자적으로 구현한 것이며, MIT 라이선스로 소스 코드를 공개하고 있습니다.',
          '이용자가 본 서비스를 통해 생성한 계산 결과 및 CSV 데이터에 대한 권리는 이용자 본인에게 귀속됩니다.',
        ],
      },
      {
        heading: '제6조 (면책 사항)',
        items: [
          '운영자는 본 서비스의 계산 결과 또는 AI 응답의 정확성, 완전성, 적시성을 보증하지 않습니다.',
          '본 서비스의 이용으로 인해 발생하는 직접적, 간접적 손해에 대해 운영자는 법률이 허용하는 범위 내에서 책임을 지지 않습니다.',
          'AI 채팅 응답은 LLM의 특성상 부정확하거나 부적절한 내용을 포함할 수 있으며, 이를 임상 판단의 근거로 단독 사용해서는 안 됩니다.',
        ],
      },
      {
        heading: '제7조 (서비스 변경 및 중단)',
        items: [
          '운영자는 서비스의 전부 또는 일부를 사전 고지 없이 변경, 중단, 종료할 수 있습니다.',
          '유료 기능(크레딧 시스템, 스킬북 스토어 등)이 도입될 경우, 해당 기능에 대한 별도의 이용약관이 적용될 수 있습니다.',
        ],
      },
      {
        heading: '제8조 (광고)',
        items: [
          '비로그인 이용자에게는 Google AdSense를 통한 광고가 표시될 수 있습니다.',
          '로그인한 이용자에게는 광고가 표시되지 않습니다.',
        ],
      },
      {
        heading: '제9조 (약관의 변경)',
        items: [
          '운영자는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 효력이 발생합니다.',
          '변경 후 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.',
        ],
      },
      {
        heading: '제10조 (준거법 및 관할)',
        items: [
          '본 약관은 대한민국 법률에 따라 해석되며, 서비스 관련 분쟁의 관할 법원은 서울중앙지방법원으로 합니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    effectiveDate: 'Effective Date: February 15, 2026',
    intro: 'These Terms of Service govern your use of the Rorschach Structural Summary Calculator web service (the "Service") operated by the Seoul Institute of Clinical Psychology (the "Operator"). By using the Service, you agree to be bound by these terms.',
    sections: [
      {
        heading: '1. Purpose and Nature of the Service',
        items: [
          'The Service is an online tool that assists in computing the Structural Summary of the Rorschach Inkblot Test based on the Exner Comprehensive System (CS).',
          'All calculation results and AI responses are provided for reference only and do not replace independent clinical judgment or formal psychological assessment reports.',
          'The Service does not constitute medical practice, psychological diagnosis, or legal advice.',
        ],
      },
      {
        heading: '2. User Eligibility',
        items: [
          'The Service is primarily intended for clinical psychologists, counseling psychologists, and psychology trainees with professional training in the Rorschach test.',
          'While use by non-professionals is not restricted, interpretation of results must be conducted under the supervision of a qualified professional.',
        ],
      },
      {
        heading: '3. Examinee Data Protection and Ethical Use',
        items: [
          'You must not enter personally identifiable information of examinees (clients) — such as real names, national ID numbers, or contact details — into the Service.',
          'When saving CSV files, do not use file names that could identify the examinee (e.g., real names, employee IDs). Use code names or anonymized identifiers instead.',
          'When using the AI chat feature, you must mask or remove any information that could identify the examinee (name, age, affiliation, referral context, etc.) before submitting.',
          'Content entered into AI chat is processed through external LLM providers (OpenAI, Google, Anthropic) via API keys you provide. The Operator is not responsible for how these providers handle your data. Exercise particular caution when transmitting sensitive clinical information.',
          'You are responsible for complying with applicable laws and the ethical guidelines of your professional organization.',
        ],
      },
      {
        heading: '4. Accounts and API Keys',
        items: [
          'To use the AI chat feature, you must sign in with a Google account and register your own LLM API key.',
          'Registered API keys are encrypted using AES-256-CBC and stored on the server. They are decrypted only when processing AI chat requests.',
          'All costs associated with API key usage are solely your responsibility. The Operator is not liable for API usage charges.',
          'You are responsible for keeping your account and API keys secure.',
        ],
      },
      {
        heading: '5. Intellectual Property',
        items: [
          'Intellectual property rights for the Service\'s software, design, and content belong to the Operator.',
          'The scoring calculation logic was independently implemented based on published academic materials (Exner CS) and is released under the MIT License.',
          'Rights to calculation results and CSV data generated through the Service belong to you.',
        ],
      },
      {
        heading: '6. Disclaimer',
        items: [
          'The Operator does not warrant the accuracy, completeness, or timeliness of calculation results or AI responses.',
          'To the extent permitted by law, the Operator shall not be liable for any direct or indirect damages arising from the use of the Service.',
          'AI chat responses may contain inaccurate or inappropriate content due to the nature of LLMs and must not be used as the sole basis for clinical decisions.',
        ],
      },
      {
        heading: '7. Service Modifications and Termination',
        items: [
          'The Operator may modify, suspend, or terminate all or part of the Service without prior notice.',
          'If paid features (credit system, Skill Book Store, etc.) are introduced, separate terms may apply to those features.',
        ],
      },
      {
        heading: '8. Advertising',
        items: [
          'Non-logged-in users may be shown advertisements through Google AdSense.',
          'Logged-in users are not shown advertisements.',
        ],
      },
      {
        heading: '9. Changes to Terms',
        items: [
          'The Operator may revise these terms as necessary. Revised terms take effect upon being posted within the Service.',
          'Continued use of the Service after changes constitutes acceptance of the revised terms.',
        ],
      },
      {
        heading: '10. Governing Law and Jurisdiction',
        items: [
          'These terms shall be governed by and construed in accordance with the laws of the Republic of Korea. Any disputes relating to the Service shall be subject to the jurisdiction of the Seoul Central District Court.',
        ],
      },
    ],
  },
  ja: {
    title: '利用規約',
    effectiveDate: '施行日: 2026年2月15日',
    intro: '本利用規約は、ソウル臨床心理研究所(以下「運営者」)が提供するロールシャッハ構造要約計算機ウェブサービス(以下「本サービス」)の利用に関する事項を定めます。本サービスを利用することにより、本規約に同意したものとみなされます。',
    sections: [
      {
        heading: '第1条（サービスの目的と性質）',
        items: [
          '本サービスは、ロールシャッハ・インクブロットテストのExner包括システム(CS)に基づく構造要約の計算を支援するオンラインツールです。',
          'すべての計算結果およびAI応答は参考情報として提供されるものであり、独立した臨床判断や公式な心理評価報告書に代わるものではありません。',
          '本サービスは医療行為、心理診断、法的助言を構成するものではありません。',
        ],
      },
      {
        heading: '第2条（利用者資格）',
        items: [
          '本サービスは、臨床心理士、カウンセラー、心理学研修生など、ロールシャッハテストの専門的訓練を受けた、または受けている方を主な対象としています。',
          '非専門家の利用を制限するものではありませんが、結果の解釈は必ず資格を持つ専門家の監督のもとで行ってください。',
        ],
      },
      {
        heading: '第3条（被検者情報の保護と倫理的利用）',
        items: [
          '被検者（クライエント）の実名、個人番号、連絡先など、個人を特定できる情報を本サービスに入力しないでください。',
          'CSVファイル保存時、被検者を特定できるファイル名を使用しないでください。コードネームまたは匿名化された識別子を使用してください。',
          'AIチャット機能使用時、被検者を特定できる情報をマスキングまたは削除してから送信してください。',
          'AIチャットに入力された内容は、利用者が提供する外部LLMプロバイダー（OpenAI、Google、Anthropic）のAPIを通じて処理されます。これらのプロバイダーのデータ処理方法について運営者は責任を負いません。',
          '利用者は、関連法令および所属機関の倫理規定を遵守する責任があります。',
        ],
      },
      {
        heading: '第4条（アカウントとAPIキー）',
        items: [
          'AIチャット機能を利用するには、Googleアカウントでログインし、ご自身のLLM APIキーを登録する必要があります。',
          '登録されたAPIキーはAES-256-CBC方式で暗号化してサーバーに保存され、AIチャットリクエスト処理時のみ復号化されます。',
          'APIキー使用に伴うすべての費用は利用者の負担となります。',
          '利用者は自身のアカウントとAPIキーを安全に管理する責任があります。',
        ],
      },
      {
        heading: '第5条（知的財産権）',
        items: [
          '本サービスのソフトウェア、デザイン、コンテンツの知的財産権は運営者に帰属します。',
          '採点計算ロジックは公開された学術資料に基づき独自に実装したものであり、MITライセンスでソースコードを公開しています。',
          '本サービスを通じて生成された計算結果およびCSVデータの権利は利用者に帰属します。',
        ],
      },
      {
        heading: '第6条（免責事項）',
        items: [
          '運営者は計算結果またはAI応答の正確性、完全性、適時性を保証しません。',
          '法律が許容する範囲内で、本サービスの利用により生じた直接的・間接的損害について運営者は責任を負いません。',
          'AIチャット応答はLLMの特性上、不正確または不適切な内容を含む可能性があり、臨床判断の唯一の根拠として使用してはなりません。',
        ],
      },
      {
        heading: '第7条（サービスの変更と中断）',
        items: [
          '運営者はサービスの全部または一部を事前通知なく変更、中断、終了できます。',
          '有料機能が導入される場合、別途の利用規約が適用される場合があります。',
        ],
      },
      {
        heading: '第8条（広告）',
        items: [
          '非ログインユーザーにはGoogle AdSenseによる広告が表示される場合があります。',
          'ログインユーザーには広告は表示されません。',
        ],
      },
      {
        heading: '第9条（規約の変更）',
        items: [
          '運営者は必要に応じて本規約を変更できます。変更された規約はサービス内の告知により効力を生じます。',
          '変更後もサービスを継続利用する場合、変更された規約に同意したものとみなされます。',
        ],
      },
      {
        heading: '第10条（準拠法と管轄）',
        items: [
          '本規約は大韓民国の法律に準拠して解釈されます。',
        ],
      },
    ],
  },
  es: {
    title: 'Terminos de Servicio',
    effectiveDate: 'Fecha de vigencia: 15 de febrero de 2026',
    intro: 'Estos Terminos de Servicio rigen el uso del servicio web de la Calculadora de Sumario Estructural de Rorschach (el "Servicio") operado por el Seoul Institute of Clinical Psychology (el "Operador"). Al utilizar el Servicio, usted acepta estos terminos.',
    sections: [
      {
        heading: '1. Proposito y naturaleza del Servicio',
        items: [
          'El Servicio es una herramienta en linea que asiste en el calculo del Sumario Estructural del Test de Rorschach basado en el Sistema Comprehensivo de Exner (CS).',
          'Todos los resultados y respuestas de IA se proporcionan solo como referencia y no reemplazan el juicio clinico independiente.',
          'El Servicio no constituye practica medica, diagnostico psicologico ni asesoria legal.',
        ],
      },
      {
        heading: '2. Proteccion de datos del examinado y uso etico',
        items: [
          'No debe ingresar informacion personal identificable de los examinados en el Servicio.',
          'Al guardar archivos CSV, no use nombres de archivo que puedan identificar al examinado. Use nombres en codigo o identificadores anonimizados.',
          'Al usar el chat de IA, debe enmascarar o eliminar cualquier informacion que pueda identificar al examinado antes de enviarla.',
          'El contenido ingresado en el chat de IA se procesa a traves de proveedores externos de LLM (OpenAI, Google, Anthropic) mediante claves API que usted proporciona. El Operador no es responsable del manejo de datos por parte de estos proveedores.',
          'Usted es responsable de cumplir con las leyes aplicables y las directrices eticas de su organizacion profesional.',
        ],
      },
      {
        heading: '3. Cuentas y claves API',
        items: [
          'Para usar la funcion de chat de IA, debe iniciar sesion con una cuenta de Google y registrar su propia clave API de LLM.',
          'Las claves API registradas se cifran usando AES-256-CBC. Todos los costos asociados con el uso de la clave API son de su exclusiva responsabilidad.',
        ],
      },
      {
        heading: '4. Exencion de responsabilidad',
        items: [
          'El Operador no garantiza la exactitud, integridad u oportunidad de los resultados o respuestas de IA.',
          'Las respuestas del chat de IA pueden contener contenido inexacto debido a la naturaleza de los LLM y no deben usarse como unica base para decisiones clinicas.',
          'En la medida permitida por la ley, el Operador no sera responsable por danos directos o indirectos derivados del uso del Servicio.',
        ],
      },
      {
        heading: '5. Modificaciones del Servicio',
        items: [
          'El Operador puede modificar, suspender o terminar el Servicio sin previo aviso.',
          'El Operador puede revisar estos terminos segun sea necesario. El uso continuado del Servicio despues de los cambios constituye aceptacion.',
        ],
      },
    ],
  },
  pt: {
    title: 'Termos de Servico',
    effectiveDate: 'Data de vigencia: 15 de fevereiro de 2026',
    intro: 'Estes Termos de Servico regem o uso do servico web da Calculadora de Sumario Estrutural de Rorschach (o "Servico") operado pelo Seoul Institute of Clinical Psychology (o "Operador"). Ao usar o Servico, voce concorda com estes termos.',
    sections: [
      {
        heading: '1. Proposito e natureza do Servico',
        items: [
          'O Servico e uma ferramenta online que auxilia no calculo do Sumario Estrutural do Teste de Rorschach baseado no Sistema Compreensivo de Exner (CS).',
          'Todos os resultados e respostas de IA sao fornecidos apenas como referencia e nao substituem julgamento clinico independente.',
          'O Servico nao constitui pratica medica, diagnostico psicologico nem consultoria juridica.',
        ],
      },
      {
        heading: '2. Protecao de dados do examinado e uso etico',
        items: [
          'Voce nao deve inserir informacoes pessoais identificaveis dos examinados no Servico.',
          'Ao salvar arquivos CSV, nao use nomes de arquivo que possam identificar o examinado. Use codinomes ou identificadores anonimizados.',
          'Ao usar o chat de IA, voce deve mascarar ou remover qualquer informacao que possa identificar o examinado antes de enviar.',
          'O conteudo inserido no chat de IA e processado por provedores externos de LLM (OpenAI, Google, Anthropic) por meio de chaves API que voce fornece. O Operador nao e responsavel pelo tratamento de dados por esses provedores.',
          'Voce e responsavel por cumprir as leis aplicaveis e as diretrizes eticas de sua organizacao profissional.',
        ],
      },
      {
        heading: '3. Contas e chaves API',
        items: [
          'Para usar a funcao de chat de IA, voce deve fazer login com uma conta Google e registrar sua propria chave API de LLM.',
          'As chaves API registradas sao criptografadas usando AES-256-CBC. Todos os custos associados ao uso da chave API sao de sua exclusiva responsabilidade.',
        ],
      },
      {
        heading: '4. Isencao de responsabilidade',
        items: [
          'O Operador nao garante a precisao, integridade ou oportunidade dos resultados ou respostas de IA.',
          'As respostas do chat de IA podem conter conteudo impreciso devido a natureza dos LLMs e nao devem ser usadas como unica base para decisoes clinicas.',
          'Na medida permitida por lei, o Operador nao sera responsavel por danos diretos ou indiretos decorrentes do uso do Servico.',
        ],
      },
      {
        heading: '5. Modificacoes do Servico',
        items: [
          'O Operador pode modificar, suspender ou encerrar o Servico sem aviso previo.',
          'O Operador pode revisar estes termos conforme necessario. O uso continuado do Servico apos as alteracoes constitui aceitacao.',
        ],
      },
    ],
  },
};

export default async function TermsPage({ searchParams }: TermsPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const content = CONTENT[activeLang];

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{content.effectiveDate}</p>
          <p className="mt-4 text-[15px] leading-7 text-slate-700">{content.intro}</p>

          <div className="mt-8 space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-bold text-slate-800">{section.heading}</h2>
                <ul className="mt-3 space-y-2">
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
