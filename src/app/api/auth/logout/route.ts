import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/logout
 * 현재 세션 사용자 로그아웃 처리 API
 * - Supabase 세션 쿠키를 무효화하고 세션을 종료합니다.
 */
export const POST = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[API /api/auth/logout] 로그아웃 오류:', error.message);
      return NextResponse.json(
        { success: false, message: `로그아웃 처리 실패: ${error.message}` },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: '성공적으로 로그아웃되었습니다.',
    });

    // 비회원 토큰 쿠키가 남아있다면 함께 정리
    response.cookies.delete('dream_teller_guest_token');

    return response;
  } catch (error) {
    console.error('[API /api/auth/logout] 예외 발생:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
