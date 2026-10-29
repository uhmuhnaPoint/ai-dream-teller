'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  LogOut,
  X,
  Database,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: '매출 대시보드',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: '주문 관리',
    href: '/admin/order-list',
    icon: ReceiptText,
    exact: false,
  },
  {
    name: '유저 관리',
    href: '/admin/user-list',
    icon: Users,
    exact: false,
  },
];

/**
 * AdminSidebar: 관리자 전용 좌측 글로벌 네비게이션 사이드바 컴포넌트
 * - 데스크톱 고정 뷰 및 모바일 반응형 오버레이(Drawer)를 지원합니다.
 * - PRD 5.3 및 0. 공통 레이아웃 명세 준수: 매출 조회(/admin), 주문 리스트(/admin/order-list), 유저 리스트(/admin/user-list)
 */
export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();

  /**
   * 메뉴 활성화 상태 판별
   * @param item 대상 네비게이션 아이템
   */
  const isItemActive = (item: NavItem): boolean => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  /**
   * 관리자 로그아웃 처리
   * TODO: 추후 Supabase Auth 기반 관리자 세션 파기 및 로그인 화면(/admin/login 등)으로 리다이렉트 구현
   */
  const handleAdminLogout = () => {
    if (confirm('관리자 세션에서 로그아웃하시겠습니까?')) {
      // FIX: 실제 인증 백엔드 연결 시 signOut() 호출 로직으로 교체 필요
      window.location.href = '/';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F111A] text-slate-200 border-r border-slate-800/80 shadow-2xl">
      {/* 1. 상단 브랜드 헤더 영역 */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-3 group focus:outline-hidden"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#6B46C1] to-[#D4AF37] flex items-center justify-center text-white shadow-lg shadow-purple-950/40 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">
                DREAM TELLER
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#6B46C1] text-purple-100 rounded-sm tracking-wider uppercase">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">관리자 콘솔 v1.0</p>
          </div>
        </Link>

        {/* 모바일 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          aria-label="사이드바 닫기"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. 백엔드 시스템 가동 상태 배너 */}
      <div className="mx-4 mt-4 px-3 py-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-2.5">
        <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <span className="font-semibold text-emerald-200 block">Live Backend Active</span>
          <p className="text-slate-400">
            PRD 6.6 관리자 Server Actions 및 API 연동
          </p>
        </div>
      </div>

      {/* 3. 메인 네비게이션 메뉴 */}
      <div className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          관리 메뉴
        </div>
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-[#6B46C1] text-white shadow-md shadow-purple-950/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent
                  className={`w-4 h-4 transition-colors ${
                    active ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* 사이트 바로가기 섹션 */}
        <div className="pt-6 pb-2 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          서비스 연동
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>사용자 서비스 홈</span>
          </div>
          <span className="text-[10px] text-slate-400">새 탭</span>
        </Link>
      </div>

      {/* 4. 하단 관리자 계정 상태 및 로그아웃 */}
      <div className="p-4 border-t border-slate-800/60 bg-[#0C0E15]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                운영총괄마스터
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 truncate">
                  admin@ai-dreamteller.com
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            title="로그아웃"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
            aria-label="관리자 로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. 데스크톱 고정 좌측 사이드바 (lg 이상 고정) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* 2. 모바일/태블릿용 반응형 오버레이 Drawer (lg 미만) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* 백드롭 오버레이 배경 */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 슬라이드오버 Drawer 패널 */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 ease-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
