'use client';

import React from 'react';
import Image from 'next/image';
import { 
  PerspectiveType 
} from '@/types/dream-teller';
import { PERSPECTIVES } from './step-perspective';
import { 
  Sparkles, 
  Check, 
  FileText, 
  Clock, 
  ShieldAlert, 
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Lock,
  Layers
} from 'lucide-react';

interface StepPaymentOptionsProps {
  perspective: PerspectiveType | null;
  dreamContent: string;
  includeImage: boolean;
  onToggleImage: (include: boolean) => void;
  onPrev: () => void;
  onSubmitOrder: () => void;
  isSubmitting?: boolean;
  isGuestMode?: boolean;
  onNextToGuestInfo?: () => void;
}

/**
 * StepPaymentOptions: 3단계 - 결제 옵션(텍스트 해몽 + AI 이미지 복원)을 선택하고 최종 금액을 확인하는 컴포넌트입니다.
 * 비즈니스 기획 관점:
 * - 텍스트 1,500원 + 이미지 +500원을 기본 선택(Default Opt-in)으로 유도하여 객단가(AOV) 33% 상승.
 * - 소셜 프루프 뱃지("89% 유저 선택")와 샘플 비주얼 썸네일을 배치하여 시각화 추가 구매 저항감을 극소화합니다.
 * - 3분 이내 생성 및 비의료 진단 주의사항을 명확히 고지하여 고객 클레임과 법적 리스크를 선제 차단합니다.
 */
