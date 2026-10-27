'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FeedPost } from '@/types/feed';
import { PERSPECTIVES } from '@/components/dream-teller/step-perspective';
import { 
  Sparkles, 
  MessageSquare, 
  Share2, 
  MoreHorizontal, 
  Globe, 
  Send,
  Heart,
  Lightbulb,
  Check
} from 'lucide-react';

interface FeedCardProps {
  post: FeedPost;
  onReact: (postId: string, reactionType: 'mystic' | 'comfort' | 'insight' | 'sameHere') => void;
  onAddComment: (postId: string, content: string) => void;
}

/**
 * FeedCard: 페이스북 포스트 UI 디자인을 기반으로 구성된 개별 꿈 해몽 공개 피드 카드 컴포넌트입니다.
 * - 상단: 작성자 프로필, 학파 뱃지, 공개 시점
 * - 본문: 꿈 원문 내용 (더보기/접기 지원)
 * - 중간: AI 심층 해몽 리포트 박스 (양피지 테마)
 * - 미디어: faker.js urlPicsumPhotos 기반 고화질 AI 생성 아트워크
 * - 하단: 페이스북형 리액션 통계, 반응 버튼, 댓글 목록 및 입력창
 */
const FeedCard = ({ post, onReact, onAddComment }: FeedCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>('');
  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const perspectiveData = PERSPECTIVES.find((p) => p.id === post.perspective);

  // 총 리액션 수 합산
  const totalReactions =
    post.likes.mystic + post.likes.comfort + post.likes.insight + post.likes.sameHere;

  // 댓글 제출 핸들러
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
    if (!showComments) setShowComments(true);
  };

  // 링크 공유 핸들러
  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(`${window.location.origin}/feeds#${post.id}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // 복사 실패 시 무시
    }
  };

  // 현재 유저 리액션 라벨 및 아이콘
  const getReactionDisplay = () => {
    switch (post.userReaction) {
      case 'mystic':
        return { label: '신비로워요', icon: '🔮', color: 'text-purple-600 font-bold' };
      case 'comfort':
        return { label: '위로돼요', icon: '🫂', color: 'text-rose-600 font-bold' };
      case 'insight':
        return { label: '통찰을얻음', icon: '💡', color: 'text-amber-600 font-bold' };
      case 'sameHere':
        return { label: '나도이런꿈', icon: '🌙', color: 'text-indigo-600 font-bold' };
      default:
        return { label: '공감하기', icon: null, color: 'text-stone-600 hover:text-purple-700' };
    }
  };

  const reactionDisplay = getReactionDisplay();

  return (
    <article
      id={post.id}
      className="bg-white border border-[#E8E0F8] rounded-2xl md:rounded-3xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* 1. 포스트 상단 헤더 (페이스북 프로필 영역) */}
      <div className="p-4 md:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* 아바타 */}
          <div
            className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-sm border shadow-2xs shrink-0 ${post.authorAvatarColor}`}
          >
            {post.authorNickname.charAt(0)}
          </div>

          {/* 닉네임 및 작성 시점 */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm md:text-base text-[#1E1B2E]">
                {post.authorNickname}
              </span>

              {/* 학파 뱃지 */}
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                {perspectiveData?.name.split(' ')[0] || '심층분석'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
              <span>{post.createdAt}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[11px]">
                <Globe className="w-3 h-3 text-stone-400" />
                <span>익명 공개</span>
              </span>
            </div>
          </div>
        </div>

        {/* 우측 더보기 아이콘 */}
        <button
          type="button"
          onClick={handleShare}
          title="공유하기"
          className="p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <MoreHorizontal className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. 꿈 원문 내용 본문 */}
      <div className="px-4 md:px-5 pb-3">
        <div className="text-sm md:text-base text-[#1E1B2E] leading-relaxed whitespace-pre-line">
          {isExpanded || post.dreamContent.length <= 140 ? (
            post.dreamContent
          ) : (
            <>
              {post.dreamContent.slice(0, 140)}...
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="ml-1 text-xs font-semibold text-purple-700 hover:underline cursor-pointer"
              >
                더보기
              </button>
            </>
          )}
        </div>

        {isExpanded && post.dreamContent.length > 140 && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="mt-1 text-xs text-stone-400 hover:underline cursor-pointer block"
          >
            접기
          </button>
        )}
      </div>

      {/* 3. AI 심층 해몽 리포트 하이라이트 박스 (Grand Archive 양피지 스타일) */}
      <div className="mx-4 md:mx-5 mb-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E0F8] space-y-3">
        {/* 리포트 헤더 */}
        <div className="flex items-center justify-between border-b border-[#E8E0F8] pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI 심층 해몽 통찰 ({perspectiveData?.enName || '분석심리학'})</span>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
            VERIFIED
          </span>
        </div>

        {/* 핵심 상징 키워드 */}
        <div className="flex flex-wrap gap-1.5">
          {post.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-[#E8E0F8] text-[#4B4562]"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* 분석 요약문 */}
        <p className="text-xs md:text-sm text-[#353047] leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-[#E8E0F8]/60">
          “{post.analysisSummary}”
        </p>

        {/* 현실 심리 처방 조언 */}
        <div className="text-xs text-[#6B46C1] font-medium pt-0.5 flex items-start gap-1">
          <span className="shrink-0 font-bold">💡 현실 조언:</span>
          <span className="leading-relaxed">{post.realLifeAdvice}</span>
        </div>
      </div>

      {/* 4. AI 캔버스 복원 이미지 (있을 경우 - faker.js urlPicsumPhotos) */}
      {post.hasImage && post.imageUrl && (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-stone-900 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || 'AI 꿈 시각화 복원 아트워크'}
            fill
            sizes="(max-width: 768px) 100vw, 680px"
            className="object-cover transition-transform duration-500 hover:scale-102"
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[11px] text-white/90 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI 꿈 시각화 복원</span>
          </div>
        </div>
      )}

      {/* 5. 페이스북형 리액션 & 댓글 카운터 통계 바 */}
      <div className="px-4 md:px-5 py-2.5 flex items-center justify-between text-xs text-stone-500 border-b border-stone-100">
        {/* 좌측: 리액션 이모지 뱃지 스택 */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1 items-center">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-100 text-[10px]">
              🔮
            </span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-[10px]">
              🫂
            </span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-[10px]">
              💡
            </span>
          </div>
          <span className="ml-1 font-medium text-[#1E1B2E]">
            {totalReactions.toLocaleString()}
          </span>
        </div>

        {/* 우측: 댓글 수 및 공유 통계 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            댓글 {post.comments.length}개
          </button>
          <span>•</span>
          <span>공개 아카이브</span>
        </div>
      </div>

      {/* 6. 페이스북형 액션 버튼 바 (공감하기 / 댓글 달기 / 공유하기) */}
      <div className="relative px-2 py-1 flex items-center justify-around border-b border-stone-100">
        {/* 공감하기 버튼 (호버/클릭 시 페이스북형 리액션 팝업) */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
        >
          <button
            type="button"
            onClick={() => onReact(post.id, post.userReaction ? post.userReaction : 'mystic')}
            className={`w-full py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors hover:bg-stone-50 ${reactionDisplay.color}`}
          >
            {reactionDisplay.icon ? (
              <span className="text-base">{reactionDisplay.icon}</span>
            ) : (
              <Heart className="w-4 h-4 text-stone-500" />
            )}
            <span>{reactionDisplay.label}</span>
          </button>

          {/* 리액션 선택 팝업 (Facebook Reaction Picker) */}
          {showReactionPicker && (
            <div className="absolute bottom-full left-2 mb-1 z-30 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  onReact(post.id, 'mystic');
                  setShowReactionPicker(false);
                }}
                className="hover:scale-125 transition-transform text-xl p-1"
                title="신비로워요"
              >
                🔮
              </button>
              <button
                type="button"
                onClick={() => {
                  onReact(post.id, 'comfort');
                  setShowReactionPicker(false);
                }}
                className="hover:scale-125 transition-transform text-xl p-1"
                title="위로돼요"
              >
                🫂
              </button>
              <button
                type="button"
                onClick={() => {
                  onReact(post.id, 'insight');
                  setShowReactionPicker(false);
                }}
                className="hover:scale-125 transition-transform text-xl p-1"
                title="통찰을 얻었어요"
              >
                💡
              </button>
              <button
                type="button"
                onClick={() => {
                  onReact(post.id, 'sameHere');
                  setShowReactionPicker(false);
                }}
                className="hover:scale-125 transition-transform text-xl p-1"
                title="저도 비슷한 꿈을 꿨어요"
              >
                🌙
              </button>
            </div>
          )}
        </div>

        {/* 댓글 달기 버튼 */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-stone-600 hover:text-[#1E1B2E] hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-stone-500" />
          <span>댓글 달기</span>
        </button>

        {/* 공유하기 버튼 */}
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-stone-600 hover:text-[#1E1B2E] hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">복사 완료</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-stone-500" />
              <span>공유하기</span>
            </>
          )}
        </button>
      </div>

      {/* 7. 페이스북형 댓글 섹션 (토글 가능) */}
      {showComments && (
        <div className="p-4 md:p-5 bg-stone-50/70 border-t border-stone-100 space-y-3">
          {/* 기존 댓글 목록 */}
          <div className="space-y-2.5">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1 bg-white p-2.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1E1B2E]">{comment.author}</span>
                    <span className="text-[10px] text-stone-400">{comment.createdAt}</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 새 댓글 작성 입력창 */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-[11px] shrink-0">
              나
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="따뜻한 공감이나 비슷한 꿈의 경험을 남겨주세요..."
                className="w-full pl-3 pr-10 py-2 rounded-full border border-stone-300 bg-white text-xs text-[#1E1B2E] placeholder:text-stone-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200/40"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                  commentInput.trim()
                    ? 'text-purple-600 hover:bg-purple-50 cursor-pointer'
                    : 'text-stone-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};

export default FeedCard;
