'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: '어떤 전문 관점을 선택해야 가장 알맞을까요?',
    answer:
      '신비롭고 영적인 느낌이나 뚜렷한 상징물(거대한 문, 열쇠, 동물 등)이 나오는 꿈이라면 "칼 융"을 추천합니다. 반복되는 불안, 시험, 쫓기는 꿈이거나 억눌린 감정과 관련된 꿈은 "프로이트"가 적합합니다. 일상 스트레스나 최근 사건이 뒤섞여 나타났다면 "현대 신경과학"을, 대인관계 갈등이나 내면의 복잡한 감정을 정리하고 싶다면 "게슈탈트 치료"를 선택해보세요.',
  },
  {
    question: '정말 결제 후 3분 안에 해몽 결과가 완성되나요?',
    answer:
      '네, 결제가 완료되면 최첨단 생성 AI 기반 전용 해몽 파이프라인이 즉시 작동하여 텍스트 심층 리포트와 고화질 AI 일러스트를 약 3분 이내에 생성 완료합니다. 완성 즉시 고유한 결과 페이지 링크가 발급되며 영구적으로 다시 열람하실 수 있습니다.',
  },
  {
    question: '제가 입력한 꿈 내용의 비밀이 보장되나요?',
    answer:
      '100% 철저하게 보장됩니다. 고객님이 입력하신 꿈 데이터는 데이터베이스에 암호화되어 안전하게 보관되며, 본인이 결과 페이지에서 "피드 공개" 토글을 직접 켜지 않는 한 절대 타인에게 노출되지 않는 비공개 상태로 유지됩니다.',
  },
  {
    question: 'AI 이미지 복원 옵션(+500원)은 무엇인가요?',
    answer:
      '깨어나는 순간 뇌리에서 금세 사라지는 꿈속의 강렬하고 몽환적인 한 장면을 AI가 고화질 마법 유화 스타일로 복원해 드리는 특별 옵션입니다. 89% 이상의 유저가 텍스트 리포트와 함께 신청하고 계시며, 스마트폰 배경화면이나 개인 소장용으로 높은 만족도를 자랑합니다.',
  },
  {
    question: '비회원도 결제 및 해몽 조회가 가능한가요?',
    answer:
      '물론입니다. 별도의 복잡한 회원가입 없이 전화번호와 간단한 비밀번호만으로 비회원 주문이 가능하며, 이후 언제든지 상단 메뉴의 "비회원 주문 조회"에서 해몽 리포트를 다시 확인하실 수 있습니다.',
  },
];

/**
 * FaqSection: 상세 페이지 하단에서 잠재 고객의 심리적 저항과 의문을 해소하는 FAQ 컴포넌트입니다.
 */
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mt-16 pt-12 border-t border-[#E8E0F8] max-w-3xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-900">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>자주 묻는 질문</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#1E1B2E]">
          무의식 해독 의뢰에 대해 궁금하신가요?
        </h3>
        <p className="text-xs md:text-sm text-[#4B4562]">
          가장 많은 분들이 문의하신 내용을 모았습니다.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.question}
              className="border border-[#E8E0F8] bg-white rounded-xl overflow-hidden transition-all duration-200 shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleOpen(idx)}
                className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors"
              >
                <span className="font-semibold text-sm md:text-base text-[#1E1B2E]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#1E1B2E]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 md:px-5 md:pb-5 pt-0 text-xs md:text-sm text-[#4B4562] leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/50">
                  <div className="pt-3">{item.answer}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqSection;
