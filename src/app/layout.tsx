import './globals.css';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { AuthProvider } from '@/providers/auth-provider';

export const metadata = {
  title: 'AI Dream Teller | AI 심층 꿈 해몽 서비스',
  description: '사주나 미신이 아닌 학문적 관점으로 분석하는 AI 심층 꿈 해몽 서비스',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout: 전역 레이아웃 컴포넌트입니다.
 * AuthProvider를 통해 애플리케이션 전체에 Supabase 인증 컨텍스트를 제공합니다.
 */
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1E1B2E] antialiased selection:bg-[#E8E0F8] selection:text-[#1E1B2E]">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
