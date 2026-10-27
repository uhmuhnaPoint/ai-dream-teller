import { Metadata } from 'next';
import { Suspense } from 'react';
import ResultViewContainer from '@/components/dream-result/result-view-container';
import { getDreamResultByOrderId } from '@/lib/dummy-dream-results';
import { Compass, Loader2 } from 'lucide-react';

interface DreamResultPageProps {
  params: Promise<{
    'order-id': string;
  }>;
}

/**
 * generateMetadata: 동적 주문 식별자 기반 SEO 메타데이터를 생성합니다.
 */
export const generateMetadata = async ({
  params,
}: DreamResultPageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  const orderId = resolvedParams['order-id'];
  const resultData = getDreamResultByOrderId(orderId);

  return {
    title: `${resultData.report.title} | AI Dream Teller 해석 리포트`,
    description: `어젯밤 꿈의 심층 해독 결과: ${resultData.report.unconsciousCore}`,
    openGraph: {
      title: `${resultData.report.title} - AI Dream Teller`,
      description: resultData.report.unconsciousCore,
      images: [resultData.aiImageUrl || '/images/pensieve-library.jpg'],
    },
  };
};

/**
 * DreamResultContent: 비동기 params를 해결하고 결과를 렌더링하는 내부 컴포넌트입니다.
 * Next.js 16 Partial Prefetching 규격에 따라 Suspense boundary 내부에서 안전하게 실행됩니다.
 */
const DreamResultContent = async ({
  params,
}: {
  params: Promise<{ 'order-id': string }>;
}) => {
  const resolvedParams = await params;
  const orderId = resolvedParams['order-id'];
  const dreamResult = getDreamResultByOrderId(orderId);

  return (
    <>
      {/* 상단 헤더 */}
      <header className="text-center space-y-2.5 mb-8 md:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8E0F8] text-xs font-semibold text-[#4B4562] shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>무의식 해독 결과서 (The Decoded Archive)</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1B2E] tracking-tight">
          나만의 무의식 심층 해몽 리포트
        </h1>

        <p className="text-xs sm:text-sm text-[#4B4562] max-w-md mx-auto">
          주문번호 <span className="font-mono font-bold text-[#1E1B2E]">{orderId}</span>의 분석이 성공적으로 완료되었습니다.
        </p>
      </header>

      {/* 메인 결과 인터랙션 뷰 */}
      <ResultViewContainer initialData={dreamResult} />
    </>
  );
};

/**
 * DreamResultPage: 해석 확인 페이지(/dream-result/[order-id]) 라우트입니다.
 */
const DreamResultPage = ({ params }: DreamResultPageProps) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B2E] relative overflow-hidden py-8 md:py-14">
      {/* 배경 은은한 오로라 광채 장식 (Ethereal Aura) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#E8E0F8]/40 via-[#FCE7F3]/20 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <main>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-sm text-[#4B4562]">
                  무의식 기록 보관소에서 해몽 리포트를 불러오는 중입니다...
                </p>
              </div>
            }
          >
            <DreamResultContent params={params} />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DreamResultPage;
