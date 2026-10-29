'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/my-page';
import { KakaoSymbol, GoogleSymbol } from '@/components/auth/social-buttons';
import { createClient } from '@/lib/supabase/client';
import {
  Edit3,
  Check,
  X,
  LogOut,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Compass,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';

interface UserProfileHeaderProps {
  user: UserProfile;
  onUpdateNickname: (newNickname: string) => void;
  onLogout: () => void;
}

/**
 * 마이페이지 유저 프로필 헤더 컴포넌트
 * - 닉네임 수정 (인라인 폼 및 실시간 업데이트)
 * - 소셜 로그인 연동 상태 표시 (카카오/구글 공식 뱃지)
 * - 로그아웃 버튼 (세션 클리어 및 리디렉션)
 * - 3대 무의식 활동 통계 요약 카드
 */
export const UserProfileHeader = ({
  user,
  onUpdateNickname,
  onLogout,
}: UserProfileHeaderProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nicknameInput, setNicknameInput] = useState<string>(user.nickname);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // 닉네임 저장 핸들러
  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      alert('닉네임을 한 글자 이상 입력해 주세요.');
      return;
    }
    if (trimmed.length > 15) {
      alert('닉네임은 최대 15자까지 가능합니다.');
      return;
    }
    onUpdateNickname(trimmed);
    setIsEditing(false);
    setFeedbackMsg('닉네임이 성공적으로 변경되었습니다 ✨');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // 닉네임 수정 취소 핸들러
  const handleCancelEdit = () => {
    setNicknameInput(user.nickname);
    setIsEditing(false);
  };

  // 로그아웃 핸들러
  const handleSignOut = async () => {
    if (!confirm('정말 로그아웃 하시겠습니까?')) return;
    try {
      setIsLoggingOut(true);
      await onLogout();
      router.push('/');
    } catch (e) {
      console.error('로그아웃 중 오류:', e);
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-950/5 relative overflow-hidden backdrop-blur-sm">
      {/* 상단 은은한 오로라 데코 라인 */}
      <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      {/* 상단 프로필 및 계정 정보 영역 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EAE3D6]">
        {/* 아바타 & 닉네임 영역 */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* 아바타 (Wax Seal 프레임) */}
          <div className="relative group shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#1E1B2E] border-2 border-amber-400/40 p-1 flex items-center justify-center shadow-lg shadow-purple-950/20 text-amber-300">
              <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200/90" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="인증된 무의식 탐험가">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 닉네임 & 계정 정보 */}
          <div className="space-y-1.5 flex-1">
            {/* 닉네임 수정 UI */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  maxLength={15}
                  className="px-3 py-1.5 text-base sm:text-lg font-bold text-[#1E1B2E] bg-white border-2 border-[#6B46C1] rounded-xl focus:outline-hidden shadow-xs w-48 sm:w-60"
                  autoFocus
                  placeholder="새 닉네임 입력"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNickname();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveNickname}
                  className="p-2 rounded-xl bg-[#6B46C1] hover:bg-[#553C9A] text-white transition-colors cursor-pointer"
                  title="저장"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors cursor-pointer"
                  title="취소"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1E1B2E] tracking-tight">
                  {user.nickname}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#6B46C1] hover:bg-[#E8E0F8]/50 transition-colors cursor-pointer"
                  title="닉네임 변경"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 변경 완료 안내 토스트 */}
            {feedbackMsg && (
              <p className="text-xs text-purple-700 font-semibold animate-fadeIn">
                {feedbackMsg}
              </p>
            )}

            {/* 계정 이메일 및 소셜 연동 뱃지 */}
            <div className="flex items-center gap-2.5 flex-wrap text-xs text-[#7A7165]">
              <span>{user.email}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span>{user.createdAt}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />

              {/* 소셜 로그인 뱃지 */}
              {user.provider === 'kakao' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FEE500] text-[#191919] font-medium text-[11px] border border-amber-300 shadow-2xs">
                  <KakaoSymbol className="w-3.5 h-3.5 text-[#191919]" />
                  <span>카카오 연동됨</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white text-[#1F1F1F] font-medium text-[11px] border border-stone-200 shadow-2xs">
                  <GoogleSymbol className="w-3.5 h-3.5" />
                  <span>Google 연동됨</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="flex sm:justify-end">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
          </button>
        </div>
      </div>

      {/* 하단 무의식 활동 통계 카드 3종 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6">
        {/* 통계 1: 누적 꿈 해몽 */}
        <div className="bg-white/80 border border-[#EAE3D6] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#7A7165]">해독한 무의식 기록</p>
            <p className="text-lg font-bold text-[#1E1B2E]">
              {user.stats.totalDreams}
              <span className="text-xs font-normal text-stone-500 ml-1">편</span>
            </p>
          </div>
        </div>

        {/* 통계 2: 소장 아트워크 */}
        <div className="bg-white/80 border border-[#EAE3D6] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#7A7165]">영구 소장 아트워크</p>
            <p className="text-lg font-bold text-[#1E1B2E]">
              {user.stats.artworkCount}
              <span className="text-xs font-normal text-stone-500 ml-1">점</span>
            </p>
          </div>
        </div>

        {/* 통계 3: 주 탐험 학파 */}
        <div className="bg-white/80 border border-[#EAE3D6] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#7A7165]">주 탐험 학파</p>
            <p className="text-sm font-bold text-[#1E1B2E] truncate max-w-[150px]">
              {user.stats.favoritePerspective}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
