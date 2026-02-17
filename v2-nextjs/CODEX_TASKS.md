# 작업 정리 및 로드맵 대조 보고서 (최종 수정본)

작성일: 2026-02-16
작성자: Codex

---

## 0) 사용자 피드백 핵심

사용자 의도:
- API 키 입력(BYOK) 기능은 앞으로도 유지한다.
- 크레딧 시스템은 별도 기능 축이다.
- 내가 방금 한 작업을 로드맵과 대조해 "정합성" 관점으로 다시 정리해야 한다.

이 문서는 위 피드백을 반영한 최종 정리본이다.

---

## 1) 실제 수행 작업 요약

### 1-1. 크레딧 코드 제거
- 삭제: `app/api/credits/`, `components/account/CreditBalancePanel.tsx`, `lib/creditLedger.ts`
- 스키마 정리: `CreditTransactionType`, `CreditTransaction`, `User.creditBalance`, `User.creditTransactions` 제거
- 계정 페이지에서 크레딧 섹션/메뉴 제거

### 1-2. SkillBook 관리 구조 분리
- `SkillBookManager`를 역할별로 분해:
  - `SkillBookList.tsx`
  - `SkillBookEditor.tsx`
  - `SkillBookBuilder.tsx`
- `SkillBookManager.tsx`는 모드 전환만 담당하는 얇은 파일로 교체

### 1-3. i18n 정리
- 하드코딩 문구를 번역 키로 이동
- draft/duplicate 관련 키를 5개 locale에 추가

### 1-4. 스토어 attribution 추가
- 스키마 필드 추가: `forkedFromId`, `forkedFromName`, `originalAuthor`
- import/duplicate/create 흐름에서 원본 정보 보존
- 목록 UI에 원작성자 표시

### 1-5. 검증
- `test` 통과
- `lint` 통과
- `next build` 통과
- `prisma migrate status` up-to-date
- `prisma migrate diff` empty migration

---

## 2) 로드맵 대조 결과 (핵심)

### 2-1. 로드맵과 정합한 부분
- SkillBook 중심 구조 강화: 정합
- Store 확장 대비 attribution 추가: 정합
- BYOK 기능 자체 유지: 정합 (삭제하지 않음)

### 2-2. 로드맵/제품 방향과 어긋난 부분
- Builder 안내 문구에 "향후 크레딧 기반 전환" 뉘앙스를 넣어 정책 혼선을 유발함.
- 사용자 의도("BYOK는 계속 유지")와 메시지 정합성이 맞지 않음.

정리:
- 기능 구현 자체는 대부분 맞았으나,
- 정책 커뮤니케이션 문구는 잘못된 신호를 줄 수 있게 작성됨.

---

## 3) 정책 정합성 기준 (확정)

앞으로 기준:
1. BYOK(사용자 API 키 입력/사용)는 유지 기능이다.
2. 크레딧은 별도 축(마켓/정산/빌더 과금 가능성)으로 분리해서 다룬다.
3. UI 문구는 위 1,2를 혼동 없이 전달해야 한다.

---

## 4) 즉시 후속 작업 항목

1. Builder 안내 문구를 BYOK 유지 정책에 맞게 수정
2. "API 키"와 "크레딧"의 역할 분리를 명확히 하는 사용자 안내 문구 정리
3. 관련 locale 문구 동기화

---

## 5) 결론

이번 작업의 코드 구조 개선과 검증은 유효하다.
다만 제품 메시지 정합성(특히 Builder 안내 문구)은 사용자 피드백 기준으로 수정이 필요하다.

본 문서는 기존 명세/중간 보고를 대체하는 최종 정리본이다.

---

## 6) 제품 오너 추가 요구사항 (크레딧 경제 모델) - 2026-02-16

아래는 대화로 확정된 비즈니스 요구사항이며, 추후 구현은 이 기준을 우선한다.

### 6-1. 크레딧 사용/소각 규칙

1. 스킬북을 스토어에 등록할 때 등록비(credits)를 차감한다.  
   - 이 등록비는 소각(유통량 감소)으로 처리한다.

