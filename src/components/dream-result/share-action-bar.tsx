'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check, MessageCircle, Lock, Eye, Sparkles } from 'lucide-react';

interface ShareActionBarProps {
  orderId: string;
  isPublic: boolean;
  onTogglePublic: (nextPublic: boolean) => void;
  isOwner: boolean;
}

/**
 * ShareActionBar: 해석 확인 페이지에서 링크 복사, 카카오톡 공유, 피드 공개 여부 토글을 지원하는 액션 바입니다.
 */
const ShareActionBar = ({
  orderId,
  isPublic,
  onTogglePublic,
  isOwner,
}: ShareActionBarProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showKakaoNotice, setShowKakaoNotice] = useState<boolean>(false);

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // 복사 에러 시 무시
    }
  };

  // 카카오톡 공유 핸들러
  const handleKakaoShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Dream Teller | 내 꿈의 심층 해몽 리포트',
          text: '어젯밤 꾼 꿈의 무의식 암호를 해독받았습니다. 리포트와 AI 아트워크를 확인해보세요!',
          url: window.location.href,
        });
        return;
      } catch {
        // 취소 시 무시
      }
    }
    // Web Share API 미지원 브라우저용 안내 및 자동 링크 복사
    await handleCopyLink();
    setShowKakaoNotice(true);
    setTimeout(() => setShowKakaoNotice(false), 3000);
  };

  return (
    <div className="bg-white border border-[#E8E0F8] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* 좌측: 소유자용 공개/비공개 토글 스위치 (PRD 요구사항) */}
        {isOwner ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => onTogglePublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                isPublic ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E1B2E]">
                {isPublic ? (
                  <span className="text-amber-800 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>익명 피드 공개 중 ✨</span>
                  </span>
                ) : (
                  <span className="text-stone-600 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                    <span>나만의 비밀 보관 (비공개)</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7A7393] mt-0.5">
                {isPublic
                  ? '다른 탐험가들이 피드(/feeds)에서 익명으로 이 꿈을 열람하고 공감할 수 있습니다.'
                  : '오직 고유 결과 링크를 가진 분만 열람 가능합니다.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#7A7393]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>익명으로 공유된 마법 아카이브 결과 리포트입니다.</span>
          </div>
        )}

        {/* 우측: 공유 액션 버튼 그룹 */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* 링크 복사 */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:border-amber-300 bg-white text-xs font-semibold text-[#1E1B2E] hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">링크 복사됨!</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-stone-500" />
                <span>결과 링크 복사</span>
              </>
            )}
          </button>

          {/* 카카오톡 공유 */}
          <button
            type="button"
            onClick={handleKakaoShare}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#191919]" />
            <span>카카오톡 공유</span>
          </button>
        </div>
      </div>

      {/* 카카오톡 알림 안내 토스트 */}
      {showKakaoNotice && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
          <span>링크가 클립보드에 복사되었습니다! 카카오톡 대화방에 붙여넣어 공유해보세요.</span>
        </div>
      )}
    </div>
  );
};

export default ShareActionBar;
