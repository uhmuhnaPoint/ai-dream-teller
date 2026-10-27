'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DreamPurchaseOrder } from '@/types/my-page';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  CreditCard,
  ImageIcon,
} from 'lucide-react';

interface OrderHistoryListProps {
  orders: DreamPurchaseOrder[];
}

/**
 * 마이페이지 유저 구매 내역 리스트 컴포넌트
 * 요구사항 준수:
 * - 회원이 결제/해독한 꿈 구매 내역 목록을 카드로 렌더링
 * - 각 주문 카드에서 바로 결과 페이지(/dream-result/[order-id])로 이동 지원
 */
export const OrderHistoryList = ({ orders }: OrderHistoryListProps) => {
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const perspectiveLabelMap: Record<string, { label: string; color: string }> = {
    jung: { label: '칼 융 분석심리학', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    freud: { label: '지그문트 프로이트', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    neuroscience: { label: '인지신경과학', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    gestalt: { label: '게슈탈트 심리학', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  };

  const handleCopyLink = async (orderId: string) => {
    try {
      const url = `${window.location.origin}/dream-result/${orderId}`;
      await navigator.clipboard.writeText(url);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-12 text-center space-y-4 shadow-xl shadow-purple-950/5">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#1E1B2E]">아직 해독된 꿈 기록이 없습니다</h3>
        <p className="text-xs text-[#7A7165] max-w-sm mx-auto">
          첫 번째 꿈을 의뢰하고, 당신의 무의식이 보낸 암호를 4대 학문적 관점으로 풀어보세요.
        </p>
        <Link
          href="/dream-teller"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E1B2E] text-white text-xs font-semibold hover:bg-[#2D2438] transition-colors"
        >
          <span>첫 번째 꿈 해몽 시작하기</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const perspectiveInfo = perspectiveLabelMap[order.perspective] || {
          label: order.perspective,
          color: 'bg-stone-100 text-stone-700 border-stone-200',
        };

        return (
          <div
            key={order.orderId}
            className="bg-[#FAF8F5]/90 border border-[#E8E0D5] hover:border-[#D5C7F0] rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all space-y-4 group relative"
          >
            {/* 상단 메타 정보 (주문번호, 작성일, 결제금액, 상태) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pb-3 border-b border-[#EAE3D6]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono font-semibold text-[#1E1B2E] bg-white px-2 py-0.5 rounded-md border border-[#E2D9CC]">
                  {order.orderNumber}
                </span>
                <span className="text-[#7A7165] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{order.createdAt}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>해석 완료</span>
                </span>
                <span className="text-[#5D576B] font-medium flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-stone-400" />
                  <span>{order.price.toLocaleString()}원 결제</span>
                </span>
              </div>
            </div>

            {/* 본문 정보 & 썸네일 */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* AI 일러스트 썸네일 (이미지 옵션 주문의 경우) */}
              {order.hasImage && (
                <div className="relative w-full sm:w-28 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E2D9CC] bg-stone-100 group-hover:scale-102 transition-transform">
                  <Image
                    src={order.imageUrl || '/images/pensieve-library.jpg'}
                    alt={order.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 112px"
                  />
                  <div className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-amber-300">
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* 꿈 텍스트 & 해몽 요약 */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${perspectiveInfo.color}`}>
                    {perspectiveInfo.label}
                  </span>
                  {order.hasImage && (
                    <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-amber-600" />
                      <span>AI 아트워크 포함</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E] group-hover:text-[#6B46C1] transition-colors">
                  {order.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5D576B] line-clamp-2 leading-relaxed">
                  {order.summary}
                </p>
              </div>
            </div>

            {/* 하단 액션 버튼 그룹 */}
            <div className="pt-3 border-t border-[#EAE3D6] flex flex-wrap items-center justify-between gap-3">
              {/* 공유 링크 복사 버튼 */}
              <button
                type="button"
                onClick={() => handleCopyLink(order.orderId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6154] hover:text-[#1E1B2E] bg-white hover:bg-stone-100 border border-[#DDD5C7] transition-colors cursor-pointer"
              >
                {copiedOrderId === order.orderId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">링크 복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>결과서 링크 복사</span>
                  </>
                )}
              </button>

              {/* 결과 페이지 이동 버튼 (요구사항: 구매 내역 리스트 → 결과 페이지 이동) */}
              <Link
                href={`/dream-result/${order.orderId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-400/40 hover:border-amber-400 shadow-sm hover:shadow-md transition-all group/btn"
              >
                <span>해석 결과서 보기</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
