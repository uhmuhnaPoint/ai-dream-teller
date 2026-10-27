'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  User,
  MessageSquare,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Hash,
  ShieldCheck,
  ArrowRight,
  Phone,
} from 'lucide-react';

type InquiryType = 'PAYMENT' | 'DREAM_RESULT' | 'GUEST_ORDER' | 'PARTNERSHIP' | 'OTHER';

interface InquiryTypeOption {
  id: InquiryType;
  label: string;
  badge: string;
}

const INQUIRY_TYPES: InquiryTypeOption[] = [
  { id: 'PAYMENT', label: '결제 및 환불 문의', badge: '결제' },
  { id: 'DREAM_RESULT', label: '해몽 분석 오류 / 이미지 재생성', badge: '해몽' },
  { id: 'GUEST_ORDER', label: '비회원 주문 조회 및 비밀번호', badge: '비회원' },
  { id: 'PARTNERSHIP', label: '서비스 제휴 및 제안', badge: '제휴' },
  { id: 'OTHER', label: '기타 일반 문의', badge: '기타' },
];

const FAQS = [
  {
    q: '결제했는데 결과서가 바로 안 보여요.',
    a: 'AI 심층 해몽 파이프라인 및 고화질 일러스트 생성은 평균 1~3분 정도 소요됩니다. 5분이 지나도 확인되지 않을 경우 [해석 확인 페이지]를 새로고침하시거나, 주문 번호와 함께 문의해 주시면 즉시 확인해 드립니다.',
  },
  {
    q: '비회원 주문 비밀번호를 잊어버렸어요.',
    a: '결제 시 입력하셨던 휴대폰 번호와 대략적인 결제 일시/금액을 문의 내용에 남겨주시면, 본인 확인 절차 후 등록된 휴대폰 번호로 임시 비밀번호를 발송해 드립니다.',
  },
  {
    q: '해몽 결과나 AI 일러스트를 다시 생성할 수 있나요?',
    a: '서버 오류나 부적절한 이미지 생성 등 시스템 문제로 인한 결과물은 100% 무료로 재분석을 지원해 드립니다. 문의 유형에서 [해몽 분석 오류 / 이미지 재생성]을 선택하고 접수해 주세요.',
  },
  {
    q: '환불 규정이 궁금합니다.',
    a: '디지털 콘텐츠 특성상 AI 분석 및 이미지 생성이 이미 완료된 건은 원칙적으로 환불이 불가합니다. 단, 시스템 장애로 인해 10분 이상 결과서가 생성되지 않은 미완료 건은 결제 금액 전액이 즉시 자동 취소/환불됩니다.',
  },
];

/**
 * ContactForm: 1:1 고객 문의 폼 및 빠른 해결 FAQ 컴포넌트
 */
