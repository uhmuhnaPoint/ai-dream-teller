'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAuthorization } from '@/lib/security/admin-auth';
import { executeAiDreamPipeline } from '@/app/api/ai/generate/route';
import { parseDreamAnalysisMarkdown } from '@/lib/dream-parser';
import {
  AdminMetricsData,
  AdminOrderListItem,
  AdminOrderDetail,
  AdminUserListItem,
  AdminOrderFilterParams,
  UserRole,
  ExpertField,
} from '@/types/admin';
import { PaymentStatus } from '@/types/order';

/**
 * 1. 관리자 대시보드 메트릭스 조회 (PRD 6.6 GET /api/admin/metrics 대응)
 * 실시간 Supabase DB 집계 및 안정적인 기본값 산출
 */
export const getAdminMetrics = async (): Promise<AdminMetricsData> => {
  const auth = await verifyAdminAuthorization();
  if (!auth.isAuthorized) {
    throw new Error(auth.reason || '관리자 권한이 없습니다.');
  }

  const supabase = createAdminClient();

  try {
    // orders 및 dream_results 전체 데이터 병렬 조회
    const [ordersRes, dreamRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('dream_results').select('id, order_id, analysis_status'),
    ]);

    const orders = ordersRes.data || [];
    const dreamResults = dreamRes.data || [];

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const currentYearMonth = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;

    let todayRevenue = 0;
    let todayOrderCount = 0;
    let monthlyRevenue = 0;
    let monthlyOrderCount = 0;
    let totalRevenue = 0;
    let paidOrderCount = 0;

    let textOnlyCount = 0;
    let withImageCount = 0;

    const expertDistribution = {
      freud: 0,
      jung: 0,
      neuroscience: 0,
      gestalt: 0,
    };

    // 8개월 트렌드 초기 구조 생성 (현재 월 포함 과거 8개월)
    const monthlyMap: Record<string, { revenue: number; orderCount: number }> = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[ym] = { revenue: 0, orderCount: 0 };
    }

    orders.forEach((ord) => {
      const createdDateStr = ord.created_at ? ord.created_at.slice(0, 10) : '';
      const createdYM = ord.created_at
        ? `${new Date(ord.created_at).getFullYear()}.${String(new Date(ord.created_at).getMonth() + 1).padStart(2, '0')}`
        : '';

      const isPaid = ord.payment_status === 'paid';
      const amount = Number(ord.total_amount) || 0;

      // 플랜 및 학파 분포 (모든 접수 건 집계)
      if (ord.includes_image) {
        withImageCount++;
      } else {
        textOnlyCount++;
      }

      const field = ord.expert_field as keyof typeof expertDistribution;
      if (field && expertDistribution[field] !== undefined) {
        expertDistribution[field]++;
      }

      // 매출 집계는 결제 완료(paid) 건 기준
      if (isPaid) {
        totalRevenue += amount;
        paidOrderCount++;

        if (createdDateStr === todayStr) {
          todayRevenue += amount;
          todayOrderCount++;
        }

        if (createdYM === currentYearMonth) {
          monthlyRevenue += amount;
          monthlyOrderCount++;
        }

        if (monthlyMap[createdYM]) {
          monthlyMap[createdYM].revenue += amount;
          monthlyMap[createdYM].orderCount += 1;
        }
      }
    });

    // AI 해몽 완료율 집계
    const completedAnalysisCount = dreamResults.filter((r) => r.analysis_status === 'completed').length;
    const pendingAnalysisCount = dreamResults.filter((r) => r.analysis_status === 'pending' || r.analysis_status === 'processing').length;

    // 결제 전환율 및 평균 객단가 계산
    const conversionRate = orders.length > 0 ? Number(((paidOrderCount / orders.length) * 100).toFixed(1)) : 0;
    const averageOrderValue = paidOrderCount > 0 ? Math.round(totalRevenue / paidOrderCount) : 0;

    const monthlyTrends = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orderCount: data.orderCount,
    }));

    return {
      summary: {
        todayRevenue,
        todayOrderCount,
        monthlyRevenue,
        monthlyOrderCount,
        totalRevenue,
        totalOrderCount: orders.length,
        completedAnalysisCount,
        pendingAnalysisCount,
        conversionRate,
        averageOrderValue,
      },
      monthlyTrends,
      planDistribution: {
        textOnlyCount,
        withImageCount,
      },
      expertDistribution,
    };
  } catch (error) {
    console.error('[getAdminMetrics Error]:', error);
    throw new Error('대시보드 메트릭스 데이터를 집계하는 중 오류가 발생했습니다.');
  }
};

/**
 * 2. 관리자 주문 목록 조회 (PRD 6.6 GET /api/admin/orders 대응)
 * 실시간 검색 및 다중 조건 필터링 지원
 */
