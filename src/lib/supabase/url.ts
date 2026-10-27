/**
 * 개발/프로덕션 환경에 따른 도메인 Base URL 반환 유틸리티
 * - 브라우저(클라이언트): 현재 접속 중인 origin (localhost:3000 또는 Vercel 프로덕션 도메인)
 * - 서버 환경: 환경 변수(NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BASE_URL, VERCEL_URL) 참조
 */
export const getBaseUrl = (): string => {
  // 1. 브라우저 환경에서는 현재 주소창의 origin 우선 (동적 감지)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Vercel 프로덕션/미리보기 환경 변수
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. 로컬 기본값
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

/**
 * 로그인 성공 후 리디렉트할 OAuth Callback 전체 URL 생성
 * @param next 로그인 완료 후 최종 이동할 목적지 경로 (기본값: /dream-teller)
 */
export const getAuthCallbackUrl = (next = '/dream-teller'): string => {
  const baseUrl = getBaseUrl();
  const cleanNext = next.startsWith('/') ? next : `/${next}`;
  return `${baseUrl}/auth/callback?next=${encodeURIComponent(cleanNext)}`;
};