export const ContactForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('PAYMENT');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [agreedPrivacy, setAgreedPrivacy] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('이름 또는 닉네임을 입력해 주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('답변받으실 유효한 이메일 주소를 입력해 주세요.');
      return;
    }

    if (message.trim().length < 10) {
      setErrorMessage('문의 내용을 최소 10자 이상 상세히 작성해 주세요.');
      return;
    }

    if (!agreedPrivacy) {
      setErrorMessage('개인정보 수집 및 이용 동의가 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    // 문의 접수 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setOrderNumber('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 좌측: 문의 작성 폼 */}
      <div className="lg:col-span-7 bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-950/5 relative overflow-hidden backdrop-blur-sm">
        {/* 상단 미세 오로라 데코 */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        {isSubmitted ? (
          /* 문의 접수 완료 화면 */
          <div className="py-10 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                접수 완료
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#1E1B2E]">
                문의가 정상적으로 접수되었습니다
              </h2>
              <p className="text-xs sm:text-sm text-[#5D576B] max-w-md mx-auto leading-relaxed">
                작성해 주신 이메일(<strong>{email}</strong>)로 영업일 기준 24시간 이내에 정성껏 검토 후 답변을 발송해 드리겠습니다.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                추가 문의 작성하기
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1E1B2E] text-amber-300 hover:text-amber-200 text-xs font-bold shadow-md transition-all"
              >
                메인 홈으로 이동
              </Link>
            </div>
          </div>
        ) : (
          /* 문의 입력 폼 */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-[#6B46C1] text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>1:1 고객 지원 센터</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E1B2E]">
                궁금한 점이나 도움이 필요하신가요?
              </h2>
              <p className="text-xs text-[#7A7165]">
                꿈 해몽 분석, 결제, 비회원 주문 조회 등 무엇이든 편하게 남겨주세요.
              </p>
            </div>

            {/* 에러 메시지 알림 */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 문의 유형 선택 칩 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1E1B2E]">
                문의 유형 <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INQUIRY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInquiryType(type.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      inquiryType === type.id
                        ? 'bg-[#1E1B2E] text-amber-300 border-[#1E1B2E] shadow-xs scale-102'
                        : 'bg-white text-stone-600 border-[#DDD5C7] hover:border-stone-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 이름 및 이메일 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E1B2E]">
                  이름 / 닉네임 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    required
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-xs sm:text-sm text-[#1E1B2E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E1B2E]">
                  답변받으실 이메일 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-xs sm:text-sm text-[#1E1B2E] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 주문 번호 (선택 사항) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1E1B2E]">
                주문 번호 <span className="text-stone-400 font-normal">(선택사항 - 결제/주문 문의 시)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="예: ORD-20261027-77A9 또는 전화번호"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-xs sm:text-sm text-[#1E1B2E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 문의 내용 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1E1B2E]">
                  문의 상세 내용 <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-[#8C827A]">
                  {message.length}자 (최소 10자)
                </span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="문의하실 내용을 구체적으로 남겨주시면 더욱 정확하고 빠른 답변이 가능합니다."
                rows={5}
                required
                className="w-full p-3.5 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/20 text-xs sm:text-sm text-[#1E1B2E] focus:outline-hidden leading-relaxed resize-none"
              />
            </div>

            {/* 개인정보 수집 및 이용 동의 */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="agree-privacy"
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                className="w-4 h-4 text-[#6B46C1] rounded border-[#DDD5C7] focus:ring-[#6B46C1]"
              />
              <label htmlFor="agree-privacy" className="text-xs text-[#5D576B] cursor-pointer">
                문의 처리를 위한 개인정보(이름, 이메일, 주문정보) 수집 및 이용에 동의합니다.
              </label>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] hover:from-[#382260] hover:to-[#272338] text-amber-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>문의 내용을 전송하는 중...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>문의 접수하기</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 우측: 운영시간 안내 & 자주 묻는 질문(FAQ) */}
      <div className="lg:col-span-5 space-y-6">
        {/* 고객센터 운영 정보 카드 */}
        <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1E1B2E]">고객센터 운영 안내</h3>
              <p className="text-[11px] text-[#7A7165]">평일 10:00 ~ 18:00 (주말/공휴일 휴무)</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#5D576B] border-t border-[#EAE3D6] pt-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[#8C827A]">답변 소요 시간</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                24시간 이내 회신
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8C827A]">공식 지원 이메일</span>
              <span className="font-mono text-[#1E1B2E]">support@aidreamteller.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8C827A]">비회원 즉시 조회</span>
              <Link href="/guest-login" className="text-[#6B46C1] hover:underline font-bold">
                비회원 주문 조회 바로가기 →
              </Link>
            </div>
          </div>
        </div>

        {/* 자주 묻는 질문 (FAQ) 아코디언 */}
        <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-[#6B46C1]">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1E1B2E]">자주 묻는 질문 (FAQ)</h3>
              <p className="text-[11px] text-[#7A7165]">문의 전 해결 방법을 빠르게 확인해 보세요.</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#EAE3D6] pt-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#E2D9CC] bg-white rounded-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-xs font-bold text-[#1E1B2E] hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#6B46C1]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-[#5D576B] leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/40 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
