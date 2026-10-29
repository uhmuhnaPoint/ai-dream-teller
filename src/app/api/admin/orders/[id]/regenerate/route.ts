import { NextRequest, NextResponse } from 'next/server';
import { regenerateAiDreamReport } from '@/app/actions/admin';
import { verifyAdminAuthorization } from '@/lib/security/admin-auth';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/admin/orders/[id]/regenerate
 * 설명: 결과물 품질 이슈 등을 이유로 LLM 해몽 재생성을 트리거합니다. 관리자 전용 권한 확인 후 AI 파이프라인을 재가동합니다.
 */
export const POST = async (
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

    const updatedOrderDetail = await regenerateAiDreamReport(id);

    return NextResponse.json({
      success: true,
      message: 'AI 꿈 해몽이 성공적으로 재생성되었습니다.',
      data: updatedOrderDetail,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'AI 해몽 재생성 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'REGENERATION_FAILED', message: errorMessage },
      { status: 500 }
    );
  }
};