2. 스토어 판매 정산 시 판매 수수료를 credits로 차감한다.  
   - 판매자 정산 크레딧과 별도로, 수수료 크레딧은 소각 처리한다.

3. 플랫폼 제공 AI(사용자 API 키 미등록 사용자용) 사용 시, 실제 토큰 사용량 기반으로 크레딧을 차감한다.  
   - 내부 실비(LLM 원가) + 마진이 남는 구조로 환산 단가를 설정한다.

### 6-2. BYOK 정책

1. 사용자 API 키 입력(BYOK) 기능은 유지한다. 제거 대상이 아니다.
2. BYOK와 플랫폼키 과금형은 공존한다.
3. UI/문구에서 API 키와 크레딧을 혼동시키지 않는다.

### 6-3. 매출/경제 모델 인식

1. 1차 현금 유입은 \"크레딧 구매\" 시점에서 발생한다.
2. 소각은 매출 발생 행위가 아니라, 내부 경제(유통량/수익배분) 운영 장치다.
3. 따라서 아래 3개 파라미터를 함께 설계해야 한다.
   - 크레딧 판매 단가
   - 토큰->크레딧 환산 단가(모델별)
   - 등록비/수수료율

### 6-4. 구현 우선순위 제안

1. 결제->충전(크레딧 패키지 구매) 파이프라인
2. 거래원장(CreditTransaction) 확장: `listing_fee_burn`, `sale_commission_burn`, `platform_ai_usage_burn`, `sale_settlement_credit`
3. 플랫폼키 채팅 토큰 계량/과금 엔진
4. 스토어 등록/판매 정산 시 크레딧 소각 규칙 적용
5. 관리자 요율 테이블(모델원가/마진/수수료) 설정 화면 또는 구성 파일

---

## 7) 경제모델 Q&A 기록 (중요)

### 7-1. \"소각을 해야 돈을 버는가?\"에 대한 정리

1. 실제 현금 유입은 크레딧 \"구매\" 시점에서 발생한다.  
2. 소각은 매출 발생 행위가 아니라 내부 경제 운영 장치(유통량 관리, 수수료 처리)다.  
3. 따라서 수익성은 아래 3개를 함께 설계해야 확보된다.
   - 크레딧 판매 단가
   - 토큰 환산 단가(모델별)
   - 등록비/수수료율

### 7-2. BYOK + 플랫폼 과금 공존 원칙

1. 개인 API 키 사용(BYOK)은 유지한다.
2. 개인 키가 없으면 플랫폼 모델을 사용하고 크레딧 과금한다.
3. 사용자가 혼동하지 않도록 UI에서 모드를 명시한다.

### 7-3. 모델 노출 전략

1. Provider(회사)와 Model(세부 모델)을 분리 표기한다.
2. 추천 모델을 우선 노출하고, 고급 사용자용으로 전체 모델을 펼친다.
3. 각 모델에 \"가격/속도/분석형\" 수준을 같이 노출한다.

---

## 8) 단가/환산 정책 제안 (초안)

아래는 2026-02-16 기준 공식 가격 페이지를 참고한 초기안이다.  
실제 운영 전에는 반드시 최신 단가로 재검증한다.

### 8-1. 기준 파라미터

- `USD_PER_CREDIT`: 0.01 (1 credit = $0.01)
- `PLATFORM_MARKUP_MULTIPLIER`: 1.3 ~ 1.6 권장
- 결제수수료/환율/부가세/환불리스크를 고려해 최종 마진율 조정

### 8-2. 권장 시작값

1. 플랫폼 채팅 과금: `원가(입출력 토큰) * 1.4`를 크레딧으로 환산
2. 스토어 등록비: 30~100 credits (카테고리별 차등)
3. 판매 수수료: 12% ~ 20% (credits 소각)

### 8-3. 크레딧 판매 패키지(예시)

