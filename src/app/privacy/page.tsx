import Link from 'next/link';

export const metadata = {
  title: '개인정보 처리방침',
  description: '개인정보 처리방침 페이지 (더미)',
};

export default function PrivacyPage() {
  return (
    <section className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">개인정보 처리방침</h1>
      <p className="text-gray-700">여기에 개인정보 처리방침 내용이 들어갑니다.</p>
    </section>
  );
}
