import Link from 'next/link';
import { Sparkles, ShieldCheck, Clock, BookOpen } from 'lucide-react';

interface TrustBadge {
  id: string;
  label: string;
  icon: typeof ShieldCheck;
}

const TRUST_BADGES: TrustBadge[] = [
  { id: 'psychology', label: '무의식 심리학 기반', icon: BookOpen },
  { id: 'privacy', label: '100% 비밀 보장', icon: ShieldCheck },
  { id: 'time', label: '3분 내 즉시 완성', icon: Clock },
];

/**
 * HeroSection: 랜딩 페이지 최상단에서 유저의 호기심과 결핍을 자극해
 * 즉각적인 해몽 시작(/dream-teller)으로 연결하는 메인 히어로 섹션입니다.
 */
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      {/* 몽환적인 오로라 및 별빛 배경 그라데이션 장식 */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-[420px] w-[640px] rounded-full bg-gradient-to-tr from-[#E8E0F8] via-[#FCE7F3] to-[#E0F2FE] opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* 상단 무드 뱃지: 미신/운세와의 차별화 및 신비감 강조 */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF9] px-4 py-1.5 text-xs sm:text-sm font-medium text-[#4B4562] shadow-xs">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span>사주나 운세가 아닌, 무의식의 기호학적 심층 해독</span>
        </div>

        {/* 메인 카피 H1: 잊혀지기 전 지금 풀어야 한다는 긴박감과 호기심 유도 */}
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-[#1E1B2E] sm:text-5xl md:text-6xl md:leading-[1.18]">
          어젯밤 당신의 무의식이 보낸 비밀 신호,
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#6B46C1] via-[#9F7AEA] to-[#D53F8C] bg-clip-text text-transparent">
            {' '}흩어지기 전에 지금 해독하세요
          </span>
        </h1>

        {/* 상세 소개 Subtext: 전문성(학문 기반)과 구체적인 가치 제시 */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#4B4562]">
          단순한 미신이나 운세가 아닙니다. 프로이트·칼 융의 심층 심리학부터 현대 뇌인지과학까지,
          당신의 무의식이 남긴 상징과 감정을 입체적으로 분석합니다. 흐릿했던 꿈의 기억을 단 3분 만에
          선명한 마법 같은 아트워크와 심층 리포트로 마주하세요.
        </p>

        {/* CTA 버튼 및 마이크로 카피 */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <Link
            href="/dream-teller"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#1E1B2E] via-[#2D2438] to-[#1E1B2E] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6B46C1]/20 active:scale-[0.98]"
          >
            {/* 호버 시 발광하는 오로라 테두리 이펙트 */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#9F7AEA]/20 via-[#F687B3]/20 to-[#4FD1C5]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Sparkles className="h-5 w-5 text-[#D4AF37] transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative z-10">내 꿈의 암호 해독하기</span>
            <span className="relative z-10 text-xs text-[#D4AF37]">✨</span>
          </Link>

          {/* 마이크로 카피: 진입 장벽 완화 (가격 및 시간 제시) */}
          <p className="text-xs sm:text-sm text-[#716A89]">
            평균 3분 소요 · 4가지 심층 분석 학파 지원 · 1,500원의 지적 통찰
          </p>
        </div>

        {/* 신뢰도 배지(Trust Badges): 12,000건+ 사회적 증거와 신뢰성 확보 */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 border-t border-[#E8E0F8]/80">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="flex items-center gap-2 text-xs sm:text-sm text-[#4B4562]"
              >
                <Icon className="h-4 w-4 text-[#6B46C1]" />
                <span className="font-medium">{badge.label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6B46C1]">
            <span>누적 12,000+건 꿈 해독 완료</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
