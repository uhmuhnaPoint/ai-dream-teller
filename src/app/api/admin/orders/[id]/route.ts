import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrderDetail } from '@/app/actions/admin';
import { verifyAdminAuthorization } from '@/lib/security/admin-auth';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/orders/[id]
 * 설명: 상세 주문 내역에서 원본 꿈 텍스트, 사용자 정보, 결제 상태 및 해몽 결과를 반환합니다.
 */
export const GET = async (
  request: NextRequest,
  context: RouteContext
) => {
  try {
    const adminKey = request.headers.get('x-admin-key') || request.nextUrl.searchParams.get('key');
    const auth = await verifyAdminAuthorization(adminKey);

    if (!auth.isAuthorized) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: auth.reason || '관리자 권한이 없습니다.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { code: 'BAD_REQUEST', message: '주문 식별자(id)가 필요합니다.' },
        { status: 400 }
      );
    }

    const data = await getAdminOrderDetail(id);

    if (!data) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: '해당 주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '주문 상세 정보 조회 실패';
    return NextResponse.json(
      { code: 'INTERNAL_SERVER_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
