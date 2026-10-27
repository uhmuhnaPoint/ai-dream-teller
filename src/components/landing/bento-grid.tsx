'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Compass, 
  Palette, 
  ScrollText, 
  Library, 
  ArrowRight,
  Brain,
  Eye,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import DreamResultModal from '@/components/dream-result/dream-result-modal';

interface SchoolOfThought {
  id: string;
  name: string;
  enName: string;
  icon: typeof Brain;
  coreQuestion: string;
  description: string;
}

const SCHOOLS: SchoolOfThought[] = [
  {
    id: 'freud',
    name: '프로이트',
    enName: 'Sigmund Freud',
    icon: Brain,
    coreQuestion: '“억압된 무의식 속 어떤 숨은 욕망이 검열을 거쳐 상징으로 변형되었는가?”',
    description: '꿈은 무의식으로 향하는 왕도(Royal Road)입니다. 일상에서 억누른 감정과 충동이 은유된 기호를 정밀 해독합니다.',
  },
  {
    id: 'jung',
    name: '칼 융',
    enName: 'Carl Jung',
    icon: Eye,
    coreQuestion: '“인류 공통의 원형(Archetype)과 신화적 상징이 어떤 내면의 성장을 인도하는가?”',
    description: '단순한 결핍이 아닌 자기실현(Individuation)의 초대장입니다. 그림자, 페르소나, 아니마 등 원형적 상징을 탐색합니다.',
  },
  {
    id: 'neuroscience',
    name: '신경과학',
    enName: 'Neuroscience',
    icon: Activity,
    coreQuestion: '“REM 수면 중 뇌 신경망이 감정 기억을 어떻게 정리하고 정화하고 있는가?”',
    description: '뇌의 편도체와 해마가 낮 동안의 스트레스와 복합 감정을 재구성하는 인지적 정화 메커니즘을 과학적으로 분석합니다.',
  },
  {
    id: 'gestalt',
    name: '게슈탈트',
    enName: 'Gestalt Therapy',
    icon: Layers,
    coreQuestion: '“꿈에 나타난 모든 사물과 인물은 내 자아의 어떤 분열된 조각인가?”',
    description: '꿈의 모든 요소는 나 자신의 투사입니다. 버림받았던 내면의 조각들과 대화를 나누며 온전한 통합을 이룹니다.',
  },
];

/**
 * BentoGrid: 4가지 핵심 가치(학문적 엄밀함, 시각화, 빠른 해답, 기록 아카이빙)를
 * 해리포터풍의 신비로운 마법 서재와 펜시브 메타포로 전달하는 핵심 기능 소개 섹션입니다.
 */