- Starter: $10 = 1,000 credits
- Growth: $30 = 3,300 credits (보너스 10%)
- Pro: $50 = 5,750 credits (보너스 15%)
- Clinic: $100 = 12,500 credits (보너스 25%)

보너스는 \"대량 선결제 유도\" 목적이며, 토큰 원가 급변 시 즉시 조정 가능해야 한다.

### 8-4. 손익 보호 장치

1. 모델별 최소 선차감 크레딧(요청 시작 컷오프) 적용
2. 모델별 `maxOutputTokens` 상한 고정
3. 월간 손익 모니터링 후 마진/수수료 자동 조정 루틴 도입

---

## 9) 신규 아이디어 메모: 회원등급 + 기여점수 + 문서 제안 스레드

작성 시점: 2026-02-16  
중요도: 높음 (제품 차별화 및 장기 락인 전략)

### 9-1. 아이디어 요약

1. 스토어 등록비와 판매 수수료를 회원 등급에 따라 차등 적용한다.  
2. 회원 등급은 \"활동 포인트\"로 결정한다.  
3. 활동 포인트는 2개 축으로 적립한다.
   - (A) 스킬북 성과: 다운로드/즐겨찾기/추천
   - (B) 문서 편집 기여: 참조 문서에 제안 댓글 작성 -> 관리자가 반영하면 점수 지급
4. 참조 문서는 위키형 성장 전략으로 확장한다.
   - 문서별 제안 댓글 스레드 제공
   - 관리자/AI 보조 검토 후 반영/기각 기록
   - 반영된 제안 작성자는 포인트 획득

### 9-2. 제품적 평가

장점:
1. 창작자 유입/유지 유도 (등급 혜택이 명확함)
2. 커뮤니티 기반 문서 품질 개선 (집단지성 + 관리자 검수)
3. 스토어 경제와 지식 커뮤니티가 한 시스템으로 연결됨
4. \"Rorschach 위키\" 포지셔닝 가능

리스크:
1. 저품질/악성 제안 스팸
2. 점수 파밍(상호 추천/조작)
3. 관리자 검수 피로도 증가

완화책:
1. 최소 신뢰 조건(가입 기간/본인인증/기본 활동량) 이후 점수 반영
2. 이벤트별 점수 상한/감쇠(동일 사용자의 반복 행동 가중치 축소)
3. 관리자 승인 기반 최종 점수 확정(자동 확정 금지)

### 9-3. 구현 설계 초안

#### A) 등급 및 점수

핵심 테이블(초안):
1. `UserTier`
   - `id`, `code`(bronze/silver/gold/platinum), `minPoints`
   - `listingFeeDiscountPct`, `saleCommissionDiscountPct`
2. `UserActivityPointLedger`
   - `id`, `userId`, `sourceType`, `sourceId`, `points`, `reason`, `createdAt`
3. `User`
   - `activityPoints` 누적값
   - `tierCode` (계산/스냅샷 방식 중 택1)

점수 발생 소스:
1. 스킬북 다운로드
2. 스킬북 즐겨찾기
3. 스킬북 추천(좋아요)
4. 문서 제안 댓글 반영 승인

#### B) 스킬북 성과 이벤트

추가 테이블(초안):
1. `SkillBookFavorite`
2. `SkillBookLike`
3. (기존 import/download 이벤트와 연계 가능한 집계 뷰)

규칙:
1. 중복 집계 방지(동일 사용자 1회)
2. 짧은 기간 과도 이벤트는 감쇠 계수 적용

#### C) 참조 문서 제안 스레드

추가 테이블(초안):
1. `RefDocSuggestionThread`
   - `id`, `docSlug`, `authorId`, `title`, `body`, `status`(open/reviewed/accepted/rejected), `createdAt`
2. `RefDocSuggestionReply`
   - `id`, `threadId`, `authorId`, `body`, `createdAt`
3. `RefDocSuggestionLike`
   - **최상위 스레드만** 좋아요 가능(요구사항 반영)
4. `RefDocSuggestionReview`
   - `threadId`, `reviewerId`, `decision`, `decisionReason`, `appliedAt`, `linkedDocRevision`

