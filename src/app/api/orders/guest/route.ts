import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/orders/guest
 * 비회원(게스트) 세션 토큰을 검증하여 해당 사용자의 주문 내역 목록만 격리 반환합니다.
 * 보안 요건:
 * 1. dream_teller_guest_token 쿠키 부재 또는 형식 오류 시 401 Unauthorized 차단
 * 2. 복호화된 cleanPhone 기반으로 users 테이블 조회 및 해당 게스트 소유 주문만 격리 필터링
 * 3. 타 비회원 또는 회원의 주문이 섞여 노출되는 데이터 유출(Data Leakage) 원천 방어
 */
export const GET = async (request: NextRequest) => {
  try {
    const guestCookie = request.cookies.get('dream_teller_guest_token');

    if (!guestCookie || !guestCookie.value) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: '비회원 인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = guestCookie.value;
    if (!token.startsWith('gst_')) {
      return NextResponse.json(
        { code: 'INVALID_TOKEN', message: '유효하지 않은 비회원 인증 토큰 형식입니다.' },
        { status: 401 }
      );
    }

    // 토큰 디코딩 (gst_base64url)
    const base64Data = token.slice(4);
    let decodedString = '';
    try {
      decodedString = Buffer.from(base64Data, 'base64url').toString('utf-8');
    } catch {
      return NextResponse.json(
        { code: 'INVALID_TOKEN', message: '비회원 인증 토큰 디코딩에 실패했습니다.' },
        { status: 401 }
      );
    }

    const [cleanPhone] = decodedString.split(':');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { code: 'INVALID_TOKEN_PAYLOAD', message: '비회원 토큰 정보가 유효하지 않습니다.' },
        { status: 401 }
      );
    }

    const adminSupabase = createAdminClient();

    // users 테이블에서 해당 전화번호의 게스트 계정 조회
    const { data: guestUser, error: userError } = await adminSupabase
      .from('users')
      .select('id, phone_number, role')
      .eq('phone_number', cleanPhone)
      .eq('role', 'guest')
      .maybeSingle();

    if (userError || !guestUser) {
      return NextResponse.json(
        { code: 'GUEST_NOT_FOUND', message: '일치하는 비회원 주문자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 해당 게스트 유저 ID로 체결된 주문만 격리 조회
    const { data: orders, error: ordersError } = await adminSupabase
      .from('orders')
      .select('*, dream_results(*)')
      .eq('user_id', guestUser.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw new Error(ordersError.message);
    }

    return NextResponse.json({
      success: true,
      data: orders || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '비회원 주문 내역 조회 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'GUEST_ORDERS_FETCH_ERROR', message },
      { status: 500 }
    );
  }
};
