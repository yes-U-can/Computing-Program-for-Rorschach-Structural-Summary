# Rorschach Structural Summary Calculator v2.0.0

로샤 구조 요약지 자동 계산 프로그램 (Next.js 버전)

## 프로젝트 정보

- **버전**: v2.0.0 (Next.js)
- **이전 버전**: v1.4.0 (Google Apps Script)
- **플랫폼**: Next.js 16 + Vercel
- **기술 스택**: TypeScript, React 19, Tailwind CSS 4

## 개발 목적

v1.4.0 (GAS)의 기술적 한계를 극복하고, 수익화 및 글로벌 확장이 가능한 전문가용 웹 애플리케이션으로 재탄생

## 주요 기능

- ✅ 179개 지표 자동 계산 (Exner Comprehensive System)
- ✅ Desktop 테이블 뷰 + Mobile 카드 UI
- ✅ 다국어 지원 (한국어, 영어, 일본어, 스페인어, 포르투갈어)
- ✅ LocalStorage 자동 저장 (서버 저장 없음)
- ✅ CSV 내보내기 (Raw Data + Summary)
- ✅ 인쇄 기능 (A4 3페이지)
- ✅ Google AdSense 통합
- ✅ 후원 시스템 (PayPal, Ko-fi, Buy Me a Coffee)
- ✅ SEO 최적화

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 프로젝트 구조

```
Computing Program for Rorschach Structural Summary/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── calculate/     # 계산 API 엔드포인트
│   ├── layout.tsx         # 전역 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # UI 컴포넌트 (버튼, 모달 등)
│   ├── forms/            # 폼 컴포넌트 (입력 테이블 등)
│   ├── modals/           # 모달 컴포넌트
│   └── results/          # 결과 표시 컴포넌트
├── hooks/                 # 커스텀 React 훅
│   ├── useTranslation.ts # 다국어 지원
│   └── useLocalStorage.ts # LocalStorage 관리
├── lib/                   # 유틸리티 함수
│   ├── calculator.ts      # 계산 로직 (Code.gs → TS) ✅
│   ├── constants.ts       # 상수 및 설정 ✅
│   ├── utils.ts           # 유틸리티 함수 ✅
│   ├── storage.ts         # LocalStorage 유틸 ✅
│   └── validation.ts      # 입력 검증 함수 ✅
├── types/                 # TypeScript 타입 정의 ✅
├── gas/                   # v1.4.0 (GAS) 레거시 파일 (참고용)
│   ├── Code.gs           # GAS 계산 로직 (이전됨)
│   ├── index.html        # GAS UI (이전됨)
│   └── styles.html       # GAS 스타일 (이전됨)
└── public/                # 정적 파일
```

## 개발 진행 상황

### ✅ Phase 1: 환경 설정 (완료)
- [x] Next.js 16 프로젝트 생성
- [x] TypeScript + Tailwind CSS 설정
- [x] 필수 패키지 설치
- [x] 폴더 구조 생성
- [x] Git 초기화
- [x] 보안 취약점 확인 및 최신 버전 유지

### ✅ Phase 2: 코어 로직 마이그레이션 (완료)
- [x] `lib/constants.ts` - SCORING_CONFIG 이전 완료
- [x] `lib/utils.ts` - 유틸리티 함수 이전 완료
- [x] `lib/storage.ts` - LocalStorage 유틸 완료
- [x] `hooks/useTranslation.ts` - 다국어 지원 훅 완료
- [x] `hooks/useLocalStorage.ts` - LocalStorage 훅 완료
- [x] `lib/calculator.ts` - 계산 로직 이전 완료 (Code.gs → TS)
- [x] `lib/validation.ts` - 입력 검증 함수 완료

### ⏳ Phase 3: UI 컴포넌트 개발 (진행 중)
- [x] `gas/` 폴더로 레거시 파일 정리 완료
- [x] 기본 컴포넌트 구조 생성
- [x] `components/ui/LanguageSelector.tsx` - 언어 선택 컴포넌트
- [ ] `gas/index.html` → React 컴포넌트로 분리
- [ ] `gas/styles.html` → Tailwind CSS로 전환
- [ ] 폼 입력 컴포넌트
- [ ] 결과 표시 컴포넌트
- [ ] 모달 컴포넌트

### 📋 Phase 4: 수익화 통합 (예정)
- [ ] Google AdSense 통합
- [ ] 후원 시스템 (PayPal, Ko-fi, Buy Me a Coffee)

### 📋 Phase 5: SEO 최적화 (예정)
- [ ] 메타데이터 최적화
- [ ] 구조화된 데이터 (JSON-LD)
- [ ] sitemap.xml, robots.txt

## 코드 구조 개선 사항

### v1.4.0 (GAS)의 문제점
- ❌ 모든 JavaScript가 `index.html`에 인라인으로 작성 (약 3,000줄)
- ❌ GAS 샌드박스 규제로 인해 외부 JS 파일 분리 불가
- ❌ 유지보수 어려움

### v2.0.0 (Next.js)의 개선
- ✅ React 컴포넌트로 모듈화
- ✅ 커스텀 훅으로 로직 분리
- ✅ TypeScript로 타입 안정성 확보
- ✅ 유지보수 용이한 폴더 구조

## 참고 문서

- [PRD](./docs/PRD_20260103.md)
- [BRD](./docs/BRD_20260103.md)
- [GTM](./docs/GTM_20260103.md)

## 라이선스

MIT License
Copyright (c) 2026 서울임상심리연구소 (SICP)
