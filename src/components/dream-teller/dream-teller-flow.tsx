'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PerspectiveType } from '@/types/dream-teller';
import StepPerspective, { PERSPECTIVES } from './step-perspective';
import StepDreamInput from './step-dream-input';
import StepPaymentOptions from './step-payment-options';
import MobileStickyBar from './mobile-sticky-bar';
import FaqSection from './faq-section';
import { 
  Check, 
  ChevronDown, 
  Sparkles, 
  PenTool, 
  CreditCard,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';

const STORAGE_KEY = 'ai_dream_order_draft';

/**
 * DreamTellerFlow: 프로덕트 상세 페이지(/dream-teller)의 핵심 아코디언 인터랙션 및 상태 관리 컴포넌트입니다.
 * PRD 요구사항 준수:
 * - 3단계 Accordion UX (1. 전문 분야 선택 -> 2. 꿈 내용 입력 -> 3. 결제 옵션 및 금액 확인)
 * - '다음 단계' 전환 시 자동 부드러운 스크롤
 * - 기본 옵션: 텍스트 1,500원 + 이미지 500원(기본 활성화) = 2,000원
 * - 모바일 하단 고정 Sticky 액션 바 연동
 * - 결제 페이지(/payments) 연동을 위한 주문 드래프트 세션 저장
 */
const DreamTellerFlow = () => {
  const router = useRouter();

  // 스텝 관리 (1: 학파 선택, 2: 꿈 작성, 3: 옵션 및 결제 확인)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // 폼 상태 (PRD 요구사항: 이미지 추가 기본 활성화 true)
  const [perspective, setPerspective] = useState<PerspectiveType | null>('jung');
  const [dreamContent, setDreamContent] = useState<string>('');
  const [includeImage, setIncludeImage] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 스크롤 포커스용 ref
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // 금액 계산
  const BASE_PRICE = 1500;
  const IMAGE_PRICE = 500;
  const totalAmount = BASE_PRICE + (includeImage ? IMAGE_PRICE : 0);

  /**
   * 세션 스토리지에서 이전 작성 드래프트 복원 (이탈 방지 UX)
   */
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.perspective) setPerspective(parsed.perspective);
        if (parsed.dreamContent) setDreamContent(parsed.dreamContent);
        if (typeof parsed.includeImage === 'boolean') setIncludeImage(parsed.includeImage);
      }
    } catch {
      // 세션 스토리지 접근 실패 시 기본값 유지
    }
  }, []);

  /**
   * 스텝 이동 및 자동 스크롤 함수
   */
  const scrollToStep = (stepNumber: number) => {
    setActiveStep(stepNumber);

    setTimeout(() => {
      let targetRef: React.RefObject<HTMLDivElement | null> | null = null;
      if (stepNumber === 1) targetRef = step1Ref;
      if (stepNumber === 2) targetRef = step2Ref;
      if (stepNumber === 3) targetRef = step3Ref;

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  /**
   * 1단계 -> 2단계 이동
   */
  const handleNextFromStep1 = () => {
    if (!perspective) return;
    setCompletedSteps((prev) => Array.from(new Set([...prev, 1])));
    scrollToStep(2);
  };

  /**
   * 2단계 -> 3단계 이동
   */
  const handleNextFromStep2 = () => {
    if (dreamContent.trim().length < 20) return;
    setCompletedSteps((prev) => Array.from(new Set([...prev, 1, 2])));
    scrollToStep(3);
  };

  /**
   * 특정 스텝 헤더 클릭 시 아코디언 토글 (이전 완료된 단계 또는 현재 단계 재열기)
   */
  const handleHeaderClick = (stepNumber: number) => {
    // 2단계는 1단계가 완료되었을 때만 열 수 있음
    if (stepNumber === 2 && !perspective) return;
    // 3단계는 2단계가 유효할 때만 열 수 있음
    if (stepNumber === 3 && dreamContent.trim().length < 20) return;

    scrollToStep(stepNumber);
  };

  /**
   * 최종 결제 주문 제출 핸들러
   * 드래프트 주문을 세션 스토리지에 안전하게 보존하고 /payments 로 이동합니다.
   */
  const handleSubmitOrder = async () => {
    if (!perspective) {
      scrollToStep(1);
      return;
    }
    if (dreamContent.trim().length < 20) {
      scrollToStep(2);
      return;
    }

    try {
      setIsSubmitting(true);

      const orderDraft = {
        perspective,
        dreamContent: dreamContent.trim(),
        includeImage,
        totalAmount,
        createdAt: new Date().toISOString(),
      };

      // 세션 스토리지에 결제 대기 데이터 저장 (결제 실패 시 복구 목적 포함)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orderDraft));

      // 결제 페이지로 이동
      router.push('/payments');
    } catch {
      alert('결제 페이지로 이동하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const selectedPerspectiveData = PERSPECTIVES.find((p) => p.id === perspective);

  return (
    <div className="w-full pb-28 md:pb-16">
      {/* 상단 프로그레스 및 신뢰성 하이라이트 배너 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 text-center text-xs md:text-sm">
        <div className="bg-white/80 border border-[#E8E0F8] rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-center gap-1.5 text-[#1E1B2E]">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-semibold">3분 내 심층 완성</span>
        </div>
        <div className="bg-white/80 border border-[#E8E0F8] rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-center gap-1.5 text-[#1E1B2E]">
          <Users className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-semibold">누적 12,000+건 분석</span>
        </div>
        <div className="bg-white/80 border border-[#E8E0F8] rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-center gap-1.5 text-[#1E1B2E]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">100% 비밀 보장</span>
        </div>
      </div>

      {/* 아코디언 컨테이너 */}
      <div className="space-y-4">
        {/* ================= STEP 1: 전문 분야 선택 ================= */}
        <div
          ref={step1Ref}
          className="border-2 border-[#E8E0F8] bg-white/95 rounded-2xl md:rounded-3xl shadow-xs overflow-hidden transition-all duration-300 scroll-mt-24"
        >
          {/* 헤더 버튼 */}
          <button
            type="button"
            onClick={() => handleHeaderClick(1)}
            className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              {/* 스텝 인장 인디케이터 */}
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs shrink-0 ${
                  completedSteps.includes(1) && activeStep !== 1
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : activeStep === 1
                    ? 'bg-[#1E1B2E] text-amber-300 ring-4 ring-amber-300/20'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {completedSteps.includes(1) && activeStep !== 1 ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>1</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-[#1E1B2E]">
                    전문 분야 선택
                  </h2>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    4대 관점
                  </span>
                </div>
                <p className="text-xs text-[#7A7393] mt-0.5">
                  프로이트 · 칼 융 · 현대 신경과학 · 게슈탈트
                </p>
              </div>
            </div>

            {/* 헤더 우측 요약 뱃지 */}
            <div className="flex items-center gap-2 shrink-0">
              {selectedPerspectiveData && activeStep !== 1 && (
                <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-[#1E1B2E] border border-stone-200">
                  {selectedPerspectiveData.name.split(' ')[0]} 선택됨
                </span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${
                  activeStep === 1 ? 'rotate-180 text-[#1E1B2E]' : ''
                }`}
              />
            </div>
          </button>

          {/* 본문 콘텐츠 */}
          {activeStep === 1 && (
            <div className="p-5 md:p-6 pt-0 border-t border-[#F2EFF8] bg-[#FAF8F5]/30">
              <div className="pt-4">
                <StepPerspective
                  selectedPerspective={perspective}
                  onSelect={(p) => setPerspective(p)}
                  onNext={handleNextFromStep1}
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 2: 꿈 내용 입력 ================= */}
        <div
          ref={step2Ref}
          className="border-2 border-[#E8E0F8] bg-white/95 rounded-2xl md:rounded-3xl shadow-xs overflow-hidden transition-all duration-300 scroll-mt-24"
        >
          {/* 헤더 버튼 */}
          <button
            type="button"
            onClick={() => handleHeaderClick(2)}
            className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs shrink-0 ${
                  completedSteps.includes(2) && activeStep !== 2
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : activeStep === 2
                    ? 'bg-[#1E1B2E] text-amber-300 ring-4 ring-amber-300/20'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {completedSteps.includes(2) && activeStep !== 2 ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>2</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-[#1E1B2E]">
                    꿈 내용 기록하기
                  </h2>
                  <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    최소 20자
                  </span>
                </div>
                <p className="text-xs text-[#7A7393] mt-0.5">
                  어젯밤 흩어진 무의식의 기억을 생생하게 기록해주세요
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {dreamContent.trim().length >= 20 && activeStep !== 2 && (
                <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {dreamContent.trim().length}자 작성됨
                </span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${
                  activeStep === 2 ? 'rotate-180 text-[#1E1B2E]' : ''
                }`}
              />
            </div>
          </button>

          {activeStep === 2 && (
            <div className="p-5 md:p-6 pt-0 border-t border-[#F2EFF8] bg-[#FAF8F5]/30">
              <div className="pt-4">
                <StepDreamInput
                  dreamContent={dreamContent}
                  onChange={(c) => setDreamContent(c)}
                  onNext={handleNextFromStep2}
                  onPrev={() => scrollToStep(1)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 3: 결제 옵션 및 금액 확인 ================= */}
        <div
          ref={step3Ref}
          className="border-2 border-[#E8E0F8] bg-white/95 rounded-2xl md:rounded-3xl shadow-xs overflow-hidden transition-all duration-300 scroll-mt-24"
        >
          {/* 헤더 버튼 */}
          <button
            type="button"
            onClick={() => handleHeaderClick(3)}
            className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs shrink-0 ${
                  activeStep === 3
                    ? 'bg-[#1E1B2E] text-amber-300 ring-4 ring-amber-300/20'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                <span>3</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-[#1E1B2E]">
                    결제 옵션 선택 및 최종 금액 확인
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    최종 단계
                  </span>
                </div>
                <p className="text-xs text-[#7A7393] mt-0.5">
                  기본 텍스트 해몽 1,500원 · AI 이미지 복원 +500원
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-extrabold text-[#1E1B2E] text-sm md:text-base">
                {totalAmount.toLocaleString()}원
              </span>
              <ChevronDown
                className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${
                  activeStep === 3 ? 'rotate-180 text-[#1E1B2E]' : ''
                }`}
              />
            </div>
          </button>

          {activeStep === 3 && (
            <div className="p-5 md:p-6 pt-0 border-t border-[#F2EFF8] bg-[#FAF8F5]/30">
              <div className="pt-4">
                <StepPaymentOptions
                  perspective={perspective}
                  dreamContent={dreamContent}
                  includeImage={includeImage}
                  onToggleImage={(inc) => setIncludeImage(inc)}
                  onPrev={() => scrollToStep(2)}
                  onSubmitOrder={handleSubmitOrder}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 잠재 유저 전환 FAQ 섹션 */}
      <FaqSection />

      {/* 모바일 하단 Sticky 플로팅 액션 바 */}
      <MobileStickyBar
        currentStep={activeStep}
        perspective={perspective}
        dreamContent={dreamContent}
        includeImage={includeImage}
        totalAmount={totalAmount}
        onNextStep={() => {
          if (activeStep === 1) handleNextFromStep1();
          if (activeStep === 2) handleNextFromStep2();
        }}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default DreamTellerFlow;
