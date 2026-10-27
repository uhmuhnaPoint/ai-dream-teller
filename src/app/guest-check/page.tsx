'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import {
  Search,
  FileText,
  Calendar,
  CreditCard,
  Check,
  ArrowRight,
  LogOut,
  Sparkles,
  Lock,
  ImageIcon,
} from 'lucide-react';

interface GuestOrder {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  perspective: string;
  title: string;
  summary: string;
  hasImage: boolean;
  imageUrl?: string;
  price: number;
}

const DUMMY_GUEST_ORDERS: GuestOrder[] = [
  {
    orderId: 'DREAM_1014',
    orderNumber: 'ORD-GUEST-20261014-98A1',
    createdAt: '2026.10.14 07:40',
    perspective: '현대 인지신경과학',
    title: '기울어진 사무실 복도와 시계탑',
    summary: '끝없는 복도를 달리며 업무 마감 스트레스를 뇌가 수면 중 감정 탈감작으로 정화한 꿈입니다.',
    hasImage: false,
    price: 1500,
  },
  {
    orderId: 'DREAM_CURRENT',
    orderNumber: 'ORD-GUEST-20261027-33B4',
    createdAt: '2026.10.27 14:30',
    perspective: '칼 융 분석심리학',
    title: '보랏빛 도서관과 황금빛 부엉이',
    summary: '오로라 하늘을 날아 고대 지혜의 상징인 부엉이를 만난 꿈. 내면의 지혜와 직관의 각성을 상징합니다.',
    hasImage: true,
    imageUrl: '/images/pensieve-library.jpg',
    price: 2000,
  },
];

/**
 * 비회원 주문 조회 페이지 (/guest-check)
 * 요구사항 준수:
 * - 비회원 로그인 세션 확인
 * - 데이터 안정성 (Array/Object 분기 처리)
 * - 리스트 → 결과 페이지(/dream-result/[order-id]) 이동
 */
