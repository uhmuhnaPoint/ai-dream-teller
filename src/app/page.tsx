import { Metadata } from 'next';
import HeroSection from '@/components/landing/hero-section';
import BentoGrid from '@/components/landing/bento-grid';
import RecentDreams from '@/components/landing/recent-dreams';
import BottomCta from '@/components/landing/bottom-cta';

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
 * Home: AI Dream Teller의 메인 랜딩 페이지입니다.
 * Server Component로 구성되어 SEO 최적화 메타데이터를 정적으로 제공하며,
 * 기획된 전환 퍼널(Hero -> Bento Grid -> Recent Feed -> Bottom CTA)을 순차적으로 렌더링합니다.
 */
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BentoGrid />
      <RecentDreams />
      <BottomCta />
    </div>
  );
};

export default Home;