const BentoGrid = () => {
  // 사용자가 4대 학문적 관점을 직접 눌러보며 신뢰감을 체감할 수 있도록 상태 관리
  const [activeSchoolId, setActiveSchoolId] = useState<string>('freud');
  const activeSchool = SCHOOLS.find((s) => s.id === activeSchoolId) || SCHOOLS[0];

  // Card 2 클릭 시 해석 확인 페이지 팝업 뷰 열기 상태
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* 섹션 헤더 */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E0F8]/60 px-3.5 py-1 text-xs font-semibold text-[#6B46C1] mb-3">
          <Library className="w-3.5 h-3.5" />
          <span>신비로운 꿈의 대도서관</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1E1B2E]">
          무의식의 암호를 해독하는 4가지 비밀 열쇠
        </h2>
        <p className="mt-3.5 text-sm sm:text-base text-[#4B4562] leading-relaxed">
          운세나 사주처럼 모호한 미래 예측이 아닌, 내면의 심리와 뇌과학을 관통하는
          독보적인 해몽 경험을 선사합니다.
        </p>
      </div>

      {/* Bento Grid 레이아웃: 2열 비대칭 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: 4대 렌즈 선택 (2컬럼 차지 - 대형 카드) */}
        <div className="md:col-span-2 rounded-3xl border border-[#E8E0F8] bg-gradient-to-br from-[#FFFDF9] via-[#FAF8F5] to-[#F5F0EB] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#6B46C1]/10 px-2.5 py-1 text-xs font-semibold text-[#6B46C1]">
              <Compass className="w-3.5 h-3.5" />
              학문적 엄밀함
            </span>
            <span className="text-xs text-[#716A89] font-medium">The Quad-Lens Analysis</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#1E1B2E] tracking-tight">
            사주나 미신이 아닌, 4가지 학문적 렌즈로 투영하는 꿈의 본질
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#4B4562]">
            하나의 꿈도 어떤 학파의 렌즈를 끼우느냐에 따라 전혀 다른 차원의 통찰이 열립니다.
            원하는 관점을 선택해 보세요.
          </p>

          {/* 4대 학파 탭 셀렉터 */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCHOOLS.map((school) => {
              const Icon = school.icon;
              const isActive = school.id === activeSchoolId;
              return (
                <button
                  key={school.id}
                  onClick={() => setActiveSchoolId(school.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-sm'
                      : 'bg-white/80 text-[#4B4562] border-[#E8E0F8] hover:bg-white hover:border-[#6B46C1]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-[#6B46C1]'}`} />
                  <span className="text-xs sm:text-sm font-semibold truncate">{school.name}</span>
                </button>
              );
            })}
          </div>

          {/* 선택된 학파 상세 프리뷰 박스 (양피지 서재 스타일) */}
          <div className="mt-4 rounded-2xl border border-[#E8E0F8]/80 bg-white/90 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E8E0F8]/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B46C1]">
                {activeSchool.enName}
              </span>
              <span className="text-[11px] text-[#716A89]">전문 분석 알고리즘 탑재</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#1E1B2E] italic">
              {activeSchool.coreQuestion}
            </p>
            <p className="mt-2 text-xs text-[#4B4562] leading-relaxed">
              {activeSchool.description}
            </p>
          </div>
        </div>

        {/* Card 2: 펜시브의 재현 - 꿈의 시각화 (1컬럼 차지) */}
        <div
          onClick={() => setIsResultModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsResultModalOpen(true);
            }
          }}
          className="rounded-3xl border border-[#E8E0F8] bg-gradient-to-b from-[#FFFDF9] to-[#FAF8F5] p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group/card2 hover:border-[#D4AF37]/80 hover:-translate-y-1 relative"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#D53F8C]/10 px-2.5 py-1 text-xs font-semibold text-[#D53F8C]">
                <Palette className="w-3.5 h-3.5" />
                기억의 실체화
              </span>
              <span className="text-[11px] font-semibold text-[#D53F8C] bg-[#FCE7F3] px-2 py-0.5 rounded-full">
                +500원 옵션
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#1E1B2E] tracking-tight group-hover/card2:text-[#6B46C1] transition-colors">
              말로는 다 설명 못 할 그 장면, 눈앞의 예술로 복원하다
            </h3>
            <p className="mt-2 text-xs text-[#4B4562] leading-relaxed">
              깨어나는 순간 흩어지는 꿈속의 몽환적인 색채와 질감을 AI가 한 폭의 마법 같은 일러스트로 영구 보존합니다.
            </p>
          </div>

          {/* 생성형 아트워크 프리뷰 이미지 */}
          <div className="mt-5 relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-[#E8E0F8] group shadow-inner">
            <Image
              src="/images/pensieve-library.jpg"
              alt="펜시브 마법 도서관 꿈 시각화 프리뷰"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B2E]/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] text-white/90 font-medium">
                “꿈속에서 은빛으로 빛나던 펜시브와 하늘의 오로라”
              </span>
            </div>
          </div>

          {/* 하단 클릭 인터랙션 안내 뱃지 */}
          <div className="mt-4 pt-3 border-t border-[#E8E0F8]/80 flex items-center justify-between text-xs font-bold text-[#6B46C1] group-hover/card2:text-[#553C9A]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>실제 해석 확인 리포트 & 캘린더 보기</span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/card2:translate-x-1" />
          </div>
        </div>

        {/* Card 3: 3분의 비밀 해독 (1컬럼 차지) */}
        <div className="rounded-3xl border border-[#E8E0F8] bg-gradient-to-b from-[#FFFDF9] to-[#FAF8F5] p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2B6CB0]/10 px-2.5 py-1 text-xs font-semibold text-[#2B6CB0]">
                <ScrollText className="w-3.5 h-3.5" />
                즉각적인 해답
              </span>
              <span className="text-xs text-[#716A89]">A4 2장 분량</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#1E1B2E] tracking-tight">
              단 3분 만에 펼쳐지는 나만의 맞춤형 심층 해석서
            </h3>
            <p className="mt-2 text-xs text-[#4B4562] leading-relaxed">
              단순 키워드 몇 줄의 흔한 해몽이 아닙니다. 상징물, 감정의 층위, 현실 심리 상태를 입체적으로 분석한 정밀 리포트를 즉시 발급합니다.
            </p>
          </div>

          {/* 마법 양피지 리포트 시각화 미니어처 */}
          <div className="mt-5 rounded-2xl border border-[#D4AF37]/40 bg-[#FFFDF8] p-4 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-2.5">
              <span className="text-[11px] font-bold text-[#8C6D23]">AI DREAM ANALYSIS REPORT</span>
              <div className="h-2 w-2 rounded-full bg-[#38A169] animate-pulse" />
            </div>
            <div className="space-y-1.5 text-[11px] text-[#4B4562]">
              <div className="flex justify-between">
                <span className="text-[#716A89]">핵심 기저 상징:</span>
                <span className="font-semibold text-[#1E1B2E]">날아가는 시계탑과 억압된 시간성</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#716A89]">현재 무의식 상태:</span>
                <span className="font-semibold text-[#6B46C1]">변화에 대한 깊은 갈망 (88%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#716A89]">내면의 처방:</span>
                <span className="font-semibold text-[#1E1B2E]">과거의 통제감을 내려놓을 때</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[10px] text-[#716A89]">
              <span>정밀 분석 완료</span>
              <span className="font-bold text-[#D4AF37]">Seal Certified 📜</span>
            </div>
          </div>
        </div>

        {/* Card 4: 밤의 비밀 서재 (2컬럼 차지 - 대형 카드) */}
        <div className="md:col-span-2 rounded-3xl border border-[#E8E0F8] bg-gradient-to-br from-[#FFFDF9] via-[#FAF8F5] to-[#F5F0EB] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#38A169]/10 px-2.5 py-1 text-xs font-semibold text-[#276749]">
                <Library className="w-3.5 h-3.5" />
                기록과 연결
              </span>
              <span className="text-xs text-[#716A89] font-medium">The Dream Archive & Feed</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#1E1B2E] tracking-tight">
              잊혀지던 꿈들이 모여 내면의 지도가 되는 비밀 서재
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#4B4562]">
              캘린더에 차곡차곡 쌓이는 무의식의 궤적을 통해 반복되는 감정 패턴을 발견하세요.
              익명 피드를 통해 나와 비슷한 꿈을 꾼 다른 이들의 신비로운 기록을 탐색할 수도 있습니다.
            </p>
          </div>

          {/* 캘린더 & 피드 시각화 UI 미니어처 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-[#E8E0F8] bg-white/90 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E1B2E] mb-2">
                <span>무의식 캘린더 히스토리</span>
                <span className="text-[#6B46C1] text-[11px]">3회 기록됨</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#716A89] py-1">
                <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span>
                <span className="p-1 rounded bg-[#E8E0F8] text-[#6B46C1] font-bold">12</span>
                <span className="p-1">13</span>
                <span className="p-1 rounded bg-[#FCE7F3] text-[#D53F8C] font-bold">14</span>
                <span className="p-1">15</span>
                <span className="p-1">16</span>
                <span className="p-1 rounded bg-[#E0F2FE] text-[#2B6CB0] font-bold">17</span>
                <span className="p-1">18</span>
              </div>
              <p className="mt-2 text-[10px] text-[#716A89]">꿈의 반복 주기와 감정 변화를 추적합니다.</p>
            </div>

            <div className="rounded-2xl border border-[#E8E0F8] bg-white/90 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#1E1B2E] mb-1.5">
                  <span>익명 꿈 피드 탐색</span>
                  <span className="text-[10px] bg-[#E8E0F8] text-[#6B46C1] px-1.5 py-0.5 rounded">공개 커뮤니티</span>
                </div>
                <p className="text-[11px] text-[#4B4562] line-clamp-2">
                  “어젯밤 저도 하늘을 나는 고래 꿈을 꾸었는데, 융의 관점에서 엄청난 위로를 받았어요...”
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8E0F8] flex items-center justify-between text-[10px] text-[#6B46C1] font-semibold">
                <span>피드 보러가기</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 하단 유도 링크 */}
      <div className="mt-10 text-center">
        <Link
          href="/dream-teller"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B46C1] hover:text-[#553C9A] transition-colors"
        >
          <span>내 꿈에 꼭 맞는 학파 선택하고 해석 시작하기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Card 2 클릭 시 열리는 해석 확인 리포트 & 캘린더 모달 */}
      <DreamResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        orderId="DREAM_PENSIEVE_HIGHLIGHT"
      />
    </section>
  );
};

export default BentoGrid;
