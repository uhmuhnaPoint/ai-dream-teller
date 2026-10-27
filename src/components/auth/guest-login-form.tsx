'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  Search,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

/**
 * 전화번호 자동 하이픈 포맷팅 함수
 */
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

/**
 * 비회원 로그인 폼 컴포넌트
 * 요구사항 준수:
 * - 전화번호·비밀번호 입력
 * - 주문 조회 버튼 클릭 시 인증 후 /guest-check 이동
 * - 테스트 편의용 원클릭 데모 계정 프리셋 지원
 */
export const GuestLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('next') || '/guest-check';

  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (errorMessage) setErrorMessage(null);
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  // 데모 주문 정보 자동 채우기
  const handleFillDemo = () => {
    setPhone('010-1234-5678');
    setPassword('1234');
    setErrorMessage(null);
  };

  // 폼 제출 핸들러 (비회원 로그인 및 주문 조회)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('휴대폰 번호 10~11자리를 정확히 입력해 주세요.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('주문 시 설정한 비밀번호 4자리 이상을 입력해 주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || '일치하는 비회원 주문 정보를 찾을 수 없습니다.');
        return;
      }

      // 비회원 인증 세션 로컬 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'dream_teller_guest_session',
          JSON.stringify({
            token: data.token,
            user: data.guestUser,
            loggedInAt: Date.now(),
          })
        );
      }

      // 비회원 주문 조회 페이지로 이동
      router.push(redirectTarget);
    } catch (err) {
      console.error('비회원 로그인 통신 에러:', err);
      setErrorMessage('서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 상단 엠블럼 & 헤더 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#1E1B2E] border border-amber-400/30 text-amber-300 shadow-xl shadow-purple-950/20 mb-3 ring-4 ring-amber-400/10">
          <Search className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#6B46C1] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>비회원 전용 조회</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-serif font-bold text-[#1E1B2E] tracking-tight">
          비회원 주문 조회
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#5D576B] leading-relaxed">
          결제 시 입력하셨던 전화번호와 비밀번호로 꿈 해석 리포트를 조회합니다.
        </p>
      </div>

      {/* 비회원 로그인 양피지 카드 */}
      <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/5 relative overflow-hidden backdrop-blur-md">
        {/* 상단 오로라 골드 라인 */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        {/* 에러 알림 */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">조회 불가</p>
              <p className="mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. 휴대폰 번호 입력 필드 */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone-input"
              className="block text-xs font-semibold text-[#4A3E3D]"
            >
              휴대폰 번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-sm text-[#1E1B2E] placeholder:text-stone-400 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* 2. 비밀번호 입력 필드 */}
          <div className="space-y-1.5">
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold text-[#4A3E3D]"
            >
              주문 비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="결제 시 설정한 비밀번호 (4자리 이상)"
                maxLength={20}
                required
                className="w-full h-12 pl-10 pr-11 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-sm text-[#1E1B2E] placeholder:text-stone-400 focus:outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                title={showPassword ? '비밀번호 가리기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#8C827A]">
              비회원 결제 시 직접 입력하셨던 4자리 이상의 비밀번호입니다.
            </p>
          </div>

          {/* 데모 정보 자동 입력 칩 */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B5B95] bg-[#E8E0F8]/50 hover:bg-[#E8E0F8] border border-[#D5C7F0] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6B5B95]" />
              <span>테스트용 예시 정보 자동 입력 (010-1234-5678 / 1234)</span>
            </button>
          </div>

          {/* 3. 주문 조회 버튼 (PRD 명세) */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] hover:from-[#382260] hover:to-[#272338] text-amber-300 hover:text-amber-200 font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>주문 내역 확인 중...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>주문 조회하기</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* 보안 안심 안내 */}
        <div className="mt-6 pt-5 border-t border-[#EAE3D6] flex items-center justify-center gap-2 text-xs text-[#7A7165]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>입력하신 정보는 주문 조회 및 암호화 검증에만 사용됩니다.</span>
        </div>

        {/* 회원 로그인 유도 링크 */}
        <div className="mt-5 text-center pt-2">
          <p className="text-xs text-[#7A7165]">
            카카오 또는 Google 계정으로 결제하셨나요?
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-1 text-xs text-[#6B46C1] hover:text-[#553C9A] font-bold mt-1 hover:underline transition-colors"
          >
            <span>회원 로그인으로 이동하기</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 하단 바로 작성 링크 */}
      <div className="mt-6 text-center">
        <Link
          href="/dream-teller"
          className="inline-flex items-center gap-1.5 text-xs text-[#7A7165] hover:text-[#1E1B2E] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>새로운 꿈 해석 의뢰하러 가기</span>
        </Link>
      </div>
    </div>
  );
};
