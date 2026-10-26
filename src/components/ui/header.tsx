"use client";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

// 헤더 컴포넌트: 사이트 로고와 기본 네비게이션을 포함합니다.
// TODO: 필요에 따라 더 많은 메뉴 아이템과 사용자 프로필 드롭다운을 추가합니다.
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <Link href="/" className="text-2xl font-bold text-gray-800">
        AI Dream Teller
      </Link>
      {/* Desktop navigation (md and up) */}
      <nav className="hidden md:flex space-x-4">
        <Link href="/auth" className="text-gray-600 hover:text-gray-800">로그인</Link>
        <Link href="/guest-check" className="text-gray-600 hover:text-gray-800">비회원 주문 조회</Link>
        <Link href="/my-page" className="text-gray-600 hover:text-gray-800">마이페이지</Link>
      </nav>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col p-4" onClick={() => setIsOpen(false)}>
          <button
            className="self-end mb-4 p-2 rounded hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <nav className="flex flex-col space-y-2">
            <Link href="/" className="text-gray-800 hover:underline" onClick={() => setIsOpen(false)}>홈</Link>
            <Link href="/auth" className="text-gray-800 hover:underline" onClick={() => setIsOpen(false)}>로그인</Link>
            <Link href="/guest-check" className="text-gray-800 hover:underline" onClick={() => setIsOpen(false)}>비회원 주문 조회</Link>
            <Link href="/my-page" className="text-gray-800 hover:underline" onClick={() => setIsOpen(false)}>마이페이지</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
