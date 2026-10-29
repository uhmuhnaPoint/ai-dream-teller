'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';

interface AdminShellProps {
  children: React.ReactNode;
}

/**
 * AdminShell: 관리자 공통 쉘 레이아웃 래퍼
 * - 사이드바 모바일 토글 상태를 클라이언트 상태로 관리
 * - 사이드바와 헤더, 콘텐츠 영역의 반응형 그리드 구조 제공
 */
export const AdminShell = ({ children }: AdminShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleOpenSidebar = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* 1. 글로벌 관리자 사이드바 (데스크톱 고정 & 모바일 드로어) */}
      <AdminSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* 2. 메인 콘텐츠 뷰포트 영역 */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* 상단 관리자 헤더 */}
        <AdminHeader onOpenSidebar={handleOpenSidebar} />

        {/* 페이지별 동적 라우트 메인 콘텐츠 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
