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

import { useAuth } from '@/providers/auth-provider';

/**
 * 마이페이지 메인 컨테이너 컴포넌트
 * - 로그인 회원 프로필, 닉네임 수정, 소셜 로그인 표시, 로그아웃
 * - 무의식 캘린더 탭 (날짜 하이라이트 → 결과 페이지 이동)
 * - 구매 내역 탭 (구매 내역 리스트 → 결과 페이지 이동)
 * - 비로그인 시 친절한 로그인 안내 및 1초 체험 모드 지원
 */
export const MyPageContainer = () => {
  const { user: authUser, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'calendar' | 'orders'>('calendar');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [orders, setOrders] = useState<DreamPurchaseOrder[]>(DUMMY_PURCHASE_ORDERS);
  const [calendarEntries, setCalendarEntries] = useState<CalendarDreamEntry[]>(MY_PAGE_CALENDAR_ENTRIES);

  // AuthProvider에서 유저 정보를 받아 프로필 상태 갱신
  useEffect(() => {
    if (authUser) {
      const meta = authUser.user_metadata;
      const parsedNickname =
        typeof meta?.name === 'string' && meta.name.trim()
          ? meta.name
          : typeof meta?.full_name === 'string' && meta.full_name.trim()
          ? meta.full_name
          : undefined;

      setUserProfile((prev) => ({
        ...prev,
        id: authUser.id,
        email: authUser.email || prev.email,
        nickname: parsedNickname || prev.nickname,
      }));
    }
  }, [authUser]);

  // 실제 로그인 회원의 주문 내역(GET /api/orders) 조회 및 동기화
  useEffect(() => {
    if (authUser && authUser.id !== 'demo-scholar-user-01') {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/orders');
          const result = await res.json();
          if (res.ok && result.success && Array.isArray(result.data)) {
            interface OrderApiItem {
              id: string;
              order_number: string;
              created_at: string;
              dream_content: string;
              expert_field: string;
              includes_image: boolean;
              total_amount: number;
              payment_status: string;
            }
            const mappedOrders: DreamPurchaseOrder[] = result.data.map((item: OrderApiItem) => {
              const perspectiveMap: Record<string, string> = {
                freud: '프로이트 정신분석',
                jung: '융 분석심리학',
                neuroscience: '현대 뇌과학',
                gestalt: '게슈탈트',
              };
              return {
                orderId: item.order_number || item.id,
                date: item.created_at ? item.created_at.split('T')[0] : '2026.10.29',
                dreamTitle:
                  item.dream_content && item.dream_content.length > 28
                    ? `${item.dream_content.slice(0, 28)}...`
                    : item.dream_content || '심층 무의식 분석',
                perspectiveName: perspectiveMap[item.expert_field] || '융 분석심리학',
                hasArtwork: Boolean(item.includes_image),
                price: item.total_amount,
                resultUrl: `/dream-result/${item.order_number || item.id}`,
                status: item.payment_status === 'paid' ? 'completed' : 'processing',
              };
            });

            if (mappedOrders.length > 0) {
              setOrders(mappedOrders);
            }
          }
        } catch (err) {
          console.error('구매 내역 조회 중 오류:', err);
        }
      };

      fetchOrders();
    }
  }, [authUser]);

  // 1초 체험 모드 활성화 핸들러
  const handleEnableDemoMode = () => {
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
      window.dispatchEvent(new Event('dream_teller_auth_change'));
    }
  };

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
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('로그아웃 처리 실패:', err);
    }
  };

  // 비로그인 상태일 때의 안내 뷰
  if (!authLoading && !authUser) {
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
            onClick={handleEnableDemoMode}
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
