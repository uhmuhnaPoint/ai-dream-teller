'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Sparkles, Compass } from 'lucide-react';
import ResultViewContainer from './result-view-container';
import { getDreamResultByOrderId } from '@/lib/dummy-dream-results';

interface DreamResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

/**
 * DreamResultModal: 메인 페이지(Bento Grid Card 2, RecentDreams 등)에서 카드를 클릭했을 때
 * 즉각적으로 전체 해석 확인 페이지의 경험(꿈 내용, AI 아트워크, 심층 해몽, 회원용 캘린더)을 팝업으로 제공하는 모달 컴포넌트입니다.
 */
const DreamResultModal = ({
  isOpen,
  onClose,
  orderId = 'DREAM_EXAMPLE_PENSIEVE',
}: DreamResultModalProps) => {
  const dreamResult = getDreamResultByOrderId(orderId);

  // Esc 키를 누르면 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E1B2E]/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* 바깥 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* 모달 윈도우 컨테이너 (Grand Archive 양피지 스타일) */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] border-2 border-[#D4AF37]/50 shadow-2xl p-4 sm:p-8 text-[#1E1B2E] z-10 space-y-6">
        {/* 모달 상단 툴바 */}
        <div className="flex items-center justify-between border-b border-[#E8E0F8] pb-4 sticky -top-4 sm:-top-8 bg-[#FAF8F5]/95 backdrop-blur-xs z-20 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E1B2E] to-[#6B46C1] flex items-center justify-center text-[#D4AF37] shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#1E1B2E]">
                  해석 확인 팝업 뷰 (Dream Decoded Modal)
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold hidden sm:inline">
                  실제 결과 미리보기
                </span>
              </div>
              <p className="text-[11px] text-[#7A7393]">
                주문번호 <span className="font-mono">{orderId}</span> · 회원 로그인 상태 시 캘린더 연동
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 독립 라우트 페이지로 열기 링크 */}
            <Link
              href={`/dream-result/${orderId}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-[#1E1B2E] transition-colors"
              title="새 탭에서 전체화면 페이지로 열기"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">전체화면 페이지로 보기</span>
            </Link>

            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메인 해석 확인 페이지 컨테이너 렌더링 */}
        <ResultViewContainer initialData={dreamResult} />
      </div>
    </div>
  );
};

export default DreamResultModal;
