'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DreamResultData } from '@/types/dream-result';
import DreamCalendar from './dream-calendar';
import ShareActionBar from './share-action-bar';
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  Quote, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Lightbulb,
  HeartHandshake,
  UserCheck,
  UserX
} from 'lucide-react';

interface ResultViewContainerProps {
  initialData: DreamResultData;
}

/**
 * ResultViewContainer: 해석 확인 페이지(/dream-result/[order-id])의 메인 인터랙션 컨테이너입니다.
 * 
 * 디자인 가이드 준수:
 * - Bright Ivory Base (#FAF8F5) 양피지 질감 캔버스
 * - Ethereal Aurora & Moonlight Lavender (#E8E0F8) 무드
 * - Wax Seal 스타일 인장 뱃지
 * 
 * 사용자 요구사항 충족:
 * 1. 로그인 회원 본인 뷰: 자신의 꿈 기록에 기반한 '무의식 캘린더(DreamCalendar)'가 노출됨.
 * 2. 타인 공유 뷰: 캘린더가 완전히 숨겨지고 전환 CTA 배너가 노출됨.
 * 3. 뷰 모드 시뮬레이터 탭을 제공하여 두 상태를 실시간으로 테스트 가능.
 */
const ResultViewContainer = ({ initialData }: ResultViewContainerProps) => {
  // 회원 본인 뷰 여부 상태 (기본값: true)
  const [isMemberOwner, setIsMemberOwner] = useState<boolean>(initialData.isMemberOwner);
  // 공개/비공개 토글 상태
  const [isPublic, setIsPublic] = useState<boolean>(initialData.isPublic);

  return (
    <div className="space-y-8 pb-16">
      {/* 뷰 모드 테스트 시뮬레이터 툴바 */}
      <div className="bg-white/80 border border-[#E8E0F8] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-[#4B4562]">
          <span className="font-bold text-[#1E1B2E]">👁️ 뷰 모드 시뮬레이션:</span>
          <span>(회원 본인 / 타인 공유 뷰에 따른 캘린더 노출 제어)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-stone-200">
          <button
            type="button"
            onClick={() => setIsMemberOwner(true)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              isMemberOwner
                ? 'bg-[#1E1B2E] text-amber-200 shadow-xs'
                : 'text-stone-500 hover:text-[#1E1B2E]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>회원 본인 뷰 (캘린더 노출)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMemberOwner(false)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              !isMemberOwner
                ? 'bg-[#1E1B2E] text-amber-200 shadow-xs'
                : 'text-stone-500 hover:text-[#1E1B2E]'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>타인 공유 뷰 (캘린더 숨김)</span>
          </button>
        </div>
      </div>

      {/* 1. 상단 공유 및 피드 공개 액션 바 */}
      <ShareActionBar
        orderId={initialData.orderId}
        isPublic={isPublic}
        onTogglePublic={(next) => setIsPublic(next)}
        isOwner={isMemberOwner}
      />

      {/* 2. 유저가 입력한 꿈 내용 인용 카드 (Parchment Quote Card) */}
      <section className="relative bg-white/95 border-2 border-[#E8E0F8] rounded-3xl p-6 sm:p-8 shadow-xs overflow-hidden">
        {/* 마법 인장 뱃지 */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold text-[#1E1B2E] tracking-tight">
              기록된 꿈의 원문 (The Dream Transcript)
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {initialData.createdAt}
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-300/80">
          <Quote className="absolute -left-3 -top-1 w-6 h-6 text-amber-400/50 fill-amber-300/20" />
          <p className="text-sm sm:text-base text-[#1E1B2E] leading-relaxed whitespace-pre-line font-medium italic">
            “{initialData.dreamStory}”
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#7A7393]">
          <span>작성자: <strong>{initialData.authorNickname}</strong></span>
          <span>관점: <strong className="text-purple-700">{initialData.report.perspectiveBadge}</strong></span>
        </div>
      </section>

      {/* 3. AI 생성 꿈 시각화 아트워크 섹션 (있을 경우) */}
      {initialData.hasImage && initialData.aiImageUrl && (
        <section className="bg-white border-2 border-[#E8E0F8] rounded-3xl overflow-hidden shadow-xs space-y-4">
          <div className="p-5 sm:p-6 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>AI 펜시브 캔버스 복원</span>
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E]">
                무의식의 시각화 아트워크
              </h3>
            </div>
            <span className="text-xs text-stone-400">100% 영구 보존</span>
          </div>

          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-stone-900 overflow-hidden">
            <Image
              src={initialData.aiImageUrl}
              alt={initialData.aiImageAlt || 'AI 생성 꿈 시각화 이미지'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              className="object-cover transition-transform duration-700 hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-medium drop-shadow-sm">The Pensieve Visual Artwork</span>
              <span className="text-white/80 drop-shadow-sm">고해상도 아트워크</span>
            </div>
          </div>
        </section>
      )}

      {/* 4. 심층 해몽 리포트 섹션 (Grand Archive Deep Report) */}
      <section className="bg-white border-2 border-[#E8E0F8] rounded-3xl p-6 sm:p-9 shadow-xs space-y-8">
        {/* 리포트 헤더 */}
        <div className="space-y-3 border-b border-[#E8E0F8] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
            <Compass className="w-3.5 h-3.5 text-purple-600" />
            <span>{initialData.report.perspectiveBadge}</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1E1B2E] tracking-tight">
            {initialData.report.title}
          </h3>

          <p className="text-sm sm:text-base text-[#4B4562] italic bg-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl border border-[#E8E0F8] leading-relaxed">
            {initialData.report.unconsciousCore}
          </p>

          {/* 핵심 키워드 */}
          <div className="flex flex-wrap gap-2 pt-1">
            {initialData.report.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-[#1E1B2E] border border-stone-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* 1) 무의식 렌즈별 핵심 상징 분해 (3단 카드) */}
        <div className="space-y-4">
          <h4 className="text-sm sm:text-base font-bold text-[#1E1B2E] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>1. 무의식 속 3대 핵심 상징 분해</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {initialData.report.symbolBreakdown.map((item, idx) => (
              <div
                key={item.symbol}
                className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="truncate">{item.symbol}</span>
                </div>
                <p className="text-xs text-[#353047] leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2) 심리 진단 & 현실 실천 처방 (2단 분할) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 심리 상태 진단 */}
          <div className="bg-purple-50/40 border border-purple-200/60 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span>현재의 심리 상태 진단</span>
            </div>
            <p className="text-xs sm:text-sm text-[#353047] leading-relaxed">
              {initialData.report.psychologicalDiagnosis}
            </p>
          </div>

          {/* 현실 실천 처방 */}
          <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>현실을 위한 행동 처방 (Action Plan)</span>
            </div>
            <p className="text-xs sm:text-sm text-[#353047] leading-relaxed">
              {initialData.report.actionablePrescription}
            </p>
          </div>
        </div>

        {/* 3) 영혼의 질문 프롬프트 */}
        <div className="bg-[#1E1B2E] text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              성장을 위한 자기 질문 (Reflection Prompt)
            </span>
            <p className="text-sm sm:text-base font-semibold text-gray-100 italic">
              {initialData.report.growthPrompt}
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-xs bg-white/10 text-amber-200 px-3 py-1 rounded-full border border-white/20">
              오늘의 명상 주제
            </span>
          </div>
        </div>
      </section>

      {/* 5. 중요 조건 분기: 회원 본인일 때만 무의식 캘린더 노출 */}
      {isMemberOwner ? (
        <section className="animate-in fade-in duration-300">
          <DreamCalendar
            entries={initialData.calendarEntries || []}
            currentOrderId={initialData.orderId}
          />
        </section>
      ) : (
        /* 타인이 공유 링크로 들어왔을 때 (캘린더 숨김 & 나도 해몽 풀기 CTA 노출) */
        <section className="bg-gradient-to-r from-[#1E1B2E] via-[#2D2438] to-[#1E1B2E] text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>나만의 무의식 리포트 받기</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            어젯밤 당신의 꿈속에도 비밀 신호가 숨겨져 있습니다
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            프로이트, 칼 융, 신경과학 기반 4대 학문적 관점으로 단 3분 만에 나만의 심층 리포트와 고화질 AI 아트를 받아보세요.
          </p>
          <div className="pt-2">
            <Link
              href="/dream-teller"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F6AD55] text-[#1E1B2E] font-bold text-sm hover:scale-102 transition-all shadow-md active:scale-98"
            >
              <span>내 꿈의 암호 해독하기 (1,500원)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultViewContainer;
