'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'ai_dream_order_draft';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const [isConfirming, setIsConfirming] = useState<boolean>(true);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{ orderId: string; totalAmount: number; orderName?: string } | null>(null);

  // React 18/Strict Mode 중복 호출 방어 ref
  const hasRequestedRef = React.useRef<boolean>(false);

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setConfirmError('유효하지 않은 결제 승인 요청입니다. 필수 파라미터가 누락되었습니다.');
      setIsConfirming(false);
      return;
    }

    // 이미 요청이 시작되었으면 중복 실행 방지
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    const requestConfirm = async () => {
      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || '결제 승인 처리 중 오류가 발생했습니다.');
        }

        setPaymentData({
          orderId,
          totalAmount: Number(amount),
          orderName: result.data?.orderName,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : '결제 승인에 실패했습니다.';
        setConfirmError(msg);
      } finally {
        setIsConfirming(false);
      }
    };

    requestConfirm();
  }, [paymentKey, orderId, amount]);

  if (isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <h2 className="text-lg font-bold text-[#1E1B2E]">토스페이먼츠 결제 승인 중...</h2>
        <p className="text-xs sm:text-sm text-[#4B4562] max-w-sm">
          금융 결제원 및 카드사 승인을 처리하고 있습니다. 잠시만 창을 유지해주세요.
        </p>
      </div>
    );
  }

  if (confirmError) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-red-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#1E1B2E]">결제 승인 실패</h2>
        <p className="text-xs sm:text-sm text-red-600 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-100">
          {confirmError}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/payments"
            className="px-5 py-2.5 rounded-xl bg-[#1E1B2E] text-amber-200 text-xs font-semibold hover:bg-[#2D2845] transition-colors"
          >
            다시 결제하기
          </Link>
          <Link
            href="/my-page?tab=orders"
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            주문 내역 확인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8 bg-white border-2 border-[#E8E0F8] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-md">
      {/* 성공 인장 */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>결제 완료 · 해독 파이프라인 가동</span>
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          무의식 해독 의뢰가 접수되었습니다!
        </h1>
        <p className="text-xs sm:text-sm text-[#4B4562] leading-relaxed">
          결제가 정상적으로 완료되어 AI가 입력하신 꿈 내용을 심층 분석하고 있습니다. 평균 3분 이내로 리포트가 완성됩니다.
        </p>
      </div>

      {/* 결제 요약 박스 */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-2xl p-4 text-xs space-y-2 text-left">
        <div className="flex justify-between text-[#4B4562]">
          <span>주문번호</span>
          <span className="font-mono font-medium text-[#1E1B2E]">{paymentData?.orderId}</span>
        </div>
        <div className="flex justify-between text-[#4B4562]">
          <span>결제 금액</span>
          <span className="font-bold text-[#1E1B2E]">{paymentData?.totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 액션 버튼 그룹 */}
      <div className="pt-2 space-y-2.5">
        <Link
          href={`/dream-result/${paymentData?.orderId || orderId}`}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1E1B2E] text-amber-200 font-bold text-sm hover:bg-[#2D2845] transition-all shadow-sm"
        >
          <span>해석 결과 확인 대기방으로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/my-page?tab=orders"
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
        >
          <span>마이페이지 주문 내역 보기</span>
        </Link>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B2E] py-12 px-4 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm text-[#4B4562]">결제 상태를 확인하는 중입니다...</p>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
};

export default PaymentSuccessPage;
