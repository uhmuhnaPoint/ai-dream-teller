import { Metadata } from 'next';
import FeedTimeline from '@/components/feeds/feed-timeline';
import { Compass, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: '익명 꿈 피드 | AI Dream Teller - 무의식의 타임라인',
  description:
    '다른 탐험가들이 풀어낸 신비로운 꿈 기록과 4대 학파 AI 심층 리포트, 그리고 AI가 한 폭의 명화로 복원한 꿈 아트워크를 타임라인에서 만나보세요.',
  keywords: [
    '꿈 피드',
    '꿈 공유',
    '꿈 해몽 사례',
    'AI 꿈 그림',
    '칼 융 꿈 해석 예시',
    '프로이트 해몽 피드',
    'AI Dream Teller',
  ],
  openGraph: {
    title: 'AI Dream Teller | 밤의 비밀 서재 - 익명 꿈 피드',
    description: '다른 이들의 무의식이 보낸 비밀 신호와 AI 심층 해독 리포트를 함께 살펴보세요.',
    images: ['/images/pensieve-library.jpg'],
  },
};

/**
 * FeedsPage: 피드 페이지(/feeds) 라우트입니다.
 * Server Component로 SEO 메타데이터를 제공하며, 페이스북형 타임라인 인터랙션과 무한 스크롤은 FeedTimeline에 위임합니다.
 */
const FeedsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B2E] relative overflow-hidden py-8 md:py-12">
      {/* 배경 은은한 오로라 광채 장식 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#E8E0F8]/40 via-[#FCE7F3]/20 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* 상단 헤더 */}
        <header className="text-center space-y-2.5 mb-8 md:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8E0F8] text-xs font-semibold text-[#4B4562] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>밤의 비밀 서재 (The Dream Archive Feed)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1B2E] tracking-tight">
            익명 꿈 해몽 타임라인
          </h1>

          <p className="text-xs sm:text-sm text-[#4B4562] max-w-lg mx-auto leading-relaxed">
            다른 이들이 마주했던 신비로운 무의식의 세계와 4가지 학문적 렌즈로 해독된 통찰, 그리고 한 폭의 그림으로 복원된 꿈들을 만나보세요.
          </p>
        </header>

        {/* 메인 피드 타임라인 */}
        <main>
          <FeedTimeline />
        </main>
      </div>
    </div>
  );
};

export default FeedsPage;
