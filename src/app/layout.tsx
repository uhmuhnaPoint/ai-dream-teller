import './globals.css';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

export const metadata = {
  title: 'AI Dream Teller',
  description: '꿈을 AI와 함께 해석하는 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
   <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
 <Header />
   <main className="flex-1">{children}</main>
 <Footer />
 </body>
 </html>
 );
}
