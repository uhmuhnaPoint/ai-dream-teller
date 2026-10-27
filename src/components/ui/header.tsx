'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';

/**
 * Header: 전역 네비게이션 바 컴포넌트입니다.
 * Warm Ivory 글래스모피즘과 마법 도서관 무드를 살린 로고 스타일을 적용합니다.
 */
const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E0F8]/80 transition-all">
      {/* 사이트 브랜드 로고 */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#1E1B2E] to-[#6B46C1] flex items-center justify-center text-[#D4AF37] shadow-xs group-hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1E1B2E]">
          AI DREAM TELLER
        </span>
      </Link>

      {/* 데스크톱 네비게이션 링크 */}
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#4B4562]">
        <Link href="/feeds" className="hover:text-[#6B46C1] transition-colors">
          꿈 피드
        </Link>
        <Link href="/auth" className="hover:text-[#6B46C1] transition-colors">
          로그인
        </Link>
        <Link href="/guest-check" className="hover:text-[#6B46C1] transition-colors">
          비회원 주문 조회
        </Link>
        <Link href="/my-page" className="hover:text-[#6B46C1] transition-colors">
          마이페이지
        </Link>
        <Link
          href="/dream-teller"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E1B2E] text-white text-xs font-semibold hover:bg-[#2D2438] transition-colors shadow-xs"
        >
          <span>해몽 시작</span>
          <span className="text-[#D4AF37]">✨</span>
        </Link>
      </nav>

      {/* 모바일 햄버거 토글 버튼 */}
      <button
        type="button"
        className="md:hidden p-2 rounded-lg text-[#1E1B2E] hover:bg-[#E8E0F8]/50 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 모바일 Drawer (위에서 아래로 풀 너비 슬라이드) */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#1E1B2E]/40 backdrop-blur-xs z-50 md:hidden flex flex-col justify-start">
          <div className="bg-[#FAF8F5] border-b border-[#E8E0F8] p-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F8]">
              <span className="font-bold text-[#1E1B2E]">메뉴</span>
              <button
                type="button"
                className="p-1.5 rounded-lg text-[#4B4562] hover:bg-[#E8E0F8]/50"
                onClick={() => setIsOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#1E1B2E]">
              <Link href="/" className="py-2 hover:text-[#6B46C1]" onClick={() => setIsOpen(false)}>
                홈
              </Link>
              <Link href="/feeds" className="py-2 hover:text-[#6B46C1]" onClick={() => setIsOpen(false)}>
                익명 꿈 피드 🌙
              </Link>
              <Link href="/dream-teller" className="py-2 text-[#6B46C1] font-bold" onClick={() => setIsOpen(false)}>
                꿈 해몽 시작하기 ✨
              </Link>
              <Link href="/auth" className="py-2 hover:text-[#6B46C1]" onClick={() => setIsOpen(false)}>
                로그인
              </Link>
              <Link href="/guest-check" className="py-2 hover:text-[#6B46C1]" onClick={() => setIsOpen(false)}>
                비회원 주문 조회
              </Link>
              <Link href="/my-page" className="py-2 hover:text-[#6B46C1]" onClick={() => setIsOpen(false)}>
                마이페이지
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
