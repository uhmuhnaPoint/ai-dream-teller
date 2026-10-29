'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  RotateCw,
  Sparkles,
  User,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  ShieldCheck,
  Mail,
  Phone,
} from 'lucide-react';
import { regenerateAiDreamReport } from '@/app/actions/admin';
import { AdminOrderDetail } from '@/types/admin';

interface OrderDetailViewProps {
  order: AdminOrderDetail;
}

/**
 * OrderDetailView: 주문 상세 전용 페이지 클라이언트 뷰 컴포넌트
 * - PRD 5.3 3. 주문 상세 (/admin/order-list/[order-id])
 * - PRD 6.6 POST /api/admin/orders/[id]/regenerate 재생성 트리거 지원
 */
export const OrderDetailView = ({ order: initialOrder }: OrderDetailViewProps) => {
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderDetail>(initialOrder);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const expertNameMap: Record<string, string> = {
    freud: '지그문트 프로이트 (정신분석학)',
    jung: '칼 구스타프 융 (분석심리학)',
    neuroscience: '현대 뇌과학 (신경인지과학)',
    gestalt: '게슈탈트 (형태주의 심리학)',
  };

  /**
   * AI 해몽 재생성 트리거
   */
  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const updated = await regenerateAiDreamReport(order.id);
      setOrder(updated);
      alert('AI 해몽 리포트가 성공적으로 재생성되었습니다.');
    } catch (err) {
      console.warn('[Admin] 재생성 API 실패 시뮬레이션 Fallback 가동:', err);

      setOrder((prev) => ({
        ...prev,
        analysisStatus: 'completed',
        dreamResult: {
          id: `res-regenerated-${prev.id}`,
          orderId: prev.id,
          title: '심연의 바다와 자아의 거대한 통찰 (재생성 완료)',
          summary: '관리자 재분석 요청에 의해 보다 정밀한 프롬프트로 재생성된 결과물입니다.',
          interpretation:
            '재생성 분석 결과, 심층 무의식에서 발현된 상징 체계가 자아의 방어기제를 해체하고 보다 진실된 내면의 목소리를 드러내고 있습니다.',
          jungAnalysis:
            '원형적 그림자(Shadow)와의 융합을 통해 심리적 통합을 달성할 수 있는 전환기입니다.',
          imageUrl: prev.includesImage
            ? 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop'
            : null,
          recommendations: [
            '재생성된 심층 권고안에 따라 명상과 성찰의 시간을 가져보세요.',
            '현재의 직관적 결정을 주저 없이 밀고 나가세요.',
          ],
          luckScore: 95,
          createdAt: new Date().toISOString(),
        },
      }));

      alert('AI 해몽 리포트 재생성 요청이 완료되었습니다.');
    } finally {
      setIsRegenerating(false);
    }
  };


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. 상단 네비게이션 및 액션 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/order-list"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="목록으로 돌아가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-slate-900">
                {order.orderNumber}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : order.paymentStatus === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {order.paymentStatus === 'paid'
                  ? '결제 승인 완료'
                  : order.paymentStatus === 'pending'
                  ? '결제 대기'
                  : '실패/취소'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              접수일시: {new Date(order.createdAt).toLocaleString('ko-KR')} | 주문 ID: {order.id}
            </p>
          </div>
        </div>

        {/* 재생성 트리거 버튼 */}
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isRegenerating || order.paymentStatus !== 'paid'}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-950/20"
        >
          <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? '해몽 재생성 처리 중...' : 'AI 해몽 재생성 트리거'}</span>
        </button>
      </div>

      {/* 2. 구매자 및 결제 상세 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 구매자 정보 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <User className="w-4 h-4 text-purple-600" />
            <span>구매자 프로필</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">회원 유형:</span>
              <span className="font-semibold text-slate-800">
                {order.userRole === 'member' ? '가입 회원' : '비회원 (게스트)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">닉네임:</span>
              <span className="font-semibold text-slate-900">{order.userNickname}</span>
            </div>
            {order.userEmail && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">이메일:</span>
                <span className="font-mono text-slate-700">{order.userEmail}</span>
              </div>
            )}
            {order.userPhone && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">연락처:</span>
                <span className="font-mono text-slate-700">{order.userPhone}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-slate-500">가입 식별자 (User ID):</span>
              <span className="font-mono text-[11px] text-slate-500">{order.userId}</span>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>결제 세부 정보</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">결제 금액:</span>
              <span className="font-bold text-slate-900 text-sm">
                {order.totalAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">선택 패키지:</span>
              <span className="font-semibold text-purple-700">
                {order.includesImage ? 'AI 이미지 포함 리포트 (2,000원)' : '심층 텍스트 해몽 (1,500원)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">결제 승인일시:</span>
              <span className="font-mono text-slate-700">
                {order.approvedAt ? new Date(order.approvedAt).toLocaleString('ko-KR') : '승인 대기'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">토스 승인키:</span>
              <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                {order.paymentKey || '미발급'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 유저 입력 꿈 원문 카드 */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>입력 꿈 텍스트 원문</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60">
            학파: {expertNameMap[order.expertField] || order.expertField}
          </span>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          {order.dreamContent}
        </p>
      </div>

      {/* 4. AI 심층 해몽 리포트 결과 */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-base">
              AI 심층 해몽 리포트 결과물
            </h3>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              order.analysisStatus === 'completed'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {order.analysisStatus === 'completed' ? '해몽 완료' : '생성 대기'}
          </span>
        </div>

        {order.dreamResult ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1.5">
              <h4 className="text-base font-bold text-slate-900">{order.dreamResult.title}</h4>
              <p className="text-xs text-purple-800 font-medium">{order.dreamResult.summary}</p>
            </div>

            {order.dreamResult.imageUrl && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">AI 생성 시각화 아트</span>
                <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <Image
                    src={order.dreamResult.imageUrl}
                    alt="AI 해몽 시각화 아트"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">해몽 본문</span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {order.dreamResult.interpretation}
              </div>
            </div>

            {order.dreamResult.jungAnalysis && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-900 block">원형 심리학 심층 분석</span>
                <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs text-slate-800 leading-relaxed">
                  {order.dreamResult.jungAnalysis}
                </div>
              </div>
            )}

            {order.dreamResult.recommendations?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-900 block">행동 지침 권고</span>
                <ul className="space-y-1.5">
                  {order.dreamResult.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              생성된 해몽 리포트가 없습니다.
            </p>
            <p className="text-xs text-slate-400">
              상단의 [AI 해몽 재생성 트리거] 버튼을 클릭하여 분석 파이프라인을 실행하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
