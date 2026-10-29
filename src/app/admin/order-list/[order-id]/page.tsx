import React from 'react';
import { notFound } from 'next/navigation';
import { getMockOrderDetail, MOCK_ADMIN_ORDERS } from '@/lib/admin-mock-data';
import { getAdminOrderDetail } from '@/app/actions/admin';
import { OrderDetailView } from '@/components/admin/order-detail-view';

interface PageProps {
  params: Promise<{
    'order-id': string;
  }>;
}

export const metadata = {
  title: '주문 상세 정보 | AI Dream Teller 관리자',
  description: 'AI Dream Teller 단일 주문 건의 상세 결제 내역 및 AI 해몽 리포트 확인/재생성',
};


/**
 * AdminOrderDetailPage: 특정 주문 상세 단독 라우트 (/admin/order-list/[order-id])
 * PRD 5.3 3. 주문 상세 & PRD 6.6 GET /api/admin/orders/[id] 명세 준수
 * Server Component로 파라미터를 수신하고 getAdminOrderDetail Server Action을 통해 실데이터 바인딩
 */
const AdminOrderDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const orderId = resolvedParams['order-id'];

  if (!orderId) {
    notFound();
  }

  let orderDetail = null;

  try {
    orderDetail = await getAdminOrderDetail(orderId);
  } catch (error) {
    console.warn('[AdminOrderDetailPage] 실데이터 조회 실패 -> 목 데이터 Fallback:', error);
  }

  // 실데이터 미존재 시 목 데이터 공급자에서 조회
  if (!orderDetail) {
    orderDetail = getMockOrderDetail(orderId);
  }

  if (!orderDetail) {
    notFound();
  }

  return <OrderDetailView order={orderDetail} />;
};

export default AdminOrderDetailPage;
