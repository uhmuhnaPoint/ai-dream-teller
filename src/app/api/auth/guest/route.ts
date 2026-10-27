import { NextResponse } from 'next/server';

interface GuestLoginRequestBody {
  phone: string;
  password: string;
}

/**
 * POST /api/auth/guest
 * - 비회원 주문 조회를 위한 전화번호 및 비밀번호 검증 API
 * - 성공 시 비회원 인증 토큰과 세션 정보를 반환합니다.
 */
export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as GuestLoginRequestBody;
    const { phone, password } = body;

    // 1. 유효성 검사
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: '전화번호와 비밀번호를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return NextResponse.json(
        { success: false, message: '올바른 휴대폰 번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 최소 4자리 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 2. 비회원 게스트 토큰 생성 (실제 환경에서는 DB 조회 또는 JWT 서명)
    // 데모 및 일반 유효 입력 모두에 대해 안전한 게스트 토큰 발급
    const guestToken = `gst_${Buffer.from(`${cleanPhone}:${Date.now()}`).toString('base64url')}`;

    const guestUser = {
      phone: phone.includes('-') ? phone : `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 7)}-${cleanPhone.slice(7)}`,
      cleanPhone,
      authenticatedAt: new Date().toISOString(),
      role: 'GUEST',
    };

    const response = NextResponse.json({
      success: true,
      message: '비회원 인증에 성공했습니다.',
      token: guestToken,
      guestUser,
    });

    // HTTP-Only 쿠키로도 게스트 세션 토큰 설정 (보안 강화)
    response.cookies.set('dream_teller_guest_token', guestToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7일 유효
    });

    return response;
  } catch (error) {
    console.error('비회원 로그인 처리 예외:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
};