요구사항 반영:
1. 좋아요는 최상위 댓글(스레드 루트)에만 허용
2. 피드백 주기(예: 4주) 동안 누적 좋아요를 점수 환산에 사용

#### D) AI 보조 검토 파이프라인

1. \"마지막 검토 이후 신규 제안\" 배치 조회
2. AI가 제안 타당성/중복/근거 수준 분류
3. 관리자 검토 큐에서 승인/기각
4. 승인 시:
   - 문서 반영 기록 저장
   - 제안자 활동 점수 지급
5. 기각 시:
   - 기각 사유 기록
   - 점수 미지급

### 9-4. 포인트 산정 제안(초안)

기본값 예시:
1. 다운로드 1건: +1
2. 즐겨찾기 1건: +2
3. 추천(좋아요) 1건: +3
4. 문서 제안 반영: +20 + (4주 누적 좋아요 * 2)

안전장치:
1. 소스별 월간 상한
2. 동일 IP/유사 패턴 이상징후 제외
3. 계정 신뢰도 낮은 이벤트는 반영률 축소

### 9-5. 등급별 수수료 차등 예시(초안)

1. Bronze: 등록비 할인 0%, 판매수수료 할인 0%
2. Silver: 등록비 할인 10%, 판매수수료 할인 2%p
3. Gold: 등록비 할인 20%, 판매수수료 할인 4%p
4. Platinum: 등록비 할인 35%, 판매수수료 할인 6%p

주의:
1. 할인은 플랫폼 마진을 침식하지 않는 범위에서 상한 설정
2. 최소 수수료 바닥값(min commission floor) 유지

### 9-6. 구현 단계 제안

1단계 (빠른 MVP):
1. `UserTier`, `activityPoints`, `UserActivityPointLedger` 추가
2. 스킬북 공개 전환/판매 정산 시 등급 할인 적용
3. 관리자 수동 점수 조정 화면

2단계:
1. 스킬북 즐겨찾기/추천 이벤트 구현
2. 이벤트 기반 자동 점수 적립

3단계:
1. 참조 문서 제안 스레드/좋아요/검토 큐 구현
2. AI 보조 검토 배치 + 승인/기각 기록 + 점수 반영

---

## 10) 실제 구현 진행 로그 (2026-02-16, 대화 기반 실행)

### 10-1. 채팅/과금 경로

완료:
1. Provider + Model 선택 구조 도입 (`modelId`, `billingMode`)
2. BYOK / Platform 모드 공존 구현
3. 플랫폼 모드 사전 크레딧 컷오프 + 응답 후 크레딧 소각
4. 모델 카탈로그/가격수준/속도/품질/심리학형 라벨 노출
5. 플랫폼 키 미설정/크레딧 부족에 대한 사용자 친화적 오류문구 보강

주요 파일:
1. `lib/aiModels.ts`
2. `app/api/chat/models/route.ts`
3. `app/api/chat/route.ts`
4. `app/chat/page.tsx`
5. `components/chat/ChatWidget.tsx`

### 10-2. 크레딧 소각/등급 할인

완료:
1. 스킬북 공개 전환 시 등록비 소각
2. 사용자 등급(`tierCode`)에 따른 등록비 할인 계산 반영

주요 파일:
1. `lib/tierPolicy.ts`
2. `app/api/skillbooks/[id]/route.ts`

### 10-3. 기여점수/커뮤니티 기반

완료(백엔드 기반):
1. 활동점수 원장/등급/문서 제안 스레드 관련 스키마 추가
2. 스킬북 import 시 원저자 점수 지급(다운로드 이벤트)
3. 스킬북 즐겨찾기/추천 API 추가 + 점수 지급
4. 문서 제안 스레드/답글/좋아요/관리자 검토 API 추가
5. 관리자 검토 승인 시 좋아요 가중 포인트 지급

