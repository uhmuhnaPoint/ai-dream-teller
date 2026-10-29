import { NextRequest, NextResponse } from 'next/server';
import { getAdminMetrics } from '@/app/actions/admin';
import { verifyAdminAuthorization } from '@/lib/security/admin-auth';

/**
 * GET /api/admin/metrics
 * 설명: 관리자 대시보드용으로 기간별 매출과 주문 통계 데이터를 반환합니다.
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

    const data = await getAdminMetrics();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '대시보드 메트릭스 조회 실패';
    return NextResponse.json(
      { code: 'INTERNAL_SERVER_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
