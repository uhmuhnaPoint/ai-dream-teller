import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react';

interface DreamExample {
  id: string;
  title: string;
  dreamExcerpt: string;
  analysisExcerpt: string;
  schoolBadge: string;
  schoolColor: string;
  imageSrc: string;
  imageAlt: string;
  createdTime: string;
}

const DREAM_EXAMPLES: DreamExample[] = [
  {
    id: 'example-1',
    title: '오로라 밤하늘을 유영하는 고래와 은빛 시계탑',
    dreamExcerpt:
      '하늘 높이 떠 있는 고대 시계탑 주위를 거대한 은빛 고래가 헤엄쳐 지나갔습니다. 시계탑의 바늘이 거꾸로 돌기 시작했는데도 무섭지 않고 오히려 마음이 평온해졌어요.',
    analysisExcerpt:
      '신경과학 관점에서 이 꿈은 누적된 시간 압박과 마감 스트레스를 뇌가 "초월적 비행"을 통해 인지적으로 완화하려는 치유적 보상 반응입니다.',
    schoolBadge: '신경과학 분석',
    schoolColor: 'bg-[#2B6CB0]/10 text-[#2B6CB0] border-[#2B6CB0]/20',
    imageSrc: '/images/sky-whale.jpg',
    imageAlt: '오로라 밤하늘을 유영하는 고래와 마법 시계탑 AI 생성 아트워크',
    createdTime: '12분 전 해독 완료',
  },
  {
    id: 'example-2',
    title: '안개 낀 밤 숲속에 홀로 빛나던 룬 문자의 황금 문',
    dreamExcerpt:
      '끝없는 안개 숲을 걷다가 땅에 닿지 않고 공중에 떠 있는 룬 문자의 황금 문을 발견했습니다. 문틈 사이로 눈부신 별빛이 쏟아져 나오고 있었어요.',
    analysisExcerpt:
      '칼 융의 원형 심리학에서 이 문은 "자아의 문턱(Threshold)"을 상징합니다. 현재 새로운 인생 국면을 앞두고 무의식이 성장의 결단을 촉구하고 있습니다.',
    schoolBadge: '칼 융 원형 분석',
    schoolColor: 'bg-[#6B46C1]/10 text-[#6B46C1] border-[#6B46C1]/20',
    imageSrc: '/images/mystic-door.jpg',
    imageAlt: '안개 숲속에 떠 있는 마법의 황금 문 AI 생성 아트워크',
    createdTime: '28분 전 해독 완료',
  },
  {
    id: 'example-3',
    title: '흩날리는 황금 양피지와 끝없는 나선형 마법 서재',
    dreamExcerpt:
      '수많은 책들이 공중에 떠다니고 은빛 펜시브 대야에서 무언가 기억의 실타래가 피어오르는 도서관에서 계속해서 내 이름이 적힌 양피지를 찾았습니다.',
    analysisExcerpt:
      '프로이트의 욕망 분석에 따르면 타인에게 인정받고 증명하고 싶은 지적 야망과 은밀한 자기 발견의 욕구가 상징적으로 투영된 서사입니다.',
    schoolBadge: '프로이트 심층 분석',
    schoolColor: 'bg-[#D53F8C]/10 text-[#D53F8C] border-[#D53F8C]/20',
    imageSrc: '/images/pensieve-library.jpg',
    imageAlt: '날아다니는 양피지와 마법 서재 AI 생성 아트워크',
    createdTime: '45분 전 해독 완료',
  },
];

/**
 * RecentDreams: 실제 생성된 고품질 꿈 리포트와 AI 아트워크 예시를 노출하여
 * 신뢰도를 높이고 유료 서비스의 기대 가치를 입증하는 소셜 프루프 섹션입니다.
 */
const RecentDreams = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F5F0EB]/50 border-y border-[#E8E0F8]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 타이틀 및 피드 바로가기 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/30 px-3 py-1 text-xs font-semibold text-[#8C6D23] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>실시간 해독 아카이브</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B2E]">
              방금 전 다른 이들이 발견한 무의식의 장면들
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4B4562]">
              어젯밤 꿈이 어떤 지적 통찰과 환상적인 아트워크로 다시 태어났는지 살펴보세요.
            </p>
          </div>

          <Link
            href="/feeds"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6B46C1] hover:text-[#553C9A] transition-colors self-start sm:self-auto"
          >
            <span>공개 피드 전체보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3단 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {DREAM_EXAMPLES.map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl border border-[#E8E0F8] bg-[#FFFDF9] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* 상단 꿈 시각화 AI 이미지 */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-[#FAF8F5]">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md bg-white/90 ${item.schoolColor}`}>
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

              {/* 하단 텍스트 및 해석 발췌 */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1B2E] tracking-tight group-hover:text-[#6B46C1] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  
                  {/* 유저가 입력한 원본 꿈 발췌 */}
                  <div className="mt-3 rounded-xl bg-[#FAF8F5] border border-[#E8E0F8]/80 p-3 text-xs text-[#4B4562] italic line-clamp-3">
                    “{item.dreamExcerpt}”
                  </div>

                  {/* AI의 심층 해석 요약 */}
                  <div className="mt-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B46C1] mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>심층 해독 리포트 발췌</span>
                    </div>
                    <p className="text-xs text-[#4B4562] leading-relaxed line-clamp-3">
                      {item.analysisExcerpt}
                    </p>
                  </div>
                </div>

                {/* 상세 보기 및 시작 링크 */}
                <div className="mt-5 pt-3.5 border-t border-[#E8E0F8]/80 flex items-center justify-between text-xs">
                  <span className="text-[#716A89]">나도 이 관점으로 풀기</span>
                  <Link
                    href="/dream-teller"
                    className="font-semibold text-[#6B46C1] hover:underline inline-flex items-center gap-1"
                  >
                    해석 신청 <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentDreams;
