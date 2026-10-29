import React, { Suspense } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';

export const metadata = {
  title: '관리자 콘솔 | AI Dream Teller',
  description: 'AI Dream Teller 서비스 관리자 콘솔 및 실시간 매출/주문 통계 대시보드',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout: 관리자(/admin) 경로 전용 글로벌 레이아웃 컴포넌트
 * - PRD 5.3 0. 공통 레이아웃 명세 준수
 * - Next.js 16의 usePathname 및 dynamic params 프리렌더링 호환을 위해 Suspense 적용
 */
const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <Suspense fallback={null}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
};

export default AdminLayout;