const GuestCheckPage = () => {
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [orders, setOrders] = useState<GuestOrder[]>(DUMMY_GUEST_ORDERS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 비회원 세션 확인
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('dream_teller_guest_session');
      if (sessionStr) {
        try {
          const parsed = JSON.parse(sessionStr);
          if (parsed?.token) {
            setIsAuthenticated(true);
            setGuestPhone(parsed?.user?.phone || '010-****-****');
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dream_teller_guest_session');
    }
    setIsAuthenticated(false);
  };

  // 비회원 세션이 없는 경우 안내 뷰
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1E1B2E] flex flex-col justify-between">
        <Header />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-purple-950/5 w-full">
            <div className="w-16 h-16 rounded-2xl bg-[#2D1B4E] border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300 shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1E1B2E]">
                비회원 인증이 필요합니다
              </h1>
              <p className="text-xs sm:text-sm text-[#5D576B] leading-relaxed">
                주문 시 입력하신 휴대폰 번호와 비밀번호로 먼저 인증을 진행해 주세요.
              </p>
            </div>
            <Link
              href="/guest-login?next=/guest-check"
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] text-amber-300 font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>비회원 로그인하러 가기</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 데이터 안정성 처리: orders가 배열이 아닌 단일 객체로 반환되는 경우 대비 분기
  const safeOrders: GuestOrder[] = Array.isArray(orders)
    ? orders
    : orders
    ? [orders]
    : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1B2E] flex flex-col justify-between selection:bg-[#E8E0F8] selection:text-[#6B46C1] relative overflow-hidden">
      {/* 배경 은은한 오로라 글로우 */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E8E0F8]/50 to-[#F5E6CC]/30 blur-3xl pointer-events-none" />

      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 space-y-6">
        {/* 상단 비회원 정보 바 */}
        <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>비회원 조회 성공</span>
              </span>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-[#1E1B2E]">
                {guestPhone} 님의 주문 내역
              </h1>
            </div>
            <p className="text-xs text-[#7A7165]">
              총 <strong>{safeOrders.length}건</strong>의 꿈 해석 주문이 확인되었습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>조회 종료</span>
            </button>
            <Link
              href="/dream-teller"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E1B2E] text-white text-xs font-semibold hover:bg-[#2D2438] transition-colors"
            >
              <span>새 꿈 의뢰</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* 주문 리스트 영역 */}
        {safeOrders.length === 0 ? (
          <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#1E1B2E]">주문 내역이 없습니다</h2>
            <p className="text-xs text-[#7A7165]">
              해당 번호로 완료된 비회원 결제 건이 존재하지 않습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {safeOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#FAF8F5]/90 border border-[#E8E0D5] hover:border-[#D5C7F0] rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all space-y-4 group"
              >
                {/* 상단 메타 */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pb-3 border-b border-[#EAE3D6]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-semibold text-[#1E1B2E] bg-white px-2 py-0.5 rounded-md border border-[#E2D9CC]">
                      {order.orderNumber}
                    </span>
                    <span className="text-[#7A7165] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{order.createdAt}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>해석 완료</span>
                    </span>
                    <span className="text-[#5D576B] font-medium flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-stone-400" />
                      <span>{order.price.toLocaleString()}원</span>
                    </span>
                  </div>
                </div>

                {/* 본문 정보 */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {order.hasImage && (
                    <div className="relative w-full sm:w-28 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E2D9CC] bg-stone-100">
                      <Image
                        src={order.imageUrl || '/images/pensieve-library.jpg'}
                        alt={order.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 112px"
                      />
                      <div className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-amber-300">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                        {order.perspective}
                      </span>
                      {order.hasImage && (
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-amber-600" />
                          <span>AI 일러스트 보존됨</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-[#1E1B2E]">
                      {order.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5D576B] line-clamp-2 leading-relaxed">
                      {order.summary}
                    </p>
                  </div>
                </div>

                {/* 결과 페이지 이동 액션 */}
                <div className="pt-3 border-t border-[#EAE3D6] flex justify-end">
                  <Link
                    href={`/dream-result/${order.orderId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-400/40 hover:border-amber-400 shadow-sm hover:shadow-md transition-all group/btn"
                  >
                    <span>심층 해석 결과서 열람하기</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= 회원가입 및 소셜 로그인 전환 유도 섹션 ================= */}
        <section className="mt-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B4E] via-[#1E1B2E] to-[#120F24] border-2 border-amber-400/30 p-6 sm:p-8 text-white shadow-2xl shadow-purple-950/20">
          {/* 오로라 배경 블러 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>회원 전용 혜택 안내</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug">
                매번 비밀번호를 찾지 마세요.<br className="hidden sm:inline" />
                <span className="text-amber-300">평생 보관되는 나만의 무의식 서재</span>를 얻으세요
              </h2>

              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                카카오나 Google 계정으로 3초 만에 로그인하시면, 지금까지 비회원으로 의뢰한 꿈들을 
                <strong> 월별 무의식 캘린더</strong>와 <strong>고화질 아트워크 갤러리</strong>에 영구 보존할 수 있습니다.
              </p>

              {/* 혜택 뱃지 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-purple-100">
                  <span className="text-amber-400">📅</span>
                  <span>꿈 캘린더 자동 기록</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-purple-100">
                  <span className="text-amber-400">🎨</span>
                  <span>고화질 아트워크 소장</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-purple-100">
                  <span className="text-amber-400">⚡</span>
                  <span>비번 없이 1초 열람</span>
                </div>
              </div>
            </div>

            {/* 회원 로그인 페이지로 이동 버튼 */}
            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-[#1E1B2E] font-bold text-sm sm:text-base shadow-xl shadow-amber-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>3초 소셜 회원가입/로그인하기</span>
                <ArrowRight className="w-4 h-4 text-[#1E1B2E] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GuestCheckPage;
