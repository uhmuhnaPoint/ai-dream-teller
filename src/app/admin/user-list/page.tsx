import React from 'react';
import { UserListPageContent } from '@/components/admin/user-list-page-content';

export const metadata = {
  title: '유저 관리 | AI Dream Teller 관리자',
  description: 'AI Dream Teller 회원 및 비회원 고객 주문 히스토리 및 결제 집계 관리',
};

/**
 * AdminUserListPage: 관리자 유저 리스트 페이지 (/admin/user-list)
 * PRD 5.3 4. 유저 리스트 & PRD 6.6 GET /api/admin/users 명세 준수
 * Server Component로 메타데이터를 제공하고 UserListPageContent로 렌더링을 위임
 */
const AdminUserListPage = () => {
  return <UserListPageContent />;
};

export default AdminUserListPage;
