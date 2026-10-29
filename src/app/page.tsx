import { Metadata } from 'next';
import { Suspense } from 'react';
import HeroSection from '@/components/landing/hero-section';
import BentoGrid from '@/components/landing/bento-grid';
import RecentDreams from '@/components/landing/recent-dreams';
import BottomCta from '@/components/landing/bottom-cta';
import { getPublicDreams } from '@/lib/feeds-service';

export const metadata: Metadata = {
  title: 'AI Dream Teller | 당신의 무의식이 보낸 비밀 신호, 심층 꿈 해몽',
  description:
    '사주나 운세가 아닌 프로이트, 칼 융, 신경과학 기반 4가지 전문 관점으로 어젯밤 꿈을 AI가 정밀 분석합니다. 단 3분 만에 나만의 심층 리포트와 고화질 AI 아트워크를 만나보세요.',
  keywords: [
    '꿈 해몽',
    'AI 꿈 해몽',
    '꿈 분석',
    '프로이트 해몽',
    '칼 융 꿈',
    '신경과학 꿈',
    '꿈 시각화',
    '무의식 분석',
  ],
  openGraph: {
    title: 'AI Dream Teller | 어젯밤 당신의 무의식이 보낸 비밀 신호',
    description:
      '흩어지기 전에 3분 만에 해독하세요. 4대 학문적 관점의 심층 해독과 펜시브의 마법 같은 AI 아트워크.',
    images: ['/images/pensieve-library.jpg'],
  },
};

/**
 * RecentDreamsAsyncSection:
 * 비동기 Supabase DB 조회를 전담하는 내부 서버 컴포넌트입니다.
 * Next.js 16 Partial Prefetching(PPR) 규격에 따라 Suspense boundary 내부에서 안전하게 실행됩니다.
 */
const RecentDreamsAsyncSection = async () => {
  const initialPublicDreams = await getPublicDreams(12);
  return <RecentDreams initialDreams={initialPublicDreams} />;
};

/**
 * Home: AI Dream Teller의 메인 랜딩 페이지입니다.
 * 정적 셸(Hero, BentoGrid, BottomCta)은 빌드 타임에 프리렌더링되며,
 * 동적 DB 조회 섹션은 Suspense로 래핑되어 최적의 체감 성능과 SEO를 제공합니다.
 */
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BentoGrid />
      <Suspense fallback={<RecentDreams />}>
        <RecentDreamsAsyncSection />
      </Suspense>
      <BottomCta />
    </div>
  );
};

export default Home;
