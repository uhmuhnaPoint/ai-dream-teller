'use client';

import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface StepDreamInputProps {
  dreamContent: string;
  onChange: (content: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MIN_LENGTH = 20;

const SAMPLE_DREAMS = [
  '끝없이 펼쳐진 보랏빛 사막 한가운데에서 거대한 모래시계를 발견했습니다. 시계 안에는 모래 대신 푸른 별가루가 거꾸로 솟아오르고 있었고, 멀리서 알 수 없는 목소리가 제 어릴 적 이름을 반복해서 불렀습니다.',
  '깊은 밤, 낡은 도서관의 닫힌 비밀 문을 열었더니 바다 밑으로 이어지는 나선형 계단이 나왔습니다. 계단을 내려갈수록 숨을 쉴 수 있었고, 거대한 혹등고래가 제 곁을 천천히 맴돌며 황금빛 열쇠를 건네주었습니다.',
  '제가 살던 고향집 옥상에 올라갔는데, 밤하늘에 두 개의 달이 떠 있었습니다. 하나는 은빛이었고 하나는 붉은빛이었는데, 가족들과 친구들이 저를 둘러싸고 아무 말 없이 미소를 지으며 손을 흔들고 있었습니다.',
];

/**
 * StepDreamInput: 2단계 - 사용자의 꿈 내용을 입력받고 유효성을 검사하는 컴포넌트입니다.
 * 비즈니스 기획 관점:
 * - 최소 20자 유효성 검사로 AI 분석 품질을 보장합니다.
 * - 작성에 막막함을 느끼는 유저를 위해 '예시 불러오기'와 '분석 가이드 칩'을 배치하여 작성 이탈율을 최소화합니다.
 */
const StepDreamInput = ({
  dreamContent,
  onChange,
  onNext,
  onPrev,
}: StepDreamInputProps) => {
  const [sampleIndex, setSampleIndex] = useState<number>(0);
  const currentLength = dreamContent.trim().length;
  const isValid = currentLength >= MIN_LENGTH;
  const progressRatio = Math.min(100, Math.round((currentLength / MIN_LENGTH) * 100));

  /**
   * 예시 꿈 텍스트를 불러와 사용자의 입력을 돕는 핸들러
   */
  const handleLoadSample = () => {
    const nextSample = SAMPLE_DREAMS[sampleIndex % SAMPLE_DREAMS.length];
    onChange(nextSample);
    setSampleIndex((prev) => prev + 1);
  };

  /**
   * 입력 내용 초기화 핸들러
   */
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-6">
      {/* 가이드 배너 */}
      <div className="bg-[#FAF8F5] border border-[#E8E0F8] rounded-xl p-4 md:p-5 flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#E8E0F8] flex items-center justify-center shrink-0 text-[#4B4562] mt-0.5">
          <PenTool className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#1E1B2E]">
            기억이 흐릿해지기 전에, 떠오르는 조각들을 편안하게 적어주세요.
          </p>
          <p className="text-[#4B4562] mt-1 text-xs md:text-sm leading-relaxed">
            문장이 완벽하지 않아도 괜찮습니다. 단편적인 장면, 등장인물, 색채, 당시 느꼈던 감정(두려움, 신비로움, 평온함 등)을 함께 적어주시면 AI 해독 정확도가 비약적으로 향상됩니다.
          </p>
        </div>
      </div>

      {/* 힌트 & 예시 불러오기 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7A7393]">
          <span className="font-semibold text-[#1E1B2E]">💡 팁:</span>
          <span className="bg-white/80 border border-[#E8E0F8] px-2 py-0.5 rounded-md text-[#4B4562]">
            주요 배경/장소
          </span>
          <span className="bg-white/80 border border-[#E8E0F8] px-2 py-0.5 rounded-md text-[#4B4562]">
            등장인물/사물
          </span>
          <span className="bg-white/80 border border-[#E8E0F8] px-2 py-0.5 rounded-md text-[#4B4562]">
            가장 선명했던 감정
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentLength > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-stone-400 hover:text-stone-600 underline cursor-pointer transition-colors"
            >
              내용 지우기
            </button>
          )}
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-amber-600" />
            <span>예시 꿈 불러오기</span>
          </button>
        </div>
      </div>

      {/* 꿈 입력 텍스트에어리어 */}
      <div className="relative">
        <textarea
          value={dreamContent}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder="어젯밤 또는 최근 인상 깊었던 꿈의 내용을 자세히 적어주세요. (최소 20자 이상)&#10;예: 끝이 보이지 않는 호수 위를 걷고 있었는데 물 아래에서 거대한 그림자가 저를 따라왔습니다. 무섭기보다는 묘하게 다정한 기분이 들었어요..."
          className="w-full p-4 md:p-5 rounded-2xl border-2 border-[#E8E0F8] bg-white text-[#1E1B2E] placeholder:text-stone-400 focus:outline-none focus:border-amber-400/80 focus:ring-4 focus:ring-amber-300/20 text-sm md:text-base leading-relaxed transition-all resize-y shadow-xs"
        />

        {/* 텍스트에어리어 우측 하단 장식/아이콘 */}
        <div className="absolute right-3 bottom-4 pointer-events-none text-stone-300">
          <Sparkles className="w-5 h-5 text-amber-300/40" />
        </div>
      </div>

      {/* 유효성 검사 및 프로그레스 바 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            {isValid ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>마법 깃펜이 충분한 기억을 포착했습니다 ✨</span>
              </span>
            ) : (
              <span className="text-amber-800 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>
                  최소 {MIN_LENGTH}자 이상 작성해주세요 ({MIN_LENGTH - currentLength}자 남음)
                </span>
              </span>
            )}
          </div>

          <div className="text-stone-500 font-mono">
            <span className={isValid ? 'font-bold text-[#1E1B2E]' : 'text-stone-500'}>
              {currentLength}
            </span>
            <span className="text-stone-400"> / 최소 {MIN_LENGTH}자</span>
          </div>
        </div>

        {/* 미니 프로그레스 게이지 */}
        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isValid ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
            style={{ width: `${progressRatio}%` }}
          />
        </div>
      </div>

      {/* 보안/비밀 보장 넛지 */}
      <div className="flex items-center gap-2 text-xs text-[#7A7393] bg-[#FAF8F5]/80 px-3 py-2 rounded-lg border border-[#E8E0F8]/50">
        <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span>
          작성된 꿈 내용은 100% 안전하게 암호화 보관되며, 본인의 동의 없이 외부에 공개되지 않습니다.
        </span>
      </div>

      {/* 스텝 이동 버튼 그룹 */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전: 관점 변경</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
            isValid
              ? 'bg-[#1E1B2E] text-amber-200 hover:bg-[#2D2845] hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>다음: 결제 옵션 및 금액 확인</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StepDreamInput;
