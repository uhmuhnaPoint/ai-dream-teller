import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { MyPageContainer } from '@/components/my-page/my-page-container';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: '마이페이지 | AI 드림 텔러 - 나의 무의식 서재',
  description: '내가 해독한 꿈들의 궤적을 캘린더에서 확인하고, 심층 해석 리포트와 소장 아트워크를 열람하세요.',
};

/**
 * 유저 마이페이지 (/my-page)
 * 요구사항 준수:
 * - 캘린더 날짜 하이라이트 → 결과 페이지 이동
 * - 구매 내역 리스트 → 결과 페이지 이동
 * - 닉네임 수정, 소셜 로그인 표시, 로그아웃
 */
const MyPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1B2E] flex flex-col justify-between selection:bg-[#E8E0F8] selection:text-[#6B46C1] relative overflow-hidden">
      {/* 배경 신비로운 오로라 글로우 */}
      <div className="absolute top-[-5%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#E8E0F8]/50 to-[#F5E6CC]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-[#D4AF37]/15 to-[#6B5B95]/15 blur-3xl pointer-events-none" />

      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <Suspense
          fallback={
            <div className="w-full max-w-4xl mx-auto p-16 flex flex-col items-center justify-center gap-3 bg-[#FAF8F5]/80 rounded-3xl border border-[#E8E0D5]">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B46C1]" />
              <p className="text-xs text-[#7A7165] font-medium">무의식 서재를 불러오는 중...</p>
            </div>
          }
        >
          <MyPageContainer />
        </Suspense>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default MyPage;