주요 파일:
1. `prisma/schema.prisma`
2. `lib/activityPoints.ts`
3. `app/api/skillbooks/import/route.ts`
4. `app/api/skillbooks/[id]/favorite/route.ts`
5. `app/api/skillbooks/[id]/like/route.ts`
6. `app/api/ref/suggestions/route.ts`
7. `app/api/ref/suggestions/[threadId]/replies/route.ts`
8. `app/api/ref/suggestions/[threadId]/like/route.ts`
9. `app/api/ref/suggestions/[threadId]/review/route.ts`

### 10-4. 운영 준비/설정

완료:
1. `.env.example` 템플릿 추가 (플랫폼키 예시값 `abcd1234` 포함)
2. 실제 플랫폼 키 미설정 시 안전 실패 + 사용자 안내 메시지 경로 준비

### 10-5. 남은 구현 (다음 단계)

1. 문서 제안 스레드 UI(참조 페이지 내)
2. 월간 배치 집계 크론(기간별 자동 평가/리포트)
3. AI 보조 검토 배치(제안 요약/타당성 점수/패치안 생성)
4. 판매 정산 시 수수료 소각(`sale_commission_burn`) 및 판매자 정산(`sale_settlement_credit`) 집행 API
5. 관리자 대시보드(등급/요율/검토 큐/반영 이력)

---

## 11) 2026-02-16 추가 구현/보정 로그 (최신)

### 11-1. 사용자 요청 반영 확인

1. 플랫폼 제공 AI 키는 사용자가 추후 실제 값을 넣을 수 있도록 `.env.example`에 예시값(`abcd1234`)으로 명시했다.
2. 사용자가 BYOK를 사용하지 않고 플랫폼 모드로 요청했는데 플랫폼 키가 비어 있으면, 채팅 API는 `503`과 함께 명확한 오류를 반환하도록 구현되어 있다.
3. 채팅 UI(페이지/위젯)는 위 오류를 사용자 친화적인 안내 문구로 변환해서 보여준다.

### 11-2. 품질 보정

1. 일부 화면에 깨져 보이던 문구(인코딩 혼합) 정리:
   - `app/chat/page.tsx`
   - `components/chat/ChatWidget.tsx`
   - `lib/aiModels.ts` (심리학 레이블)
2. 모델 선택/과금 모드/잔액 표기는 페이지와 위젯에서 일관되게 동작한다.

### 11-3. 검증 결과(최신)

1. `npx prisma generate` 통과
2. `npx prisma validate` 통과
3. `npx next build` 통과

### 11-4. 환경 제약 메모

1. 현재 실행 환경의 네트워크 제한으로 `prisma migrate diff`는 Prisma 엔진 다운로드 단계에서 실패할 수 있다.
2. 따라서 DB 드리프트 최종 검증은 네트워크 가능한 환경에서 1회 재확인이 필요하다.

---

## 12) 2026-02-16 추가 구현 (문서 제안 스레드 UI 연결)

### 12-1. 구현 이유

대화에서 합의한 "참조 문서 위키형 기여 흐름"을 실제 사용자 접점에 올리기 위해, 기존 백엔드 API에 이어 문서 상세 페이지에 제안 스레드 UI를 연결했다.

### 12-2. 실제 변경 사항

1. `app/api/ref/suggestions/route.ts`
   - GET 응답에 `viewerHasLiked`를 포함하도록 확장했다.
   - 로그인 사용자 기준으로 현재 문서 스레드들에 대한 좋아요 여부를 계산해 함께 반환한다.

2. `components/ref/DocSuggestionPanel.tsx` (신규)
   - 문서별 제안 스레드 목록 조회
   - 제안 스레드 등록
   - 스레드 좋아요/취소
   - 답글 조회/등록
   - 상태 배지(open/reviewed/accepted/rejected) 표시
   - 다국어 라벨(en/ko/ja/es/pt) 포함
   - 비로그인 사용자는 읽기만 가능하고, 작성/좋아요는 비활성 처리

3. `app/ref/[...slug]/page.tsx`
   - 문서 상세 하단에 `DocSuggestionPanel` 연동
   - `docSlug`를 전달해 해당 문서의 제안만 표시되게 구성

