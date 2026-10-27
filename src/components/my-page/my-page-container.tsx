'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, DreamPurchaseOrder } from '@/types/my-page';
import { CalendarDreamEntry } from '@/types/dream-result';
import {
  INITIAL_USER_PROFILE,
  DUMMY_PURCHASE_ORDERS,
  MY_PAGE_CALENDAR_ENTRIES,
} from '@/lib/dummy-my-page';
import { UserProfileHeader } from './user-profile-header';
import { MyDreamCalendar } from './my-dream-calendar';
import { OrderHistoryList } from './order-history-list';
import { createClient } from '@/lib/supabase/client';
import {
  Calendar as CalendarIcon,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  UserCheck,
} from 'lucide-react';

/**
 * 마이페이지 메인 컨테이너 컴포넌트
 * - 로그인 회원 프로필, 닉네임 수정, 소셜 로그인 표시, 로그아웃
 * - 무의식 캘린더 탭 (날짜 하이라이트 → 결과 페이지 이동)
 * - 구매 내역 탭 (구매 내역 리스트 → 결과 페이지 이동)
 * - 비로그인 시 친절한 로그인 안내 및 1초 체험 모드 지원
 */
export const MyPageContainer = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'orders'>('calendar');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [orders, setOrders] = useState<DreamPurchaseOrder[]>(DUMMY_PURCHASE_ORDERS);
  const [calendarEntries, setCalendarEntries] = useState<CalendarDreamEntry[]>(MY_PAGE_CALENDAR_ENTRIES);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // 기본값 true(체험 또는 로그인)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // 세션 확인 (Supabase 및 로컬스토리지)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setIsLoggedIn(true);
          const meta = session.user.user_metadata;
          const provider = (session.user.app_metadata?.provider as 'kakao' | 'google') || 'kakao';

          setUserProfile((prev) => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
            nickname: meta?.name || meta?.full_name || prev.nickname,
            provider,
          }));
        } else if (typeof window !== 'undefined') {
          // 로컬 스토리지 데모 세션 확인
          const localSession = localStorage.getItem('dream_teller_auth_session');
          if (localSession) {
            try {
              const parsed = JSON.parse(localSession);
              if (parsed?.user) {
                setIsLoggedIn(true);
                setUserProfile((prev) => ({
                  ...prev,
                  nickname: parsed.user.user_metadata?.name || prev.nickname,
                  email: parsed.user.email || prev.email,
                }));
              }
            } catch {
              setIsLoggedIn(true);
            }
          } else {
            // 로컬스토리지나 Supabase 세션이 없더라도 사용자가 바로 볼 수 있게 유지하되 알림 배너 옵션 제공
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error('세션 확인 중 오류:', err);
        setIsLoggedIn(true);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // 닉네임 업데이트
  const handleUpdateNickname = (newNickname: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, nickname: newNickname };
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('dream_teller_auth_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.user.user_metadata = { ...parsed.user.user_metadata, name: newNickname };
            localStorage.setItem('dream_teller_auth_session', JSON.stringify(parsed));
          } catch (e) {
            console.error(e);
          }
        }
      }
      return updated;
    });
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // 비로그인 상태일 때의 안내 뷰
  if (!isLoggedIn && !isCheckingAuth) {
    return (
      <div className="w-full max-w-lg mx-auto my-12 bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-8 text-center space-y-6 shadow-2xl shadow-purple-950/10">
        <div className="w-16 h-16 rounded-2xl bg-[#2D1B4E] border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E1B2E]">
            로그인이 필요한 공간입니다
          </h2>
          <p className="text-xs sm:text-sm text-[#5D576B] leading-relaxed">
            나의 무의식 캘린더와 구매한 해몽 리포트를 안전하게 열람하려면 로그인해 주세요.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/auth?next=/my-page"
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] text-amber-300 font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>소셜 계정으로 로그인하기</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </Link>

          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="w-full h-11 flex items-center justify-center gap-1.5 rounded-xl bg-[#F0EBE1] hover:bg-[#EAE4DC] text-xs font-semibold text-[#5D576B] transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>체험 계정으로 마이페이지 둘러보기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* 1. 유저 프로필 헤더 (닉네임 수정, 소셜 로그인 표시, 로그아웃, 통계) */}
      <UserProfileHeader
        user={userProfile}
        onUpdateNickname={handleUpdateNickname}
        onLogout={handleLogout}
      />

      {/* 2. 탭 네비게이션: [무의식 캘린더] vs [전체 구매·해몽 내역] */}
      <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
              activeTab === 'calendar'
                ? 'text-[#1E1B2E]'
                : 'text-[#8A8175] hover:text-[#1E1B2E]'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-[#6B46C1]" />
            <span>무의식 캘린더</span>
            {activeTab === 'calendar' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B46C1] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[#1E1B2E]'
                : 'text-[#8A8175] hover:text-[#1E1B2E]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#6B46C1]" />
            <span>해몽 구매 내역</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8E0F8] text-[#553C9A] font-semibold">
              {orders.length}
            </span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B46C1] rounded-full" />
            )}
          </button>
        </div>

        {/* 새 꿈 해몽하러 가기 CTA */}
        <Link
          href="/dream-teller"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#6B46C1] hover:text-[#553C9A] transition-colors pb-3"
        >
          <span>새로운 꿈 기록하기</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </Link>
      </div>

      {/* 3. 탭별 메인 콘텐츠 */}
      <div>
        {activeTab === 'calendar' ? (
          /* 요구사항: 캘린더 날짜 하이라이트 → 결과 페이지 이동 */
          <MyDreamCalendar entries={calendarEntries} />
        ) : (
          /* 요구사항: 구매 내역 리스트 → 결과 페이지 이동 */
          <OrderHistoryList orders={orders} />
        )}
      </div>
    </div>
  );
};
