import React from 'react';
import { OrderListPageContent } from '@/components/admin/order-list-page-content';

export const metadata = {
  title: '주문 내역 관리 | AI Dream Teller 관리자',
  description: 'AI Dream Teller 전체 결제 주문 목록 조회, 실시간 필터링 및 AI 해몽 리포트 관리',
};

/**
 * AdminOrderListPage: 관리자 주문 리스트 페이지 (/admin/order-list)
 * PRD 5.3 2. 주문 리스트 명세 준수
 * Server Component로 메타데이터를 서빙하며 내부 인터랙션은 OrderListPageContent로 위임
 */
const AdminOrderListPage = () => {
  return <OrderListPageContent />;
};

export default AdminOrderListPage;
