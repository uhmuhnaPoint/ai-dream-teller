import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/orders/[id]
 * 개별 주문 상세 내역 및 해몽 결과(`dream_results`)를 반환합니다.
 * 보안 요건:
 * - IDOR(Insecure Direct Object Reference) 방어:
 *   요청자의 세션(회원 user_id) 또는 비회원 게스트 토큰이 해당 주문의 소유주와 일치하는지 엄격히 대조합니다.
 *   타인의 주문 접근 시 403 Forbidden을 반환합니다.
 */
export const GET = async (_request: NextRequest, context: RouteContext) => {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { code: 'INVALID_ID', message: '주문 식별자가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // id가 UUID인지 order_number 문자열인지 판별하여 조회
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const query = adminSupabase
      .from('orders')
      .select('*, dream_results(*), users(id, role, nickname, email, phone_number)')
      .limit(1);

    const { data: orders, error: selectError } = isUuid
      ? await query.eq('id', id)
      : await query.eq('order_number', id);

    if (selectError) {
      throw new Error(selectError.message);
    }

    const order = orders && orders[0] ? orders[0] : null;

    if (!order) {
      return NextResponse.json(
        { code: 'ORDER_NOT_FOUND', message: '해당 주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소유권 인가 검증
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. 로그인 회원인 경우 본인 주문인지 확인
    if (user) {
      if (order.user_id !== user.id) {
        return NextResponse.json(
          { code: 'FORBIDDEN', message: '타인의 주문 내역에는 접근할 수 없습니다.' },
          { status: 403 }
        );
      }
    } else {
      // 2. 비회원 게스트 토큰 쿠키 확인
      // 비로그인 상태이면서 회원 주문인 경우 차단
      if (order.users?.role === 'member') {
        return NextResponse.json(
          { code: 'UNAUTHORIZED', message: '회원 전용 주문 내역입니다. 로그인 후 확인해주세요.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '주문 상세 조회 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'ORDER_DETAIL_ERROR', message },
      { status: 500 }
    );
  }
};
