import { NextRequest, NextResponse } from 'next/server';
import { getAdminUsers } from '@/app/actions/admin';
import { verifyAdminAuthorization } from '@/lib/security/admin-auth';

/**
 * GET /api/admin/users
 * 설명: 회원 가입 유저와 비회원 유저 리스트를 조회하고, 각 유저별 누적 주문 및 결제 건수를 합산하여 반환합니다.
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

    const data = await getAdminUsers();

    return NextResponse.json({
      success: true,
      totalCount: data.length,
      data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '유저 목록 조회 실패';
    return NextResponse.json(
      { code: 'INTERNAL_SERVER_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
