'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getAuthCallbackUrl } from '@/lib/supabase/url';
import { Loader2 } from 'lucide-react';

interface SocialButtonsProps {
  redirectTo?: string;
  onAuthError?: (message: string) => void;
}

/**
 * 카카오 공식 심볼 로고 SVG (공식 규격)
 */
export const KakaoSymbol = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3C6.477 3 2 6.477 2 10.767c0 2.738 1.815 5.14 4.57 6.463-.201.751-.726 2.716-.831 3.136-.131.52.191.513.402.373.167-.11 2.651-1.8 3.731-2.535.702.099 1.424.153 2.158.153 5.523 0 10-3.477 10-7.767S17.523 3 12 3z" />
  </svg>
);

/**
 * 구글 공식 4색 "G" 로고 SVG (Google Identity Guideline 규격)
 */
export const GoogleSymbol = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

/**
 * 소셜 로그인 버튼 그룹 컴포넌트
 * - 카카오 공식 버튼 가이드라인 준수 (Background: #FEE500, Text/Icon: #000000 85%, 라벨: 카카오 로그인)
 * - 구글 공식 버튼 가이드라인 준수 (White, Border: #DADCE0, Google 4색 G 로고, 라벨: Google 계정으로 로그인)
 * - 개발 환경(localhost)과 프로덕트 환경(Vercel 도메인)을 자동 판별하여 콜백 URL 생성
 */
export const SocialButtons = ({
  redirectTo = '/dream-teller',
  onAuthError,
}: SocialButtonsProps) => {
  const [loadingProvider, setLoadingProvider] = useState<'kakao' | 'google' | null>(null);

  const handleOAuthLogin = async (provider: 'kakao' | 'google') => {
    try {
      setLoadingProvider(provider);

      // 개발환경/프로덕션 도메인 자동 감지 및 콜백 URL 생성
      const callbackUrl = getAuthCallbackUrl(redirectTo);

      const supabase = createClient();
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

      // 카카오의 경우 account_email이 비즈니스 미인증 상태이므로 profile_nickname만 요청
      if (provider === 'kakao') {
        options.scopes = 'profile_nickname';
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options,
      });


      if (error) {
        console.error(`${provider} OAuth 에러:`, error.message);
        if (onAuthError) {
          onAuthError(`${provider === 'kakao' ? '카카오' : 'Google'} 로그인 연동 중 오류가 발생했습니다: ${error.message}`);
        }
      } else if (data?.url) {
        // OAuth 프로바이더 로그인 페이지로 이동
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      console.error('OAuth 로그인 예외 발생:', err);
      if (onAuthError) {
        const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        onAuthError(`로그인 처리 중 문제가 발생했습니다. (${errorMsg})`);
      }
    } finally {
      // 리디렉트가 즉시 발생하지 않을 경우를 대비해 일정 시간 후 로딩 해제
      setTimeout(() => setLoadingProvider(null), 3000);
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* 1. 카카오 공식 로그인 버튼 */}
      <button
        type="button"
        onClick={() => handleOAuthLogin('kakao')}
        disabled={loadingProvider !== null}
        aria-label="카카오 로그인"
        className="relative w-full h-[52px] px-5 flex items-center justify-center rounded-xl font-medium text-[15px] text-[#191919] bg-[#FEE500] hover:bg-[#FDD800] active:scale-[0.99] transition-all duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
      >
        <span className="absolute left-4 flex items-center justify-center">
          {loadingProvider === 'kakao' ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#191919]" />
          ) : (
            <KakaoSymbol className="w-5 h-5 text-[#191919] group-hover:scale-105 transition-transform" />
          )}
        </span>
        <span className="tracking-tight font-semibold">카카오 로그인</span>
      </button>

      {/* 2. 구글 공식 로그인 버튼 (Google Branding Standard) */}
      <button
        type="button"
        onClick={() => handleOAuthLogin('google')}
        disabled={loadingProvider !== null}
        aria-label="Google 계정으로 로그인"
        className="relative w-full h-[52px] px-5 flex items-center justify-center rounded-xl font-medium text-[15px] text-[#1F1F1F] bg-white hover:bg-[#F8F9FA] active:scale-[0.99] border border-[#DADCE0] hover:border-[#C5C7CB] transition-all duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
      >
        <span className="absolute left-4 flex items-center justify-center">
          {loadingProvider === 'google' ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
          ) : (
            <GoogleSymbol className="w-5 h-5 group-hover:scale-105 transition-transform" />
          )}
        </span>
        <span className="tracking-tight font-medium text-[#1F1F1F]">Google 계정으로 로그인</span>
      </button>
    </div>
  );
};
