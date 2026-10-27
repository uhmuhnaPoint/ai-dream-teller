'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarDreamEntry } from '@/types/dream-result';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  BookOpen,
  ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface MyDreamCalendarProps {
  entries: CalendarDreamEntry[];
}

/**
 * 마이페이지 전용 무의식 캘린더 컴포넌트
 * - 캘린더 날짜 하이라이트 (별빛 인장 및 골드 링)
 * - 날짜 선택 시 상세 스니펫 프리뷰 및 '결과 페이지 이동(/dream-result/[order-id])' 지원
 */
export const MyDreamCalendar = ({ entries }: MyDreamCalendarProps) => {
  // 기본 선택 엔트리: 가장 최근 기록된 꿈
  const [selectedEntry, setSelectedEntry] = useState<CalendarDreamEntry | null>(
    entries[entries.length - 1] || null
  );

  // 2026년 10월 달력 규격 (1일: 목요일 시작, 총 31일)
  const DAYS_IN_MONTH = 31;
  const START_DAY_OFFSET = 4; // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목

  const entryMap = new Map<number, CalendarDreamEntry>();
  entries.forEach((e) => entryMap.set(e.day, e));

  const perspectiveLabelMap: Record<string, string> = {
    jung: '칼 융 분석심리학',
    freud: '지그문트 프로이트 정신분석',
    neuroscience: '현대 인지신경과학',
    gestalt: '게슈탈트 형태주의',
  };

  return (
    <div className="bg-[#FAF8F5]/90 border border-[#E8E0D5] rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-950/5 space-y-6">
      {/* 캘린더 헤더 안내 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EAE3D6] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>무의식 타임라인</span>
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1E1B2E]">
              나의 꿈 캘린더 (Dream Calendar)
            </h2>
          </div>
          <p className="text-xs text-[#7A7165] mt-1">
            2026년 10월 · 날짜별 별빛 인장을 클릭하여 당시의 꿈 해석 리포트로 바로 이동하세요.
          </p>
        </div>

        <div className="text-xs bg-white border border-[#E8E0D5] px-3.5 py-2 rounded-xl font-medium text-[#4B4562] flex items-center gap-2 shrink-0 shadow-2xs">
          <CalendarIcon className="w-4 h-4 text-[#6B46C1]" />
          <span>이번 달 해몽 기록: <strong className="text-[#6B46C1]">{entries.length}편</strong></span>
        </div>
      </div>

      {/* 달력 그리드 */}
      <div>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#8C827A] mb-2">
          <span className="text-rose-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-500">토</span>
        </div>

        {/* 날짜 셀 그리드 */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* 이전 달 빈 칸 */}
          {Array.from({ length: START_DAY_OFFSET }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-11 sm:h-14 rounded-xl bg-stone-100/40" />
          ))}

          {/* 1일 ~ 31일 */}
          {Array.from({ length: DAYS_IN_MONTH }).map((_, idx) => {
            const dayNum = idx + 1;
            const entry = entryMap.get(dayNum);
            const isSelected = selectedEntry?.day === dayNum;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => {
                  if (entry) setSelectedEntry(entry);
                }}
                disabled={!entry}
                className={`h-11 sm:h-14 rounded-xl border flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all text-xs relative ${
                  entry
                    ? isSelected
                      ? 'bg-gradient-to-br from-[#2D1B4E] to-[#1E1B2E] text-white border-amber-400 ring-2 ring-amber-400/30 shadow-md scale-105 z-10 cursor-pointer'
                      : 'bg-white hover:bg-[#F3EFEA] text-[#1E1B2E] border-amber-400/80 hover:border-amber-500 shadow-2xs cursor-pointer'
                    : 'bg-white/40 text-stone-300 border-stone-200/50 cursor-default'
                }`}
              >
                <div className="w-full flex justify-between items-center px-0.5">
                  <span className={`font-semibold ${isSelected ? 'text-amber-300' : entry ? 'text-[#1E1B2E]' : 'text-stone-300'}`}>
                    {dayNum}
                  </span>
                  {entry?.hasImage && (
                    <ImageIcon className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-amber-600'}`} />
                  )}
                </div>

                {/* 꿈이 있는 날짜: 별빛 인장 */}
                {entry && (
                  <div className="w-full flex items-center justify-center pb-0.5">
                    <span
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-amber-400 animate-ping' : 'bg-amber-500 shadow-xs shadow-amber-500/50'
                      }`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜의 꿈 스니펫 상세 카드 & 결과 페이지 바로 이동 링크 */}
      {selectedEntry && (
        <div className="bg-white border-2 border-[#E8E0D5] rounded-2xl p-5 sm:p-6 shadow-md shadow-purple-950/5 relative overflow-hidden animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#E8E0F8] text-[#4B3B70] border border-[#D5C7F0]">
                  {perspectiveLabelMap[selectedEntry.perspective] || selectedEntry.perspective}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {selectedEntry.dateStr}
                </span>
                {selectedEntry.hasImage && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>AI 일러스트 보관됨</span>
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E]">
                {selectedEntry.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5D576B] line-clamp-2 leading-relaxed">
                {selectedEntry.summary}
              </p>
            </div>

            {/* 결과 페이지 이동 버튼 (요구사항: 캘린더 날짜 하이라이트 → 결과 페이지 이동) */}
            <div className="shrink-0 flex items-center">
              <Link
                href={`/dream-result/${selectedEntry.orderId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2D1B4E] to-[#1E1B2E] text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-bold border border-amber-400/40 hover:border-amber-400 shadow-md hover:shadow-lg transition-all group"
              >
                <span>심층 해석 리포트 열람</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
