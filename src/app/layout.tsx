import './globals.css';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

export const metadata = {
  title: 'AI Dream Teller | AI 심층 꿈 해몽 서비스',
  description: '사주나 미신이 아닌 학문적 관점으로 분석하는 AI 심층 꿈 해몽 서비스',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout: 전역 레이아웃 컴포넌트입니다.
 * Warm Ivory 캔버스 배경과 부드러운 텍스트 색상을 설정하여
 * 해리포터풍의 신비로운 마법 서재 테마를 전역에 일관되게 적용합니다.
 */
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1E1B2E] antialiased selection:bg-[#E8E0F8] selection:text-[#1E1B2E]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
