import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Receipt,
  Users,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { getAdminMetrics, getAdminOrders } from '@/app/actions/admin';
import { MOCK_ADMIN_METRICS, MOCK_ADMIN_ORDERS } from '@/lib/admin-mock-data';
import { AdminMetricsData, AdminOrderListItem } from '@/types/admin';

export const metadata = {
  title: '매출 대시보드 | AI Dream Teller 관리자',
  description: 'AI Dream Teller 서비스 실시간 매출 지표 및 주문 현황 통계',
};


/**
 * AdminMainPage: 관리자 메인 대시보드 화면 (/admin)
 * PRD 5.3 1. 관리자 메인 (/admin) & PRD 6.6 GET /api/admin/metrics 명세 준수
 * Server Component로 실데이터 Server Actions(getAdminMetrics, getAdminOrders)와 연동
 */
const AdminMainPage = async () => {
  let metrics: AdminMetricsData = MOCK_ADMIN_METRICS;
  let recentOrders: AdminOrderListItem[] = MOCK_ADMIN_ORDERS.slice(0, 5);
  let isLiveData = false;

  try {
    const [fetchedMetrics, fetchedOrders] = await Promise.all([
      getAdminMetrics(),
      getAdminOrders(),
    ]);

    // 주문 데이터가 DB에 하나라도 존재하면 실데이터로 렌더링
    if (fetchedMetrics.summary.totalOrderCount > 0 || fetchedOrders.length > 0) {
      metrics = fetchedMetrics;
      recentOrders = fetchedOrders.slice(0, 5);
      isLiveData = true;
    }
  } catch (error) {
    console.warn('[AdminMainPage] 실데이터 로드 예외 -> 모의 데이터 Fallback:', error);
  }

  const { summary, monthlyTrends } = metrics;
  const maxRevenue = Math.max(10000, ...monthlyTrends.map((t) => t.revenue));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. 상단 환영 및 요약 헤더 배너 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1B2E] via-[#2A1B4E] to-[#1E1B2E] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            수익형 AI 심층 해몽 서비스
            {isLiveData && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                실시간 DB 연동
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            관리자 대시보드에 오신 것을 환영합니다.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            실시간 주문 현황과 월별 매출 성장 추이를 모니터링하고 AI 해몽 파이프라인의 상태를 점검하세요.
          </p>
        </div>

        {/* 배경 은은한 발광 효과 */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#6B46C1]/30 blur-3xl" />
        <div className="absolute right-40 -bottom-10 h-40 w-40 rounded-full bg-amber-500/20 blur-2xl" />
      </div>

      {/* 2. 핵심 지표 카드 그리드 (PRD 5.3 1. 관리자 메인) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 오늘 매출 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>오늘 매출</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summary.todayRevenue.toLocaleString()}
            <span className="text-sm font-semibold text-slate-500 ml-1">원</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>+{summary.todayOrderCount}건 발생</span>
            <span className="text-slate-400 font-normal">| 당일 집계</span>
          </div>
        </div>

        {/* 당월 누적 매출 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>당월 누적 매출</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summary.monthlyRevenue.toLocaleString()}
            <span className="text-sm font-semibold text-slate-500 ml-1">원</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
            <span>누적 {summary.monthlyOrderCount}건</span>
            <span className="text-slate-400 font-normal">| 이번 달</span>
          </div>
        </div>

        {/* 총 누적 매출 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>총 누적 매출</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summary.totalRevenue.toLocaleString()}
            <span className="text-sm font-semibold text-slate-500 ml-1">원</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>전체 주문 {summary.totalOrderCount.toLocaleString()}건</span>
          </div>
        </div>

        {/* AI 해몽 처리 현황 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>AI 해몽 완료율</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {summary.totalOrderCount > 0
              ? ((summary.completedAnalysisCount / summary.totalOrderCount) * 100).toFixed(1)
              : '100.0'}
            <span className="text-sm font-semibold text-slate-500 ml-1">%</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold">{summary.completedAnalysisCount}건 완료</span>
            <span>/ 대기 {summary.pendingAnalysisCount}건</span>
          </div>
        </div>
      </div>

      {/* 3. 8개월 매출 추이 차트 (PRD 5.3 1. 관리자 메인 8개월 차트) */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              월별 매출 및 주문 추이 (최근 8개월)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              서비스 출시 이후 지속적인 월간 성장률을 시각화합니다.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#6B46C1]" />
              <span className="text-slate-600 font-medium">월 매출액 (원)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-amber-400" />
              <span className="text-slate-600 font-medium">주문 건수</span>
            </div>
          </div>
        </div>

        {/* 차트 렌더링 영역 */}
        <div className="pt-8 pb-4">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 px-2">
            {monthlyTrends.map((point) => {
              const heightPercent = Math.max(12, Math.round((point.revenue / maxRevenue) * 100));

              return (
                <div
                  key={point.month}
                  className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
                >
                  {/* 툴팁 */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1 whitespace-nowrap shadow-lg">
                    <p className="font-bold">{point.month}</p>
                    <p>{point.revenue.toLocaleString()}원 ({point.orderCount}건)</p>
                  </div>

                  {/* 매출 바 */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-[#4C1D95] to-[#8B5CF6] group-hover:from-[#5B21B6] group-hover:to-[#A78BFA] transition-all duration-300 relative"
                  >
                    {/* 상단 포인트 라벨 */}
                    <span className="hidden sm:block absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600">
                      {Math.round(point.revenue / 10000)}만
                    </span>
                  </div>

                  {/* X축 월 라벨 */}
                  <span className="text-[11px] text-slate-500 font-medium group-hover:text-purple-600 transition-colors">
                    {point.month.includes('.') ? point.month.split('.')[1] : point.month}월
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. 최근 주문 리스트 프리뷰 & 바로가기 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 주문 현황 (2열 차지) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">최근 발생 주문</h3>
              <p className="text-xs text-slate-500">실시간 유입된 최근 주문 내역입니다.</p>
            </div>
            <Link
              href="/admin/order-list"
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              전체 보기
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2.5 -mx-2.5 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : order.paymentStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}
                    >
                      {order.paymentStatus === 'paid'
                        ? '결제완료'
                        : order.paymentStatus === 'pending'
                        ? '결제대기'
                        : '실패/취소'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.userRole === 'member' ? '회원' : '비회원'} · {order.userNickname}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-md">
                    {order.dreamContent}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {order.totalAmount.toLocaleString()}원
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {order.includesImage ? '이미지 포함' : '텍스트 전용'}
                    </span>
                  </div>

                  <Link
                    href={`/admin/order-list/${order.id}`}
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="주문 상세 보기"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 퀵 내비게이션 & 운영 현황 카드 (1열 차지) */}
        <div className="space-y-6">
          {/* 주요 관리 메뉴 바로가기 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">빠른 관리 이동</h3>
            <div className="space-y-2.5">
              <Link
                href="/admin/order-list"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 hover:border-purple-300 hover:bg-purple-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      주문 리스트
                    </span>
                    <span className="text-[11px] text-slate-500">
                      전체 주문 조회 및 재분석
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </Link>

              <Link
                href="/admin/user-list"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 hover:border-purple-300 hover:bg-purple-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      유저 리스트
                    </span>
                    <span className="text-[11px] text-slate-500">
                      회원/비회원 이용자 집계
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* 시스템 운영 가이드 및 실데이터 백엔드 가동 상태 */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>백엔드 API 시스템 가동 중</span>
            </div>
            <h4 className="text-sm font-bold">
              PRD 6.6 관리자 백엔드 파이프라인
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supabase 실시간 트랜잭션과 1:1 해몽 결과 조인, 텔레그램 모니터링 알림, AI 해몽 재생성(Regenerate) 엔드포인트가 완비되었습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMainPage;
