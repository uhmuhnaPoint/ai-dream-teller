import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AuthCard } from '@/components/auth/auth-card';

export const metadata: Metadata = {
  title: '로그인 | AI 드림 텔러 - 무의식의 도서관',
  description: '카카오 또는 구글 계정으로 3초 만에 로그인하고, 나만의 꿈 캘린더와 무의식 분석 리포트를 평생 보관하세요.',
};

/**
 * 회원 로그인 페이지 (/auth)
 * - 구글 및 카카오 공식 로그인 버튼 지원
 * - 로그인 완료 후 프로덕트 상세 페이지(/dream-teller)로 자동 이동
 * - Next.js 16 Partial Prefetching 지원을 위한 Suspense Boundary 적용
 */
const AuthPage = () => {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1E1B2E] relative flex flex-col justify-between py-8 px-4 sm:px-6 overflow-hidden">
      {/* 배경 신비로운 오로라 그라데이션 글로우 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E8E0F8]/60 to-[#F5E6CC]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#D4AF37]/15 to-[#6B5B95]/15 blur-3xl pointer-events-none" />

      {/* 상단 네비게이션 바 */}
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
        <div className="w-20" /> {/* 균형용 여백 */}
      </div>

      {/* 중앙 메인 로그인 섹션 */}
      <div className="relative z-10 my-auto py-8">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto p-12 flex flex-col items-center justify-center gap-3 bg-[#FAF8F5]/80 rounded-2xl border border-[#E8E0D5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B5B95]" />
              <p className="text-xs text-[#7A7165] font-medium">무의식 서재를 여는 중...</p>
            </div>
          }
        >
          <AuthCard />
        </Suspense>
      </div>

      {/* 하단 카피라이트 */}
      <div className="w-full max-w-4xl mx-auto text-center relative z-10 pt-4">
        <p className="text-[11px] text-[#A3998E]">
          © 2026 AI Dream Teller. 칼 융·프로이트·신경과학·게슈탈트 기반 무의식 분석
        </p>
      </div>
    </main>
  );
};

export default AuthPage;
