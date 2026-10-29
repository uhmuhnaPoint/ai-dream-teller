'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

/**
 * Header: 전역 네비게이션 바 컴포넌트입니다.
 * - Warm Ivory 글래스모피즘과 마법 도서관 무드를 살린 로고 스타일을 적용합니다.
 * - 로그인 상태에 따라 로그인/비회원 주문 조회 또는 마이페이지/로그아웃 메뉴를 조건부 렌더링합니다.
 */
const Header = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 모바일 Drawer 오픈 시 ESC 키 닫힘 및 배경 스크롤 잠금 관리
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 로그아웃 수행 후 메인 화면으로 이동
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('[Header] 로그아웃 실패:', err);
    }
  };

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
        {!loading && user ? (
          <>
            <Link href="/my-page" className="hover:text-[#6B46C1] transition-colors">
              마이페이지
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-[#6B46C1] transition-colors cursor-pointer text-sm font-medium"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/auth" className="hover:text-[#6B46C1] transition-colors">
              로그인
            </Link>
            <Link href="/guest-login" className="hover:text-[#6B46C1] transition-colors">
              비회원 주문 조회
            </Link>
          </>
        )}
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
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 어두운 배경 오버레이 (백드롭 터치/클릭 시 닫힘) */}
          <div
            className="fixed inset-0 bg-[#1E1B2E]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* 상단 Drawer 메뉴 컨텐츠 */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="모바일 네비게이션 메뉴"
            className="relative bg-[#FAF8F5] border-b border-[#E8E0F8] p-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top duration-200 z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F8]">
              <span className="font-bold text-[#1E1B2E]">메뉴</span>
              <button
                type="button"
                className="p-1.5 rounded-lg text-[#4B4562] hover:bg-[#E8E0F8]/50"
                onClick={closeMenu}
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#1E1B2E]">
              <Link href="/" className="py-2 hover:text-[#6B46C1]" onClick={closeMenu}>
                홈
              </Link>
              <Link href="/feeds" className="py-2 hover:text-[#6B46C1]" onClick={closeMenu}>
                익명 꿈 피드 🌙
              </Link>
              <Link href="/dream-teller" className="py-2 text-[#6B46C1] font-bold" onClick={closeMenu}>
                꿈 해몽 시작하기 ✨
              </Link>
              {!loading && user ? (
                <>
                  <Link href="/my-page" className="py-2 hover:text-[#6B46C1]" onClick={closeMenu}>
                    마이페이지
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="py-2 text-left hover:text-[#6B46C1] cursor-pointer"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth" className="py-2 hover:text-[#6B46C1]" onClick={closeMenu}>
                    로그인
                  </Link>
                  <Link href="/guest-login" className="py-2 hover:text-[#6B46C1]" onClick={closeMenu}>
                    비회원 주문 조회
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
