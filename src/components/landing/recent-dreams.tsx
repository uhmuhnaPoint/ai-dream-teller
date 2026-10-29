'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock, 
  X, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  EyeOff,
  Feather
} from 'lucide-react';
import { PublicDreamItem } from '@/lib/dream-parser';

const FILTER_TABS = [
  { id: 'all', label: '전체 관점' },
  { id: 'freud', label: '프로이트 (욕망/은유)' },
  { id: 'jung', label: '칼 융 (원형/상징)' },
  { id: 'neuroscience', label: '신경과학 (뇌기억/정화)' },
  { id: 'gestalt', label: '게슈탈트 (자아통합)' },
];

interface RecentDreamsProps {
  initialDreams?: PublicDreamItem[];
}

/**
 * RecentDreams: 메인 페이지 하단에 위치하며,
 * 실제 Supabase DB에서 유저가 공개(is_public = true)를 승인하고
 * AI 분석이 완료(analysis_status = 'completed')된 실제 꿈 데이터들만 엄선하여 렌더링합니다.
 */
const RecentDreams = ({ initialDreams = [] }: RecentDreamsProps) => {
  // 실제 공개 꿈 피드 목록 상태
  const [dreams, setDreams] = useState<PublicDreamItem[]>(initialDreams);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 학파별 필터 상태 관리 ('all' 또는 개별 학파)
  const [activeFilter, setActiveFilter] = useState<string>('all');
  // 모달에 열려있는 꿈 상세 데이터 (null이면 모달 닫힘)
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  // 노출 카드 수 제한 (더보기 토글)
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // 클라이언트 마운트 시 최신 공개 피드 목록 자동 동기화
  useEffect(() => {
    const fetchLatestPublicDreams = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/feeds?limit=20');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.feeds)) {
            setDreams(json.feeds);
          }
        }
      } catch (err) {
        console.error('최신 공개 꿈 피드 동기화 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPublicDreams();
  }, []);

  // 선택된 학파 필터에 따른 피드 리스트 필터링
  const filteredDreams = dreams.filter((dream) => {
    if (activeFilter === 'all') return true;
    return dream.fieldId === activeFilter;
  });

  // 현재 모달에 표시 중인 꿈 객체
  const currentModalIndex = filteredDreams.findIndex((d) => d.id === selectedDreamId);
  const currentDream = currentModalIndex !== -1 ? filteredDreams[currentModalIndex] : null;

  // 모달 내부에서 이전/다음 꿈 피드로 전환하는 핸들러
  const handlePrevDream = () => {
    if (currentModalIndex > 0) {
      setSelectedDreamId(filteredDreams[currentModalIndex - 1].id);
    } else {
      setSelectedDreamId(filteredDreams[filteredDreams.length - 1].id);
    }
  };

  const handleNextDream = () => {
    if (currentModalIndex < filteredDreams.length - 1) {
      setSelectedDreamId(filteredDreams[currentModalIndex + 1].id);
    } else {
      setSelectedDreamId(filteredDreams[0].id);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#F5F0EB]/60 border-y border-[#E8E0F8]/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 상단 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/40 px-3 py-1 text-xs font-semibold text-[#8C6D23] mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>실시간 해독 아카이브 · 회원이 공개 허용한 실제 무의식 기록</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1B2E]">
              방금 전 다른 이들이 발견한 무의식의 장면들
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4B4562]">
              카드를 누르면 실제 유저들이 받아본 <strong>AI 심층 해석 리포트 전문</strong>과 <strong>복원 아트워크</strong>를 자세히 살펴볼 수 있습니다.
            </p>
          </div>

          <Link
            href="/feeds"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6B46C1] hover:text-[#553C9A] transition-colors self-start md:self-auto"
          >
            <span>공개 피드 전체보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 학파별 탭 필터 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setVisibleCount(6);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-sm'
                    : 'bg-white/80 text-[#4B4562] border-[#E8E0F8] hover:bg-white hover:border-[#6B46C1]/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 꿈 피드 카드 그리드 (실제 Supabase DB 데이터 기반 렌더링) */}
        {filteredDreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredDreams.slice(0, visibleCount).map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedDreamId(item.id)}
                className="group cursor-pointer rounded-3xl border border-[#E8E0F8] bg-[#FFFDF9] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#6B46C1]/40 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
              >
                {/* 상단 꿈 시각화 AI 이미지 */}
                <div className="relative w-full aspect-4/3 overflow-hidden bg-[#FAF8F5]">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  {/* 오버레이: 클릭 안내 힌트 */}
                  <div className="absolute inset-0 bg-[#1E1B2E]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#1E1B2E]/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                      해몽 리포트 전문 읽기
                    </span>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md bg-white/95 ${item.schoolColor}`}>
                      {item.schoolBadge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#1E1B2E]/70 text-white backdrop-blur-xs">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      {item.createdTime}
                    </span>
                  </div>
                </div>

                {/* 하단 텍스트 및 발췌 요약 */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E] tracking-tight group-hover:text-[#6B46C1] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    
                    {/* 유저가 입력한 실제 꿈 스토리 발췌 */}
                    <div className="mt-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0F8]/80 p-3 text-xs text-[#4B4562] italic line-clamp-2">
                      “{item.dreamFullStory}”
                    </div>

                    {/* AI의 핵심 심층 해석 요약 */}
                    <div className="mt-3.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#6B46C1] mb-1">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span>{item.analysisFullReport.symbolSummary}</span>
                      </div>
                      <p className="text-xs text-[#4B4562] leading-relaxed line-clamp-2">
                        {item.analysisFullReport.unconsciousInsight}
                      </p>
                    </div>
                  </div>

                  {/* 카드 하단 클릭 유도 액션 */}
                  <div className="mt-5 pt-3.5 border-t border-[#E8E0F8]/80 flex items-center justify-between text-xs">
                    <span className="text-[#716A89] flex items-center gap-1">
                      조회 {item.views.toLocaleString()}회
                    </span>
                    <span className="font-semibold text-[#6B46C1] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      전체 리포트 열기 <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* 실제 공개 데이터가 없거나 필터 조건에 맞지 않을 때의 우아한 마법 서재 안내 카드 (Empty State) */
          <div className="rounded-3xl border border-[#E8E0F8] bg-[#FFFDF9] p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FAF8F5] border border-[#E8E0F8] flex items-center justify-center text-[#D4AF37]">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E]">
              {activeFilter === 'all'
                ? '아직 탐험가들이 공개한 무의식 장면이 없습니다.'
                : '이 관점으로 아직 공개된 무의식 기록이 없습니다.'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#4B4562] max-w-md mx-auto leading-relaxed">
              모든 해몽 리포트는 기본적으로 철저히 비공개(비밀 보관) 처리되며,
              회원이 공개를 선택한 기록만 이곳에 나타납니다. 첫 번째 주인공이 되어보세요!
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href={activeFilter === 'all' ? '/dream-teller' : `/dream-teller?field=${activeFilter}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#1E1B2E] px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#2D2438] transition-all shadow-md active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>이 관점으로 내 꿈 해몽하기</span>
              </Link>
            </div>
          </div>
        )}

        {/* 더 많은 피드 로드하기 버튼 및 전체 피드 이동 */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          {visibleCount < filteredDreams.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E8E0F8] text-xs sm:text-sm font-semibold text-[#1E1B2E] hover:bg-[#FAF8F5] hover:border-[#6B46C1]/40 shadow-xs transition-all duration-200"
            >
              <span>꿈 카드 더 불러오기</span>
              <ArrowRight className="w-4 h-4 text-[#6B46C1]" />
            </button>
          )}

          <Link
            href="/feeds"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF8F5] border border-[#6B46C1]/30 text-xs sm:text-sm font-semibold text-[#6B46C1] hover:bg-[#E8E0F8]/50 shadow-xs transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>밤의 비밀 서재 (피드 전체보기)</span>
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 카드 클릭 시 열리는 상세 해몽 리포트 모달 (실제 Supabase AI 분석 리포트 렌더링) */}
      {/* ============================================================== */}
      {currentDream && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1E1B2E]/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedDreamId(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 text-[#1E1B2E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 및 네비게이션 헤더 */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0F8]">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentDream.schoolColor}`}>
                  {currentDream.schoolBadge}
                </span>
                <span className="text-xs text-[#716A89]">{currentDream.createdTime}</span>
              </div>

              <div className="flex items-center gap-1">
                {/* 이전/다음 피드 넘겨보기 버튼 */}
                {filteredDreams.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevDream}
                      className="p-1.5 rounded-full hover:bg-[#E8E0F8]/50 text-[#4B4562] transition-colors"
                      title="이전 꿈 피드 보기"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextDream}
                      className="p-1.5 rounded-full hover:bg-[#E8E0F8]/50 text-[#4B4562] transition-colors"
                      title="다음 꿈 피드 보기"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDreamId(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors ml-2"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 타이틀 */}
            <h3 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight text-[#1E1B2E]">
              {currentDream.title}
            </h3>

            {/* AI 생성 시각화 아트워크 */}
            <div className="mt-4 relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-[#E8E0F8] shadow-inner bg-[#FAF8F5]">
              <Image
                src={currentDream.imageSrc}
                alt={currentDream.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
              <div className="absolute bottom-2.5 right-2.5 bg-[#1E1B2E]/80 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>AI Dream Canvas 복원작</span>
              </div>
            </div>

            {/* 1. 유저의 원본 꿈 서사 */}
            <div className="mt-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E0F8] p-4 sm:p-5">
              <span className="text-[11px] font-bold text-[#716A89] uppercase tracking-wider block mb-1.5">
                기록된 원본 꿈 서사 (Dream Narrative)
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-[#1E1B2E] italic">
                “{currentDream.dreamFullStory}”
              </p>
            </div>

            {/* 2. AI 심층 해석 리포트 요약 및 전문 */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#6B46C1] border-b border-[#E8E0F8] pb-2">
                <BookOpen className="w-4 h-4" />
                <span>AI 심층 해몽 분석서 (핵심 요약)</span>
              </div>

              {/* 기저 상징 해독 */}
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#FFFDF8] p-4 text-xs">
                <span className="font-bold text-[#8C6D23] block mb-1">
                  1. 핵심 기저 상징 분해 (Symbolic Decoding)
                </span>
                <p className="text-[#4B4562] leading-relaxed">
                  {currentDream.analysisFullReport.symbolSummary}
                </p>
              </div>

              {/* 무의식 통찰 */}
              <div className="rounded-xl border border-[#E8E0F8] bg-white p-4 text-xs">
                <span className="font-bold text-[#1E1B2E] block mb-1">
                  2. 무의식의 심층 메시지 (Unconscious Message)
                </span>
                <p className="text-[#4B4562] leading-relaxed">
                  {currentDream.analysisFullReport.unconsciousInsight}
                </p>
              </div>

              {/* 심리 상태 & 실천 조언 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-[#E8E0F8] bg-[#F5F0EB]/60 p-3.5">
                  <span className="font-bold text-[#1E1B2E] block mb-1">현재 심리 지표</span>
                  <p className="text-[#4B4562]">{currentDream.analysisFullReport.psychologicalState}</p>
                </div>
                <div className="rounded-xl border border-[#E8E0F8] bg-[#F5F0EB]/60 p-3.5">
                  <span className="font-bold text-[#1E1B2E] block mb-1">내면의 실천 처방</span>
                  <p className="text-[#4B4562]">{currentDream.analysisFullReport.advice}</p>
                </div>
              </div>
            </div>

            {/* 모달 하단 전환 액션 버튼 */}
            <div className="mt-7 pt-4 border-t border-[#E8E0F8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href={`/dream-result/${currentDream.orderNumber}`}
                className="text-xs font-semibold text-[#6B46C1] hover:underline flex items-center gap-1"
              >
                <span>심층 해석 결과서 및 전체 뷰로 보기 →</span>
              </Link>

              <Link
                href={`/dream-teller?field=${currentDream.fieldId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1E1B2E] px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#2D2438] transition-all shadow-md active:scale-98"
              >
                <span>이 관점으로 내 꿈 풀기</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentDreams;
