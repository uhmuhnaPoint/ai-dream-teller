'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PerspectiveType } from '@/types/dream-teller';
import StepPerspective, { PERSPECTIVES } from './step-perspective';
import StepDreamInput from './step-dream-input';
import StepPaymentOptions from './step-payment-options';
import StepGuestOrderInfo from './step-guest-order-info';
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
  Users,
  UserCheck,
  UserX,
  Phone
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

const STORAGE_KEY = 'ai_dream_order_draft';

/**
 * DreamTellerFlow: 프로덕트 상세 페이지(/dream-teller)의 핵심 아코디언 인터랙션 및 상태 관리 컴포넌트입니다.
 * 요구사항 준수:
 * - 4번 섹션 (비회원 주문자 정보 입력) 추가
 * - 로그인 유저는 4번 섹션이 안 보이게 처리 (3단계에서 바로 결제)
 * - 비회원 유저는 4번 섹션이 보이게 처리 (전화번호/비밀번호 입력 후 결제)
 * - Dev Tools 시뮬레이터 제공 (회원 모드 vs 비회원 모드 원클릭 토글)
 */
const DreamTellerFlow = () => {
  const router = useRouter();
  const { isLoggedIn, user: authUser } = useAuth();

  // 스텝 관리 (1: 학파 선택, 2: 꿈 작성, 3: 옵션 확인, 4: 비회원 정보 입력)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // 회원 vs 비회원 모드 (로그인 세션 기반 기본값 설정)
  const [isGuestMode, setIsGuestMode] = useState<boolean>(!isLoggedIn);

  // 로그인 상태 변화 시 게스트 모드 자동 동기화
  useEffect(() => {
    setIsGuestMode(!isLoggedIn);
  }, [isLoggedIn]);

  // 폼 상태 (PRD 요구사항: 이미지 추가 기본 활성화 true)
  const [perspective, setPerspective] = useState<PerspectiveType | null>('jung');
  const [dreamContent, setDreamContent] = useState<string>('');
  const [includeImage, setIncludeImage] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 비회원 주문자 정보 상태 (4단계)
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestPassword, setGuestPassword] = useState<string>('');

  // 스크롤 포커스용 ref
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

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
      if (stepNumber === 4) targetRef = step4Ref;

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
   * 3단계 -> 4단계 이동 (비회원 모드 전용)
   */
  const handleNextFromStep3 = () => {
    if (dreamContent.trim().length < 20) return;
    setCompletedSteps((prev) => Array.from(new Set([...prev, 1, 2, 3])));
    scrollToStep(4);
  };

  /**
   * 특정 스텝 헤더 클릭 시 아코디언 토글 (이전 완료된 단계 또는 현재 단계 재열기)
   */
  const handleHeaderClick = (stepNumber: number) => {
    // 2단계는 1단계가 완료되었을 때만 열 수 있음
    if (stepNumber === 2 && !perspective) return;
    // 3단계는 2단계가 유효할 때만 열 수 있음
    if (stepNumber === 3 && dreamContent.trim().length < 20) return;
    // 4단계는 비회원 모드이고 2단계가 유효할 때만 열 수 있음
    if (stepNumber === 4 && (!isGuestMode || dreamContent.trim().length < 20)) return;

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

    // 비회원 모드인 경우 4단계 전화번호/비밀번호 검증
    if (isGuestMode) {
      const cleanPhone = guestPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10 || guestPassword.length < 4) {
        scrollToStep(4);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      let registeredOrderId: string | undefined;
      let registeredOrderNumber: string | undefined;

      // 소셜 로그인 회원의 경우 서버 DB에 pending 주문서 사전 생성
      if (!isGuestMode && isLoggedIn) {
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dreamContent: dreamContent.trim(),
            expertField: perspective,
            includesImage: includeImage,
            totalAmount,
          }),
        });

        const orderResult = await orderResponse.json();
        if (!orderResponse.ok || !orderResult.success) {
          throw new Error(orderResult.message || '주문서 생성에 실패했습니다.');
        }

        registeredOrderId = orderResult.data?.orderId;
        registeredOrderNumber = orderResult.data?.orderNumber;
      }

      const orderDraft = {
        perspective,
        dreamContent: dreamContent.trim(),
        includeImage,
        totalAmount,
        orderId: registeredOrderId,
        orderNumber: registeredOrderNumber,
        isGuest: isGuestMode,
        guestInfo: isGuestMode
          ? {
              phone: guestPhone,
              password: guestPassword,
            }
          : undefined,
        createdAt: new Date().toISOString(),
      };

      // 세션 스토리지에 결제 대기 데이터 저장 (결제 실패 시 복구 목적 포함)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orderDraft));

      // 결제 페이지로 이동
      router.push('/payments');
    } catch (err) {
      const message = err instanceof Error ? err.message : '결제 페이지로 이동하는 중 오류가 발생했습니다.';
      alert(message);
      setIsSubmitting(false);
    }
  };

  const selectedPerspectiveData = PERSPECTIVES.find((p) => p.id === perspective);

  return (
    <div className="w-full pb-28 md:pb-16">
      {/* ================= Dev Tools: 회원 / 비회원 모드 시뮬레이터 ================= */}
      <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-[#F0EBE1] border border-[#DDD5C7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-[#5D576B] font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
          <span>[Dev Tools] 4섹션(비회원 주문) 가시성 테스트 시뮬레이터</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => {
              setIsGuestMode(false);
              if (activeStep === 4) setActiveStep(3);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              !isGuestMode
                ? 'bg-[#1E1B2E] text-amber-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>👤 로그인 회원 (4섹션 숨김)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGuestMode(true)}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              isGuestMode
                ? 'bg-[#1E1B2E] text-amber-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>🕶️ 비회원 (4섹션 노출)</span>
          </button>
        </div>
      </div>

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
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    isGuestMode
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {isGuestMode ? '3 / 4 단계' : '최종 단계'}
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
                  isGuestMode={isGuestMode}
                  onNextToGuestInfo={handleNextFromStep3}
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 4: 비회원 주문자 정보 입력 (비회원 전용) ================= */}
        {isGuestMode && (
          <div
            ref={step4Ref}
            className="border-2 border-amber-300/80 bg-white/95 rounded-2xl md:rounded-3xl shadow-xs overflow-hidden transition-all duration-300 scroll-mt-24 ring-2 ring-amber-400/20 animate-fadeIn"
          >
            {/* 헤더 버튼 */}
            <button
              type="button"
              onClick={() => handleHeaderClick(4)}
              className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs shrink-0 ${
                    activeStep === 4
                      ? 'bg-[#1E1B2E] text-amber-300 ring-4 ring-amber-300/20'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <span>4</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base md:text-lg font-bold text-[#1E1B2E]">
                      비회원 주문자 정보 입력
                    </h2>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      최종 단계
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                      비회원 전용
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7393] mt-0.5">
                    해몽 결과 조회에 사용할 휴대폰 번호와 비밀번호를 입력해 주세요.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {guestPhone && (
                  <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    {guestPhone}
                  </span>
                )}
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${
                    activeStep === 4 ? 'rotate-180 text-[#1E1B2E]' : ''
                  }`}
                />
              </div>
            </button>

            {activeStep === 4 && (
              <div className="p-5 md:p-6 pt-0 border-t border-[#F2EFF8] bg-[#FAF8F5]/30">
                <div className="pt-4">
                  <StepGuestOrderInfo
                    phone={guestPhone}
                    password={guestPassword}
                    onChangePhone={(p) => setGuestPhone(p)}
                    onChangePassword={(pw) => setGuestPassword(pw)}
                    onPrev={() => scrollToStep(3)}
                    onSubmitOrder={handleSubmitOrder}
                    isSubmitting={isSubmitting}
                    totalAmount={totalAmount}
                  />
                </div>
              </div>
            )}
          </div>
        )}
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
          if (activeStep === 3 && isGuestMode) handleNextFromStep3();
        }}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmitting}
        isGuestMode={isGuestMode}
      />
    </div>
  );
};

export default DreamTellerFlow;
