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
    intro: '이 약관은 MOW(이하 "운영자")가 제공하는 웹서비스 로샤 구조요약 계산 도우미(영문: Computing Program for Rorschach Structural Summary, 서비스 URL: https://exnersicp.vercel.app, 이하 "서비스")의 이용과 관련하여 운영자와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 정함을 목적으로 합니다.',
    sections: [
      {
        heading: '제2조(용어의 정의)',
        items: [
          '이 약관에서 사용하는 용어의 뜻은 다음과 같습니다.',
          '이용자란 이 약관에 따라 서비스를 이용하는 자를 말합니다.',
          '회원이란 Google OAuth를 통해 로그인하고 서비스 내 계정 식별 정보가 생성되어 서비스를 이용하는 자를 말합니다.',
          '비회원(게스트)이란 로그인 없이 서비스의 일부 기능(구조요약 자동 계산 등)을 이용하는 자를 말합니다.',
          '구조요약 자동 계산이란 로샤(Rorschach) 검사 Exner 종합체계(CS)에 기반한 구조요약(Structural Summary) 산출을 돕는 기능을 말합니다.',
          'AI 해석 보조란 이용자가 등록한 API 키를 이용하여 외부 대형언어모델(LLM) 제공사(OpenAI/Google/Anthropic 등)의 API를 호출하고, 해석에 참고할 수 있는 응답을 제공받는 기능을 말합니다.',
          'API 키란 이용자가 외부 LLM 제공사의 API를 이용하기 위하여 보유·등록하는 인증키를 말합니다.',
          '지식 소스란 이용자가 AI 해석 보조 기능에서 참고자료로 활용하기 위해 등록하는 노트, 문서 등 자료를 말합니다.',
          '스킬북(Skill Book)이란 AI 해석 보조 시 적용되는 지침(Instructions)과 참고 문서(Documents)의 묶음으로, 회원이 생성·관리·거래할 수 있는 콘텐츠 단위를 말합니다.',
          '스킬북 스토어란 스킬북을 크레딧으로 구매하거나 판매할 수 있는 서비스 내 거래 공간을 말합니다.',
          '크레딧이란 스킬북 생성·관리 관련 기능 이용 또는 스킬북 스토어 거래 등에 사용하는 유료 전자적 가치(결제에 의해 충전되는 재화)를 말합니다.',
          '이 약관에서 정하지 아니한 용어는 관련 법령 및 일반적인 거래관행에 따릅니다.',
        ],
      },
      {
        heading: '제3조(약관의 효력 및 적용)',
        items: [
          '운영자는 이 약관의 내용을 서비스 화면에 게시하거나 그 밖의 방법으로 이용자가 알 수 있도록 합니다.',
          '이용자가 서비스를 이용하는 경우 이 약관에 동의한 것으로 봅니다. 다만, 회원은 가입(로그인) 과정에서 약관 동의 절차를 거칩니다.',
          '운영자는 서비스의 일부에 대하여 개별 운영정책 또는 추가 약관(예: 크레딧, 스킬북 스토어, 결제 관련 정책 등)을 둘 수 있으며, 해당 내용이 이 약관과 충돌하는 경우 특별한 정함이 없는 한 개별 운영정책 또는 추가 약관이 우선 적용됩니다.',
        ],
      },
      {
        heading: '제4조(계정 및 인증, 이용제한)',
        items: [
          '회원 가입 및 로그인은 Google OAuth 인증을 통해 이루어집니다.',
          '본 서비스는 별도의 독립 회원가입 절차 없이 Google OAuth 로그인 방식으로 회원을 식별합니다.',
          '회원은 Google 계정 설정의 "연결된 앱" 관리 메뉴에서 본 서비스 연결 권한을 직접 해제할 수 있습니다.',
          'Google 연결 해제와 서비스 내 데이터 삭제(탈퇴에 준하는 처리)는 별개의 절차이며, 서비스 데이터 삭제는 문의처를 통해 요청할 수 있습니다.',
          '회원은 계정 정보를 사실에 맞게 유지하고, 계정의 관리 책임을 부담합니다. 회원의 관리 소홀로 발생한 손해는 관련 법령이 허용하는 범위에서 회원이 부담할 수 있습니다.',
          '운영자는 다음 각 호의 사유가 있는 경우 회원의 서비스 이용을 일시적으로 제한하거나 계정을 정지·해지할 수 있습니다. 이 경우 운영자는 사전 통지하는 것을 원칙으로 하되, 긴급한 경우 사후 통지할 수 있습니다.',
          '타인의 계정을 도용하거나 제3자에게 계정을 대여·양도·판매하는 경우',
          'API 키를 부정하게 취득·공유·판매하거나, 결제/크레딧을 부정 이용하는 경우',
          '서비스의 정상 운영을 방해하거나, 보안 취약점 악용 등 부정행위를 시도한 경우',
          '타인의 권리를 침해하거나, 불법정보를 게시·전송한 경우',
          '그 밖에 법령 또는 이 약관을 중대하게 위반한 경우',
          '회원은 위 조치에 대하여 운영자가 안내하는 방법으로 이의신청을 할 수 있으며, 운영자는 합리적인 기간 내에 심사하여 결과를 안내합니다.',
        ],
      },
      {
        heading: '제5조(서비스의 제공 및 이용조건)',
        items: [
          '운영자는 이용자에게 다음 각 호의 서비스를 제공합니다.',
          '비회원(게스트) 대상: 구조요약 자동 계산 등 핵심 기능',
          '회원 대상: AI 해석 보조, AI 대화 기록 관리, 지식 소스 등록, 스킬북 생성·관리, 스킬북 스토어 이용, 크레딧 충전·사용 등',
          '기타 운영자가 제공하는 부가 기능',
          '서비스 이용을 위해서는 이용자의 단말기, 네트워크 환경, 브라우저 설정 등이 필요할 수 있으며, 이로 인한 이용 제한은 운영자의 책임 범위에 포함되지 않을 수 있습니다.',
          '광고는 비회원(게스트)에게 표시될 수 있으며, 회원에게는 표시되지 않을 수 있습니다. 광고의 노출 여부·형태는 운영정책에 따라 변경될 수 있습니다.',
          '개인정보의 수집·이용·보관·처리에 관한 사항은 개인정보처리방침에 따릅니다.',
        ],
      },
      {
        heading: '제6조(API 키 및 외부 LLM 사용)',
        items: [
          'AI 해석 보조는 BYOK(Bring Your Own Key) 방식으로 제공됩니다. 회원은 OpenAI/Google/Anthropic 등 외부 LLM 제공사의 API 키를 직접 등록하여 사용합니다.',
          '운영자는 등록된 API 키를 서버에 암호화하여 저장하며, 회원의 AI 요청을 처리하는 경우에 한하여 이를 복호화하여 외부 LLM 제공사의 API 호출에 사용합니다.',
          '외부 LLM 제공사 API 이용에 따른 요금 및 과금 책임은 회원에게 있습니다. 운영자는 외부 LLM 이용요금의 부과·정산에 관여하지 않습니다.',
          '외부 LLM 제공사의 서비스 정책, 약관, 장애, 응답 품질(정확성·완전성·적시성), 중단 등에 관한 사항은 해당 제공사의 책임과 정책에 따르며, 운영자는 법령이 허용하는 범위에서 그 책임을 제한할 수 있습니다.',
          '회원은 본인의 API 키를 안전하게 관리해야 하며, 제3자에게 공유·대여·양도하는 행위를 해서는 안 됩니다.',
        ],
      },
      {
        heading: '제7조(AI 해석 보조의 한계 및 이용자 책임)',
        items: [
          'AI 해석 보조 및 그 결과물은 참고자료로 제공됩니다.',
          '본 서비스는 의료행위 또는 공식적인 심리 진단·치료를 제공하지 않으며, AI 해석 보조는 전문적 판단을 대체하지 않습니다.',
          '회원은 AI 응답을 단독으로 진단, 치료, 처치, 법적 판단 등의 근거로 사용하여서는 안 되며, 최종 판단과 책임은 회원에게 있습니다.',
          '운영자는 AI 해석 보조의 결과가 특정 목적에 적합함을 보증하지 않으며, 회원은 필요에 따라 추가 검토 및 전문적 판단 절차를 거쳐야 합니다.',
        ],
      },
      {
        heading: '제8조(스킬북의 생성·권리·이용허락 및 거래)',
        items: [
          '회원이 스킬북을 생성하는 경우, 스킬북에 포함된 지침·문서·구성 및 그 편집물(이하 "회원 스킬북 콘텐츠")의 권리는 특별한 정함이 없는 한 해당 회원에게 귀속됩니다.',
          '회원은 서비스를 통해 회원 스킬북 콘텐츠를 저장·표시·검수·거래(판매/구매)·고객지원 및 분쟁처리·서비스 품질 개선을 위하여 필요한 범위에서 운영자에게 비독점적, 전 세계적, 무상(별도 합의가 없는 한) 이용허락을 부여합니다.',
          '이용허락의 범위에는 다음 각 호가 포함됩니다: 서비스 내에서의 표시, 목록화, 검색, 미리보기 제공; 스토어 거래의 이행(결제·정산·다운로드/접근권 부여 등) 및 이에 수반되는 기술적 처리; 운영정책 및 법령 준수 여부 확인을 위한 검수, 신고 처리, 분쟁 대응; 장애 대응, 백업, 보안, 고객지원 등 서비스 운영에 필요한 행위.',
          '운영자는 다음 각 호의 사유가 있는 경우 회원 스킬북 콘텐츠의 게시 제한, 수정·삭제, 거래 중지, 접근 제한 등의 조치를 할 수 있습니다. 이 경우 운영자는 원칙적으로 사전 통지하되, 긴급한 경우 사후 통지할 수 있습니다.',
          '법령 위반 또는 범죄에 이용될 우려가 있는 경우',
          '타인의 저작권, 영업비밀, 개인정보, 명예 등 권리를 침해하는 경우',
          '허위·과장, 기만적 표시 또는 이용자에게 중대한 혼동을 초래하는 경우',
          '악성코드 포함, 보안 위험 유발 등 서비스 안전을 해치는 경우',
          '그 밖에 운영정책 또는 이 약관을 중대하게 위반한 경우',
          '스킬북 스토어의 판매·구매 조건(가격, 제공 방식, 정산, 수수료, 판매자 의무 등)은 관련 법령 및 별도의 운영정책 또는 추가 약관에 따를 수 있습니다.',
        ],
      },
      {
        heading: '제9조(크레딧의 충전·사용·유효기간·환불)',
        items: [
          '크레딧은 회원이 결제를 통해 충전하여 사용할 수 있는 유료 전자적 가치입니다.',
          '크레딧은 스킬북 빌더, 스킬북 스토어 및 운영자가 정한 유료 기능에 사용할 수 있습니다.',
          '크레딧의 유효기간은 충전일로부터 5년으로 하며, 유효기간이 경과한 크레딧은 소멸합니다. 다만, 관련 법령 또는 운영정책에서 달리 정하는 경우 그에 따릅니다.',
          '크레딧은 원칙적으로 타인에게 양도·대여·담보 제공할 수 없으며, 상속은 관련 법령 및 운영정책에 따릅니다.',
          '미사용 크레딧 잔액의 환불은 관련 법령이 허용하는 범위 및 운영정책에 따라 처리합니다. 결제수단별 수수료, 제3자 결제대행사의 정책 등이 적용될 수 있습니다.',
          '이미 사용된 크레딧은 원칙적으로 환불되지 않습니다. 다만, 서비스 장애, 중복 결제, 결제 오류 등 합리적인 사유가 인정되는 경우 운영자는 관련 법령 및 운영정책에 따라 조치할 수 있습니다.',
          '크레딧의 청약철회 및 환불에 관하여는 전자상거래 등 관련 법령을 우선 적용하며, 이 약관에서 정하지 아니한 사항은 별도의 운영정책 또는 추가 약관에 따를 수 있습니다.',
        ],
      },
      {
        heading: '제10조(지적재산권)',
        items: [
          '서비스(웹사이트, UI/UX, 소프트웨어, 소스코드, 데이터베이스, 상표, 로고, 문서 등)에 관한 권리는 운영자 또는 정당한 권리자에게 귀속됩니다.',
          'SICP는 심리학 자문 협력 주체로서, 서비스 내·외부에서 SICP 명칭을 대외 브랜딩에 사용하는 것에 관하여 운영자와 별도 합의가 있을 수 있습니다.',
          '이용자는 서비스를 통해 제공되는 콘텐츠를 운영자의 사전 동의 없이 복제, 배포, 전송, 2차적 저작물 작성, 역설계, 기타 상업적 이용을 할 수 없습니다. 다만, 법령상 허용되는 범위는 예외로 합니다.',
          '이용자가 서비스 이용 과정에서 생성한 개인 데이터(예: CSV 내보내기 결과물, 개인 노트·문서 등)의 권리는 이용자에게 귀속됩니다.',
        ],
      },
      {
        heading: '제11조(금지행위)',
        items: [
          '이용자는 서비스 이용과 관련하여 다음 각 호의 행위를 하여서는 안 됩니다.',
          '피검자 또는 제3자의 개인정보(실명, 연락처, 주민등록번호 등)를 무단으로 입력·수집·공개·전송하는 행위',
          '타인의 계정 또는 인증정보를 도용하거나, 계정을 대여·양도·판매하는 행위',
          'API 키를 공유·대여·양도·판매하거나, 부정한 방법으로 취득·사용하는 행위',
          '스킬북, 지식 소스 또는 게시물로 타인의 저작권·초상권·명예·영업비밀 등 권리를 침해하는 행위',
          '불법정보, 음란물, 폭력·혐오 조장, 차별·괴롭힘 등 법령 또는 공서양속에 반하는 정보를 게시·전송하는 행위',
          '서비스의 정상 운영을 방해하는 행위(과도한 트래픽 유발, 자동화 도구를 통한 무단 수집, 보안 취약점 탐색·악용, 악성코드 유포 등)',
          '결제·크레딧·스토어 거래를 부정하게 이용하거나, 환불 악용 등 부정행위를 하는 행위',
          '기타 이 약관 또는 관련 법령을 위반하는 행위',
        ],
      },
      {
        heading: '제12조(서비스의 변경 및 중단)',
        items: [
          '운영자는 서비스의 개선, 유지보수, 기술적·운영상 필요, 법령 또는 정책 변경, 외부 서비스(결제·로그인·LLM 제공사 등) 변경 등의 사유로 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.',
          '운영자는 서비스의 중대한 변경 또는 중단이 예상되는 경우, 가능한 범위에서 사전에 공지합니다. 다만, 긴급한 장애 대응 등 불가피한 경우에는 사후 공지할 수 있습니다.',
        ],
      },
      {
        heading: '제13조(책임의 제한)',
        items: [
          '운영자는 서비스 제공과 관련하여 고의 또는 중대한 과실이 없는 한, 법령이 허용하는 범위 내에서 책임을 부담합니다.',
          '운영자는 외부 LLM 제공사, Google OAuth, 결제대행사, 광고사업자 등 제3자의 서비스 장애 또는 정책 변경으로 인하여 발생한 손해에 대하여, 고의 또는 중대한 과실이 없는 한 법령이 허용하는 범위 내에서 책임을 제한할 수 있습니다.',
          '운영자는 이용자의 귀책사유(계정·API 키 관리 소홀, 약관 위반, 불법·부적절한 데이터 입력 등)로 인하여 발생한 손해에 대하여 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.',
          '운영자는 AI 해석 보조 결과물의 정확성, 완전성, 최신성, 특정 목적 적합성을 보증하지 않으며, 이로 인한 손해에 대하여 고의 또는 중대한 과실이 없는 한 법령이 허용하는 범위에서 책임을 제한할 수 있습니다.',
        ],
      },
      {
        heading: '제14조(약관의 개정 및 고지)',
        items: [
          '운영자는 관련 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.',
          '운영자가 약관을 개정하는 경우, 개정 내용, 시행일, 개정 사유 및 이의제기 방법을 명시하여 다음 각 호의 기간 동안 서비스 내 공지합니다.',
          '이용자에게 불리하지 않은 변경: 시행일 7일 전부터',
          '이용자에게 불리한 변경 또는 중요한 변경: 시행일 30일 전부터',
          '이용자는 개정 약관에 동의하지 않을 경우, 시행일 전까지 운영자에게 이의제기를 하고 서비스 이용을 중단(회원은 제4조 절차에 따른 탈퇴·데이터 삭제 요청 포함)할 수 있습니다.',
          '운영자가 위 공지를 하고, 시행일까지 이용자가 명시적으로 거부 의사를 표시하지 아니하고 서비스를 계속 이용하는 경우, 관련 법령이 허용하는 범위에서 개정 약관에 동의한 것으로 봅니다. 다만, 관련 법령에서 달리 정하는 경우에는 그에 따릅니다.',
        ],
      },
      {
        heading: '제15조(준거법 및 관할)',
        items: [
          '이 약관은 대한민국 법령에 따라 해석되고 적용됩니다.',
          '서비스 이용과 관련하여 분쟁이 발생할 경우, 당사자 간 협의를 통해 원만히 해결하도록 노력하며, 소송이 제기되는 경우 민사소송법 등 관련 법령에 따른 관할법원에 제기합니다.',
        ],
      },
      {
        heading: '제16조(문의처)',
        items: [
          '서비스 이용과 관련한 문의는 아래 이메일로 할 수 있습니다.',
          '이메일: mow.coding@gmail.com',
        ],
      },
      {
        heading: '부칙',
        items: ['이 약관은 2026년 2월 15일부터 시행합니다.'],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    effectiveDate: 'Effective Date: February 15, 2026',
    intro: 'These Terms of Service (the "Terms") govern the rights, obligations, and responsibilities between MOW (the "Operator") and users in connection with the use of the web service Computing Program for Rorschach Structural Summary (the "Service") available at https://exnersicp.vercel.app.',
    sections: [
      {
        heading: 'Article 2 (Definitions)',
        items: [
          'User means any person who accesses or uses the Service in accordance with these Terms.',
          'Member means a User who logs in and creates an account via Google OAuth authentication.',
          'Guest means a User who uses certain features of the Service, including Structural Summary Calculation, without logging in.',
          'Structural Summary Calculation means the automated calculation of the Structural Summary based on the Rorschach test under the Exner Comprehensive System (CS).',
          'AI Interpretation Support means the functionality that enables Members to obtain interpretive assistance by calling external large language model (LLM) APIs using their own registered API keys.',
          'API Key means an authentication key issued by an external LLM provider (such as OpenAI, Google, or Anthropic) and registered by the Member for use within the Service.',
          'Knowledge Sources means notes, documents, or other materials uploaded or registered by a Member for reference in AI Interpretation Support.',
          'Skill Book means a bundled unit consisting of instructions and reference documents used to guide AI Interpretation Support and created, managed, or traded by Members.',
          'Skill Book Store means the marketplace within the Service where Skill Books may be purchased or sold using Credits.',
          'Credits means paid digital value purchased by Members and used for Skill Book-related features and other paid functionalities within the Service.',
        ],
      },
      {
        heading: 'Article 3 (Acceptance and Scope of Terms)',
        items: [
          'The Operator shall make these Terms available on the Service website.',
          'By accessing or using the Service, Users are deemed to have agreed to these Terms. Members must expressly agree to these Terms during the account registration process.',
          'The Operator may establish additional policies or supplementary terms for specific features (including Credits, Skill Book Store, and payment-related services). In case of conflict, such additional terms shall prevail unless otherwise specified.',
        ],
      },
      {
        heading: 'Article 4 (Account, Authentication, and Restrictions)',
        items: [
          'Membership registration and login are conducted through Google OAuth authentication.',
          'The Service does not provide a separate standalone sign-up flow; members are identified through Google OAuth login.',
          'Members can revoke the Service connection in their Google account settings under connected apps.',
          'Revoking Google connection and deleting Service-stored data (withdrawal-equivalent handling) are separate procedures; deletion of Service-stored data may be requested through the contact channel.',
          'Members are responsible for maintaining the accuracy of their account information and for safeguarding their account credentials.',
          'The Operator may suspend or terminate an account if any of the following occurs:',
          '(1) Unauthorized use, transfer, rental, or sale of accounts;',
          '(2) Misuse, sale, or unauthorized sharing of API Keys or Credits;',
          '(3) Interference with the normal operation or security of the Service;',
          '(4) Violation of applicable laws or infringement of third-party rights;',
          '(5) Material breach of these Terms.',
          'Except in urgent cases, the Operator will provide prior notice of suspension or termination. Members may submit an objection through the contact method provided, and the Operator will review and respond within a reasonable time.',
        ],
      },
      {
        heading: 'Article 5 (Provision and Use of the Service)',
        items: [
          'The Service provides:',
          '(1) Structural Summary Calculation to Guests and Members;',
          '(2) AI Interpretation Support, Knowledge Source registration, Skill Book creation and management, Skill Book Store access, and Credit-based features to Members;',
          '(3) Other related services as determined by the Operator.',
          'Certain features may require internet access and compatible technical environments.',
          'Advertisements may be displayed to Guests. Logged-in Members may not be shown advertisements.',
          'The collection and processing of personal data are governed by the Privacy Policy.',
        ],
      },
      {
        heading: 'Article 6 (API Keys and External LLM Services)',
        items: [
          'AI Interpretation Support operates on a BYOK (Bring Your Own Key) model. Members must register their own API Keys from external LLM providers.',
          'API Keys are stored in encrypted form on the server and decrypted only when necessary to process a Member\'s AI request.',
          'All fees and charges incurred through external LLM services are the sole responsibility of the Member.',
          'The Operator may process requests, route model calls, and store related chat records as needed to provide Service features. Processing by external LLM providers remains subject to each provider\'s own terms and policies.',
          'Members are solely responsible for safeguarding their API Keys.',
        ],
      },
      {
        heading: 'Article 7 (Limitations of AI Interpretation Support)',
        items: [
          'AI Interpretation Support is provided for reference purposes only.',
          'The Service does not provide medical services, clinical diagnoses, or treatment.',
          'AI-generated responses do not replace independent professional judgment.',
          'Final responsibility for interpretation and decision-making rests with the Member.',
        ],
      },
      {
        heading: 'Article 8 (Skill Books: Rights, License, and Transactions)',
        items: [
          'Members retain ownership of the content they create within Skill Books.',
          'Members grant the Operator a non-exclusive, worldwide license to store, display, review, distribute, and facilitate transactions involving Skill Books for purposes of operating, maintaining, and improving the Service.',
          'The Operator may restrict, suspend, or remove Skill Books that:',
          '(1) Violate laws or third-party rights;',
          '(2) Contain unlawful or harmful content;',
          '(3) Create security risks or disrupt Service operations.',
          'Terms governing pricing, fees, settlement, and marketplace conduct may be subject to additional policies.',
        ],
      },
      {
        heading: 'Article 9 (Credits: Purchase, Validity, and Refunds)',
        items: [
          'Credits are paid digital value purchased by Members.',
          'Credits may be used for Skill Book-related features and other paid services.',
          'Credits are valid for five (5) years from the date of purchase, unless otherwise required by law.',
          'Credits are non-transferable and may not be assigned or pledged. Inheritance is subject to applicable law.',
          'Refunds of unused Credits may be processed in accordance with applicable laws and payment policies.',
          'Used Credits are generally non-refundable unless required by law or in cases of payment error or service malfunction.',
          'Consumer withdrawal and refund rights shall be governed by applicable e-commerce and consumer protection laws.',
        ],
      },
      {
        heading: 'Article 10 (Intellectual Property)',
        items: [
          'All intellectual property rights related to the Service, including software, design, and implementation, belong to the Operator or lawful rights holders.',
          'SICP serves as a psychological advisory partner, and use of its name in branding may be subject to separate agreement.',
          'Users may not reproduce, distribute, reverse engineer, or commercially exploit the Service without prior authorization.',
          'Users retain ownership of their personal exported data (e.g., CSV outputs and personal notes).',
        ],
      },
      {
        heading: 'Article 11 (Prohibited Conduct)',
        items: [
          'Users shall not:',
          'Input, disclose, or transmit personal data of examinees or third parties without authorization;',
          'Share, sell, or misuse API Keys;',
          'Infringe upon intellectual property or other rights;',
          'Post unlawful, harmful, or fraudulent content;',
          'Interfere with the Service\'s normal operation;',
          'Engage in fraudulent transactions involving Credits or Skill Books.',
        ],
      },
      {
        heading: 'Article 12 (Modification and Suspension of Service)',
        items: [
          'The Operator may modify or suspend the Service due to technical, operational, or legal reasons.',
          'Significant changes will be announced in advance where reasonably practicable.',
        ],
      },
      {
        heading: 'Article 13 (Limitation of Liability)',
        items: [
          'The Operator shall be liable only to the extent permitted by applicable law and shall not be liable in the absence of willful misconduct or gross negligence.',
          'The Operator is not responsible for damages arising from external LLM providers or third-party services, except as required by law.',
          'The Operator does not guarantee the accuracy, completeness, or suitability of AI-generated content.',
        ],
      },
      {
        heading: 'Article 14 (Amendments to the Terms)',
        items: [
          'The Operator may amend these Terms in compliance with applicable laws.',
          'Amendments will be announced at least:',
          '(1) 7 days prior to the effective date for general changes;',
          '(2) 30 days prior for changes materially adverse to Users.',
          'The notice shall include the effective date, summary of changes, and instructions for objection.',
          'Continued use after the effective date constitutes acceptance unless otherwise required by law.',
        ],
      },
      {
        heading: 'Article 15 (Governing Law and Jurisdiction)',
        items: [
          'These Terms shall be governed by the laws of the Republic of Korea.',
          'Any disputes arising from or relating to the Service shall be subject to the jurisdiction of the competent court as determined in accordance with applicable civil procedure laws.',
        ],
      },
      {
        heading: 'Supplementary Provision',
        items: ['These Terms shall take effect on February 15, 2026.'],
      },
      {
        heading: 'Contact',
        items: ['Email: mow.coding@gmail.com'],
      },
    ],
  },
  ja: {
    title: '利用規約',
    effectiveDate: '施行日: 2026年2月15日',
    intro: '本利用規約（以下「本規約」といいます。）は、MOW（以下「運営者」といいます。）が提供するウェブサービス「ロシャ構造要約計算アシスタント」（Computing Program for Rorschach Structural Summary、URL: https://exnersicp.vercel.app、以下「本サービス」といいます。）の利用に関し、運営者と利用者との間の権利義務および責任事項等を定めることを目的とします。',
    sections: [
      {
        heading: '第2条（定義）',
        items: [
          '「利用者」とは、本規約に同意のうえ本サービスを利用するすべての者をいいます。',
          '「会員」とは、Google OAuthを通じてログインし、アカウントを作成して本サービスを利用する者をいいます。',
          '「非会員（ゲスト）」とは、ログインを行わずに構造要約自動計算機能等を利用する者をいいます。',
          '「構造要約自動計算」とは、ロールシャッハ検査Exner包括システム（CS）に基づく構造要約（Structural Summary）の算出を支援する機能をいいます。',
          '「AI解釈支援」とは、会員が登録したAPIキーを用いて外部大規模言語モデル（LLM）提供事業者のAPIを呼び出し、解釈の参考となる応答を取得する機能をいいます。',
          '「APIキー」とは、OpenAI、Google、Anthropic等の外部LLM提供事業者が発行する認証キーであり、会員が本サービスに登録するものをいいます。',
          '「ナレッジソース」とは、AI解釈支援機能において参照資料として会員が登録するノート、文書等をいいます。',
          '「スキルブック（Skill Book）」とは、AI解釈支援時に適用される指示（Instructions）および参考文書（Documents）をまとめたコンテンツ単位をいいます。',
          '「スキルブックストア」とは、スキルブックをクレジットにより購入または販売できる本サービス内の取引機能をいいます。',
          '「クレジット」とは、スキルブック関連機能その他有料機能に利用できる、決済により付与されるデジタル価値をいいます。',
        ],
      },
      {
        heading: '第3条（規約の同意および適用範囲）',
        items: [
          '運営者は、本規約の内容を本サービス上に掲示します。',
          '利用者は、本サービスを利用することにより、本規約に同意したものとみなされます。会員は登録時に明示的な同意手続きを行います。',
          '運営者は、クレジット、スキルブックストア、決済等に関し、個別のポリシーまたは追加規約を定めることがあります。この場合、特別の定めがない限り、当該個別規約が優先されます。',
        ],
      },
      {
        heading: '第4条（アカウントおよび利用制限）',
        items: [
          '会員登録およびログインはGoogle OAuthを通じて行われます。',
          '本サービスは独立した会員登録フローを設けず、Google OAuthログインにより会員を識別します。',
          '会員はGoogleアカウント設定の「接続済みアプリ」管理画面で本サービスの接続権限を自ら解除できます。',
          'Google連携解除とサービス内保存データの削除（退会に準ずる処理）は別手続であり、サービス内データ削除は問い合わせ窓口を通じて申請できます。',
          '会員は、自己のアカウント情報を適切に管理する責任を負います。',
          '運営者は、以下の場合、事前通知を原則とし、緊急の場合は事後通知のうえ、アカウントの利用停止または解約を行うことがあります。',
          '(1) アカウントの不正使用、譲渡、貸与、販売',
          '(2) APIキーまたはクレジットの不正利用',
          '(3) 本サービスの運営妨害またはセキュリティ侵害行為',
          '(4) 法令違反または第三者の権利侵害',
          '(5) 本規約の重大な違反',
          '会員は、利用停止等の措置に対して異議申立てを行うことができ、運営者は合理的期間内に審査し回答します。',
        ],
      },
      {
        heading: '第5条（サービスの提供）',
        items: [
          '本サービスは、ゲストおよび会員に対し構造要約自動計算機能を提供します。',
          '会員には、AI解釈支援、ナレッジソース登録、スキルブック生成管理、スキルブックストア利用、クレジット利用等の機能が提供されます。',
          'ゲストには広告が表示される場合があります。会員には広告が表示されない場合があります。',
          '個人情報の取扱いは、別途定めるプライバシーポリシーに従います。',
        ],
      },
      {
        heading: '第6条（APIキーおよび外部LLMの利用）',
        items: [
          'AI解釈支援はBYOK方式で提供されます。会員は自己のAPIキーを登録して利用します。',
          'APIキーは暗号化してサーバーに保存され、リクエスト処理時にのみ復号されます。',
          '外部LLM利用に伴う料金は会員が負担します。',
          '外部LLM提供事業者のサービス内容、品質、障害等については当該事業者の責任に帰属します。',
        ],
      },
      {
        heading: '第7条（AI解釈支援の限界）',
        items: [
          'AI解釈支援の結果は参考情報です。',
          '本サービスは医療行為または正式な心理診断を提供するものではありません。',
          '最終的な判断および責任は利用者に帰属します。',
        ],
      },
      {
        heading: '第8条（スキルブックの権利および取引）',
        items: [
          '会員が作成したスキルブックの著作権は原則として当該会員に帰属します。',
          '会員は、サービス運営、表示、取引、審査等に必要な範囲で、運営者に非独占的利用許諾を付与します。',
          '法令違反または権利侵害が認められる場合、運営者は表示制限、削除、取引停止等の措置を講じることができます。',
        ],
      },
      {
        heading: '第9条（クレジット）',
        items: [
          'クレジットは決済により購入されます。',
          '有効期間は購入日から5年間とします。',
          '未使用残高の返金は法令および運営ポリシーに従います。',
          '使用済みクレジットは原則返金不可としますが、法令に基づく場合を除きます。',
        ],
      },
      {
        heading: '第10条（知的財産権）',
        items: [
          '本サービスに関するソフトウェア、デザイン等の権利は運営者に帰属します。',
          'SICPは心理学的助言協力機関です。',
          '利用者は、無断で本サービスを複製、改変、商用利用してはなりません。',
        ],
      },
      {
        heading: '第11条（禁止行為）',
        items: [
          '利用者は以下の行為を行ってはなりません。',
          '第三者の個人情報の無断入力公開',
          'APIキーの不正共有販売',
          '他者の権利侵害',
          '違法または有害情報の投稿',
          'サービス運営の妨害行為',
          'クレジットの不正利用',
        ],
      },
      {
        heading: '第12条（責任の制限）',
        items: ['運営者は、故意または重過失がない限り、法令で許容される範囲内で責任を負います。'],
      },
      {
        heading: '第13条（規約の改定）',
        items: [
          '運営者は法令に従い本規約を改定することができます。',
          '不利でない変更は7日前、不利な変更は30日前に告知します。',
          '変更内容、施行日、異議申立方法を明示します。',
        ],
      },
      {
        heading: '第14条（準拠法および管轄）',
        items: ['本規約は大韓民国法に準拠し、紛争は民事訴訟法等の関連法令に基づく管轄裁判所に提起されます。'],
      },
      {
        heading: '第15条（お問い合わせ）',
        items: ['Email: mow.coding@gmail.com'],
      },
      {
        heading: '附則',
        items: ['本規約は2026年2月15日より施行します。'],
      },
    ],
  },
  es: {
    title: 'Términos de Servicio',
    effectiveDate: 'Fecha de entrada en vigor: 15 de febrero de 2026',
    intro: 'Estos Términos de Servicio (los "Términos") regulan los derechos, obligaciones y responsabilidades entre MOW (el "Operador") y los usuarios en relación con el uso del servicio web Asistente para el Cálculo del Resumen Estructural de Rorschach (Computing Program for Rorschach Structural Summary), disponible en https://exnersicp.vercel.app (el "Servicio").',
    sections: [
      {
        heading: 'Artículo 2 (Definiciones)',
        items: [
          '1. Usuario significa cualquier persona que acceda o utilice el Servicio conforme a los presentes Términos.',
          '2. Miembro significa el Usuario que crea una cuenta mediante autenticación Google OAuth y utiliza el Servicio tras iniciar sesión.',
          '3. Invitado significa el Usuario que utiliza determinadas funciones del Servicio, incluida la función de cálculo automático del Resumen Estructural, sin iniciar sesión.',
          '4. Cálculo del Resumen Estructural significa la función que automatiza el cálculo del Resumen Estructural basado en el Sistema Comprensivo de Exner (CS) del Test de Rorschach.',
          '5. Soporte de Interpretación con IA significa la función que permite a los Miembros obtener respuestas de apoyo interpretativo mediante el uso de claves API propias para llamar a modelos de lenguaje de gran escala (LLM) externos.',
          '6. Clave API significa la clave de autenticación emitida por proveedores externos de LLM (como OpenAI, Google o Anthropic) y registrada por el Miembro en el Servicio.',
          '7. Fuentes de Conocimiento significa notas, documentos u otros materiales cargados por el Miembro para ser utilizados como referencia en el Soporte de Interpretación con IA.',
          '8. Skill Book significa una unidad de contenido que agrupa instrucciones y documentos de referencia utilizados para orientar el Soporte de Interpretación con IA.',
          '9. Tienda de Skill Books significa el espacio dentro del Servicio donde los Skill Books pueden ser comprados o vendidos utilizando Créditos.',
          '10. Créditos significa el valor digital de pago adquirido por los Miembros y utilizado para funciones relacionadas con Skill Books u otros servicios de pago.',
        ],
      },
      {
        heading: 'Artículo 3 (Aceptación y Alcance)',
        items: [
          '1. El Operador publicará los presentes Términos en el sitio web del Servicio.',
          '2. El uso del Servicio implica la aceptación de estos Términos. Los Miembros deberán aceptar expresamente los Términos durante el proceso de registro.',
          '3. El Operador podrá establecer políticas adicionales o términos complementarios para funciones específicas (incluyendo Créditos y la Tienda de Skill Books). En caso de conflicto, dichos términos específicos prevalecerán.',
        ],
      },
      {
        heading: 'Artículo 4 (Cuenta, Autenticación y Restricciones)',
        items: [
          '1. El registro e inicio de sesión se realizan mediante Google OAuth.',
          '2. El Servicio no cuenta con un registro independiente; los Miembros se identifican mediante inicio de sesión con Google OAuth.',
          '3. Los Miembros pueden revocar la conexión del Servicio desde la sección de aplicaciones conectadas en su cuenta de Google.',
          '4. La revocación de la conexión con Google y la eliminación de datos almacenados en el Servicio (tratamiento equivalente a baja) son procedimientos distintos; la eliminación de datos del Servicio puede solicitarse por el canal de contacto.',
          '5. El Miembro es responsable de la gestión y seguridad de su cuenta.',
          '6. El Operador podrá suspender o cancelar la cuenta en los siguientes casos:',
          '(1) Uso no autorizado, cesión o venta de cuentas;',
          '(2) Uso indebido de Claves API o Créditos;',
          '(3) Interferencia con el funcionamiento del Servicio;',
          '(4) Violación de la ley o infracción de derechos de terceros;',
          '(5) Incumplimiento grave de los presentes Términos.',
          '7. El Miembro podrá presentar una reclamación respecto a cualquier medida adoptada, y el Operador revisará el caso en un plazo razonable.',
        ],
      },
      {
        heading: 'Artículo 5 (Prestación del Servicio)',
        items: [
          '1. El Servicio proporciona el Cálculo del Resumen Estructural tanto a Invitados como a Miembros.',
          '2. Los Miembros pueden utilizar funciones adicionales, incluyendo Soporte de Interpretación con IA, gestión de historial de conversaciones, registro de Fuentes de Conocimiento, creación y gestión de Skill Books, acceso a la Tienda de Skill Books y uso de Créditos.',
          '3. Los Invitados pueden visualizar publicidad; los Miembros autenticados pueden no visualizarla.',
          '4. El tratamiento de datos personales se rige por la Política de Privacidad correspondiente.',
        ],
      },
      {
        heading: 'Artículo 6 (Claves API y Servicios LLM Externos)',
        items: [
          '1. El Soporte de Interpretación con IA opera bajo el modelo BYOK (Bring Your Own Key).',
          '2. Las Claves API se almacenan cifradas y se descifran únicamente cuando sea necesario para procesar una solicitud.',
          '3. Los costos derivados del uso de servicios LLM externos son responsabilidad exclusiva del Miembro.',
          '4. El Operador puede enrutar, procesar y almacenar el historial relacionado con las solicitudes para operar el Servicio; el procesamiento por parte de proveedores LLM externos se rige por sus propios términos y políticas.',
        ],
      },
      {
        heading: 'Artículo 7 (Limitaciones del Soporte de Interpretación con IA)',
        items: [
          '1. Las respuestas generadas por IA se proporcionan únicamente con fines de referencia.',
          '2. El Servicio no constituye una herramienta de diagnóstico médico ni psicológico.',
          '3. La responsabilidad final de interpretación recae en el Usuario.',
        ],
      },
      {
        heading: 'Artículo 8 (Skill Books: Derechos y Transacciones)',
        items: [
          '1. El Miembro conserva la titularidad de los contenidos que cree en sus Skill Books.',
          '2. El Miembro otorga al Operador una licencia no exclusiva para almacenar, mostrar, revisar y facilitar la transacción de dichos contenidos dentro del Servicio.',
          '3. El Operador podrá restringir o eliminar contenidos que infrinjan la ley o derechos de terceros.',
        ],
      },
      {
        heading: 'Artículo 9 (Créditos: Compra, Vigencia y Reembolsos)',
        items: [
          '1. Los Créditos se adquieren mediante pago.',
          '2. La vigencia de los Créditos es de cinco (5) años desde su adquisición, salvo disposición legal en contrario.',
          '3. El reembolso de Créditos no utilizados se realizará conforme a la legislación aplicable.',
          '4. Los Créditos ya utilizados no son reembolsables, salvo disposición legal o error comprobado.',
        ],
      },
      {
        heading: 'Artículo 10 (Propiedad Intelectual)',
        items: [
          '1. Los derechos sobre el software, diseño e implementación del Servicio pertenecen al Operador o a los titulares legítimos.',
          '2. SICP actúa como entidad colaboradora en asesoramiento psicológico.',
          '3. Los Usuarios no podrán reproducir, distribuir ni explotar comercialmente el Servicio sin autorización previa.',
        ],
      },
      {
        heading: 'Artículo 11 (Conductas Prohibidas)',
        items: [
          'El Usuario no deberá:',
          '1. Introducir o divulgar datos personales sin autorización;',
          '2. Compartir o vender Claves API;',
          '3. Infringir derechos de terceros;',
          '4. Publicar información ilegal o dañina;',
          '5. Interferir con el funcionamiento del Servicio;',
          '6. Utilizar los Créditos de forma fraudulenta.',
        ],
      },
      {
        heading: 'Artículo 12 (Limitación de Responsabilidad)',
        items: [
          'El Operador será responsable únicamente dentro de los límites permitidos por la ley aplicable y no responderá en ausencia de dolo o negligencia grave.',
        ],
      },
      {
        heading: 'Artículo 13 (Modificación de los Términos)',
        items: [
          '1. El Operador podrá modificar los Términos conforme a la ley.',
          '2. Las modificaciones no perjudiciales se anunciarán con 7 días de antelación; las perjudiciales, con 30 días.',
          '3. El aviso incluirá fecha de entrada en vigor y procedimiento para objeciones.',
        ],
      },
      {
        heading: 'Artículo 14 (Ley Aplicable y Jurisdicción)',
        items: [
          'Los presentes Términos se rigen por la legislación de la República de Corea. Cualquier controversia se someterá al tribunal competente conforme a la normativa procesal aplicable.',
        ],
      },
      {
        heading: 'Artículo 15 (Contacto)',
        items: ['Correo electrónico: mow.coding@gmail.com'],
      },
      {
        heading: 'Disposición Final',
        items: ['Los presentes Términos entrarán en vigor el 15 de febrero de 2026.'],
      },
    ],
  },
  pt: {
    title: 'Termos de Serviço',
    effectiveDate: 'Data de entrada em vigor: 15 de fevereiro de 2026',
    intro: 'Os presentes Termos de Serviço (doravante "Termos") regulam os direitos, obrigações e responsabilidades entre a MOW (doravante "Operadora") e os usuários em relação ao uso do serviço web Assistente para Cálculo do Resumo Estrutural de Rorschach (Computing Program for Rorschach Structural Summary), disponível em https://exnersicp.vercel.app (doravante "Serviço").',
    sections: [
      {
        heading: 'Artigo 2 (Definições)',
        items: [
          '1. Usuário significa qualquer pessoa que acesse ou utilize o Serviço de acordo com estes Termos.',
          '2. Membro significa o Usuário que cria uma conta por meio de autenticação Google OAuth e utiliza o Serviço após login.',
          '3. Convidado significa o Usuário que utiliza determinadas funcionalidades do Serviço, incluindo o cálculo automático do Resumo Estrutural, sem realizar login.',
          '4. Cálculo do Resumo Estrutural significa a funcionalidade que automatiza o cálculo do Resumo Estrutural com base no Sistema Compreensivo de Exner (CS) do Teste de Rorschach.',
          '5. Suporte de Interpretação com IA significa a funcionalidade que permite ao Membro obter respostas interpretativas utilizando suas próprias chaves de API para acessar modelos de linguagem de grande porte (LLM) externos.',
          '6. Chave de API significa a chave de autenticação emitida por provedores externos de LLM (como OpenAI, Google ou Anthropic) e registrada pelo Membro no Serviço.',
          '7. Fontes de Conhecimento significam notas, documentos ou outros materiais enviados pelo Membro para uso como referência no Suporte de Interpretação com IA.',
          '8. Skill Book significa uma unidade de conteúdo que reúne instruções e documentos de referência utilizados para orientar o Suporte de Interpretação com IA.',
          '9. Loja de Skill Books significa o espaço dentro do Serviço onde Skill Books podem ser comprados ou vendidos mediante Créditos.',
          '10. Créditos significam valor digital pago adquirido pelo Membro e utilizado para funcionalidades relacionadas a Skill Books e outros serviços pagos.',
        ],
      },
      {
        heading: 'Artigo 3 (Aceitação e Aplicação)',
        items: [
          '1. A Operadora disponibilizará estes Termos no site do Serviço.',
          '2. Ao utilizar o Serviço, o Usuário declara estar de acordo com estes Termos. O Membro deverá concordar expressamente durante o processo de registro.',
          '3. A Operadora poderá estabelecer políticas adicionais ou termos complementares para funcionalidades específicas (incluindo Créditos e Loja de Skill Books). Em caso de conflito, tais termos específicos prevalecerão.',
        ],
      },
      {
        heading: 'Artigo 4 (Conta, Autenticação e Restrição de Uso)',
        items: [
          '1. O registro e login são realizados por meio de Google OAuth.',
          '2. O Serviço não possui cadastro independente; os Membros são identificados por login com Google OAuth.',
          '3. Os Membros podem revogar a conexão do Serviço na seção de aplicativos conectados da conta Google.',
          '4. A revogação da conexão com o Google e a exclusão de dados armazenados no Serviço (tratamento equivalente a encerramento de conta) são procedimentos distintos; a exclusão de dados do Serviço pode ser solicitada pelo canal de contato.',
          '5. O Membro é responsável pela gestão e segurança de sua conta.',
          '6. A Operadora poderá suspender ou encerrar a conta nos seguintes casos:',
          '(1) Uso não autorizado, cessão ou venda de contas;',
          '(2) Uso indevido de Chaves de API ou Créditos;',
          '(3) Interferência no funcionamento ou segurança do Serviço;',
          '(4) Violação da legislação aplicável ou de direitos de terceiros;',
          '(5) Descumprimento grave destes Termos.',
          '7. O Membro poderá apresentar contestação às medidas adotadas, e a Operadora analisará o caso em prazo razoável.',
        ],
      },
      {
        heading: 'Artigo 5 (Prestação do Serviço)',
        items: [
          '1. O Serviço oferece Cálculo do Resumo Estrutural tanto para Convidados quanto para Membros.',
          '2. Os Membros podem utilizar funcionalidades adicionais, incluindo Suporte de Interpretação com IA, gerenciamento de histórico de conversas, registro de Fontes de Conhecimento, criação e gestão de Skill Books, acesso à Loja de Skill Books e uso de Créditos.',
          '3. Convidados podem visualizar publicidade; Membros autenticados podem não visualizar anúncios.',
          '4. O tratamento de dados pessoais é regido pela Política de Privacidade aplicável.',
        ],
      },
      {
        heading: 'Artigo 6 (Chaves de API e Serviços LLM Externos)',
        items: [
          '1. O Suporte de Interpretação com IA opera no modelo BYOK (Bring Your Own Key).',
          '2. As Chaves de API são armazenadas de forma criptografada e descriptografadas somente quando necessário para processar solicitações.',
          '3. Os custos decorrentes do uso de serviços LLM externos são de responsabilidade exclusiva do Membro.',
          '4. A Operadora pode encaminhar, processar e armazenar histórico relacionado às solicitações para operar o Serviço; o processamento por provedores externos de LLM é regido por seus próprios termos e políticas.',
        ],
      },
      {
        heading: 'Artigo 7 (Limitações do Suporte de Interpretação com IA)',
        items: [
          '1. As respostas geradas por IA são fornecidas apenas para fins de referência.',
          '2. O Serviço não constitui ferramenta de diagnóstico médico ou psicológico.',
          '3. A responsabilidade final pela interpretação recai sobre o Usuário.',
        ],
      },
      {
        heading: 'Artigo 8 (Skill Books: Direitos e Transações)',
        items: [
          '1. O Membro mantém a titularidade dos conteúdos criados em seus Skill Books.',
          '2. O Membro concede à Operadora licença não exclusiva para armazenar, exibir, revisar e viabilizar transações envolvendo tais conteúdos dentro do Serviço.',
          '3. A Operadora poderá restringir ou remover conteúdos que violem a lei ou direitos de terceiros.',
        ],
      },
      {
        heading: 'Artigo 9 (Créditos: Aquisição, Validade e Reembolsos)',
        items: [
          '1. Créditos são adquiridos mediante pagamento.',
          '2. A validade dos Créditos é de cinco (5) anos a partir da data de aquisição, salvo disposição legal em contrário.',
          '3. O reembolso de Créditos não utilizados será realizado conforme a legislação aplicável.',
          '4. Créditos já utilizados não são reembolsáveis, salvo quando exigido por lei ou em caso de erro comprovado.',
        ],
      },
      {
        heading: 'Artigo 10 (Propriedade Intelectual)',
        items: [
          '1. Os direitos relativos ao software, design e implementação do Serviço pertencem à Operadora ou aos respectivos titulares legítimos.',
          '2. SICP atua como entidade colaboradora em consultoria psicológica.',
          '3. Os Usuários não poderão reproduzir, distribuir ou explorar comercialmente o Serviço sem autorização prévia.',
        ],
      },
      {
        heading: 'Artigo 11 (Condutas Proibidas)',
        items: [
          'O Usuário não deverá:',
          '1. Inserir ou divulgar dados pessoais de terceiros sem autorização;',
          '2. Compartilhar ou vender Chaves de API;',
          '3. Infringir direitos de terceiros;',
          '4. Publicar conteúdo ilegal ou prejudicial;',
          '5. Interferir no funcionamento do Serviço;',
          '6. Utilizar Créditos de forma fraudulenta.',
        ],
      },
      {
        heading: 'Artigo 12 (Limitação de Responsabilidade)',
        items: [
          'A Operadora será responsável apenas dentro dos limites permitidos pela legislação aplicável e não responderá na ausência de dolo ou negligência grave.',
        ],
      },
      {
        heading: 'Artigo 13 (Alteração dos Termos)',
        items: [
          '1. A Operadora poderá modificar estes Termos conforme a legislação aplicável.',
          '2. Alterações não prejudiciais serão anunciadas com 7 dias de antecedência; alterações prejudiciais, com 30 dias.',
          '3. O aviso incluirá a data de vigência e instruções para contestação.',
        ],
      },
      {
        heading: 'Artigo 14 (Lei Aplicável e Jurisdição)',
        items: [
          'Estes Termos são regidos pelas leis da República da Coreia. Eventuais controvérsias serão submetidas ao tribunal competente conforme a legislação processual aplicável.',
        ],
      },
      {
        heading: 'Artigo 15 (Contato)',
        items: ['Email: mow.coding@gmail.com'],
      },
      {
        heading: 'Disposição Final',
        items: ['Estes Termos entram em vigor em 15 de fevereiro de 2026.'],
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
