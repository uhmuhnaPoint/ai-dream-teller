import Link from 'next/link';

export const metadata = {
  title: '이용 약관',
  description: '이용 약관 페이지 (더미)',
};

export default function TermsPage() {
  return (
    <section className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">이용 약관</h1>
      <p className="text-gray-700">여기에 이용 약관 내용이 들어갑니다.</p>
    </section>
  );
}
