'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FeedPost } from '@/types/feed';
import { PerspectiveType } from '@/types/dream-teller';
import { generateDummyFeeds } from '@/lib/dummy-feeds';
import FeedCard from './feed-card';
import FeedComposerBanner from './feed-composer-banner';
import { Loader2, Sparkles, Filter, ImageIcon, Layers } from 'lucide-react';

type FilterType = 'all' | PerspectiveType | 'with_image';

/**
 * FeedTimeline: 페이스북형 타임라인 레이아웃, 관점별 필터링, 실시간 반응 및 무한 스크롤을 제공하는 피드 메인 컴포넌트입니다.
 */
const FeedTimeline = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 로드된 포스트 인덱스 트래킹
  const offsetRef = useRef<number>(0);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // 초기 더미데이터 로드 (6개)
  useEffect(() => {
    const initialPosts = generateDummyFeeds(6, 0);
    setPosts(initialPosts);
    offsetRef.current = 6;
  }, []);

  // 무한 스크롤 더보기 함수
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // 실제 네트워크 지연 느낌을 위한 타이머
    setTimeout(() => {
      const nextPosts = generateDummyFeeds(4, offsetRef.current);
      offsetRef.current += 4;

      setPosts((prev) => [...prev, ...nextPosts]);
      setIsLoadingMore(false);

      // 30개 이상 로드되면 데모 완료 안내
      if (offsetRef.current >= 30) {
        setHasMore(false);
      }
    }, 600);
  }, [isLoadingMore, hasMore]);

  // IntersectionObserver를 통한 자동 무한 스크롤
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMorePosts, hasMore, isLoadingMore]);

  // 리액션 토글 핸들러
  const handleReaction = (
    postId: string,
    reactionType: 'mystic' | 'comfort' | 'insight' | 'sameHere'
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const currentReaction = post.userReaction;
        const newLikes = { ...post.likes };

        if (currentReaction === reactionType) {
          // 이미 누른 반응 취소
          newLikes[reactionType] = Math.max(0, newLikes[reactionType] - 1);
          return { ...post, userReaction: null, likes: newLikes };
        } else {
          // 기존 반응 차감 후 새 반응 증가
          if (currentReaction) {
            newLikes[currentReaction] = Math.max(0, newLikes[currentReaction] - 1);
          }
          newLikes[reactionType] = newLikes[reactionType] + 1;
          return { ...post, userReaction: reactionType, likes: newLikes };
        }
      })
    );
  };

  // 댓글 추가 핸들러
  const handleAddComment = (postId: string, content: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const newComment = {
          id: `comment_user_${Date.now()}`,
          author: '익명의 탐험가',
          content,
          createdAt: '방금 전',
          likesCount: 0,
        };

        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [newComment, ...post.comments],
        };
      })
    );
  };

  // 필터링된 포스트 목록
  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'with_image') return post.hasImage;
    return post.perspective === filter;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 상단 꿈 작성 유도 배너 */}
      <FeedComposerBanner />

      {/* 필터 탭 네비게이션 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
            filter === 'all'
              ? 'bg-[#1E1B2E] text-amber-200 font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          전체 꿈 기록
        </button>

        <button
          type="button"
          onClick={() => setFilter('jung')}
          className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
            filter === 'jung'
              ? 'bg-[#1E1B2E] text-amber-200 font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          칼 융 (원형·상징)
        </button>

        <button
          type="button"
          onClick={() => setFilter('freud')}
          className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
            filter === 'freud'
              ? 'bg-[#1E1B2E] text-amber-200 font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          프로이트 (정신분석)
        </button>

        <button
          type="button"
          onClick={() => setFilter('neuroscience')}
          className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
            filter === 'neuroscience'
              ? 'bg-[#1E1B2E] text-amber-200 font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          현대 신경과학 (뇌인지)
        </button>

        <button
          type="button"
          onClick={() => setFilter('gestalt')}
          className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
            filter === 'gestalt'
              ? 'bg-[#1E1B2E] text-amber-200 font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          게슈탈트 치료
        </button>

        <button
          type="button"
          onClick={() => setFilter('with_image')}
          className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
            filter === 'with_image'
              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>AI 아트워크만 보기</span>
        </button>
      </div>

      {/* 포스트 카드 리스트 */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onReact={handleReaction}
            onAddComment={handleAddComment}
          />
        ))}

        {filteredPosts.length === 0 && (
          <div className="py-16 text-center bg-white border border-[#E8E0F8] rounded-2xl p-6 space-y-2">
            <Layers className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-[#1E1B2E]">해당 조건의 꿈 기록이 없습니다.</p>
            <p className="text-xs text-stone-500">다른 필터를 선택하시거나 직접 첫 꿈을 기록해보세요.</p>
          </div>
        )}
      </div>

      {/* 무한 스크롤 트리거 영역 */}
      <div ref={observerTargetRef} className="pt-6 pb-12 text-center">
        {isLoadingMore ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E8E0F8] shadow-xs text-xs text-[#4B4562]">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>비밀 서재에서 새로운 꿈 기록들을 복원하는 중...</span>
          </div>
        ) : hasMore ? (
          <button
            type="button"
            onClick={loadMorePosts}
            className="px-6 py-2.5 rounded-full bg-white border border-[#E8E0F8] text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-[#1E1B2E] transition-colors shadow-2xs cursor-pointer"
          >
            더 많은 꿈 기록 열람하기 ↓
          </button>
        ) : (
          <p className="text-xs text-stone-400">
            ✨ 모든 공개된 꿈 기록의 탐색을 마쳤습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedTimeline;
