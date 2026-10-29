'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

/**
 * Footer: 전역 푸터 컴포넌트입니다.
 * 사업자 등록 정보, 법적 고지(이용약관, 개인정보처리방침), 문의 링크를 제공합니다.
 * 관리자 콘솔(/admin)에서는 렌더링되지 않습니다.
 */
const Footer = () => {
  const pathname = usePathname();

  // 관리자 페이지 경로에서는 일반 푸터 숨김 처리
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#E8E0F8] text-[#716A89] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* 서비스 명 및 간략 소개 */}
        <div className="space-y-2 max-w-sm">
          <div className="flex items-center gap-2 text-[#1E1B2E] font-bold text-base">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>AI DREAM TELLER</span>
          </div>
          <p className="text-xs text-[#716A89] leading-relaxed">
            무의식이 남긴 상징과 기호를 4대 학문적 관점으로 해독하는 AI 심층 해몽 아카이브.
            본 서비스의 분석 결과는 심리학적 통찰을 제공하며 의료 진단을 대체하지 않습니다.
          </p>
        </div>

        {/* 법적 링크 및 메뉴 */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-xs">
          <div>
            <span className="font-semibold text-[#1E1B2E] block mb-2.5">서비스 안내</span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/dream-teller" className="hover:text-[#6B46C1] transition-colors">
                  꿈 해몽 신청
                </Link>
              </li>
              <li>
                <Link href="/feeds" className="hover:text-[#6B46C1] transition-colors">
                  공개 꿈 피드
                </Link>
              </li>
              <li>
                <Link href="/guest-check" className="hover:text-[#6B46C1] transition-colors">
                  비회원 주문 조회
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1E1B2E] block mb-2.5">약관 및 정책</span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/terms" className="hover:text-[#6B46C1] transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#6B46C1] transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#6B46C1] transition-colors">
                  고객 문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 사업자 정보 및 저작권 */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#E8E0F8]/60 text-[11px] text-[#716A89] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          상호명: AI DREAM TELLER | 대표자: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2024-서울강남-00000호
        </p>
        <p>© 2024 AI Dream Teller. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