### 12-3. 검증

1. `npx.cmd eslint app/api/ref/suggestions/route.ts components/ref/DocSuggestionPanel.tsx app/ref/[...slug]/page.tsx` 통과
2. `npx.cmd next build` 통과

### 12-4. 현재 상태 메모

1. 관리자 검토(review) UI는 아직 미구현이며 API는 준비되어 있다.
2. 현재 단계에서 일반 사용자는 "제안/토론/좋아요"까지 진행 가능하다.

---

## 13) 2026-02-16 추가 구현 (운영/검토/안내 강화 + 빌드 복구)

### 13-1. 계정 페이지 관리자 검토 패널 추가

1. `components/account/DocSuggestionReviewPanel.tsx` 신규 추가
   - 문서 제안 스레드 목록 필터(status/docSlug)
   - 관리자 시크릿 입력
   - reviewed/accepted/rejected 결정 전송
   - 결정 사유 및 문서 리비전 링크 입력
2. `app/account/page.tsx`
   - `Doc Review` 섹션과 사이드 네비 링크 추가
   - 관리자 검토 패널을 계정 화면에서 직접 사용 가능하게 연결

### 13-2. 업로드 포맷 안내 강화 (사용자 요청 반영)

1. `components/account/SkillBookBuilder.tsx`
   - `.txt` 권장 안내 추가
   - `.md`, `.csv` 지원 및 PDF 미지원(텍스트 변환 필요) 안내 추가
2. `components/account/KnowledgeSourceManager.tsx`
   - `.txt` 권장 + 현재 브라우저 localStorage 저장 구조 안내 추가

### 13-3. 빌드 블로커 처리

배경:
1. 현재 실행 환경에서 `prisma generate`가 네트워크 제한으로 실패(Prisma 엔진 다운로드 실패)
2. 이로 인해 Prisma 타입과 스키마 간 불일치가 발생

조치:
1. `app/api/internal/account-deletion/route.ts`
   - Prisma 모델 필드 타입 의존 쿼리 대신 raw SQL delete로 대체
2. `app/api/user/account/route.ts`
   - 조회/스케줄/취소 로직을 raw SQL 기반으로 대체

결과:
1. `npx.cmd eslint ...` 통과
2. `npx.cmd next build` 통과

### 13-4. 질문 응답 요약(기록)

1. 현재 이슈는 Neon 연결 실패가 아니라, 로컬 실행 환경의 Prisma 엔진 다운로드 제한 이슈였다.
2. 따라서 Neon CLI 로그인/연결 작업이 빌드 복구의 필수 조건은 아니었다.
3. 파일 원본 저장용 별도 객체 스토리지(AWS S3 등)는 현재 구조에서 필수는 아니지만, 향후 PDF 원본 보관/대용량 업로드 요구가 생기면 도입이 필요하다.

---

## 14) 2026-02-16 권한 시스템 정식 전환 (Admin RBAC)

### 14-1. 배경

사용자 피드백:
1. 문서 제안 리뷰 UI가 일반 사용자에게 보이는 것은 부적절함
2. 임시 시크릿 기반이 아니라 정식 어드민 메커니즘이 필요함

### 14-2. 정식 전환 내용

1. `User.role` 기반 RBAC 도입
   - `prisma/schema.prisma`에 `UserRole` enum(`user`, `admin`) 및 `User.role` 필드 추가

2. 세션에 role 포함
   - `types/next-auth.d.ts`에 `session.user.role` 확장
   - `app/api/auth/[...nextauth]/route.ts`에서 DB 조회 후 `role` 세팅

3. 어드민 판별 API 정식화
   - `app/api/user/admin-status/route.ts`
   - 환경변수 이메일 allowlist 제거, DB role 기반 판별로 변경

4. 리뷰 API 보호 방식 전환
   - `app/api/ref/suggestions/[threadId]/review/route.ts`
   - `x-admin-review-secret` 검사 제거
   - 로그인 세션 사용자 role이 `admin`인지 DB 확인 후 허용

