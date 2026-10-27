'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface StepGuestOrderInfoProps {
  phone: string;
  password: string;
  onChangePhone: (phone: string) => void;
  onChangePassword: (password: string) => void;
  onPrev: () => void;
  onSubmitOrder: () => void;
  isSubmitting: boolean;
  totalAmount: number;
}

/**
 * 전화번호 자동 하이픈 포맷터
 */
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

/**
 * StepGuestOrderInfo: 비회원 주문 시에만 표시되는 4번째 아코디언 섹션
 * 요구사항 준수:
 * - 비회원 유저가 자신의 전화번호와 비밀번호를 통해 주문 가능하도록 정보 입력
 * - 로그인 회원에게는 노출되지 않음
 * - 결제 완료 후 /guest-check에서 조회할 수 있도록 안내
 */
const StepGuestOrderInfo = ({
  phone,
  password,
  onChangePhone,
  onChangePassword,
  onPrev,
  onSubmitOrder,
  isSubmitting,
  totalAmount,
}: StepGuestOrderInfoProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChangePhone(formatted);
    if (error) setError(null);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangePassword(e.target.value);
    if (error) setError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('휴대폰 번호 10~11자리를 정확히 입력해 주세요.');
      return;
    }
    if (!password || password.length < 4) {
      setError('주문 조회에 사용할 비밀번호를 4자리 이상 입력해 주세요.');
      return;
    }
    setError(null);
    onSubmitOrder();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* 안내 뱃지 */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-purple-100 text-[#6B46C1] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-[#4B4562] space-y-1">
          <p className="font-bold text-[#1E1B2E]">
            비회원 주문 안내
          </p>
          <p className="leading-relaxed text-[#5D576B]">
            회원가입 없이 결제한 후, 상단 <strong>[비회원 주문 조회]</strong> 메뉴에서 지금 입력하시는 <strong>휴대폰 번호와 비밀번호</strong>로 언제든 결과서를 다시 확인하실 수 있습니다.
          </p>
        </div>
      </div>

      {/* 에러 메시지 알림 */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 입력 필드 그룹 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. 휴대폰 번호 */}
        <div className="space-y-1.5">
          <label
            htmlFor="guest-phone"
            className="block text-xs font-bold text-[#1E1B2E]"
          >
            휴대폰 번호 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="guest-phone"
              type="tel"
              value={phone}
              onChange={handlePhoneInputChange}
              placeholder="010-0000-0000"
              maxLength={13}
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-sm text-[#1E1B2E] placeholder:text-stone-400 focus:outline-hidden transition-all"
            />
          </div>
          <p className="text-[11px] text-[#8C827A]">
            해몽 완료 알림톡/문자 수신 및 주문 조회용
          </p>
        </div>

        {/* 2. 비밀번호 */}
        <div className="space-y-1.5">
          <label
            htmlFor="guest-password"
            className="block text-xs font-bold text-[#1E1B2E]"
          >
            주문 비밀번호 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="guest-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordInputChange}
              placeholder="비밀번호 (4자리 이상)"
              maxLength={20}
              required
              className="w-full h-12 pl-10 pr-11 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-sm text-[#1E1B2E] placeholder:text-stone-400 focus:outline-hidden transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
              title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[#8C827A]">
            추후 결과서 열람 시 필요한 비밀번호입니다.
          </p>
        </div>
      </div>

      {/* 소셜 로그인 안내 링크 */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between gap-3 text-xs">
        <span className="text-amber-900 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>간편 로그인하면 4번 입력 없이 바로 결제할 수 있어요!</span>
        </span>
        <Link
          href="/auth?next=/dream-teller"
          className="text-[#6B46C1] hover:text-[#553C9A] font-bold underline shrink-0 transition-colors"
        >
          소셜 로그인하기
        </Link>
      </div>

      {/* 하단 액션 버튼 그룹 */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EAE3D6]">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 단계 (결제 옵션)</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] hover:from-[#382260] hover:to-[#272338] text-amber-300 hover:text-amber-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              <span>결제 준비 중...</span>
            </>
          ) : (
            <>
              <span>{totalAmount.toLocaleString()}원 결제하기</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StepGuestOrderInfo;
