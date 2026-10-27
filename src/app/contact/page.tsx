import { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: '고객 문의하기 | AI 꿈자리 해몽소',
  description: 'AI 꿈자리 해몽소 서비스 이용 중 궁금한 점이나 결제, 해몽 리포트, 제휴 문의를 남겨주시면 신속하게 답변해 드립니다.',
};

/**
 * 고객 문의하기 페이지 (/contact)
 * 1:1 온라인 문의 폼 및 자주 묻는 질문(FAQ), 고객센터 안내 제공
 * RootLayout에서 전역 Header와 Footer를 제공하므로 중복 렌더링을 방지합니다.
 */
const ContactPage = () => {
  return (
    <div className="py-12 md:py-20 px-4 w-full">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-sm text-slate-400">문의하기 화면을 불러오는 중입니다...</p>
          </div>
        }
      >
        <ContactForm />
      </Suspense>
    </div>
  );
};

export default ContactPage;
