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
- **Payments**: Toss payments
- **AI**: Gemini with gemini sdk

## 4. 디자인 가이드(Design Guide)

- **Theme**: Mystical, Vibrant, Fluid (Bright Ivory Base)
- **Colors**: Ivory Background, Light Purple, Soft Pink, Sky Blue (Light Aurora Gradients)
- **Interactions**: 부드러운 스크롤, 호버 시 빛나는 효과, 로딩 시 몽환적인 애니메이션



## 5. 전체 레이아웃 (Global Layout)

### 5.1 전체 레이아웃

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
     - 한 줄 문구(H1): **"어젯밤 꿈, 아직 기억나시나요?"**
     - 상세 소개(Sub-text): **"프로이트부터 신경과학까지, 4가지 전문 관점으로 AI가 당신의 꿈을 분석합니다. 어젯밤 꿈을 적으면, 3분 안에 당신만의 꿈 해석 리포트가 완성됩니다."**
     - CTA 버튼 문구: **"내 꿈 해석 시작하기"** → `/dream-teller` 로 이동
   - **Feature 소개 섹션 (Bento Grid UI)**
     - **Card 1 (Main/Large) - 전문 관점 선택**  
       타이틀: "프로이트, 칼 융, 그리고 신경과학까지"  
       설명: "하나의 꿈, 네 가지 학문적 렌즈. 원하는 전문 관점을 선택해 나만의 꿈 해석을 받아보세요."
     - **Card 2 - AI 심층 분석**  
       타이틀: "키워드 검색은 그만, AI 심층 해석"  
       설명: "꿈 속 상징, 감정, 서사 구조를 AI가 종합적으로 분석하여 당신만의 해석 리포트를 생성합니다."
     - **Card 3 - AI 꿈 시각화**  
       타이틀: "꿈을 다시 눈앞에"  
       설명: "AI가 당신의 꿈 속 장면을 한 장의 이미지로 그려드립니다. 흐릿한 기억이 선명한 그림이 됩니다."
     - **Card 4 - 기록 & 공유**  
       타이틀: "나만의 꿈 아카이브"  
       설명: "캘린더에 기록되는 꿈 해석 히스토리. 결과를 친구와 공유하고, 나의 무의식 패턴을 발견하세요."
   - 이전 유저들의 꿈 해몽 텍스트 및 AI 이미지 예시 리스트 (더보기 → 예시 리스트 피드)

2. **프로덕트 상세 페이지 (`/dream-teller`)**
   - **단계별 입력 프로세스 (Accordion UX)**
     1. 전문 분야 선택  
     2. 꿈 내용 입력 (최소 20자)  
     3. 결제 옵션 선택 및 금액 확인
   - 자동 스크롤: `다음 단계` 버튼 클릭 시 자동 스크롤
   - 구매 옵션: 텍스트 해석 1,500원 / 이미지 추가 +500원 (기본 활성화)
   - 주의: 3분 이내 생성, 의료 진단 아님
   - 모바일: 하단 Sticky 버튼

3. **결제 페이지 (`/payments`)**
   - 토스페이먼츠 위젯, 회원/비회원 모두 지원
   - 결제 실패 시 입력된 꿈 내용 유지
   - 안정성: React 18 Strict Mode에서 위젯 초기화·클린업 로직 적용

4. **해석 확인 페이지 (`/dream-result/[order-id]`)**
   - 디자인: Ivory 베이스, 오로라 그라데이션, 부드러운 애니메이션
   - 섹션: 꿈 입력 인용구, AI 생성 이미지, 심층 해몽 리포트
   - 기능: 링크 복사, 카카오톡 공유, 공개 여부 토글
   - 보안: Server Component + `createServiceRoleClient` + RLS + 소유자 매칭
   - 회원 전용: 무의식 캘린더 하이라이트

5. **유저 마이페이지 (`/my-page`)**
   - 캘린더 날짜 하이라이트 → 결과 페이지 이동
   - 구매 내역 리스트 → 결과 페이지 이동
   - 닉네임 수정, 소셜 로그인 표시, 로그아웃

6. **비회원 로그인 (`/guest-login`)**
   - 전화번호·비밀번호 입력, 주문 조회 버튼

7. **비회원 주문 조회 (`/guest-check`)**
   - 리스트 → 결과 페이지, 데이터 안정성 (Array/Object 분기)

8. **피드 페이지 (`/feeds`)**
   - 페이스북형 타임라인, faker‑js 더미 데이터, 무한 스크롤

9. **회원 로그인 (`/auth`)**
   - 구글·카카오 소셜 로그인, 성공 시 `/dream-teller` 이동

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
- `GET /api/auth/callback`
  - 설명: 소셜 로그인 최종 승인 후 전달된 인증 코드를 확인하여 세션을 확정하고, 성공 시 지정된 페이지(`/dream-teller`)로 리다이렉트합니다.
- `POST /api/auth/logout`
  - 설명: 현재 활성화된 사용자의 세션을 종료하고 로그아웃 처리합니다.
- `POST /api/auth/guest`
  - 설명: 전화번호와 비밀번호를 전달받아 비회원용 세션 토큰을 발급합니다.
  - 반환값: 비회원 인증 토큰.

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
- `POST /api/payments/confirm`
  - 설명: 토스페이먼츠 결제 승인 API를 호출하여 최종 결제 완료 처리를 수행합니다.
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