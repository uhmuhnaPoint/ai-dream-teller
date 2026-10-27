'use client';

import React from 'react';
import { PerspectiveType, PerspectiveOption } from '@/types/dream-teller';
import { Eye, Brain, Activity, Layers, Check, Sparkles, ArrowRight } from 'lucide-react';

interface StepPerspectiveProps {
  selectedPerspective: PerspectiveType | null;
  onSelect: (perspective: PerspectiveType) => void;
  onNext: () => void;
}

export const PERSPECTIVES: PerspectiveOption[] = [
  {
    id: 'jung',
    name: '칼 융 (Carl Jung)',
    enName: '원형과 상징의 분석심리학',
    badge: '가장 많은 선택 ✨',
    coreQuestion: '“인류 공통의 무의식적 원형(Archetype)이 어떤 내면의 성장을 암시하는가?”',
    description: '꿈은 결핍이 아닌 영혼의 나침반입니다. 그림자(Shadow), 아니마, 신화적 모티프를 분석해 숨겨진 자아의 회복과 자기실현(Individuation)을 돕습니다.',
    recommendedFor: '신비롭고 웅장한 스케일의 꿈, 동물·괴물·열쇠 등 뚜렷한 상징물이 나오는 꿈',
    bgGradient: 'from-amber-500/10 via-purple-500/5 to-transparent',
    borderColor: 'border-amber-400/60',
  },
  {
    id: 'freud',
    name: '지그문트 프로이트 (Sigmund Freud)',
    enName: '억압된 무의식과 본능의 정신분석',
    badge: '고전의 깊이 📜',
    coreQuestion: '“의식이 억누른 어떤 숨겨진 욕망이 검열을 거쳐 상징으로 변형되었는가?”',
    description: '꿈은 무의식으로 향하는 왕도(Royal Road)입니다. 현실에서 차마 마주하지 못했던 억압된 충동과 감정의 왜곡된 기호를 날카롭게 파헤칩니다.',
    recommendedFor: '당혹스럽거나 죄책감이 드는 꿈, 쫓기거나 시험을 치르는 등 반복되는 악몽',
    bgGradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    borderColor: 'border-indigo-400/60',
  },
  {
    id: 'neuroscience',
    name: '현대 신경과학 (Neuroscience)',
    enName: 'REM 수면 뇌기억 통합 & 정서 정화',
    badge: '과학적 객관성 🧠',
    coreQuestion: '“편도체와 해마는 어젯밤 복합 감정을 어떻게 인지적으로 재정돈하고 있는가?”',
    description: '미신이나 형이상학을 배제하고, 수면 중 뇌 신경망이 스트레스 기억을 완화하고 생존 시뮬레이션을 수행하는 인지적 정화 메커니즘을 규명합니다.',
    recommendedFor: '과도한 일상 스트레스 후 꾼 꿈, 최근 겪은 현실 사건들이 뒤섞여 나타난 꿈',
    bgGradient: 'from-sky-500/10 via-teal-500/5 to-transparent',
    borderColor: 'border-sky-400/60',
  },
  {
    id: 'gestalt',
    name: '게슈탈트 치료 (Gestalt Therapy)',
    enName: '지금-여기 내면의 분열된 자아 대화',
    badge: '즉각적 자기 치유 🪞',
    coreQuestion: '“꿈에 등장한 모든 인물과 사물은 내 자아의 어떤 소외된 조각인가?”',
    description: '꿈에 나오는 괴물도, 문도, 도망치는 나도 모두 분열된 자신의 투사입니다. 조각난 내면의 부분들과 대화하며 마음에 흩어진 에너지를 온전히 통합합니다.',
    recommendedFor: '인간관계 갈등이 투영된 꿈, 스스로와 화해가 필요하거나 감정이 요동치는 꿈',
    bgGradient: 'from-rose-500/10 via-purple-500/5 to-transparent',
    borderColor: 'border-rose-400/60',
  },
];

/**
 * StepPerspective: 1단계 - 해몽을 의뢰할 전문 학문 분야를 선택하는 컴포넌트입니다.
 * 비즈니스 기획 관점: 사용자가 자신의 고민과 꿈의 특성에 맞는 학파를 선택함으로써 서비스의 전문성과 신뢰도를 실감하도록 설계되었습니다.
 */
const StepPerspective = ({
  selectedPerspective,
  onSelect,
  onNext,
}: StepPerspectiveProps) => {
  return (
    <div className="space-y-6">
      {/* 섹션 가이드 문구 */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-xl p-4 md:p-5 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#E8E0F8] flex items-center justify-center shrink-0 text-[#4B4562] mt-0.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#1E1B2E]">
            어떤 시선으로 어젯밤 당신의 무의식을 탐험하고 싶으신가요?
          </p>
          <p className="text-[#4B4562] mt-1 text-xs md:text-sm leading-relaxed">
            AI Dream Teller는 단순한 민간 해몽이 아닌, 학문적으로 검증된 4가지 심층 분석 틀을 제공합니다. 
            가장 직관적으로 끌리거나 꿈의 분위기에 맞는 관점을 하나 선택해주세요.
          </p>
        </div>
      </div>

      {/* 4대 학파 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSPECTIVES.map((item) => {
          const isSelected = selectedPerspective === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(item.id);
                }
              }}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 outline-none select-none flex flex-col justify-between ${
                isSelected
                  ? `bg-white shadow-lg ${item.borderColor} ring-2 ring-amber-300/40 -translate-y-0.5`
                  : 'bg-white/70 hover:bg-white border-[#E8E0F8]/80 hover:border-[#D4AF37]/50 hover:shadow-md'
              }`}
            >
              {/* 상단 뱃지 & 라디오 체크 인장 */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs'
                      : 'bg-[#F2EFF8] text-[#4B4562]'
                  }`}
                >
                  {item.badge}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#1E1B2E] text-amber-300 shadow-sm scale-110'
                      : 'border-2 border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* 학파 명칭 및 설명 */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-[#1E1B2E] tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#7A7393] font-medium">
                    {item.enName}
                  </p>
                </div>

                <p className="text-xs md:text-sm text-[#4B4562] italic bg-[#FAF8F5]/80 p-2.5 rounded-lg border border-[#E8E0F8]/50 leading-relaxed">
                  {item.coreQuestion}
                </p>

                <p className="text-xs md:text-sm text-[#353047] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* 추천 유형 가이드 */}
              <div className="mt-4 pt-3 border-t border-[#F2EFF8] flex items-center gap-1.5 text-xs text-[#7A7393]">
                <span className="font-semibold text-amber-700 shrink-0">추천:</span>
                <span className="truncate">{item.recommendedFor}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 다음 단계 버튼 (아코디언 연동) */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[#7A7393]">
          {selectedPerspective
            ? `선택 완료: ${PERSPECTIVES.find((p) => p.id === selectedPerspective)?.name.split(' ')[0]}`
            : '분석을 맡길 학파를 1개 선택해주세요.'}
        </p>

        <button
          type="button"
          onClick={onNext}
          disabled={!selectedPerspective}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
            selectedPerspective
              ? 'bg-[#1E1B2E] text-amber-200 hover:bg-[#2D2845] hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>다음: 꿈 내용 작성하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StepPerspective;
