'use client';

import { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';

interface DreamExample {
  id: string;
  fieldId: 'freud' | 'jung' | 'neuroscience' | 'gestalt';
  title: string;
  dreamFullStory: string;
  analysisFullReport: {
    symbolSummary: string;
    unconsciousInsight: string;
    psychologicalState: string;
    advice: string;
  };
  schoolBadge: string;
  schoolColor: string;
  imageSrc: string;
  imageAlt: string;
  createdTime: string;
  views: number;
}

const DREAM_EXAMPLES: DreamExample[] = [
  {
    id: 'example-1',
    fieldId: 'neuroscience',
    title: '오로라 밤하늘을 유영하는 거대 고래와 시계탑',
    dreamFullStory:
      '하늘 높이 떠 있는 고대 시계탑 주위를 거대한 은빛 고래가 헤엄쳐 지나갔습니다. 시계탑의 거대한 태엽과 바늘이 거꾸로 돌기 시작했는데도 전혀 무섭지 않고, 오히려 가슴 속 응어리가 풀리듯 깊은 평온함이 찾아왔습니다. 고래의 지느러미 끝에서 별빛 가루가 쏟아져 내렸습니다.',
    analysisFullReport: {
      symbolSummary: '역행하는 시계탑(시간 압박의 해제)과 은빛 고래(치유적 뇌 기억 통합)',
      unconsciousInsight:
        '현대 뇌신경과학적 관점에서 볼 때, REM 수면 중 뇌의 편도체와 해마가 누적된 마감 기한 스트레스를 "초월적 비행과 무중력 상태"로 치환하여 인지적 정화를 수행하는 뇌의 자가 회복 메커니즘입니다.',
      psychologicalState: '정서적 과부하 해소 진행 중 (신경 가소성 지표 94% 회복)',
      advice: '현실의 통제할 수 없는 일정에 대한 집착을 잠시 내려놓고, 충분한 뇌 휴식을 취할 타이밍임을 무의식이 알려주고 있습니다.',
    },
    schoolBadge: '신경과학 분석',
    schoolColor: 'bg-[#2B6CB0]/10 text-[#2B6CB0] border-[#2B6CB0]/20',
    imageSrc: '/images/sky-whale.jpg',
    imageAlt: '오로라 밤하늘을 유영하는 고래와 마법 시계탑 AI 생성 아트워크',
    createdTime: '12분 전 해독 완료',
    views: 1420,
  },
  {
    id: 'example-2',
    fieldId: 'jung',
    title: '안개 숲속에 홀로 빛나던 룬 문자의 황금 문',
    dreamFullStory:
      '끝없이 이어지는 보랏빛 안개 숲을 홀로 걷다가 땅에 닿지 않고 공중에 떠 있는 룬 문자의 황금 문을 발견했습니다. 문틈 사이로 쏟아져 나오는 오로라 빛이 제 심장을 비추었고, 문을 열어야만 진짜 나를 만날 수 있을 것 같은 강렬한 확신이 들었습니다.',
    analysisFullReport: {
      symbolSummary: '부유하는 황금 문(자아 성장의 문턱)과 룬 문자(집단 무의식의 원형)',
      unconsciousInsight:
        '칼 융의 원형 심리학에서 이 문은 "자아의 문턱(Threshold of Individuation)"을 상징합니다. 현재 당신의 무의식은 낡은 자아를 벗고, 숨겨져 있던 잠재력(Self)을 현실로 발현시키려는 거대한 전환점에 도달해 있습니다.',
      psychologicalState: '새로운 인생 국면으로의 도약 의지 (원형 통합률 88%)',
      advice: '변화에 대한 두려움 때문에 결정을 미루고 있다면, 무의식이 준비한 새로운 도전을 믿고 문을 열어보세요.',
    },
    schoolBadge: '칼 융 원형 분석',
    schoolColor: 'bg-[#6B46C1]/10 text-[#6B46C1] border-[#6B46C1]/20',
    imageSrc: '/images/mystic-door.jpg',
    imageAlt: '안개 숲속에 떠 있는 마법의 황금 문 AI 생성 아트워크',
    createdTime: '28분 전 해독 완료',
    views: 2190,
  },
  {
    id: 'example-3',
    fieldId: 'freud',
    title: '흩날리는 황금 양피지와 끝없는 나선형 마법 서재',
    dreamFullStory:
      '수많은 고서와 양피지가 허공을 날아다니고 은빛 펜시브 대야에서 기억의 실타래가 피어오르는 도서관에서 계속해서 내 이름이 적힌 양피지를 찾아 헤맸습니다. 마지막 순간 내 이름이 황금빛 글씨로 적힌 책을 펼치자 눈부신 빛이 터져 나왔습니다.',
    analysisFullReport: {
      symbolSummary: '날아다니는 양피지(지적 인정 욕망)와 은빛 펜시브(은밀한 무의식의 저장소)',
      unconsciousInsight:
        '프로이트의 욕망 분석에 따르면 타인에게 나의 가치를 완벽히 인정받고 증명하고 싶은 지적 야망과 자아 실현의 결핍이 상징적으로 치환된 서사입니다. 무의식은 이미 당신이 해답을 쥐고 있음을 암시합니다.',
      psychologicalState: '자아 존중감 확립 및 사회적 성취 욕구 (성취 추동 지수 91%)',
      advice: '타인의 평가보다 내가 진정으로 성취하고 싶은 지적 가치가 무엇인지 스스로에게 명확히 선언해 줄 필요가 있습니다.',
    },
    schoolBadge: '프로이트 심층 분석',
    schoolColor: 'bg-[#D53F8C]/10 text-[#D53F8C] border-[#D53F8C]/20',
    imageSrc: '/images/pensieve-library.jpg',
    imageAlt: '날아다니는 양피지와 마법 서재 AI 생성 아트워크',
    createdTime: '45분 전 해독 완료',
    views: 1840,
  },
  {
    id: 'example-4',
    fieldId: 'gestalt',
    title: '오래된 비밀 서재의 거울 속에서 만난 또 다른 나',
    dreamFullStory:
      '촛불이 타오르는 오래된 서재의 전신 거울 앞에 섰는데, 거울 속의 나는 현실의 나와 달리 슬프면서도 결연한 표정으로 저를 응시하고 있었습니다. 거울 속 내가 손을 뻗어 제 손을 맞잡았을 때 따뜻한 온기가 온몸으로 퍼졌습니다.',
    analysisFullReport: {
      symbolSummary: '마법 거울(외면했던 자아의 투사)과 손을 맞잡는 행위(게슈탈트 자아 통합)',
      unconsciousInsight:
        '게슈탈트 심리학에서 거울 속 인물은 "일상에서 억누르고 배제했던 나의 취약한 감정 조각"입니다. 이를 부정하지 않고 두 손을 맞잡았다는 것은 분열되었던 내면의 파편들이 화해하고 치유되는 상징적 대화입니다.',
      psychologicalState: '내면 아이와의 화해 및 자기 수용도 (자기 통합도 96%)',
      advice: '스스로에게 지나치게 엄격했던 기준을 완화하고, 지친 나의 연약한 모습까지 따뜻하게 안아줄 시간입니다.',
    },
    schoolBadge: '게슈탈트 분석',
    schoolColor: 'bg-[#38A169]/10 text-[#276749] border-[#38A169]/20',
    imageSrc: '/images/mystic-mirror.jpg',
    imageAlt: '서재의 신비로운 마법 거울과 촛불 AI 생성 아트워크',
    createdTime: '1시간 전 해독 완료',
    views: 1320,
  },
  {
    id: 'example-5',
    fieldId: 'neuroscience',
    title: '은하수 궤도를 질주하는 마법 야간 열차',
    dreamFullStory:
      '구름과 별자리 위로 부유하는 황금빛 궤도를 달리는 빈티지 열차를 탔습니다. 창밖으로 별똥별이 쏟아져 내리고 역마다 제가 과거에 소중하게 여겼던 추억의 물건들이 전시되어 있었습니다. 열차는 멈추지 않고 미래의 도시로 향했습니다.',
    analysisFullReport: {
      symbolSummary: '질주하는 야간 열차(기억 정보의 신경망 재배치)와 별자리 궤도(장기 기억 전이)',
      unconsciousInsight:
        '수면 주기 동안 뇌는 불필요한 단기 기억을 소거하고 소중한 정서적 경험을 영구 저장소로 재배치합니다. 열차가 목적지를 향해 거침없이 나아간 것은 현재 인지적 에너지가 미래지향적으로 정렬되었음을 뜻합니다.',
      psychologicalState: '정신적 명료도 회복 및 미래 확신감 (인지 에너지 89%)',
      advice: '과거의 아쉬움에 머무르지 않고 앞으로 나아갈 준비가 충분히 되어 있습니다. 계획하던 일을 행동으로 옮기세요.',
    },
    schoolBadge: '신경과학 분석',
    schoolColor: 'bg-[#2B6CB0]/10 text-[#2B6CB0] border-[#2B6CB0]/20',
    imageSrc: '/images/celestial-train.jpg',
    imageAlt: '은하수 궤도를 달리는 마법 기차 AI 생성 아트워크',
    createdTime: '1시간 20분 전 해독 완료',
    views: 1980,
  },
];

const FILTER_TABS = [
  { id: 'all', label: '전체 관점' },
  { id: 'freud', label: '프로이트 (욕망/은유)' },
  { id: 'jung', label: '칼 융 (원형/상징)' },
  { id: 'neuroscience', label: '신경과학 (뇌기억/정화)' },
  { id: 'gestalt', label: '게슈탈트 (자아통합)' },
];

/**
 * RecentDreams: 사용자가 카드들을 클릭하여 서로 다른 꿈 해몽 피드와
 * 실제 AI 분석 리포트 전문, 고해상도 AI 아트워크를 인터랙티브하게 탐색할 수 있는 섹션입니다.
 */
const RecentDreams = () => {
  // 학파별 필터 상태 관리
  const [activeFilter, setActiveFilter] = useState<string>('all');
  // 모달에 열려있는 꿈 상세 데이터 (null이면 모달 닫힘)
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  // 노출 카드 수 제한 (더보기 토글)
  const [visibleCount, setVisibleCount] = useState<number>(3);

  // 선택된 필터에 따라 피드 리스트 필터링
  const filteredDreams = DREAM_EXAMPLES.filter((dream) => {
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
              <span>실시간 해독 아카이브 · 카드를 클릭해 리포트를 읽어보세요</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1B2E]">
              방금 전 다른 이들이 발견한 무의식의 장면들
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4B4562]">
              카드를 누르면 실제 유저들이 받아본 <strong>AI 심층 해석 리포트 전문</strong>과 <strong>생성 아트워크</strong>를 자세히 살펴볼 수 있습니다.
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

        {/* 학파별 탭 필터: 클릭 시 해당 분야의 꿈 피드가 필터링되어 교체 노출 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setVisibleCount(3); // 탭 변경 시 기본 3개 노출로 리셋
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

        {/* 꿈 피드 카드 그리드 (클릭 시 상세 모달 트리거) */}
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
                  
                  {/* 꿈 스토리 발췌 */}
                  <div className="mt-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0F8]/80 p-3 text-xs text-[#4B4562] italic line-clamp-2">
                    “{item.dreamFullStory}”
                  </div>

                  {/* AI의 핵심 심층 해석 */}
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
      {/* 카드 클릭 시 열리는 상세 해몽 리포트 모달 (마법 서재 펜시브 뷰어) */}
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
                {/* 이전/다음 피드 넘겨보기 버튼: 모달 상태에서도 다른 피드를 계속 탐색 가능 */}
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
                원본 꿈 기록 (User Dream Narrative)
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-[#1E1B2E] italic">
                “{currentDream.dreamFullStory}”
              </p>
            </div>

            {/* 2. AI 심층 해석 리포트 전문 */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#6B46C1] border-b border-[#E8E0F8] pb-2">
                <BookOpen className="w-4 h-4" />
                <span>AI 심층 해몽 분석서 전문 (A4 2장 분량 요약)</span>
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
                href={`/dream-result/${currentDream.id}`}
                className="text-xs font-semibold text-[#6B46C1] hover:underline flex items-center gap-1"
              >
                <span>심층 해석 결과서 및 캘린더 전체 뷰로 보기 →</span>
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
