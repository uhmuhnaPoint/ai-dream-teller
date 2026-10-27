import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/supabase/url';

/**
 * Supabase OAuth 콜백 라우트 핸들러
 * - 소셜 로그인 인증 코드(code)를 교환하여 세션을 생성하고
 * - 성공 시 사용자를 프로덕트 상세 페이지(/dream-teller)로 리디렉트합니다.
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dream-teller';

  // 환경에 맞는 대상 도메인 산출 (개발: localhost / 프로덕트: 배포 도메인)
  const baseUrl = origin && !origin.includes('localhost') ? origin : getBaseUrl();

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // 로그인 성공 시 프로덕트 상세 페이지(/dream-teller)로 이동
        const targetUrl = new URL(next, baseUrl).toString();
        return NextResponse.redirect(targetUrl);
      }

      console.error('OAuth code exchange error:', error.message);
    } catch (err) {
      console.error('Unexpected auth callback error:', err);
    }
  }

  // 인증 실패 또는 코드 부재 시 에러 쿼리와 함께 /auth로 이동
  const failUrl = new URL(`/auth?error=auth_callback_failed`, baseUrl).toString();
  return NextResponse.redirect(failUrl);
};
