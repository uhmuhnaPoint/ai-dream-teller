import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { GuestLoginForm } from '@/components/auth/guest-login-form';

export const metadata: Metadata = {
  title: '비회원 주문 조회 | AI 드림 텔러',
  description: '회원가입 없이 결제한 꿈 해석 주문을 전화번호와 비밀번호로 간편하게 조회하세요.',
};

/**
 * 비회원 로그인 및 주문 조회 페이지 (/guest-login)
 * 요구사항 준수:
 * - 전화번호·비밀번호 입력 폼
 * - 주문 조회 버튼 클릭 시 인증 후 결과/조회 페이지로 라우팅
 * - Next.js 16 Partial Prefetching 대응 Suspense Boundary 적용
 */
const GuestLoginPage = () => {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1E1B2E] relative flex flex-col justify-between py-8 px-4 sm:px-6 overflow-hidden selection:bg-[#E8E0F8] selection:text-[#6B46C1]">
      {/* 배경 신비로운 오로라 그라데이션 글로우 */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E8E0F8]/60 to-[#F5E6CC]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#D4AF37]/15 to-[#6B5B95]/15 blur-3xl pointer-events-none" />

      {/* 상단 네비게이션 헤더 */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#6B6154] hover:text-[#1E1B2E] transition-colors py-2 px-3 rounded-lg hover:bg-black/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>
        <Link
          href="/"
          className="font-serif font-bold text-base sm:text-lg tracking-wider text-[#1E1B2E]"
        >
          AI DREAM TELLER
        </Link>
        <div className="w-20" />
      </div>

      {/* 중앙 메인 콘텐츠 */}
      <div className="relative z-10 my-auto py-8">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto p-12 flex flex-col items-center justify-center gap-3 bg-[#FAF8F5]/80 rounded-3xl border border-[#E8E0D5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B46C1]" />
              <p className="text-xs text-[#7A7165] font-medium">비회원 조회 창을 여는 중...</p>
            </div>
          }
        >
          <GuestLoginForm />
        </Suspense>
      </div>

      {/* 하단 카피라이트 */}
      <div className="w-full max-w-4xl mx-auto text-center relative z-10 pt-4">
        <p className="text-[11px] text-[#A3998E]">
          © 2026 AI Dream Teller. 비회원 안전 조회 서비스
        </p>
      </div>
    </main>
  );
};

export default GuestLoginPage;
