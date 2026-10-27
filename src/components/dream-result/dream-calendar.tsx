'use client';

import React, { useState } from 'react';
import { CalendarDreamEntry } from '@/types/dream-result';
import { Calendar as CalendarIcon, Sparkles, ChevronRight, BookOpen, Clock, ImageIcon } from 'lucide-react';

interface DreamCalendarProps {
  entries: CalendarDreamEntry[];
  currentOrderId: string;
}

/**
 * DreamCalendar: 회원 전용 무의식 캘린더 컴포넌트입니다.
 * 요구사항 준수:
 * - 로그인한 회원이 자신의 해석 확인 페이지에 접속했을 때만 노출됩니다.
 * - 이번 달 날짜별 꿈 기록 유무를 마법 서재 스타일의 별빛 인장으로 시각화합니다.
 */
const DreamCalendar = ({ entries, currentOrderId }: DreamCalendarProps) => {
  const [selectedEntry, setSelectedEntry] = useState<CalendarDreamEntry | null>(
    entries.find((e) => e.orderId === currentOrderId) || entries[entries.length - 1] || null
  );

  // 2026년 10월 (1일: 목요일 시작, 총 31일)
  // 요일 헤더: 일 월 화 수 목 금 토
  // 목요일 시작이므로 앞에 4개의 빈 칸 필요
  const DAYS_IN_MONTH = 31;
  const START_DAY_OFFSET = 4; // 목요일 (0: 일, 1: 월, 2: 화, 3: 수, 4: 목)

  // 날짜별 엔트리 매핑
  const entryMap = new Map<number, CalendarDreamEntry>();
  entries.forEach((e) => entryMap.set(e.day, e));

  return (
    <div className="bg-white border-2 border-[#E8E0F8] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* 캘린더 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>회원 전용 기능</span>
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E]">
              나의 무의식 캘린더 (The Dream Calendar)
            </h3>
          </div>
          <p className="text-xs text-[#7A7393] mt-1">
            2026년 10월 · 한 달간 차곡차곡 축적된 무의식의 궤적을 날짜별로 탐험하세요.
          </p>
        </div>

        <div className="text-xs bg-[#FAF8F5] border border-[#E8E0F8] px-3 py-1.5 rounded-xl font-medium text-[#4B4562] flex items-center gap-1.5 shrink-0">
          <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
          <span>이번 달 해독 기록: <strong>{entries.length}편</strong></span>
        </div>
      </div>

      {/* 달력 그리드 영역 */}
      <div>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-400 mb-2">
          <span className="text-rose-400">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-400">토</span>
        </div>

        {/* 날짜 셀들 */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* 시작 요일 맞춤 빈 셀 */}
          {Array.from({ length: START_DAY_OFFSET }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl" />
          ))}

          {/* 1일 ~ 31일 */}
          {Array.from({ length: DAYS_IN_MONTH }).map((_, idx) => {
            const dayNum = idx + 1;
            const entry = entryMap.get(dayNum);
            const isSelected = selectedEntry?.day === dayNum;
            const isCurrentPageDream = entry?.orderId === currentOrderId;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => entry && setSelectedEntry(entry)}
                disabled={!entry}
                className={`relative h-11 sm:h-14 rounded-xl flex flex-col items-center justify-between p-1.5 text-xs transition-all ${
                  entry
                    ? isSelected
                      ? 'bg-[#1E1B2E] text-amber-300 font-bold shadow-md scale-102 ring-2 ring-amber-300/40 cursor-pointer'
                      : 'bg-[#FAF8F5] hover:bg-[#F2EFF8] text-[#1E1B2E] font-semibold border border-[#E8E0F8] hover:border-amber-300/80 shadow-2xs cursor-pointer'
                    : 'text-stone-300 hover:text-stone-400 cursor-default'
                }`}
              >
                {/* 날짜 숫자 */}
                <span className="text-[11px] sm:text-xs">{dayNum}</span>

                {/* 기록된 꿈 인디케이터 */}
                {entry && (
                  <div className="flex items-center gap-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-purple-600'
                      }`}
                    />
                    {isCurrentPageDream && (
                      <span className="text-[9px] hidden sm:inline text-amber-600 font-bold">
                        ★
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜의 꿈 스니펫 상세 카드 */}
      {selectedEntry && (
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0F8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                10월 {selectedEntry.day}일 기록
              </span>
              <h4 className="text-sm font-bold text-[#1E1B2E]">
                {selectedEntry.title}
              </h4>
              {selectedEntry.hasImage && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                  <ImageIcon className="w-2.5 h-2.5" />
                  <span>아트워크</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#4B4562] leading-relaxed">
              {selectedEntry.summary}
            </p>
          </div>

          <div className="shrink-0 text-xs text-purple-700 font-medium flex items-center gap-1 self-end sm:self-center">
            {selectedEntry.orderId === currentOrderId ? (
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                현재 열람 중인 꿈 ✨
              </span>
            ) : (
              <span className="text-stone-500">
                무의식 아카이브 보존됨
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamCalendar;
