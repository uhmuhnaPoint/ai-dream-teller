import { Metadata } from 'next';
import PaymentsFlow from '@/components/payments/payments-flow';
import { Lock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: '결제하기 | AI Dream Teller - 안전한 토스페이먼츠 결제',
  description: 'AI Dream Teller의 심층 꿈 해몽 및 AI 아트워크 주문을 토스페이먼츠 안전 결제로 진행합니다.',
};

/**
 * PaymentsPage: 결제 페이지(/payments) 라우트입니다.
 * Server Component로 기본 SEO 메타데이터를 제공하고, 토스페이먼츠 위젯 및 폼 제어는 PaymentsFlow에 위임합니다.
 */
const PaymentsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B2E] relative overflow-hidden py-8 md:py-14">
      {/* 배경 오로라 장식 (Ethereal Aura) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-[#E8E0F8]/40 via-[#FCE7F3]/20 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* 상단 헤더 */}
        <header className="text-center space-y-2 mb-8 md:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8E0F8] text-xs font-semibold text-[#4B4562] shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>토스페이먼츠 암호화 안전 결제</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E] tracking-tight">
            해몽 의뢰서 결제 진행
          </h1>

          <p className="text-xs sm:text-sm text-[#4B4562]">
            원하시는 결제 수단을 선택하시면 결제 승인 즉시 AI 무의식 분석 파이프라인이 가동됩니다.
          </p>
        </header>

        {/* 결제 위젯 플로우 */}
        <main>
          <PaymentsFlow />
        </main>
      </div>
    </div>
  );
};

export default PaymentsPage;
