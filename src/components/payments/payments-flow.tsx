'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { getTossClientKey } from '@/lib/tosspayments';
import { OrderDraftData, PerspectiveType } from '@/types/dream-teller';
import { PERSPECTIVES } from '@/components/dream-teller/step-perspective';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Loader2
} from 'lucide-react';

const STORAGE_KEY = 'ai_dream_order_draft';

/**
 * PaymentsFlow: 결제 페이지(/payments)의 토스페이먼츠 위젯 렌더링 및 결제 요청 플로우 컴포넌트입니다.
 * PRD 요구사항 준수:
 * - 회원/비회원 결제 모두 지원 (customerKey: ANONYMOUS)
 * - React 18/19 Strict Mode에서의 위젯 중복 마운트 방지 및 클린업 로직 적용
 * - 결제 실패 시에도 sessionStorage의 꿈 내용 유지
 */
const PaymentsFlow = () => {
  const router = useRouter();

  // 주문 초안 데이터
  const [orderDraft, setOrderDraft] = useState<OrderDraftData | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(true);

  // 구매자 정보 (비회원/회원 겸용)
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // 위젯 로딩 및 결제 진행 상태
  const [isWidgetLoading, setIsWidgetLoading] = useState<boolean>(true);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 위젯 인스턴스 ref (토스페이먼츠 v2 위젯 객체)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetsRef = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);

  // 1. 세션 스토리지에서 꿈 주문 초안 로드
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: OrderDraftData = JSON.parse(saved);
        if (parsed.perspective && parsed.dreamContent && parsed.totalAmount) {
          setOrderDraft(parsed);
        }
      }
    } catch {
      // 파싱 실패 시 무시
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // 2. 토스페이먼츠 위젯 초기화 (React Strict Mode 중복 초기화 방지 클린업)
  useEffect(() => {
    if (!orderDraft || isInitializedRef.current) return;

    let isMounted = true;

    const initTossWidget = async () => {
      try {
        setIsWidgetLoading(true);
        setWidgetError(null);

        const clientKey = getTossClientKey();
        const tossPayments = await loadTossPayments(clientKey);

        if (!isMounted) return;

        // 비회원 결제 지원 (ANONYMOUS 키 사용)
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        widgetsRef.current = widgets;

        // 결제 금액 설정
        await widgets.setAmount({
          currency: 'KRW',
          value: orderDraft.totalAmount,
        });

        if (!isMounted) return;

        // 결제 수단 및 이용약관 UI 렌더링
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: '#payment-method',
            variantKey: 'DEFAULT',
          }),
          widgets.renderAgreement({
            selector: '#agreement',
            variantKey: 'AGREEMENT',
          }),
        ]);

        if (isMounted) {
          isInitializedRef.current = true;
          setIsWidgetLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : '토스 결제 모듈을 불러오는 중 오류가 발생했습니다.';
          setWidgetError(message);
          setIsWidgetLoading(false);
        }
      }
    };

    initTossWidget();

    return () => {
      isMounted = false;
      // React Strict Mode 언마운트 시 상태 초기화
      isInitializedRef.current = false;
    };
  }, [orderDraft]);

  // 3. 결제 요청 핸들러
  const handlePayment = async () => {
    if (!orderDraft || !widgetsRef.current) return;

    try {
      setIsProcessing(true);

      const selectedPerspective = PERSPECTIVES.find((p) => p.id === orderDraft.perspective);
      const perspectiveName = selectedPerspective ? selectedPerspective.name.split(' ')[0] : '심층분석';
      const orderName = `AI 꿈 해몽 (${perspectiveName}${orderDraft.includeImage ? ' + 아트워크' : ''})`;

      // 고유 주문번호 생성 (6~64자)
      const orderId = `DREAM_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // 결제창 호출
      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
        customerEmail: customerEmail.trim() || undefined,
        customerName: customerName.trim() || undefined,
        customerMobilePhone: customerPhone.trim() ? customerPhone.replace(/[^0-9]/g, '') : undefined,
      });
    } catch (err) {
      // 사용자가 결제창을 닫거나 취소한 경우
      setIsProcessing(false);
      console.warn('결제 요청 중단 또는 오류:', err);
    }
  };

  // 초안 로딩 중 상태
  if (isLoadingDraft) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm text-[#4B4562]">주문서를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 주문 초안이 없는 경우 안내 (꿈 입력 먼저 유도)
  if (!orderDraft) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-[#E8E0F8] rounded-2xl shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#1E1B2E]">작성 중인 꿈 정보가 없습니다</h2>
        <p className="text-xs sm:text-sm text-[#4B4562] leading-relaxed">
          해몽을 진행할 꿈 내용과 전문 학파를 먼저 선택하신 후 결제 페이지로 이동해주세요.
        </p>
        <Link
          href="/dream-teller"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1E1B2E] text-amber-200 text-sm font-semibold hover:bg-[#2D2845] transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>꿈 내용 작성하러 가기</span>
        </Link>
      </div>
    );
  }

  const selectedPerspectiveData = PERSPECTIVES.find((p) => p.id === orderDraft.perspective);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 2단 반응형 그리드: 좌측 결제위젯 / 우측 주문 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 좌측: 토스페이먼츠 결제위젯 영역 (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 구매자 기본 정보 (선택 입력) */}
          <div className="bg-white border border-[#E8E0F8] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
                <span>구매자 정보</span>
                <span className="text-[11px] font-normal text-stone-400">(비회원 지원)</span>
              </h3>
              <span className="text-xs text-[#7A7393]">결제 알림 및 조회용</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-medium text-[#4B4562] mb-1">
                  이름 / 닉네임
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="예: 몽상가"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-medium text-[#4B4562] mb-1">
                  휴대폰 번호
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="customer-email" className="block text-xs font-medium text-[#4B4562] mb-1">
                  이메일 (결제 영수증 수신용)
                </label>
                <input
                  id="customer-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="dreamer@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
                />
              </div>
            </div>
          </div>

          {/* 토스페이먼츠 UI 렌더링 컨테이너 */}
          <div className="bg-white border border-[#E8E0F8] rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1E1B2E] border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>결제 수단 선택</span>
              <span className="text-xs text-stone-400 flex items-center gap-1 font-normal">
                <Lock className="w-3.5 h-3.5" />
                <span>토스페이먼츠 금융 보안 적용</span>
              </span>
            </h3>

            {/* 위젯 로딩 인디케이터 */}
            {isWidgetLoading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
                <p className="text-xs text-stone-500">결제 수단 모듈을 준비하는 중입니다...</p>
              </div>
            )}

            {/* 위젯 에러 발생 시 안내 */}
            {widgetError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>결제 모듈을 불러오지 못했습니다.</span>
                </p>
                <p>{widgetError}</p>
                <p className="text-stone-500 pt-1">
                  (키 설정이 완료되었는지 확인하거나 페이지를 새로고침 해주세요.)
                </p>
              </div>
            )}

            {/* 토스페이먼츠 공식 v2 컨테이너 selector */}
            <div id="payment-method" className="w-full min-h-[280px]" />
            <div id="agreement" className="w-full" />
          </div>
        </div>

        {/* 우측: 의뢰서 요약 및 최종 결제 액션 (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* 의뢰 내역 영수증 카드 */}
          <div className="bg-white border-2 border-[#E8E0F8] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-[#7A7393] uppercase tracking-wider">
                주문 요약 (Order Summary)
              </span>
              <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-200">
                AI 심층 분석
              </span>
            </div>

            {/* 선택 항목 상세 */}
            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between items-center text-[#4B4562]">
                <span>선택 관점</span>
                <span className="font-bold text-[#1E1B2E]">
                  {selectedPerspectiveData ? selectedPerspectiveData.name : '학문적 심층 관점'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#4B4562]">
                <span>기록된 꿈 분량</span>
                <span className="font-medium text-[#1E1B2E]">
                  {orderDraft.dreamContent.length}자 기록됨
                </span>
              </div>

              {/* 꿈 내용 미리보기 스니펫 */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E0F8] text-xs text-[#4B4562] italic line-clamp-2">
                “{orderDraft.dreamContent}”
              </div>

              <div className="border-t border-stone-100 pt-2 flex justify-between items-center text-[#4B4562]">
                <span>심층 텍스트 리포트</span>
                <span>1,500원</span>
              </div>

              {orderDraft.includeImage && (
                <div className="flex justify-between items-center text-amber-800">
                  <span className="flex items-center gap-1">
                    <span>AI 비주얼 캔버스 복원</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </span>
                  <span>+500원</span>
                </div>
              )}

              {/* 최종 결제 금액 */}
              <div className="border-t-2 border-[#1E1B2E]/10 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-[#1E1B2E]">최종 결제 금액</span>
                <div className="text-right">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#1E1B2E]">
                    {orderDraft.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-base font-bold text-[#1E1B2E] ml-1">원</span>
                </div>
              </div>
            </div>

            {/* 결제 버튼 */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={isWidgetLoading || !!widgetError || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isWidgetLoading || !!widgetError || isProcessing
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-[#1E1B2E] text-amber-200 hover:bg-[#2D2845] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                  <span>결제 진행 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{orderDraft.totalAmount.toLocaleString()}원 결제하기</span>
                </>
              )}
            </button>

            {/* 꿈 수정하러 돌아가기 링크 */}
            <div className="text-center pt-1">
              <Link
                href="/dream-teller"
                className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors"
              >
                꿈 내용 또는 옵션 수정하기
              </Link>
            </div>
          </div>

          {/* 안심 보증 뱃지 */}
          <div className="space-y-2 text-xs text-[#7A7393] p-4 bg-white/70 border border-[#E8E0F8] rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>결제 실패 시에도 입력하신 꿈 내용은 안전하게 유지됩니다.</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>결제 완료 후 약 3분 이내로 AI 심층 분석이 완료됩니다.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsFlow;