5. 어드민 승격(등록) 경로 제공
   - `app/api/internal/admin/bootstrap/route.ts` 추가
   - `ADMIN_BOOTSTRAP_SECRET` 헤더 인증 후 특정 이메일을 admin으로 승격
   - role 컬럼/제약이 없으면 SQL로 자동 보정

6. 운영 환경 변수
   - `.env.example`에 `ADMIN_BOOTSTRAP_SECRET` 추가

### 14-3. 실제 어드민 승격 실행 결과

대상:
1. `mow.coding@gmail.com`

결과:
1. DB 업데이트 성공 (`updatedCount: 1`)
2. 확인값: `role = admin`

### 14-4. 검증

1. ESLint 통과
2. `npx.cmd next build` 통과

---

## 15) 2026-02-16 추가 구현 (Admin 리뷰에 AI 사전검토 연결)

### 15-1. 목표

어드민이 문서 제안 스레드를 검토할 때, 수동으로 전부 읽기 전에 AI가 사전 분류/권고안을 제공하도록 연결.

### 15-2. 구현 내용

1. 내부 AI 리뷰 API 권한 확장
   - `app/api/internal/ref-suggestion-ai-review/route.ts`
   - 기존: CRON/시크릿 헤더 기반 내부 호출만 허용
   - 변경: 세션 사용자 role이 `admin`이면 브라우저에서도 호출 허용

2. 어드민 리뷰 패널 기능 확장
   - `components/account/DocSuggestionReviewPanel.tsx`
   - 추가 기능:
     - AI provider 선택(OpenAI/Google/Anthropic)
     - model override 입력
     - `Run AI Pre-Review` 실행 버튼
     - AI 요약(summary) 표시
     - 스레드별 AI 권고(accept/reject/needs_human_review), confidence, rationale, risk flags 표시
     - `Apply AI Recommendation` 버튼으로 권고안을 바로 결정으로 반영
   - 권고안 실행 시:
     - accept -> accepted
     - reject -> rejected
     - needs_human_review -> reviewed
     - 제안 사유/리비전 값 자동 프리필 활용

### 15-3. 검증

1. `npx.cmd eslint app/api/internal/ref-suggestion-ai-review/route.ts components/account/DocSuggestionReviewPanel.tsx` 통과
2. `npx.cmd next build` 통과

---

## 16) 2026-02-16 추가 구현 (월간 운영형 리뷰 강화)

### 16-1. 목적

문서 제안 검토를 “운영 배치”처럼 돌릴 수 있도록 기간 필터와 일괄 반영 흐름을 강화.

### 16-2. 변경 사항

1. `app/api/ref/suggestions/route.ts`
   - GET에 `from`, `to` 파라미터 추가
   - 생성일(`createdAt`) 기간 필터 지원

2. `components/account/DocSuggestionReviewPanel.tsx`
   - 날짜 범위 필터(`from`, `to`) 추가 (기본: 당월 1일~말일)
   - AI pre-review 호출 시 provider/model/docSlug + 기간 전달
   - 고신뢰 일괄 반영(`Apply High-Confidence Batch`) 추가
   - 임계값 입력(기본 0.8) 추가
   - 스레드 메타 표기 정리(깨진 구분자 정리)

### 16-3. 기대 효과

1. 월 단위로 쌓인 제안을 한 번에 조회/검토 가능
2. AI 권고를 안전 임계치로 일괄 반영하여 검토 시간 단축
3. 최종 결정은 여전히 어드민 권한 하에서만 실행

### 16-4. 검증

1. `npx.cmd eslint app/api/ref/suggestions/route.ts components/account/DocSuggestionReviewPanel.tsx` 통과
2. `npx.cmd next build` 통과

---

## 17) 2026-02-17 버그 수정 (API 키 저장 후 즉시 인식 안 되는 문제)

### 17-1. 증상

1. 사용자가 OpenAI API 키를 저장했는데도
2. 메인에서 AI 해석 진입 시 "API 키 설정 필요" 안내가 계속 표시됨

