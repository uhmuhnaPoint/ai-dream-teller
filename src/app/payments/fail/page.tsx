'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';

const PaymentFailContent = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || 'PAYMENT_CANCELLED';
  const message = searchParams.get('message') || '결제가 취소되었거나 승인되지 않았습니다.';
  const orderId = searchParams.get('orderId');

  // 마운트 시 서버에 결제 실패 내역 자동 기록
  useEffect(() => {
    if (orderId) {
      fetch('/api/payments/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, code, message }),
      }).catch((err) => console.error('결제 실패 사유 서버 기록 실패:', err));
    }
  }, [orderId, code, message]);

  return (
    <div className="max-w-md mx-auto my-8 bg-white border-2 border-[#E8E0F8] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-md">
      {/* 실패 인장 아이콘 */}
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
        <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
          결제가 완료되지 않았습니다
        </h1>
        <p className="text-xs sm:text-sm text-[#4B4562] leading-relaxed">
          카드사 승인 거절 또는 결제창 닫힘으로 인해 결제가 처리되지 않았습니다.
        </p>
      </div>

      {/* 오류 상세 정보 */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-2xl p-4 text-xs space-y-2 text-left">
        <div className="flex justify-between text-[#4B4562]">
          <span>실패 사유</span>
          <span className="font-semibold text-red-600 text-right max-w-[200px] truncate">{message}</span>
        </div>
        <div className="flex justify-between text-[#4B4562]">
          <span>에러 코드</span>
          <span className="font-mono text-stone-500">{code}</span>
        </div>
        {orderId && (
          <div className="flex justify-between text-[#4B4562]">
            <span>주문 식별자</span>
            <span className="font-mono text-stone-500 text-xs">{orderId}</span>
          </div>
        )}
      </div>

      {/* PRD 요구사항: 꿈 내용 보존 안내 */}
      <div className="flex items-center gap-2 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-left text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>안심하세요!</strong> 앞서 정성껏 작성하신 꿈 내용과 선택 옵션은 안전하게 유지되어 있습니다.
        </span>
      </div>

      {/* 재시도 및 수정 버튼 그룹 */}
      <div className="flex flex-col gap-2.5 pt-2">
        <Link
          href="/payments"
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1E1B2E] text-amber-200 font-bold text-sm hover:bg-[#2D2845] transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>결제 다시 시도하기</span>
        </Link>
        <Link
          href="/dream-teller"
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>꿈 내용 또는 결제 옵션 변경하기</span>
        </Link>
      </div>
    </div>
  );
};

const PaymentFailPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B2E] py-12 px-4 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-sm text-[#4B4562]">페이지를 불러오는 중입니다...</p>
          </div>
        }
      >
        <PaymentFailContent />
      </Suspense>
    </div>
  );
};

export default PaymentFailPage;
