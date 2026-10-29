'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

/**
 * 현재 URL 경로에 매핑되는 페이지 타이틀 및 브레드크럼 타이틀 매핑
 */
const getPageTitle = (pathname: string): { title: string; subtitle: string } => {
  if (pathname === '/admin') {
    return {
      title: '매출 대시보드',
      subtitle: '실시간 주문 통계 및 결제 전환 지표 분석',
    };
  }
  if (pathname.startsWith('/admin/order-list/')) {
    return {
      title: '주문 상세 정보',
      subtitle: '주문 건별 결제 정보, 원본 꿈 및 AI 해몽 리포트',
    };
  }
  if (pathname === '/admin/order-list') {
    return {
      title: '주문 관리',
      subtitle: '전체 결제 내역 조회 및 AI 해몽 분석 상태 관리',
    };
  }
  if (pathname === '/admin/user-list') {
    return {
      title: '유저 관리',
      subtitle: '회원 및 비회원 고객 주문 히스토리 관리',
    };
  }
  return {
    title: '관리자 콘솔',
    subtitle: 'AI Dream Teller 서비스 백오피스',
  };
};

/**
 * AdminHeader: 관리자 페이지 상단 헤더 컴포넌트
 * - 모바일 사이드바 열기 트리거
 * - 현재 페이지 타이틀 및 브레드크럼 제공
 * - 데이터 새로고침 트리거 및 운영 통계 요약 칩 제공
 */
export const AdminHeader = ({ onOpenSidebar }: AdminHeaderProps) => {
  const pathname = usePathname();
  const { title, subtitle } = getPageTitle(pathname);

  /**
   * 화면 데이터 새로고침
   * TODO: 추후 Server Actions 재호출 (revalidatePath 또는 router.refresh) 연동
   */
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* 좌측: 모바일 메뉴 토글 버튼 및 현재 페이지 위치 */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="관리자 메뉴 열기"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {/* 상단 브레드크럼 */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
              <Link href="/admin" className="hover:text-purple-600 transition-colors">
                어드민
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-700 font-medium truncate">{title}</span>
            </div>

            {/* 메인 타이틀 */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                {title}
              </h1>
              <span className="hidden md:inline-block text-xs text-slate-400 font-normal">
                | {subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* 우측: 퀵 상태 칩 & 액션 컨트롤러 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 실시간 백엔드 연결 배지 */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200/60 text-purple-800 text-xs font-semibold shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase 실시간 연동</span>
          </div>


          {/* 새로고침 버튼 */}
          <button
            type="button"
            onClick={handleRefresh}
            title="데이터 새로고침"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="페이지 새로고침"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* 모의 알림 버튼 */}
          <div className="relative">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="운영 알림 내역"
              onClick={() => alert('신규 주문 1건이 대기 중입니다 (Mock)')}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