const StepPaymentOptions = ({
  perspective,
  dreamContent,
  includeImage,
  onToggleImage,
  onPrev,
  onSubmitOrder,
  isSubmitting = false,
  isGuestMode = false,
  onNextToGuestInfo,
}: StepPaymentOptionsProps) => {
  const selectedPerspectiveData = PERSPECTIVES.find((p) => p.id === perspective);
  
  const BASE_PRICE = 1500;
  const IMAGE_PRICE = 500;
  const totalAmount = BASE_PRICE + (includeImage ? IMAGE_PRICE : 0);

  return (
    <div className="space-y-6">
      {/* 가이드 배너 */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-xl p-4 md:p-5 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#E8E0F8] flex items-center justify-center shrink-0 text-[#4B4562] mt-0.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#1E1B2E]">
            마지막 단계: 해몽 구성 옵션 및 금액을 확인해주세요.
          </p>
          <p className="text-[#4B4562] mt-1 text-xs md:text-sm leading-relaxed">
            원하시는 리포트의 형태를 선택하시면 결제 즉시 AI가 무의식 암호 해독 작업에 착수합니다.
          </p>
        </div>
      </div>

      {/* 옵션 선택 카드 목록 */}
      <div className="space-y-4">
        {/* 옵션 1: 텍스트 해몽 (기본 필수) */}
        <div className="relative rounded-2xl border-2 border-stone-200 bg-white/90 p-5 flex items-start justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-[#4B4562] mt-0.5">
              <FileText className="w-5 h-5 text-purple-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-stone-100 text-stone-700">
                  기본 필수
                </span>
                <h4 className="text-base font-bold text-[#1E1B2E]">
                  4대 관점 심층 텍스트 해몽 리포트
                </h4>
              </div>
              <p className="text-xs md:text-sm text-[#4B4562] leading-relaxed">
                {selectedPerspectiveData?.name || '선택한 학파'}의 렌즈로 무의식 상징을 다각도 해독하고, 내면의 현 상태와 현실 처방 가이드를 전해드립니다.
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                <span>• 무의식 핵심 키워드 3가지</span>
                <span>• 심층 상징 분해</span>
                <span>• 현실 행동 조언</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-base md:text-lg font-bold text-[#1E1B2E]">
              1,500원
            </p>
            <span className="text-xs text-stone-400">포함됨</span>
          </div>
        </div>

        {/* 옵션 2: AI 이미지 생성 (기본 활성화 +500원, 전략적 업셀) */}
        <div
          onClick={() => onToggleImage(!includeImage)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleImage(!includeImage);
            }
          }}
          tabIndex={0}
          role="checkbox"
          aria-checked={includeImage}
          className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 outline-none select-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            includeImage
              ? 'bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-white border-amber-400 shadow-md ring-2 ring-amber-300/30'
              : 'bg-white/70 hover:bg-white border-[#E8E0F8] opacity-80'
          }`}
        >
          <div className="flex items-start gap-3.5">
            {/* 체크박스 인장 */}
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-1 transition-all ${
                includeImage
                  ? 'bg-[#1E1B2E] text-amber-300 shadow-xs'
                  : 'border-2 border-stone-300 bg-white'
              }`}
            >
              {includeImage && <Check className="w-4 h-4 stroke-[3]" />}
            </div>

            {/* 비주얼 썸네일 미리보기 */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border border-amber-300/60 shadow-xs hidden sm:block">
              <Image
                src="/images/pensieve-library.jpg"
                alt="AI 꿈 시각화 프리뷰"
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-1">
                <span className="text-[10px] text-white/90 font-medium">예시 아트</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>89%의 사용자가 함께 선택 ✨</span>
                </span>
                <h4 className="text-base font-bold text-[#1E1B2E]">
                  AI 펜시브 비주얼 캔버스 복원
                </h4>
              </div>

              <p className="text-xs md:text-sm text-[#4B4562] leading-relaxed">
                깨어나는 순간 흩어지는 꿈의 찰나를 최첨단 AI가 한 폭의 마법 유화 일러스트로 선명하게 복원해 드립니다.
              </p>

              <p className="text-xs text-amber-800 font-medium">
                단 500원에 영구 소장 가능한 나만의 고화질 무의식 아트워크 획득
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 w-full md:w-auto flex md:flex-col items-center justify-between md:items-end border-t md:border-t-0 pt-2 md:pt-0 border-stone-100">
            <span className="text-xs text-stone-500 md:hidden">추가 금액</span>
            <div>
              <p className="text-base md:text-lg font-bold text-amber-700">
                +500원
              </p>
              <span className="text-xs text-stone-400">
                {includeImage ? '선택됨' : '선택 안 됨'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 영수증 스타일 주문 요약 카드 (Parchment Bill) */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-2xl p-5 md:p-6 space-y-4">
        <h4 className="text-xs font-bold text-[#7A7393] uppercase tracking-wider">
          의뢰서 요약 (Summary)
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center text-[#4B4562]">
            <span>분석 관점</span>
            <span className="font-semibold text-[#1E1B2E]">
              {selectedPerspectiveData ? selectedPerspectiveData.name : '선택 안 됨'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#4B4562]">
            <span>꿈 텍스트 분량</span>
            <span className="font-semibold text-[#1E1B2E]">
              {dreamContent.trim().length}자 기록
            </span>
          </div>

          <div className="border-t border-[#E8E0F8] pt-2 flex justify-between items-center text-[#4B4562]">
            <span>심층 텍스트 해몽</span>
            <span>1,500원</span>
          </div>

          {includeImage && (
            <div className="flex justify-between items-center text-amber-800">
              <span className="flex items-center gap-1">
                <span>AI 꿈 캔버스 시각화 복원</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                  특별가
                </span>
              </span>
              <span>+500원</span>
            </div>
          )}

          <div className="border-t-2 border-[#1E1B2E]/10 pt-3 flex justify-between items-baseline">
            <span className="text-base font-bold text-[#1E1B2E]">최종 결제 금액</span>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-extrabold text-[#1E1B2E] tracking-tight">
                {totalAmount.toLocaleString()}
              </span>
              <span className="text-base font-bold text-[#1E1B2E] ml-1">원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 주의사항 및 안심 고지 (PRD 필수 요구사항) */}
      <div className="space-y-2.5 bg-stone-50 border border-stone-200/80 rounded-xl p-4 text-xs text-[#4B4562] leading-relaxed">
        <div className="flex items-center gap-2 font-semibold text-[#1E1B2E]">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>평균 3분 이내 초고속 해몽 생성</span>
        </div>
        <p className="pl-6 text-stone-600">
          결제가 승인되면 즉시 AI 분석 파이프라인이 가동되어 3분 이내에 심층 리포트와 고화질 이미지가 완성됩니다.
        </p>

        <div className="flex items-center gap-2 font-semibold text-[#1E1B2E] pt-1">
          <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0" />
          <span>의료 진단 대체 불가 고지</span>
        </div>
        <p className="pl-6 text-stone-600">
          본 서비스의 심층 분석 리포트는 심리학적 통찰과 자기 성찰을 돕기 위한 콘텐츠이며, 정신과 전문의의 의학적 진료나 치료를 대체하지 않습니다.
        </p>

        <div className="flex items-center gap-2 font-semibold text-[#1E1B2E] pt-1">
          <Lock className="w-4 h-4 text-stone-500 shrink-0" />
          <span>안전한 토스페이먼츠 암호화 결제</span>
        </div>
        <p className="pl-6 text-stone-600">
          모든 결제 정보는 토스페이먼츠의 최고 등급 금융 보안 모듈을 통해 안전하게 처리되며 사이트에 카드 정보가 저장되지 않습니다.
        </p>
      </div>

      {/* 스텝 이동 및 최종 결제 제출 버튼 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 꿈 내용 수정</span>
        </button>

        {isGuestMode ? (
          <button
            type="button"
            onClick={onNextToGuestInfo || onSubmitOrder}
            disabled={isSubmitting || !perspective || dreamContent.trim().length < 20}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-md w-full sm:w-auto cursor-pointer bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] text-amber-300 hover:text-amber-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <span>다음: 비회원 주문 정보 입력 (4단계)</span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmitOrder}
            disabled={isSubmitting || !perspective || dreamContent.trim().length < 20}
            className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-md w-full sm:w-auto cursor-pointer ${
              isSubmitting
                ? 'bg-stone-300 text-stone-500 cursor-wait'
                : 'bg-[#1E1B2E] text-amber-200 hover:bg-[#2D2845] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <CreditCard className="w-5 h-5 text-amber-300" />
            <span>
              {isSubmitting
                ? '결제 페이지 준비 중...'
                : `${totalAmount.toLocaleString()}원 결제하고 해몽 의뢰하기 ✨`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StepPaymentOptions;
