'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck, Moon, ArrowRight, Lock, AlertCircle, BookOpen } from 'lucide-react';
import { SocialButtons } from './social-buttons';
import { getBaseUrl } from '@/lib/supabase/url';

/**
 * 로그인 메인 카드 컴포넌트
 * - 디자인 가이드(Ivory, Charcoal Violet, Gold, Wax Seal)를 반영한 신비로운 무의식 서재 테마
 * - 카카오/구글 공식 로그인 버튼 탑재
 * - 개발/프로덕션 도메인 뱃지 및 상태 피드백
 */
export const AuthCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dream-teller';
  const errorParam = searchParams.get('error');

  const [currentOrigin, setCurrentOrigin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoSigningIn, setIsDemoSigningIn] = useState<boolean>(false);

  useEffect(() => {
    setCurrentOrigin(getBaseUrl());
    if (errorParam === 'auth_callback_failed') {
      setErrorMessage('소셜 인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }, [errorParam]);

  // 빠른 테스트/시뮬레이션용 데모 로그인 핸들러
  const handleQuickDemoLogin = () => {
    setIsDemoSigningIn(true);
    try {
      // 로컬 스토리지에 데모 유저 식별자 기록
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'dream_teller_auth_session',
          JSON.stringify({
            user: {
              id: 'demo-scholar-user-01',
              email: 'dreamer@psychology.art',
              user_metadata: { name: '꿈을 기록하는 방랑자', avatar_url: '' },
            },
            timestamp: Date.now(),
          })
        );
        // 전역 AuthProvider에 즉시 인증 변경 알림
        window.dispatchEvent(new Event('dream_teller_auth_change'));
      }
      setTimeout(() => {
        router.push(next);
      }, 300);
    } catch (e) {
      console.error(e);
      router.push(next);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 마법 도서관 인장 장식 (Wax Seal) */}
      <div className="relative mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#1E1B2E] shadow-xl shadow-purple-950/20 border border-purple-400/30 text-amber-300 ring-4 ring-amber-400/10 mb-4 transform hover:rotate-6 transition-transform">
          <Moon className="w-8 h-8 fill-amber-300/20 stroke-amber-300" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>무의식의 기록 보관소</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-serif font-bold text-[#1E1B2E] tracking-tight">
          밤의 비밀 서재 입장
        </h1>
        <p className="mt-2 text-sm text-[#5D576B] leading-relaxed">
          당신의 꿈을 분석하고 무의식 캘린더에 영구 보존하세요.
        </p>
      </div>

      {/* 메인 로그인 양피지 카드 */}
      <div className="relative bg-[#FAF8F5]/90 backdrop-blur-md rounded-2xl border border-[#E8E0D5] p-6 sm:p-8 shadow-2xl shadow-purple-950/5">
        {/* 상단 미세 오로라 라인 */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        {/* 현재 환경 도메인 안내 뱃지 */}
        <div className="mb-6 flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#F0EBE1] border border-[#E2D9CC] text-[#6B6154]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            인증 리디렉트 대상 도메인
          </span>
          <span className="font-mono text-[11px] text-[#423C34] truncate max-w-[180px]">
            {currentOrigin || '로딩 중...'}
          </span>
        </div>

        {/* 에러 피드백 알림 */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">로그인 알림</p>
              <p className="mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 소셜 로그인 공식 버튼 그룹 */}
        <div className="space-y-4">
          <SocialButtons
            redirectTo={next}
            onAuthError={(msg) => setErrorMessage(msg)}
          />

          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-[#E8E0D5]" />
            <span className="absolute bg-[#FAF8F5] px-3 text-[11px] font-medium text-[#8A8175] tracking-wider uppercase">
              또는
            </span>
          </div>

          {/* 간편 둘러보기 / 데모 빠른 입장 버튼 */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isDemoSigningIn}
            className="w-full h-11 px-4 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#4A3E3D] bg-[#F3EFEA] hover:bg-[#EAE4DC] active:scale-[0.99] border border-[#DDD5C7] transition-all cursor-pointer group"
          >
            <BookOpen className="w-4 h-4 text-[#8A7968] group-hover:text-[#4A3E3D] transition-colors" />
            <span>{isDemoSigningIn ? '서재로 이동 중...' : '체험 계정으로 1초 만에 입장하기'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8A7968] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 보안 및 보증 인장 */}
        <div className="mt-6 pt-5 border-t border-[#EFE9DF] grid grid-cols-2 gap-3 text-center text-xs text-[#7A7165]">
          <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% 비밀 보장</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white/60">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>SSL 보안 암호화</span>
          </div>
        </div>

        {/* 비회원 바로 작성 링크 */}
        <div className="mt-6 text-center">
          <Link
            href="/dream-teller"
            className="inline-flex items-center gap-1 text-xs text-[#6B5B95] hover:text-[#4D3A7A] hover:underline font-medium transition-colors"
          >
            <span>로그인 없이 비회원으로 꿈 해석 시작하기</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 하단 약관 안내 */}
      <p className="mt-6 text-center text-[11px] text-[#8C827A] leading-relaxed">
        로그인 시{' '}
        <Link href="/terms" className="underline hover:text-[#4A3E3D]">
          이용약관
        </Link>
        과{' '}
        <Link href="/privacy" className="underline hover:text-[#4A3E3D]">
          개인정보처리방침
        </Link>
        에 동의하게 됩니다.
      </p>
    </div>
  );
};
