import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrders } from '@/app/actions/admin';
import { verifyAdminAuthorization } from '@/lib/security/admin-auth';
import { PaymentStatus } from '@/types/order';
import { AnalysisStatus, ExpertField } from '@/types/admin';

/**
 * GET /api/admin/orders
 * 설명: 시스템 전체의 주문 발생 내역 리스트를 페이지네이션 및 필터와 함께 반환합니다.
 */
export const GET = async (request: NextRequest) => {
  try {
    const adminKey = request.headers.get('x-admin-key') || request.nextUrl.searchParams.get('key');
    const auth = await verifyAdminAuthorization(adminKey);

    if (!auth.isAuthorized) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: auth.reason || '관리자 권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const paymentStatus = searchParams.get('paymentStatus') as PaymentStatus | 'all' | null;
    const analysisStatus = searchParams.get('analysisStatus') as AnalysisStatus | 'all' | null;
    const expertField = searchParams.get('expertField') as ExpertField | 'all' | null;
    const searchKeyword = searchParams.get('searchKeyword') || undefined;

    const data = await getAdminOrders({
      paymentStatus: paymentStatus || undefined,
      analysisStatus: analysisStatus || undefined,
      expertField: expertField || undefined,
      searchKeyword,
    });

    return NextResponse.json({
      success: true,
      totalCount: data.length,
      data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '주문 내역 조회 실패';
    return NextResponse.json(
      { code: 'INTERNAL_SERVER_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
