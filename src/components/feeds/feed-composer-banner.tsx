'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, PenLine, Compass, ArrowRight } from 'lucide-react';

/**
 * FeedComposerBanner: 페이스북 상단의 피드 작성창(Composer) 메타포를 차용하여
 * 피드를 열람 중인 유저가 자연스럽게 자신의 꿈을 작성하고 해몽을 의뢰하도록 유도하는 전환 배너입니다.
 */
const FeedComposerBanner = () => {
  return (
    <div className="bg-white border border-[#E8E0F8] rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xs space-y-3.5 mb-6">
      {/* 페이스북 스타일 인풋 트리거 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E1B2E] to-[#6B46C1] flex items-center justify-center text-[#D4AF37] font-bold text-sm shrink-0 shadow-2xs">
          <Sparkles className="w-4 h-4" />
        </div>

        <Link
          href="/dream-teller"
          className="flex-1 bg-[#FAF8F5] hover:bg-stone-100 text-stone-500 hover:text-stone-800 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-stone-200/80 transition-colors flex items-center justify-between"
        >
          <span>어젯밤 어떤 꿈을 꾸셨나요? 흩어지기 전에 지금 해독해보세요...</span>
          <PenLine className="w-4 h-4 text-purple-600 shrink-0 hidden sm:block" />
        </Link>
      </div>

      {/* 하단 퀵 액션 버튼들 */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-medium text-[#1E1B2E]">4대 관점 지원:</span>
          <span className="hidden sm:inline text-stone-400">칼 융 · 프로이트 · 뇌과학 · 게슈탈트</span>
        </div>

        <Link
          href="/dream-teller"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1E1B2E] text-amber-200 text-xs font-semibold hover:bg-[#2D2845] transition-all shadow-2xs"
        >
          <span>내 꿈 해몽 의뢰하기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FeedComposerBanner;