export const getAdminOrders = async (
  params?: AdminOrderFilterParams
): Promise<AdminOrderListItem[]> => {
  const auth = await verifyAdminAuthorization();
  if (!auth.isAuthorized) {
    throw new Error(auth.reason || '관리자 권한이 없습니다.');
  }

  const supabase = createAdminClient();

  try {
    // orders 조회 + 1:1 dream_results 및 users 정보 조회
    const { data: rawOrders, error } = await supabase
      .from('orders')
      .select(`
        *,
        dream_results (
          id,
          analysis_status
        ),
        users (
          id,
          role,
          provider,
          nickname,
          phone_number,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    let items: AdminOrderListItem[] = (rawOrders || []).map((order) => {
      const user = order.users as {
        id?: string;
        role?: UserRole;
        provider?: string;
        nickname?: string;
        phone_number?: string;
        email?: string;
      } | null;

      const dreamRes = Array.isArray(order.dream_results)
        ? order.dream_results[0]
        : order.dream_results;

      // 닉네임 표기 (회원 닉네임 -> 게스트 연락처 마스킹 -> 기본값)
      let displayNickname = user?.nickname;
      if (!displayNickname && user?.phone_number) {
        displayNickname = user.phone_number.replace(/(\d{3})\d{4}(\d{4})/, '$1-****-$2');
      }
      if (!displayNickname) {
        displayNickname = user?.role === 'guest' ? '비회원 고객' : '익명 고객';
      }

      return {
        id: order.id,
        orderNumber: order.order_number,
        userId: order.user_id,
        userRole: (user?.role as UserRole) || 'guest',
        userNickname: displayNickname,
        userPhone: user?.phone_number || null,
        dreamContent: order.dream_content || '',
        expertField: (order.expert_field as ExpertField) || 'jung',
        includesImage: Boolean(order.includes_image),
        totalAmount: Number(order.total_amount) || 0,
        paymentStatus: (order.payment_status as PaymentStatus) || 'pending',
        analysisStatus: dreamRes?.analysis_status || (order.payment_status === 'paid' ? 'pending' : 'pending'),
        createdAt: order.created_at,
        approvedAt: order.approved_at || null,
      };
    });

    // 필터링 적용
    if (params) {
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        items = items.filter((o) => o.paymentStatus === params.paymentStatus);
      }
      if (params.analysisStatus && params.analysisStatus !== 'all') {
        items = items.filter((o) => o.analysisStatus === params.analysisStatus);
      }
      if (params.expertField && params.expertField !== 'all') {
        items = items.filter((o) => o.expertField === params.expertField);
      }
      if (params.searchKeyword && params.searchKeyword.trim()) {
        const q = params.searchKeyword.toLowerCase().trim();
        items = items.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.userNickname.toLowerCase().includes(q) ||
            (o.userPhone && o.userPhone.includes(q)) ||
            o.dreamContent.toLowerCase().includes(q)
        );
      }
    }

    return items;
  } catch (error) {
    console.error('[getAdminOrders Error]:', error);
    throw new Error('주문 목록을 불러오는 중 오류가 발생했습니다.');
  }
};

/**
 * 3. 관리자 주문 상세 조회 (PRD 6.6 GET /api/admin/orders/[id] 대응)
 * 원본 꿈 내용, 결제 정보 및 파싱된 4대학파 AI 심층 리포트 1:1 매핑
 */
export const getAdminOrderDetail = async (orderId: string): Promise<AdminOrderDetail | null> => {
  const auth = await verifyAdminAuthorization();
  if (!auth.isAuthorized) {
    throw new Error(auth.reason || '관리자 권한이 없습니다.');
  }

  const supabase = createAdminClient();

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const query = supabase.from('orders').select(`
      *,
      dream_results (
        id,
        analysis_status,
        analysis_text,
        image_url,
        is_public,
        updated_at
      ),
      users (
        id,
        role,
        provider,
        nickname,
        phone_number,
        email
      )
    `);

    const { data: order, error } = await (isUuid ? query.eq('id', orderId) : query.eq('order_number', orderId)).maybeSingle();

    if (error || !order) {
      return null;
    }

    const user = order.users as {
      id?: string;
      role?: UserRole;
      provider?: string;
      nickname?: string;
      phone_number?: string;
      email?: string;
    } | null;

    const dreamRes = Array.isArray(order.dream_results)
      ? order.dream_results[0]
      : order.dream_results;

    // 닉네임 표기
    let displayNickname = user?.nickname;
    if (!displayNickname && user?.phone_number) {
      displayNickname = user.phone_number.replace(/(\d{3})\d{4}(\d{4})/, '$1-****-$2');
    }
    if (!displayNickname) {
      displayNickname = user?.role === 'guest' ? '비회원 고객' : '익명 고객';
    }

    // dream_results 파싱
    let dreamResultDetail = null;
    if (dreamRes && dreamRes.analysis_text) {
      const parsed = parseDreamAnalysisMarkdown(dreamRes.analysis_text, order.dream_content);

      dreamResultDetail = {
        id: dreamRes.id,
        orderId: order.id,
        title: parsed.title,
        summary: parsed.unconsciousInsight,
        interpretation: parsed.psychologicalState,
        freudAnalysis: parsed.advice,
        jungAnalysis: parsed.symbolSummary,
        scientificAnalysis: null,
        imageUrl: dreamRes.image_url || null,
        recommendations: [parsed.advice, '내면의 상징 메시지를 기록하고 감정을 관찰해보세요.'].filter(Boolean),
        luckScore: 88,
        createdAt: dreamRes.updated_at || order.created_at,
      };
    }

    return {
      id: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      userRole: (user?.role as UserRole) || 'guest',
      userNickname: displayNickname,
      userPhone: user?.phone_number || null,
      dreamContent: order.dream_content || '',
      expertField: (order.expert_field as ExpertField) || 'jung',
      includesImage: Boolean(order.includes_image),
      totalAmount: Number(order.total_amount) || 0,
      paymentStatus: (order.payment_status as PaymentStatus) || 'pending',
      analysisStatus: dreamRes?.analysis_status || (order.payment_status === 'paid' ? 'pending' : 'pending'),
      createdAt: order.created_at,
      approvedAt: order.approved_at || null,
      paymentKey: order.payment_key || null,
      errorMessage: order.error_message || null,
      userEmail: user?.email || null,
      userProvider: (user?.provider as any) || 'guest',
      dreamResult: dreamResultDetail,
    };
  } catch (error) {
    console.error('[getAdminOrderDetail Error]:', error);
    throw new Error('주문 상세 정보를 조회하는 중 오류가 발생했습니다.');
  }
};

/**
 * 4. AI 해몽 강제 재생성 트리거 (PRD 6.6 POST /api/admin/orders/[id]/regenerate 대응)
 * 관리자 권한 확인 후 AI 파이프라인 재가동 및 텔레그램 알림 발송
 */
export const regenerateAiDreamReport = async (orderId: string): Promise<AdminOrderDetail> => {
  const auth = await verifyAdminAuthorization();
  if (!auth.isAuthorized) {
    throw new Error(auth.reason || '관리자 권한이 없습니다.');
  }

  try {
    // AI 해몽 파이프라인 실행
    await executeAiDreamPipeline(orderId);

    // 주문 캐시 무효화
    revalidatePath('/admin');
    revalidatePath('/admin/order-list');
    revalidatePath(`/admin/order-list/${orderId}`);

    // 최신 상세 데이터 재조회 반환
    const updated = await getAdminOrderDetail(orderId);
    if (!updated) {
      throw new Error('재생성 후 최신 주문 정보를 불러오지 못했습니다.');
    }

    return updated;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'AI 해몽 재생성 중 오류가 발생했습니다.';
    console.error('[regenerateAiDreamReport Error]:', msg);
    throw new Error(msg);
  }
};

/**
 * 5. 관리자 유저 리스트 조회 (PRD 6.6 GET /api/admin/users 대응)
 * 회원 및 비회원 고객 통합 조회, 누적 주문 건수 및 총 결제 금액 합산 집계
 */
export const getAdminUsers = async (): Promise<AdminUserListItem[]> => {
  const auth = await verifyAdminAuthorization();
  if (!auth.isAuthorized) {
    throw new Error(auth.reason || '관리자 권한이 없습니다.');
  }

  const supabase = createAdminClient();

  try {
    // users 및 orders 전체 조회
    const [usersRes, ordersRes] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('user_id, total_amount, payment_status, created_at'),
    ]);

    if (usersRes.error) {
      throw usersRes.error;
    }

    const users = usersRes.data || [];
    const orders = ordersRes.data || [];

    // 유저별 주문 합산 맵 구성
    const userOrderStats: Record<
      string,
      { totalOrders: number; totalSpent: number; lastOrderAt: string | null }
    > = {};

    orders.forEach((ord) => {
      if (!userOrderStats[ord.user_id]) {
        userOrderStats[ord.user_id] = { totalOrders: 0, totalSpent: 0, lastOrderAt: null };
      }

      userOrderStats[ord.user_id].totalOrders += 1;

      if (ord.payment_status === 'paid') {
        userOrderStats[ord.user_id].totalSpent += Number(ord.total_amount) || 0;
      }

      if (ord.created_at) {
        const currentLast = userOrderStats[ord.user_id].lastOrderAt;
        if (!currentLast || new Date(ord.created_at) > new Date(currentLast)) {
          userOrderStats[ord.user_id].lastOrderAt = ord.created_at;
        }
      }
    });

    const userList: AdminUserListItem[] = users.map((u) => {
      const stats = userOrderStats[u.id] || {
        totalOrders: 0,
        totalSpent: 0,
        lastOrderAt: null,
      };

      let displayNickname = u.nickname;
      if (!displayNickname && u.phone_number) {
        displayNickname = u.phone_number.replace(/(\d{3})\d{4}(\d{4})/, '$1-****-$2');
      }

      return {
        id: u.id,
        role: (u.role as UserRole) || 'guest',
        provider: (u.provider as any) || 'guest',
        email: u.email || null,
        nickname: displayNickname || null,
        phoneNumber: u.phone_number || null,
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        createdAt: u.created_at,
        lastOrderAt: stats.lastOrderAt,
      };
    });

    return userList;
  } catch (error) {
    console.error('[getAdminUsers Error]:', error);
    throw new Error('유저 목록을 조회하는 중 오류가 발생했습니다.');
  }
};
