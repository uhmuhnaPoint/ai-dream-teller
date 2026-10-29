'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  RotateCw,
  Sparkles,
  Receipt,
  User,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Brain,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';
import { AdminOrderDetail } from '@/types/admin';

interface OrderDetailModalProps {
  order: AdminOrderDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (orderId: string) => Promise<void>;
  isRegenerating: boolean;
}

/**
 * OrderDetailModal: 주문 상세 정보 확인 및 AI 해몽 리포트 재생성 모달 컴포넌트
 * - PRD 5.3 3. 주문 상세 (/admin/order-list/[order-id]) 명세 준수
 * - 구매자 정보, 결제 세부 정보, 원본 꿈 텍스트, 학파별 분석 결과, 생성 이미지, LLM 재생성 트리거 제공
 */
export const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
  onRegenerate,
  isRegenerating,
}: OrderDetailModalProps) => {
  if (!isOpen || !order) return null;

  // 학파 국문명 매핑
  const expertNameMap: Record<string, string> = {
    freud: '지그문트 프로이트 (정신분석학)',
    jung: '칼 구스타프 융 (분석심리학)',
    neuroscience: '현대 뇌과학 (신경인지과학)',
    gestalt: '게슈탈트 (형태주의 심리학)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* 1. 백드롭 오버레이 */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. 모달 컨테이너 */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* 상단 모달 헤더 */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#6B46C1] text-purple-100 uppercase">
                주문 상세
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-amber-300">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              고객 주문 식별자: {order.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 중단 스크롤 가능 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          {/* 섹션 1: 결제 및 구매자 정보 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 구매자 정보 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <User className="w-4 h-4 text-purple-600" />
                <span>구매자 정보</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">회원 구분:</span>
                  <span className="font-semibold text-slate-800">
                    {order.userRole === 'member' ? '가입 회원' : '비회원 (게스트)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">닉네임 / 식별:</span>
                  <span className="font-semibold text-slate-900">{order.userNickname}</span>
                </div>
                {order.userEmail && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> 이메일:
                    </span>
                    <span className="font-mono text-slate-700">{order.userEmail}</span>
                  </div>
                )}
                {order.userPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> 전화번호:
                    </span>
                    <span className="font-mono text-slate-700">{order.userPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">계정 ID:</span>
                  <span className="font-mono text-[11px] text-slate-500">{order.userId}</span>
                </div>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>결제 및 주문 상태</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">결제 상태:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.paymentStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {order.paymentStatus === 'paid'
                      ? '결제 승인 완료'
                      : order.paymentStatus === 'pending'
                      ? '결제 대기'
                      : order.paymentStatus === 'refunded'
                      ? '환불 완료'
                      : '결제 실패'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">결제 금액:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {order.totalAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">선택 옵션:</span>
                  <span className="font-semibold text-purple-700">
                    {order.includesImage ? 'AI 비주얼 아트 포함 (2,000원)' : '심층 텍스트 리포트 (1,500원)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">주문 접수일시:</span>
                  <span className="text-slate-700 font-mono">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                {order.approvedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">승인 일시:</span>
                    <span className="text-emerald-700 font-mono font-medium">
                      {new Date(order.approvedAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
                {order.paymentKey && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">토스 승인키:</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-[150px]">
                      {order.paymentKey}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 에러 메시지 있을 경우 경고 배너 */}
          {order.errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>결제/처리 실패 사유: {order.errorMessage}</span>
            </div>
          )}

          {/* 섹션 2: 입력 꿈 원문 */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>유저 입력 꿈 원문</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                분석 관점: {expertNameMap[order.expertField] || order.expertField}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-white/80 p-3.5 rounded-xl border border-amber-100">
              {order.dreamContent}
            </p>
          </div>

          {/* 섹션 3: AI 해몽 분석 결과 (Dream Result) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  AI 심층 해몽 리포트 결과
                </h4>
              </div>

              {/* 분석 상태 배지 */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    order.analysisStatus === 'completed'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : order.analysisStatus === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {order.analysisStatus === 'completed'
                    ? '분석 완료'
                    : order.analysisStatus === 'pending'
                    ? '생성 대기 중'
                    : '생성 실패'}
                </span>
              </div>
            </div>

            {order.dreamResult ? (
              <div className="space-y-5">
                {/* 리포트 타이틀 및 핵심 요약 */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div className="text-base font-bold text-[#1E1B2E]">
                    {order.dreamResult.title}
                  </div>
                  <p className="text-xs text-purple-900 font-medium">
                    {order.dreamResult.summary}
                  </p>
                </div>

                {/* AI 생성 이미지 (있을 경우) */}
                {order.dreamResult.imageUrl && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      AI 비주얼라이제이션 이미지
                    </span>
                    <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                      <Image
                        src={order.dreamResult.imageUrl}
                        alt="AI 꿈 시각화 이미지"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  </div>
                )}

                {/* 종합 심층 해석 텍스트 */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    심층 해석 본문
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {order.dreamResult.interpretation}
                  </div>
                </div>

                {/* 학파별 전문 분석 텍스트 */}
                {order.dreamResult.jungAnalysis && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-indigo-800 block">
                      칼 융 분석심리학적 통찰
                    </span>
                    <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-800 leading-relaxed">
                      {order.dreamResult.jungAnalysis}
                    </div>
                  </div>
                )}

                {/* 실천 행동 가이드 추천 */}
                {order.dreamResult.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-800 block">
                      실천 행동 권고사항
                    </span>
                    <ul className="space-y-1.5">
                      {order.dreamResult.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  아직 AI 해몽 리포트가 생성되지 않았거나 대기 중입니다.
                </p>
                <p className="text-xs text-slate-400">
                  결제가 완료된 주문은 아래 [AI 해몽 강제 재생성] 버튼을 눌러 파이프라인을 트리거할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 모달 푸터 액션 바 */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {/* PRD 6.6 POST /api/admin/orders/[id]/regenerate 대응 */}
            품질 이슈 또는 생성 오류 발생 시 즉시 재호출 가능합니다.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>

            {/* AI 해몽 재생성 트리거 버튼 (PRD 5.3 3번 명세 필수 요건) */}
            <button
              type="button"
              onClick={() => onRegenerate(order.id)}
              disabled={isRegenerating || order.paymentStatus !== 'paid'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-950/20"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? '재생성 파이프라인 가동 중...' : 'AI 해몽 재생성 트리거'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
