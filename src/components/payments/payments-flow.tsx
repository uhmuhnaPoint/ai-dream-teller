'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { getTossClientKey } from '@/lib/tosspayments';
import { OrderDraftData, PerspectiveType } from '@/types/dream-teller';
import { PERSPECTIVES } from '@/components/dream-teller/step-perspective';
import { useAuth } from '@/providers/auth-provider';
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
 * - 회원/비회원 결제 모두 지원 (회원은 user.id를 customerKey로 활용하여 결제수단 저장 지원)
 * - React 18/19 Strict Mode에서의 위젯 중복 마운트 방지 및 클린업 로직 적용
 * - DB 사전 생성된 order_number를 토스 orderId로 연결하여 금액 위변조 및 무결성 보장
 */
const PaymentsFlow = () => {
  const router = useRouter();
  const { user: authUser, loading: authLoading, isLoggedIn } = useAuth();

  // 주문 초안 데이터
  const [orderDraft, setOrderDraft] = useState<OrderDraftData | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(true);

  // 구매자 정보 (비회원/회원 겸용 - 회원의 경우 프로필 정보 자동 연동)
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // 회원 로그인 시 구매자 정보 자동 입력
  useEffect(() => {
    if (authUser) {
      const meta = authUser.user_metadata;
      const name =
        (typeof meta?.name === 'string' && meta.name) ||
        (typeof meta?.full_name === 'string' && meta.full_name) ||
        '';
      if (name && !customerName) setCustomerName(name);
      if (authUser.email && !customerEmail) setCustomerEmail(authUser.email);
    }
  }, [authUser]);

  // 위젯 로딩 및 결제 진행 상태
  const [isWidgetLoading, setIsWidgetLoading] = useState<boolean>(true);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 위젯 인스턴스 ref (토스페이먼츠 v2 위젯 객체 및 파괴용 메서드 보관)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentMethodWidgetRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agreementWidgetRef = useRef<any>(null);
  const isInitializingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(false);
  const renderedCustomerKeyRef = useRef<string | null>(null);

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

  // 2. 토스페이먼츠 위젯 초기화 (React Strict Mode 및 Auth 세션 변화 시 중복 렌더링 방지 및 destroy 클린업)
  useEffect(() => {
    isMountedRef.current = true;

    // 초안 로딩 중이거나 인증 확인 중이거나 주문 초안이 없으면 대기
    if (isLoadingDraft || authLoading || !orderDraft) {
      return;
    }

    // 회원인 경우 authUser.id를 customerKey로 활용하여 결제수단 저장 지원, 비회원은 ANONYMOUS
    const customerKey = authUser?.id || ANONYMOUS;

    // 이미 동일한 customerKey로 위젯이 렌더링되어 있는 경우: 위젯을 파괴하지 않고 금액만 업데이트 (공식 권장 사항)
    if (
      widgetsRef.current &&
      paymentMethodWidgetRef.current &&
      renderedCustomerKeyRef.current === customerKey
    ) {
      widgetsRef.current
        .setAmount({
          currency: 'KRW',
          value: orderDraft.totalAmount,
        })
        .catch((err: unknown) => {
          console.warn('Toss widget setAmount update error:', err);
        });
      return;
    }

    // 비동기 초기화가 이미 진행 중인 경우 중복 호출 방지
    if (isInitializingRef.current) {
      return;
    }

    const initTossWidget = async () => {
      isInitializingRef.current = true;
      setIsWidgetLoading(true);
      setWidgetError(null);

      try {
        // 기존에 렌더링된 위젯이 있다면 토스 공식 destroy() 메서드로 안전하게 제거
        if (paymentMethodWidgetRef.current) {
          try {
            await paymentMethodWidgetRef.current.destroy?.();
          } catch {
            // 이미 제거된 경우 무시
          }
          paymentMethodWidgetRef.current = null;
        }
        if (agreementWidgetRef.current) {
          try {
            await agreementWidgetRef.current.destroy?.();
          } catch {
            // 이미 제거된 경우 무시
          }
          agreementWidgetRef.current = null;
        }

        // DOM 컨테이너 내부 정리
        const methodEl = document.getElementById('payment-method');
        if (methodEl) methodEl.innerHTML = '';
        const agreeEl = document.getElementById('agreement');
        if (agreeEl) agreeEl.innerHTML = '';

        if (!isMountedRef.current) return;

        const clientKey = getTossClientKey();
        const tossPayments = await loadTossPayments(clientKey);

        if (!isMountedRef.current) return;

        const widgets = tossPayments.widgets({ customerKey });
        widgetsRef.current = widgets;

        // 결제 금액 설정
        await widgets.setAmount({
          currency: 'KRW',
          value: orderDraft.totalAmount,
        });

        if (!isMountedRef.current) return;

        // 1. 결제 수단 UI 렌더링 (공식 순차 호출 규격 준수)
        const methodWidget = await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        });

        if (!isMountedRef.current) {
          try {
            await methodWidget?.destroy?.();
          } catch {
            // 무시
          }
          return;
        }

        // 2. 이용약관 UI 렌더링
        let agreeWidget = null;
        try {
          agreeWidget = await widgets.renderAgreement({
            selector: '#agreement',
          });
        } catch (agreeErr) {
          console.warn('[TossPayments] 약관 위젯 렌더링 폴백 시도:', agreeErr);
          // variantKey가 지정된 경우 재시도
          try {
            agreeWidget = await widgets.renderAgreement({
              selector: '#agreement',
              variantKey: 'AGREEMENT',
            });
          } catch {
            // 약관 위젯 에러 시 결제 수단은 유지
          }
        }

        // 비동기 렌더링 도중 언마운트된 경우 (React Strict Mode) 새로 생성된 위젯 파괴
        if (!isMountedRef.current) {
          try {
            await methodWidget?.destroy?.();
          } catch {
            // 무시
          }
          try {
            await agreeWidget?.destroy?.();
          } catch {
            // 무시
          }
          return;
        }

        paymentMethodWidgetRef.current = methodWidget;
        agreementWidgetRef.current = agreeWidget;
        renderedCustomerKeyRef.current = customerKey;
        setIsWidgetLoading(false);
        setWidgetError(null);
      } catch (err) {
        console.error('[TossPayments Widget Error]:', err);
        if (isMountedRef.current) {
          const message =
            err instanceof Error ? err.message : '토스 결제 모듈을 불러오는 중 오류가 발생했습니다.';
          setWidgetError(message);
          setIsWidgetLoading(false);
        }
      } finally {
        isInitializingRef.current = false;
      }
    };

    initTossWidget();

    return () => {
      isMountedRef.current = false;
    };
  }, [isLoadingDraft, authLoading, orderDraft, authUser?.id]);

  // 컴포넌트 페이지 이탈 시 위젯 자원 최종 해제
  useEffect(() => {
    return () => {
      try {
        paymentMethodWidgetRef.current?.destroy?.();
      } catch {
        // 무시
      }
      try {
        agreementWidgetRef.current?.destroy?.();
      } catch {
        // 무시
      }
    };
  }, []);

  // 3. 결제 요청 핸들러
  const handlePayment = async () => {
    if (!orderDraft || !widgetsRef.current) return;

    try {
      setIsProcessing(true);

      const selectedPerspective = PERSPECTIVES.find((p) => p.id === orderDraft.perspective);
      const perspectiveName = selectedPerspective ? selectedPerspective.name.split(' ')[0] : '심층분석';
      const orderName = `AI 꿈 해몽 (${perspectiveName}${orderDraft.includeImage ? ' + 아트워크' : ''})`;

      let targetOrderNumber = orderDraft.orderNumber;

      // DB에 사전 생성된 주문서가 없는 경우(직접 URL 접근 등) POST /api/orders 호출하여 pending 주문서 확보
      if (!targetOrderNumber) {
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dreamContent: orderDraft.dreamContent,
            expertField: orderDraft.perspective,
            includesImage: orderDraft.includeImage,
            totalAmount: orderDraft.totalAmount,
          }),
        });

        const orderResult = await orderResponse.json();
        if (!orderResponse.ok || !orderResult.success) {
          throw new Error(orderResult.message || '주문서 생성에 실패했습니다.');
        }

        targetOrderNumber = orderResult.data.orderNumber;
        setOrderDraft((prev) =>
          prev ? { ...prev, orderNumber: targetOrderNumber, orderId: orderResult.data.orderId } : null
        );
      }

      // 결제창 호출 (토스 orderId에 DB의 고유 order_number 바인딩)
      await widgetsRef.current.requestPayment({
        orderId: targetOrderNumber,
        orderName,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
        customerEmail: customerEmail.trim() || undefined,
        customerName: customerName.trim() || undefined,
        customerMobilePhone: customerPhone.trim() ? customerPhone.replace(/[^0-9]/g, '') : undefined,
      });
    } catch (err) {
      // 사용자가 결제창을 닫거나 취소한 경우 또는 주문서 생성 실패 시
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : '결제 요청 중 오류가 발생했습니다.';
      console.warn('결제 요청 중단 또는 오류:', msg);
      if (err instanceof Error && !msg.includes('사용자가 결제를 취소')) {
        alert(msg);
      }
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
