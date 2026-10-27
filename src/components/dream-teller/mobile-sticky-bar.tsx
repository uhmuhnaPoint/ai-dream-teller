'use client';

import React from 'react';
import { PerspectiveType } from '@/types/dream-teller';
import { PERSPECTIVES } from './step-perspective';
import { ArrowRight, CreditCard, Sparkles } from 'lucide-react';

interface MobileStickyBarProps {
  currentStep: number;
  perspective: PerspectiveType | null;
  dreamContent: string;
  includeImage: boolean;
  totalAmount: number;
  onNextStep: () => void;
  onSubmitOrder: () => void;
  isSubmitting?: boolean;
  isGuestMode?: boolean;
}

/**
 * MobileStickyBar: 모바일(md 미만) 환경에서 뷰포트 하단에 고정 노출되는 액션 바입니다.
 * 비즈니스 기획 관점:
 * - 긴 스크롤 환경에서도 사용자가 언제든 다음 스텝 및 최종 결제 금액을 직관적으로 확인하고 전환할 수 있도록 지원합니다.
 */
const MobileStickyBar = ({
  currentStep,
  perspective,
  dreamContent,
  includeImage,
  totalAmount,
  onNextStep,
  onSubmitOrder,
  isSubmitting = false,
  isGuestMode = false,
}: MobileStickyBarProps) => {
  const selectedPerspectiveData = PERSPECTIVES.find((p) => p.id === perspective);
  const isDreamValid = dreamContent.trim().length >= 20;
  const maxSteps = isGuestMode ? 4 : 3;

  // 스텝별 CTA 버튼 활성화 및 액션 분기
  const canProceed =
    (currentStep === 1 && !!perspective) ||
    (currentStep === 2 && isDreamValid) ||
    (currentStep === 3 && !!perspective && isDreamValid) ||
    (currentStep === 4 && !!perspective && isDreamValid);

  const handleAction = () => {
    if (!canProceed) return;
    if (isGuestMode) {
      if (currentStep === 4) {
        onSubmitOrder();
      } else {
        onNextStep();
      }
    } else {
      if (currentStep === 3) {
        onSubmitOrder();
      } else {
        onNextStep();
      }
    }
  };

  const getButtonText = () => {
    if (currentStep === 1) return '꿈 작성하기';
    if (currentStep === 2) return '옵션 확인하기';
    if (currentStep === 3 && isGuestMode) return '비회원 정보 입력';
    return `${totalAmount.toLocaleString()}원 결제하기`;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E0F8] px-4 py-3 shadow-[0_-4px_16px_rgba(30,27,46,0.08)]">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* 요약 정보 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-[#7A7393]">
            <span>{currentStep}/{maxSteps}단계</span>
            {selectedPerspectiveData && (
              <>
                <span>•</span>
                <span className="font-medium text-[#1E1B2E]">
                  {selectedPerspectiveData.name.split(' ')[0]}
                </span>
              </>
            )}
            {includeImage && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded">
                +아트
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs text-stone-500">합계</span>
            <span className="text-lg font-bold text-[#1E1B2E]">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <button
          type="button"
          onClick={handleAction}
          disabled={!canProceed || isSubmitting}
          className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            canProceed && !isSubmitting
              ? 'bg-[#1E1B2E] text-amber-200 active:scale-95'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {currentStep === 3 ? (
            <CreditCard className="w-4 h-4 text-amber-300" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{isSubmitting ? '진행 중...' : getButtonText()}</span>
          {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default MobileStickyBar;
