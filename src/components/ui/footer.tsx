import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

// Footer 컴포넌트: 간단한 사이트 정보와 소셜 링크를 표시합니다.
// TODO: 실제 서비스에 맞는 링크와 저작권 정보를 업데이트하세요.
const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between px-4 py-2 bg-gray-100 border-t">
      <div className="text-sm text-gray-600 mb-2">© 2024 AI Dream Teller | 사업자등록번호: 123-45-67890</div>
      <div className="flex space-x-4">
        <Link href="/terms" className="text-sm text-gray-600 hover:underline">이용약관</Link>
        <Link href="/privacy" className="text-sm text-gray-600 hover:underline">개인정보처리방침</Link>
        <Link href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
          <FaGithub className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