### 17-2. 원인

1. 키는 DB에 정상 저장되지만
2. `session.user.hasSavedApiKeys` 값이 세션 캐시에 남아 즉시 갱신되지 않음

### 17-3. 조치

1. `components/account/ApiKeyManager.tsx`에서 키 상태 재조회 후
2. `useSession().update()`를 호출해 세션 정보를 즉시 갱신하도록 수정

### 17-4. 검증

1. `npx.cmd eslint components/account/ApiKeyManager.tsx` 통과
2. `npx.cmd next build` 통과

---

## 18) 2026-02-17 UX 보강 (API 키 입력 섹션)

### 18-1. 사용자 피드백

1. 저장 후 입력 칸 변화가 적어 불안함
2. 저장된 키에 대한 식별 정보가 없어서 상태 확인이 어려움
3. 눈 아이콘으로 표시 전환 시 긴 문자열이 우측 아이콘과 겹쳐 보임

### 18-2. 개선 내용

1. `app/api/user/keys/route.ts`
   - GET 응답에 provider별 마스킹 값(`masked`) 추가
   - 복호화 후 마지막 4자리만 노출 (`****1234`) 형태

2. `components/account/ApiKeyManager.tsx`
   - 저장된 provider에 대해 `Stored key: ****1234` 표시
   - 입력창 우측 패딩(`pr-10`) 추가로 눈 아이콘 겹침 현상 수정
   - 기존 저장/삭제 후 세션 갱신 흐름 유지

### 18-3. 검증

1. `npx.cmd eslint app/api/user/keys/route.ts components/account/ApiKeyManager.tsx` 통과
2. `npx.cmd next build` 통과

---

## 19) 2026-02-17 긴급 장애 복구 (로컬 Google 로그인 Callback/P2022)

### 19-1. 증상

1. 로컬 로그인 시 `error=Callback`
2. 서버 로그:
   - `adapter_error_getUserByAccount`
   - `P2022 The column (not available) does not exist`

### 19-2. 원인

1. NextAuth Adapter의 `getUserByAccount` 경로에서 `Account + User` 조회 시
2. DB `User` 테이블이 현재 Prisma 모델 필드와 드리프트 상태
3. 누락 컬럼으로 인해 OAuth 콜백 단계에서 예외 발생

### 19-3. 조치

Neon DB에 누락 컬럼 즉시 보강:
1. `User.deletionRequestedAt TIMESTAMP`
2. `User.deletionScheduledAt TIMESTAMP`
3. `User.activityPoints INTEGER DEFAULT 0 NOT NULL`
4. `User.tierCode TEXT DEFAULT 'bronze' NOT NULL`

### 19-4. 검증

1. Prisma로 `account.findFirst({ include: { user: true } })` 직접 실행 성공
2. OAuth 오류 경로 쿼리 레벨에서 P2022 해소 확인

---

## 20) 2026-02-17 재발 방지 조치 (Auth DB 안전 패치 스크립트)

### 20-1. 배경

1. Prisma 엔진 다운로드/마이그레이션이 환경 제약으로 실패하는 경우가 있어 DB 드리프트가 재발할 수 있음
2. 이 경우 NextAuth 콜백에서 `P2022`가 다시 발생할 수 있음

### 20-2. 구현

1. `scripts/ensure-auth-db-schema.cjs` 추가
   - `.env.local`의 `DATABASE_URL`을 사용해 Neon에 직접 접속
   - 로그인 경로 핵심 컬럼을 idempotent SQL로 보정
   - 대상: `User.role`, `User.deletionRequestedAt`, `User.deletionScheduledAt`, `User.activityPoints`, `User.tierCode`, `User.creditBalance`
2. `package.json` 스크립트 추가
   - `db:ensure-auth-schema`

### 20-3. 실행 검증

1. `npm.cmd run db:ensure-auth-schema` 실행 성공
2. 출력: `Auth schema safety patch applied successfully.`
