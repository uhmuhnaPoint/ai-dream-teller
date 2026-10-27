import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';

/**
 * BottomCta: 랜딩페이지 하단에서 이탈하려는 유저에게
 * 꿈의 망각에 대한 긴박감과 비회원 간편 시작의 편의성을 강조해 최종 전환을 유도하는 섹션입니다.
 */
const BottomCta = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-[#1E1B2E] text-white">
      {/* 배경 오로라 빛 발광 효과 */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
      >
        <div className="h-[380px] w-[580px] rounded-full bg-gradient-to-r from-[#9F7AEA] via-[#F687B3] to-[#4FD1C5] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 인장 뱃지 */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#D4AF37] mb-6 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>기억의 유효시간은 지금 이 순간까지입니다</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          지금 이 순간에도 당신의 무의식이 보낸
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F687B3] to-[#9F7AEA] bg-clip-text text-transparent">
            {' '}비밀 암호는 잊혀져 가고 있습니다
          </span>
        </h2>

        <p className="mt-5 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          망각의 강으로 흘러가기 전에 단 3분 만에 기록하세요.
          학문적 렌즈로 투영된 심층 해몽과 환상적인 AI 아트워크가 당신만의 비밀 아카이브에 영구 보존됩니다.
        </p>

        {/* CTA 버튼 */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dream-teller"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F6AD55] px-8 py-4 text-base font-bold text-[#1E1B2E] shadow-xl hover:scale-[1.03] transition-all duration-200 active:scale-[0.98]"
          >
            <span>내 꿈의 암호 지금 해독하기</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>

        {/* 안심 보증 텍스트 */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>회원가입 없이 비회원으로도 3분 만에 즉시 해몽 가능</span>
        </div>
      </div>
    </section>
  );
};

export default BottomCta;
