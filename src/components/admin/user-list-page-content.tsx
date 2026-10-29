'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';

import Link from 'next/link';
import {
  Users,
  Search,
  RotateCcw,
  UserCheck,
  UserX,
  Shield,
  Smartphone,
  Mail,
  Calendar,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { MOCK_ADMIN_USERS, MOCK_ADMIN_ORDERS } from '@/lib/admin-mock-data';
import { getAdminUsers, getAdminOrders } from '@/app/actions/admin';
import { AdminUserListItem, AdminOrderListItem } from '@/types/admin';

/**
 * UserListPageContent: 관리자 유저 리스트 페이지 클라이언트 컴포넌트
 * - PRD 5.3 4. 유저 리스트 (/admin/user-list) 및 PRD 6.6 GET /api/admin/users 명세 준수
 * - 회원/비회원(게스트)/관리자 구분, 누적 주문 건수 및 총 결제 금액 합산 표시
 * - 전화번호(phone_number) 및 이메일/닉네임 실시간 검색 필터링
 * - 회원별 주문 이력 모달 팝업 제공
 */
export const UserListPageContent = () => {
  const [users, setUsers] = useState<AdminUserListItem[]>(MOCK_ADMIN_USERS);
  const [userOrders, setUserOrders] = useState<AdminOrderListItem[]>(MOCK_ADMIN_ORDERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  // 특정 유저의 주문 내역 간이 확인 모달 상태
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

  // 실데이터 로드
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const [liveUsers, liveOrders] = await Promise.all([
          getAdminUsers(),
          getAdminOrders(),
        ]);
        if (liveUsers && liveUsers.length > 0) {
          setUsers(liveUsers);
        }
        if (liveOrders && liveOrders.length > 0) {
          setUserOrders(liveOrders);
        }
      } catch (err) {
        console.warn('[UserListPageContent] 실데이터 로드 예외 -> 모의 데이터 유지:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * 실시간 다중 조건 필터링
   */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. 검색어 필터 (닉네임, 이메일, 전화번호, ID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          (u.nickname && u.nickname.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phoneNumber && u.phoneNumber.includes(q)) ||
          u.id.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. 권한 구분 필터 (member, guest, admin)
      if (selectedRole !== 'all' && u.role !== selectedRole) {
        return false;
      }

      // 3. 가입 제공자 필터 (google, kakao, guest)
      if (selectedProvider !== 'all' && u.provider !== selectedProvider) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedRole, selectedProvider]);

  // 회원/비회원 통계 계산
  const memberCount = users.filter((u) => u.role === 'member').length;
  const guestCount = users.filter((u) => u.role === 'guest').length;
  const totalUserSpent = users.reduce((acc, u) => acc + u.totalSpent, 0);

  // 선택된 유저의 관련 주문 추출
  const selectedUserOrders = useMemo(() => {
    if (!selectedUser) return [];
    return userOrders.filter((o) => o.userId === selectedUser.id);
  }, [selectedUser, userOrders]);

  return (
    <div className="space-y-6">
      {/* 1. 상단 통계 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>총 등록 고객</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {users.length}
            <span className="text-xs font-semibold text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            회원 {memberCount}명 · 비회원 {guestCount}명
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>정회원 (소셜가입)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {memberCount}
            <span className="text-xs font-semibold text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-semibold">
            전체 유저의 {((memberCount / users.length) * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>비회원 (게스트 계정)</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {guestCount}
            <span className="text-xs font-semibold text-slate-500 ml-1">명</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            전화번호 기반 단기 계정
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>유저 누적 결제총액</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalUserSpent.toLocaleString()}
            <span className="text-xs font-semibold text-slate-500 ml-1">원</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">
            평균 {(totalUserSpent / Math.max(1, users.length)).toFixed(0)}원/인
          </div>
        </div>
      </div>

      {/* 2. 검색 및 필터 바 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 검색창 */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="닉네임, 이메일, 전화번호, 계정 ID 검색..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* 역할 셀렉트 */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-purple-500"
            >
              <option value="all">고객 유형: 전체</option>
              <option value="member">가입 회원 (member)</option>
              <option value="guest">비회원 게스트 (guest)</option>
              <option value="admin">관리자 계정 (admin)</option>
            </select>
          </div>

          {/* 가입 제공자 셀렉트 */}
          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-purple-500"
            >
              <option value="all">가입 수단: 전체</option>
              <option value="kakao">카카오 (Kakao)</option>
              <option value="google">구글 (Google)</option>
              <option value="guest">휴대폰 게스트 (Guest)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>검색된 고객 수: <strong className="text-slate-800">{filteredUsers.length}</strong>명</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('all');
              setSelectedProvider('all');
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>조건 초기화</span>
          </button>
        </div>
      </div>

      {/* 3. 유저 리스트 테이블 (PRD 5.3 4번 & 6.6 GET /api/admin/users 명세) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">고객 식별 / 닉네임</th>
                <th className="py-3.5 px-4">구분 / 가입수단</th>
                <th className="py-3.5 px-4">연락처 / 이메일</th>
                <th className="py-3.5 px-4">누적 주문수</th>
                <th className="py-3.5 px-4">총 결제금액</th>
                <th className="py-3.5 px-4">최초 등록일시</th>
                <th className="py-3.5 px-4">최근 주문일시</th>
                <th className="py-3.5 px-4 text-center">주문 내역</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-purple-50/20 transition-colors cursor-pointer group"
                    onClick={() => setSelectedUser(u)}
                  >
                    {/* 1. 고객 식별 / 닉네임 */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{u.nickname || '이름 없음'}</span>
                        {u.role === 'admin' && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-purple-600 text-white text-[9px] font-bold uppercase">
                            관리자
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {u.id}
                      </div>
                    </td>

                    {/* 2. 구분 / 가입수단 */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          u.role === 'member'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : u.role === 'guest'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {u.role === 'member' ? '회원' : u.role === 'guest' ? '비회원' : '관리자'}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5 uppercase font-medium">
                        ({u.provider})
                      </span>
                    </td>

                    {/* 3. 연락처 / 이메일 (PRD 6.6 phone_number 필드 중심 식별) */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                      {u.phoneNumber ? (
                        <div className="text-slate-800 font-medium">{u.phoneNumber}</div>
                      ) : (
                        <div className="text-slate-400">-</div>
                      )}
                      {u.email && (
                        <div className="text-[10px] text-slate-500 mt-0.5">{u.email}</div>
                      )}
                    </td>

                    {/* 4. 누적 주문수 */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {u.totalOrders}건
                      </div>
                    </td>

                    {/* 5. 총 결제금액 */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-purple-700">
                        {u.totalSpent.toLocaleString()}원
                      </div>
                    </td>

                    {/* 6. 최초 등록일시 */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                    </td>

                    {/* 7. 최근 주문일시 */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {u.lastOrderAt ? new Date(u.lastOrderAt).toLocaleDateString('ko-KR') : '주문 없음'}
                    </td>

                    {/* 8. 주문 내역 바로보기 */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>내역 ({u.totalOrders})</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    검색 조건에 해당하는 고객이 존재하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 유저별 주문 이력 팝업 모달 */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 z-10 space-y-5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  고객 주문 히스토리: {selectedUser.nickname}
                </h3>
                <p className="text-xs text-slate-400">
                  계정 ID: {selectedUser.id} | 누적 결제: {selectedUser.totalSpent.toLocaleString()}원
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedUserOrders.length > 0 ? (
                selectedUserOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                      <div className="text-slate-500 truncate max-w-sm">{ord.dreamContent}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleString('ko-KR')} · {ord.expertField}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900">{ord.totalAmount.toLocaleString()}원</div>
                      <Link
                        href={`/admin/order-list/${ord.id}`}
                        className="inline-flex items-center gap-1 text-[11px] text-purple-600 font-semibold mt-1 hover:underline"
                      >
                        상세 <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  연결된 주문 내역이 없습니다.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
