import { Metadata } from 'next';
import DreamTellerFlow from '@/components/dream-teller/dream-teller-flow';
import { Sparkles, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: '꿈 해몽 의뢰하기 | AI Dream Teller - 4대 학문 심층 분석 & 펜시브 복원',
  description:
    '칼 융, 프로이트, 현대 신경과학, 게슈탈트 4가지 전문 관점 중 원하는 렌즈를 선택해 어젯밤 꿈의 암호를 해독하세요. 1,500원의 텍스트 리포트와 500원의 AI 비주얼 복원까지, 3분 만에 만나는 나만의 무의식 리포트.',
  keywords: [
    '꿈 해몽 신청',
    'AI 꿈 분석',
    '칼 융 꿈 분석',
    '프로이트 꿈 해석',
    '꿈 시각화',
    '무의식 분석',
    'AI Dream Teller',
  ],
  openGraph: {
    title: 'AI Dream Teller | 내 꿈의 암호 해독하기',
    description:
      '기상 후 10분 내 흩어지는 기억의 실타래를 4가지 학문적 관점으로 3분 만에 정밀 해독합니다.',
    images: ['/images/pensieve-library.jpg'],
  },
};

/**
 * DreamTellerPage: 프로덕트 상세 페이지(/dream-teller)입니다.
 * Server Component로 구성되어 검색 엔진 최적화(SEO) 메타데이터를 정적으로 서빙하고,
 * 인터랙티브한 3단계 Accordion UX와 결제 플로우는 DreamTellerFlow 클라이언트 컴포넌트에 위임합니다.
 */
const DreamTellerPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B2E] relative overflow-hidden">
      {/* 배경 은은한 오로라 광채 장식 (Ethereal Aura) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#E8E0F8]/40 via-[#FCE7F3]/20 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 md:pt-14">
        {/* 헤더 섹션: 마법 서재(Grand Archive) & 펜시브(Pensieve) 메타포 */}
        <header className="text-center space-y-3 mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E0F8] shadow-2xs text-xs md:text-sm font-medium text-[#4B4562]">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>무의식의 기록 보관소 (The Pensieve Archive)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1B2E] tracking-tight">
            내 꿈의 비밀 암호 해독 의뢰서
          </h1>

          <p className="text-sm md:text-base text-[#4B4562] max-w-xl mx-auto leading-relaxed">
            어젯밤 흩어지던 무의식의 기억을 3단계로 풀어내세요.
            <br className="hidden sm:inline" />
            선택하신 학문적 렌즈를 통해 3분 만에 맞춤 리포트와 예술 작품으로 복원됩니다.
          </p>
        </header>

        {/* 메인 3단계 Accordion 인터랙션 플로우 */}
        <main>
          <DreamTellerFlow />
        </main>
      </div>
    </div>
  );
};

export default DreamTellerPage;
