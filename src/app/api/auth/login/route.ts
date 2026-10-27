import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthCallbackUrl } from '@/lib/supabase/url';

interface LoginRequestBody {
  provider?: 'google' | 'kakao';
  redirectTo?: string;
}

/**
 * POST /api/auth/login
 * 소셜 로그인(Google, Kakao) 인증 URL 생성 및 리다이렉션 API
 * - 클라이언트 또는 서버 사이드에서 호출하여 OAuth 제공자의 인증 로그인 URL을 반환받습니다.
 */
export const POST = async (request: Request) => {
  try {
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
    const provider = body.provider || 'google';
    const redirectTo = body.redirectTo || '/dream-teller';

    if (provider !== 'google' && provider !== 'kakao') {
      return NextResponse.json(
        { success: false, message: '지원하지 않는 소셜 로그인 제공자입니다. (google, kakao 지원)' },
        { status: 400 }
      );
    }

    const callbackUrl = getAuthCallbackUrl(redirectTo);
    const supabase = await createClient();

    const options: {
      redirectTo: string;
      scopes?: string;
      queryParams?: Record<string, string>;
    } = {
      redirectTo: callbackUrl,
      queryParams: {
        prompt: 'select_account',
      },
    };

    if (provider === 'kakao') {
      options.scopes = 'profile_nickname';
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });


    if (error) {
      console.error(`[API /api/auth/login] ${provider} OAuth URL 생성 오류:`, error.message);
      return NextResponse.json(
        { success: false, message: `소셜 로그인 URL 생성 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      provider,
    });
  } catch (error) {
    console.error('[API /api/auth/login] 예외 발생:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
