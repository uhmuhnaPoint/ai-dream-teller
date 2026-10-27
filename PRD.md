# Product Requirements Document(PRD)

## 1. 프로젝트 개요 (Project Overview)

- **프로젝트 명**: AI DREAM TELLER (AI 꿈 해몽 서비스)
- **목표**: 사용자가 입력한 꿈 내용을 AI가 분석하여 심층적인 해몽과 조언을 제공하는 수익형 웹 서비스
- **핵심 가치 1**: 신비롭고 직관적인 UI 경험과 정확도 높은 AI 분석을 통해서 사용자에게 인사이트와 재미 제공.
- **핵심 가치 2**: 프로이트, 칼 융, 신경과학, 게슈탈트 등 해몽을 맡기고 싶은 전문 분야를 선택해서 해몽 요청 가능.

## 2. 타겟 유저(Target Audience)

- 꿈의 의미를 검색해보는 습관이 있는 20-40대 남녀.
- 모바일 환경에서 간편하게 결과를 확인하고 공유하고 싶어하는 유저.

## 3. 기술 스택(Tech Stack)

- **Web Framework**: Next.js 16.1.6(App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend & DB**: Next.js API Routes, Supabase
- **Auth & Session**: Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js` 기반 쿠키 세션, Google·Kakao 공식 디자인 규격 소셜 로그인 및 개발/프로덕트 동적 도메인 자동 라우팅)
- **Payments**: Toss payments (최신 v2 `@tosspayments/tosspayments-sdk` 주문서형 결제위젯)
- **Data Mocking**: `@faker-js/faker` (`urlPicsumPhotos` 기반 고화질 꿈 시각화 연동)
- **AI**: Gemini with gemini sdk

## 4. 디자인 가이드(Design Guide)

- **Theme**: Mystical Archive & Pensieve (Bright Ivory Base & Ethereal Magical Aura)
  - 해리포터풍의 신비로운 마법 서재(Grand Archive) 및 기억/꿈의 실타래를 들여다보는 펜시브(Pensieve) 메타포 적용
  - 어둡고 무거운 고딕이 아닌, **'밝은 아이보리 양피지 캔버스'** 위에 별빛 오로라가 일렁이는 지적이고 신비로운 분위기
- **Colors**:
  - Base: Warm Ivory Canvas (`#FAF8F5`, `#FDFBF7`)
  - Accent / Gradients: Moonlight Lavender (`#E8E0F8`), Ethereal Aurora (Soft Pink `#FCE7F3`, Sky Blue `#E0F2FE`), Starlight Gold/Amber Point (`#D4AF37`)
  - Text: Deep Charcoal Violet (`#1E1B2E`) & Muted Plum (`#4B4562`)
- **Interactions & Atmosphere**:
  - 부드러운 스크롤 애니메이션 및 카드 호버 시 별빛/오로라 발광(Luminescent Glow) 효과
  - 마법 인장(Wax Seal) 모양의 디테일 뱃지 및 로딩 시 펜시브 안에서 은빛 실타래가 모여드는 몽환적인 파동 애니메이션
  - 직관적이고 세련된 현대적 UI 위에 클래식한 마법 서재 감성을 조화롭게 융합



## 5. 프론트엔드 요구사항 (Frontend Requirements)

### 5.1 전체 레이아웃 (Global Layout)

1. **상단 네비게이션 바 (Header)** 
   - (공통) 홈 로고
   - (비회원) 로그인, 비회원 주문 조회
   - (회원) 마이페이지
   - (반응형) 모바일 환경(md 미만)에서는 우측 상단 햄버거 메뉴 아이콘 제공. 클릭 시 위에서 아래로(Top) 내려오는 풀 너비(Full-width) Drawer를 통해 메뉴 노출 가능.

2. **Body**
   - 각 페이지 별 주요 내용 렌더링

3. **Footer**
   - 사업자 정보(상호명, 대표자, 사업자번호, 주소 등), 이용약관 링크, 개인정보처리 방침 링크, 문의하기 링크 포함
   - 모든 페이지 하단에 고정 노출되는 글로벌 레이아웃 구조 적용

4. **Head & Meta**
   - SEO, Open Graph, GA4 등 Analytics 설정

### 5.2 유저 UX 페이지 구성 (User UX Pages)

1. **메인 랜딩페이지 (`/`)**
   - **Hero 섹션**
     - **한 줄 문구(H1)**: **"어젯밤 당신의 무의식이 보낸 비밀 신호, 흩어지기 전에 지금 해독하세요"**
       - *(서브 타이틀/배경 의도: 기상 직후 10분 내 90% 망각되는 꿈의 특성을 자극해 '지금 바로 풀어봐야 한다'는 긴박감과 호기심 유발)*
     - **상세 소개(Sub-text)**: **"단순한 미신이나 운세가 아닙니다. 프로이트·칼 융의 심층 심리학부터 현대 뇌인지과학까지, 당신의 무의식이 남긴 상징과 감정을 입체적으로 분석합니다. 흐릿했던 꿈의 기억을 단 3분 만에 선명한 마법 같은 아트워크와 심층 리포트로 마주하세요."**
     - **CTA 버튼 문구**: **"내 꿈의 암호 해독하기 ✨"** → `/dream-teller` 로 즉시 이동
       - *(버튼 마이크로카피: "평균 3분 소요 · 4가지 심층 분석 학파 지원 · 1,500원의 지적 통찰")*
       - *(버튼 인터랙션: 커서 호버 시 은은한 오로라 광채와 미세 별빛 입자 파동)*
     - **신뢰도 배지(Trust Badges)**: "무의식 심리학 기반" · "100% 개인정보 비밀 보장" · "누적 12,000+건 꿈 해독 완료"
   - **Feature 소개 섹션 (Bento Grid UI - '신비로운 꿈의 대도서관')**
     - **Card 1 (Main/Large - 2x1) - 무의식의 4대 렌즈 (The Quad-Lens Analysis)**  
       - *뱃지*: `학문적 엄밀함`  
       - *타이틀*: **"사주나 미신이 아닌, 4가지 학문적 렌즈로 투영하는 꿈의 본질"**  
       - *설명*: "하나의 꿈도 관점에 따라 전혀 다른 비밀을 품고 있습니다. 프로이트의 무의식적 욕망, 칼 융의 원형과 상징, 현대 신경과학의 뇌기억 통합, 게슈탈트의 내면 자아 대화 중 원하는 렌즈를 선택해 깊이 있는 통찰을 얻으세요."  
       - *비주얼*: 4가지 마법 고서 엠블럼과 렌즈 프리즘 인터랙션
     - **Card 2 (Highlight - 1x1) - 펜시브의 재현: 꿈의 시각화 (AI Dream Canvas)**  
       - *뱃지*: `기억의 실체화`  
       - *타이틀*: **"말로는 다 설명 못 할 그 장면, 눈앞의 예술로 복원하다"**  
       - *설명*: "깨어나는 순간 흩어지는 꿈속의 몽환적인 색채와 질감을 최첨단 생성 AI가 한 폭의 마법 같은 일러스트로 영구 보존해 드립니다. (+500원 옵션으로 평생 소장 아트워크 획득)"  
       - *비주얼*: 안개 속에서 선명한 오로라 빛 유화로 변화하는 모핑 프리뷰
        - *인터랙션*: 카드 클릭 시 **'해석 확인 리포트(DreamResultModal)'** 팝업 오버레이 즉시 오픈. 상단 뷰 모드 시뮬레이터를 통해 회원 뷰(캘린더 포함)와 타인 뷰(캘린더 숨김 + 전환 CTA)를 직접 체험 가능.
     - **Card 3 (Speed & Insight - 1x1) - 3분의 비밀 해독 (Rapid Insight Report)**  
       - *뱃지*: `즉각적인 해답`  
       - *타이틀*: **"단 3분 만에 펼쳐지는 나만의 맞춤형 심층 해석서"**  
       - *설명*: "키워드 몇 줄의 뻔한 해몽이 아닙니다. 꿈속 등장인물, 상징물, 감정의 층위를 정밀 분해하여 현재 나의 심리 상태와 현실의 방향성을 짚어주는 맞춤 리포트를 완성합니다."  
       - *비주얼*: 붉은 인장(Seal)이 찍힌 마법 양피지 형태의 리포트 인포그래픽
     - **Card 4 (Persistence & Social - 2x1) - 밤의 비밀 서재 (The Dream Archive & Feed)**  
       - *뱃지*: `기록과 연결`  
       - *타이틀*: **"잊혀지던 꿈들이 모여 내면의 지도가 되는 비밀 서재"**  
       - *설명*: "캘린더에 차곡차곡 쌓이는 무의식의 궤적을 통해 반복되는 감정 패턴을 발견하세요. 익명 피드를 통해 나와 비슷한 꿈을 꾼 다른 이들의 신비로운 기록을 엿볼 수도 있습니다."  
       - *비주얼*: 별자리처럼 연결되는 꿈 캘린더 타임라인과 신비로운 익명 피드 카드
   - 이전 유저들의 꿈 해몽 텍스트 및 AI 이미지 예시 리스트 (더보기 → 예시 리스트 피드)

2. **프로덕트 상세 페이지 (`/dream-teller`)** (구현완료) [x]
   - **단계별 입력 프로세스 (Accordion UX)**
     1. 전문 분야 선택 (칼 융, 프로이트, 신경과학, 게슈탈트 4대 학파)
     2. 꿈 내용 입력 (최소 20자, 실시간 게이지 및 작성 팁 칩, 예시 꿈 불러오기)  
     3. 결제 옵션 선택 및 금액 확인
     4. **비회원 주문자 정보 입력 (회원/비회원 조건부 노출)**:
        - **로그인 유저**: 4섹션 자동 은닉 (3단계에서 최종 결제 바로 진행)
        - **비회원 유저**: 휴대폰 번호(010 자동 포맷팅)와 비밀번호(4자리 이상) 입력 섹션 활성화 및 주문 제출
        - **Dev Tools 시뮬레이터**: 상단에 회원 모드(4섹션 숨김) / 비회원 모드(4섹션 노출) 원클릭 테스트 스위처 탑재
   - 자동 스크롤: `다음 단계` 버튼 클릭 시 다음 아코디언 헤더로 부드러운 자동 스크롤
   - 구매 옵션: 텍스트 해석 1,500원 / 이미지 추가 +500원 (기본 활성화, 89% 선택 소셜 프루프 뱃지)
   - 데이터 보존: `sessionStorage` 기반 작성 데이터 실시간 백업 및 새로고침 복원
   - 주의 및 전환: 3분 이내 생성, 의료 진단 아님 고지, 하단 전환 보조 FAQ 아코디언
   - 모바일: 화면 하단 고정 Sticky 액션 바 (회원/비회원 단계 동적 대응, 실시간 합계 금액 및 즉시 이동 지원)

3. **결제 페이지 (`/payments`)** (구현완료) [x]
   - 토스페이먼츠 위젯, 회원/비회원(`ANONYMOUS`) 모두 지원
   - 결제 실패 시 입력된 꿈 내용 유지 (`/payments/fail`에서 꿈 내용 안전 보존 안내 및 재시도 지원)
   - 결제 승인 완료 페이지 (`/payments/success`) 구축: 승인 API 호출 및 대기방 연동
   - 안정성: React 18/19 Strict Mode에서 위젯 중복 마운트 방지 및 클린업 로직 적용

4. **해석 확인 페이지 (`/dream-result/[order-id]`)** (구현완료) [x]
   - 디자인: Ivory 베이스, 오로라 그라데이션, 부드러운 애니메이션, Wax Seal 인장 뱃지
   - 섹션: 꿈 원문 인용구 카드, AI 생성 고화질 이미지 프리뷰, 4대 관점 심층 해몽 리포트(3대 상징 분해, 심리 진단, 행동 처방, 성장을 위한 질문)
   - 기능: 원클릭 링크 복사(토스트 피드백), 카카오톡 공유, 소유자 전용 피드 공개/비공개 토글
   - 보안 & 접근 권한: Server Component + `createServiceRoleClient` + RLS + 소유자 매칭
   - **회원 전용 무의식 캘린더 분기**:
     - 로그인한 회원 본인의 해석 확인 페이지: 당월 날짜별 꿈 기록 하이라이트 캘린더(`DreamCalendar`) 노출
     - 타인 공유 링크 접속자: 무의식 캘린더가 완전히 은닉되며, 대신 "나도 내 꿈의 암호 해독하기" 전환 유도 CTA 배너 노출
     - 개발/테스트 편의를 위한 뷰 모드 시뮬레이터(회원 본인 뷰 vs 타인 공유 뷰) 스위치 제공
   - 스트리밍: Next.js 16 Partial Prefetching 프리렌더링 지원 <Suspense> 스트리밍 적용
    - **모달 팝업 연동**: 메인 Bento Grid Card 2 및 '최근 해몽된 꿈' 리스트에서 전체 화면 모달(DreamResultModal)로 즉시 열람 및 캘린더 시뮬레이션 지원

5. **유저 마이페이지 (`/my-page`)** (구현완료) [x]
   - **무의식 캘린더 (`MyDreamCalendar`)**: 당월(10월) 날짜별 꿈 기록 별빛 인장 하이라이트 및 날짜 선택 시 스니펫 확인 → 심층 해석 리포트 결과 페이지(`/dream-result/[order-id]`)로 즉시 이동
   - **구매 내역 리스트 (`OrderHistoryList`)**: 주문 번호, 일시, 학파 뱃지, 꿈 요약, AI 일러스트 썸네일, 결제 금액 카드 리스트 → 해석 결과서 보기 클릭 시 결과 페이지(`/dream-result/[order-id]`) 이동 및 링크 복사
   - **프로필 & 계정 관리 (`UserProfileHeader`)**: 닉네임 인라인 실시간 수정 기능, 소셜 로그인(카카오/Google) 공식 연동 뱃지 표시, Supabase `signOut` 연동 로그아웃, 3대 활동 지표 통계 요약 카드
   - **인증 분기 처리**: 비로그인 접속 시 친절한 로그인 유도 카드 및 1초 체험 모드 둘러보기 지원

6. **비회원 로그인 (`/guest-login`)** (구현완료) [x]
   - 전화번호(010 자동 하이픈 포맷팅) 및 주문 비밀번호(마스킹/토글) 입력 폼
   - 유효성 검사 및 `POST /api/auth/guest` 인증 토큰/세션 발급
   - 원클릭 테스트용 데모 정보 자동 입력 칩 지원 (010-1234-5678 / 1234)
   - 주문 조회 버튼 클릭 시 인증 완료 후 `/guest-check` (비회원 주문 조회)로 자동 라우팅

7. **비회원 주문 조회 (`/guest-check`)** (구현완료) [x]
   - 비회원 세션 검증 (미인증 시 `/guest-login` 안내 카드 노출)
   - 주문 리스트 → 심층 해석 리포트 결과 페이지(`/dream-result/[order-id]`) 원클릭 이동
   - 데이터 안정성 강화: 주문 응답 데이터의 Array/Object 형태 분기 및 안전 매핑
   - **회원 전환 유도 섹션**: 하단에 평생 보관 무의식 서재(캘린더·아트워크 갤러리) 안내 카드 추가 및 회원 로그인(`/auth`) 버튼 연동
   - 비회원 조회 종료(세션 클리어) 및 새 꿈 의뢰 바로가기 지원

8. **피드 페이지 (`/feeds`)** (구현완료) [x]
   - **페이스북 UI 기반 타임라인**: 프로필 아바타, 닉네임, 작성 시점, 본문 더보기/접기, 양피지 AI 리포트 요약 박스, 4종 리액션 스택 및 반응 피커(🔮, 🫂, 💡, 🌙), 인라인 댓글 열람/작성, 공유
   - **상단 전환 배너**: 페이스북 작성창 메타포 기반 해몽 의뢰 전환 유도 배너(`FeedComposerBanner`)
   - **더미데이터 & 비주얼**: 4대 학파별 고증된 현실적 꿈 서사 풀 및 `faker.image.urlPicsumPhotos` 연동 AI 아트워크 (`next.config.ts` 원격 도메인 허용)
   - **필터링 & 무한 스크롤**: 4대 학파/아트워크 전용 필터 탭 및 `IntersectionObserver` 기반 자동 추가 로드 (Load More 버튼 병행)

9. **회원 로그인 (`/auth`)** (구현완료) [x]
   - 구글·카카오 소셜 로그인, 성공 시 `/dream-teller` (프로덕트 상세 페이지) 자동 이동
   - **공식 디자인 규격 준수**:
     - 카카오 공식 로그인 버튼 (Background: `#FEE500`, Symbol: 카카오 말풍선 공식 SVG, Label: "카카오 로그인")
     - Google 공식 로그인 버튼 (Background: White, Border: `#DADCE0`, Symbol: Google 4색 'G' 공식 SVG, Label: "Google 계정으로 로그인")
   - **동적 도메인 분기 라우팅**:
     - 개발 환경(`http://localhost:3000`) 및 프로덕트 환경(`https://ai-dream-teller-cyan.vercel.app`)을 브라우저/서버 환경별로 자동 감지하여 OAuth Callback URL 매핑
   - **콜백 라우트 핸들러 (`/auth/callback`)**: Supabase Code 교환 및 세션 수립 후 `next` 파라미터 대상 경로로 303 Redirect
   - **편의 기능**: 1초 체험 계정 빠른 입장 지원, 비회원 작성 바로가기, 개인정보 100% 비밀보장 뱃지


10. **텔레그램 알림**
    - 결제·AI 해몽 완료 알림 (성공/실패)

### 5.3 관리자 UX 페이지 구성 (Admin UX Pages)

0. **공통 레이아웃**
   - 좌측 네비게이션: 매출 조회, 주문 리스트

1. **관리자 메인 (`/admin`)**
   - 매출 대시보드, 핵심 지표 카드, 8개월 차트, Shadcn/UI Card, Lucide 아이콘, 반응형 Drawer

2. **주문 리스트 (`/admin/order-list`)**
   - 주문 ID, 일시, 닉네임, 구분, 분야, 금액, 상태 배지, 실시간 필터링

3. **주문 상세 (`/admin/order-list/[order-id]`)**
   - 구매자 정보, 결제 정보, 입력 꿈 텍스트, 선택 관점, AI 해몽 리포트·이미지, 재생성 트리거 버튼

4. **유저 리스트 (`/admin/user-list`)**

## 6. 백엔드 요구사항 및 API 구조 (Backend Requirements & API Structure)

프론트엔드와 독립적으로 기능할 수 있도록 RESTful하고 직관적인 API 구조로 Next.js Route Handlers(API Routes)를 설계합니다.

### 6.1 인증 및 권한 (Auth)

- `POST /api/auth/login`
  - 설명: 소셜 로그인(Google, Kakao) 인증을 위해 Supabase Auth 인스턴스를 통해 각 제공업체의 권한 승인 페이지로 리다이렉트합니다.
- `GET /auth/callback` (구현완료) [x]
  - 설명: 소셜 로그인 최종 승인 후 Supabase에서 반환된 인증 코드(`code`)를 세션으로 교환하고, 개발(localhost) 및 프로덕션(Vercel) 환경에 맞는 도메인을 자동 감지하여 지정된 목적지(`/dream-teller` 등)로 303 리다이렉트합니다.
- `POST /api/auth/logout`
  - 설명: 현재 활성화된 사용자의 세션을 종료하고 로그아웃 처리합니다.
- `POST /api/auth/guest` (구현완료) [x]
  - 설명: 전화번호와 비밀번호를 전달받아 유효성을 검증하고 비회원용 세션 토큰 및 쿠키를 발급합니다.
  - 반환값: 비회원 인증 토큰 및 게스트 유저 프로필 객체.

### 6.2 사용자 (Users)

- `GET /api/users/me`
  - 설명: 현재 로그인한 회원/비회원의 프로필 및 기본 정보를 반환합니다.
- `PATCH /api/users/me`
  - 설명: 사용자의 프로필 정보(예: 닉네임)를 수정합니다.

### 6.3 주문 및 결제 (Orders & Payments)

- `GET /api/orders`
  - 설명: 현재 로그인한 사용자의 구매 이력 리스트를 반환합니다. (마이페이지 용도)
- `POST /api/orders`
  - 설명: 꿈 입력 데이터와 선택된 옵션, 전문 분야 등을 기반으로 주문서(Pending Order)를 생성합니다.
  - **비회원 처리**: 비회원 주문 시 `phone_number`와 `guest_password`를 전달받아 `users` 테이블에 guest 레코드를 생성하거나 기존 정보를 연동합니다.
  - **금액 검증**: 클라이언트에서 전달된 `total_amount`가 서버의 옵션 가격 정책과 일치하는지 반드시 검증하여 위변조를 차단합니다.
- `GET /api/orders/[id]`
  - 설명: 개별 주문에 대한 구매 정보 및 (생성 완료된) 꿈 해몽 결과를 반환합니다.
  - **권한 검증**: 요청자의 세션(회원/비회원)이 해당 주문의 소유주인지 확인하는 로직을 포함합니다.
- `GET /api/orders/guest`
  - 설명: 발급받은 비회원 세션을 인증하여 해당 비회원의 주문 내역 리스트를 반환합니다.
- `POST /api/payments/confirm` (구현완료) [x]
  - 설명: 토스페이먼츠 결제 승인 API를 호출하여 최종 결제 완료 처리를 수행합니다.
  - **승인 처리**: 클라이언트로부터 `paymentKey`, `orderId`, `amount`를 전달받아 `TOSS_SECRET_KEY` 기반 Basic Auth로 토스페이먼츠 승인 엔드포인트(`https://api.tosspayments.com/v1/payments/confirm`)를 호출합니다.
  - **후속 처리**: 결제 성공 시 주문 상태를 `paid`로 변경하고, **텔레그램 알림 발송 (상품, 유저아이디, 결제금액, 꿈내용 일부)**을 진행합니다. 직후 AI 해몽 생성 API(`api/ai/generate`)를 비동기 호출합니다.
- `POST /api/payments/fail`
  - 설명: 결제 과정에서 발생한 실패 정보를 기록하고 해당 주문서의 상태를 `failed`로 업데이트합니다.
  - **후속 처리**: 실패 내역(에러 메시지 등)을 포함하여 관리자에게 **텔레그램 실패 알림 발송**을 진행합니다.
- `POST /api/payments/cancel`
  - 설명: 결제 취소 및 환불 요청을 처리합니다. (AI 생성 전 단계 혹은 시스템 장애 시 사용)
- `POST /api/payments/webhook`
  - 설명: 토스페이먼츠로부터 결제 상태 변경 알림(가상계좌 입금 완료 등)을 수신하여 처리합니다.
- `POST /actions/dream-result (toggleDreamPublicAction)`
  - 설명: 생성된 개별 꿈 결과의 피드 공개 여부를 전환하는 Next.js Server Action
  - **보안 처리**: 비회원의 경우 JWT 토큰(`auth.getUser()`)이 없으므로, HttpOnly 쿠키의 `guest_session` 값을 추출한 뒤 Service Role 클라이언트를 활용해 DB 내부의 소유권을 매칭 및 대조하여 타인의 결과물을 변조할 수 없도록 강제 격리 검증을 수반함.

### 6.4 피드 (Feeds)

- `GET /api/feeds`
  - 설명: 사용자에게 노출할 이전 유저들의 공개 해몽 결과 목록을 페이지네이션과 함께 반환합니다. (메인 페이지, `/feeds` 용도)

### 6.5 AI 처리 (AI Processing)

- `POST /api/ai/generate`
  - 설명: 결제가 완료된 주문의 상품(Product) 정보를 확인하여, 순수 텍스트 해몽인지 이미지 생성이 함께 포함된 해몽 상품인지 판별하고 AI 파이프라인을 분기 처리합니다.
  - **텍스트 생성 (Gemini API)**: 결제가 확인된 모든 꿈 텍스트를 바탕으로 AI 모델(Gemini)에 해몽 분석 프롬프트를 전송하여 장문의 해석 결과를 생성합니다.
  - **이미지 생성 (Image Generation API)**: 결제된 내역이 '해몽 텍스트 + AI 이미지 생성'이 포함된 상품인 경우에 한하여 호출됩니다. 일부분석된 텍스트 결과(혹은 꿈 원문)를 토대로 영어 프롬프트를 번역 및 재가공하고, 이미지 생성 API 모델을 호출하여 이미지를 얻습니다. 생성된 이미지는 Supabase Storage 등에 비동기적으로 업로드하여 Public URL 형식으로 변환한 뒤 DB에 저장합니다.
  - **후속 처리**: 텍스트 분석, 이미지 생성 및 DB 저장이 모두 정상적으로 끝났을 때(혹은 생성 과정 중 어디선가 에러로 실패했을 때) 최종 상태 정보와 내역을 **텔레그램 봇을 통해 관리자에게 알림 발송(Success / Fail 단계 명시)**합니다.

### 6.6 관리자 (Admin)

- **기술적 특이사항 (중요)**
  - **Server Actions 전환**: 클라이언트 사이드 `fetch` 시 발생하는 Next.js 미들웨어의 401/403 인증 이슈를 해결하기 위해 모든 관리자 데이터 조회 로직을 `src/app/actions/admin.ts`의 Server Actions로 전환하여 구현함.
  - **데이터 조인 최적화**: `orders`와 `dream_results` 간의 1:1 관계(UNIQUE FK)에 따른 PostgREST의 단일 객체 반환 특성을 고려하여 프런트엔드 데이터 바인딩 로직을 안정화함.

- `GET /api/admin/metrics` (구현완료 - Server Action `getAdminMetrics` 병행 가능) [x]
  - 설명: 관리자 대시보드용으로 기간별 매출과 주문 통계 데이터를 반환합니다.
- `GET /api/admin/orders` (구현완료 - Server Action `getAdminOrders`) [x]
  - 설명: 시스템 전체의 주문 발생 내역 리스트를 페이지네이션 및 필터와 함께 반환합니다. `dream_results`의 생성 상태(`analysis_status`)를 포함합니다.
- `GET /api/admin/orders/[id]` (구현완료 - Server Action `getAdminOrderDetail`) [x]
  - 설명: 상세 주문 내역에서 원본 꿈 텍스트, 사용자 정보, 결제 상태 및 해몽 결과를 반환합니다. `dream_results`는 단일 객체 형태로 매핑됩니다.
- `POST /api/admin/orders/[id]/regenerate` (구현완료) [x]
  - 설명: 결과물 품질 이슈 등을 이유로 LLM 해몽 재생성을 트리거합니다. 관리자 전용 권한 확인 후 AI 파이프라인을 재가동합니다.
- `GET /api/admin/users` (구현완료 - Server Action `getAdminUsers`) [x]
  - 설명: 회원 가입 유저와 비회원 유저 리스트를 조회하고, 각 유저별 누적 주문 및 결제 건수를 합산하여 반환합니다. `phone_number` 필드를 식별자로 사용합니다.

## 7. 데이터베이스 스키마 (Database Schema)

Supabase PostgreSQL 환경을 기준으로 구성하되, 인증 테이블(`auth.users`)과 연결되는 어플리케이션 전용 Public 테이블을 정의합니다. MECE 원칙에 따라 명확히 역할을 분리했습니다.

### 7.1 Users (`users`)

회원(소셜)과 비회원의 정보를 통합 관리하는 테이블입니다.

- **`id`** (UUID, Primary Key, **Not Null**): 고유 식별자 (Supabase `auth.users`의 PK와 1:1 매핑)
- **`role`** (String, **Not Null**): 사용자 역할 (`member`, `guest`, `admin`)
- **`provider`** (String, **Not Null**): 가입 경로 (`google`, `kakao`, `guest`)
- **`email`** (String, Null): 회원 이메일 (소셜 로그인 회원용)
- **`nickname`** (String, Null): 사용자 닉네임
- **`phone_number`** (String, Null): 비회원 식별 및 주문 조회용 전화번호
- **`guest_password_hash`** (String, Null): 비회원용 암호화된 비밀번호
- **`created_at`** (Timestamp, **Not Null**): 계정 생성 일시
- **`updated_at`** (Timestamp, **Not Null**): 정보 최종 수정 일시

### 7.2 Orders (`orders`)

사용자의 꿈 분석 요청 및 토스페이먼츠 결제 내역을 매핑하는 테이블입니다.

- **`id`** (UUID, Primary Key, **Not Null**): 내부 시스템의 고유 주문 식별자
- **`order_number`** (String, Unique, **Not Null**): 토스페이먼츠의 `orderId`로 사용될 고유 주문 번호
- **`user_id`** (UUID, Foreign Key, **Not Null**): 결제를 진행한 `users.id` 참조
- **`total_amount`** (Integer, **Not Null**): 총 결제 금액
- **`payment_status`** (String, **Not Null**): 결제 상태 (`pending`, `paid`, `failed`, `refunded`, `canceled`)
- **`payment_key`** (String, Null): 토스페이먼츠 승인 키 (결제 성공 시 저장)
- **`approved_at`** (Timestamp, Null): 토스페이먼츠 결제 승인 시각
- **`error_message`** (Text, Null): 결제 실패/에러 시 사유 메시지
- **`dream_content`** (Text, **Not Null**): 유저가 직접 입력한 원본 꿈 내용
- **`expert_field`** (String, **Not Null**): 선택한 해몽 전문 분야 (`freud`, `jung`, `neuroscience`, `gestalt` 등)
- **`includes_image`** (Boolean, **Not Null**): AI 이미지 생성 옵션 구매 여부
- **`created_at`** (Timestamp, **Not Null**): 주문서 생성 일시
- **`updated_at`** (Timestamp, **Not Null**): 결제 및 상태 업데이트 일시

### 7.3 Dream Results (`dream_results`)

결제 완료 후 생성되는 AI 해몽 결과물과 이미지 URL, 피드 공개 여부를 담당하는 테이블입니다.

- **`id`** (UUID, Primary Key, **Not Null**): 고유 식별자
- **`order_id`** (UUID, Foreign Key / Unique, **Not Null**): 매칭되는 `orders.id` 참조 (1:1 관계)
- **`analysis_status`** (String, **Not Null**): 해몽 진행 상태 (`processing`, `completed`, `failed`)
- **`analysis_text`** (Text, Null): AI(Gemini)가 생성해낸 심층 해몽 텍스트
- **`image_url`** (String, Null): AI(Gemini)가 묘사해준 꿈 이미지 URL (옵션 미구매 시 Null)
- **`is_public`** (Boolean, **Not Null**): Feed 페이지 공유 노출 여부 (`true` or `false`)
- **`created_at`** (Timestamp, **Not Null**): 해몽 작업 최초 생성 일시
- **`updated_at`** (Timestamp, **Not Null**): 해몽 결과 또는 노출 여부 수정(Update) 통제용 일시