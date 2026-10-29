import React from 'react';
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';

export const metadata = {
  title: '매출 대시보드 | AI Dream Teller 관리자',
  description: 'AI Dream Teller 서비스 실시간 매출 지표 및 주문 현황 통계',
};

/**
 * AdminMainPage: 관리자 메인 대시보드 화면 (/admin)
 * PRD 5.3 1. 관리자 메인 (/admin) & PRD 6.6 GET /api/admin/metrics 명세 준수
 * Server Component로 메타데이터를 제공하고 AdminDashboardContent를 통해 실데이터를 즉시 렌더링
 */
const AdminMainPage = () => {
  return <AdminDashboardContent />;
};

export default AdminMainPage;
