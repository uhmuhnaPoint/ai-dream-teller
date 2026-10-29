/**
 * 관리자(Admin) 목(Mock) 데이터 및 임시 공급자 모듈
 * 
 * [설계 의도]
 * - PRD 5.3(UX) 및 6.6(백엔드 API 규격)에 맞춰 실데이터와 동일한 구조의 목 데이터를 공급합니다.
 * - 백엔드 구축 후 'src/app/actions/admin.ts'의 실제 Supabase 쿼리 또는 Route Handlers로
 *   즉시 교체할 수 있도록 함수형 인터페이스를 제공합니다.
 * 
 * TODO: 추후 Supabase DB 연결 후 실제 Supabase Client 기반 Server Actions로 교체할 것.
 */

import {
  AdminMetricsData,
  AdminOrderListItem,
  AdminOrderDetail,
  AdminUserListItem,
  AdminOrderFilterParams,
} from '@/types/admin';

// 8개월 매출 및 주문 트렌드 목 데이터
export const MOCK_ADMIN_METRICS: AdminMetricsData = {
  summary: {
    todayRevenue: 38500,
    todayOrderCount: 21,
    monthlyRevenue: 1482000,
    monthlyOrderCount: 824,
    totalRevenue: 8945000,
    totalOrderCount: 4980,
    completedAnalysisCount: 4942,
    pendingAnalysisCount: 18,
    conversionRate: 68.4,
    averageOrderValue: 1796,
  },
  monthlyTrends: [
    { month: '2026.03', revenue: 720000, orderCount: 410 },
    { month: '2026.04', revenue: 890000, orderCount: 505 },
    { month: '2026.05', revenue: 950000, orderCount: 538 },
    { month: '2026.06', revenue: 1040000, orderCount: 589 },
    { month: '2026.07', revenue: 1180000, orderCount: 662 },
    { month: '2026.08', revenue: 1290000, orderCount: 718 },
    { month: '2026.09', revenue: 1395000, orderCount: 775 },
    { month: '2026.10', revenue: 1482000, orderCount: 824 },
  ],
  planDistribution: {
    textOnlyCount: 2041, // 1,500원 플랜
    withImageCount: 2939, // 2,000원 플랜 (이미지 생성 포함 선호도 높음)
  },
  expertDistribution: {
    freud: 1720,
    jung: 1850,
    neuroscience: 910,
    gestalt: 500,
  },
};

// 관리자 주문 목록 목 데이터 (다양한 상태 및 케이스 포함)
export const MOCK_ADMIN_ORDERS: AdminOrderListItem[] = [
  {
    id: 'ord-uuid-001',
    orderNumber: 'DREAM_1761740101_A1F2',
    userId: 'user-uuid-101',
    userRole: 'member',
    userNickname: '달빛항해자',
    userPhone: null,
    dreamContent: '끝없이 펼쳐진 에메랄드빛 밤바다에서 거대한 고래와 눈이 마주치고, 고래가 별조각을 입으로 뿜어내는 꿈을 꾸었습니다.',
    expertField: 'jung',
    includesImage: true,
    totalAmount: 2000,
    paymentStatus: 'paid',
    analysisStatus: 'completed',
    createdAt: '2026-10-29T20:45:00Z',
    approvedAt: '2026-10-29T20:45:18Z',
  },
  {
    id: 'ord-uuid-002',
    orderNumber: 'DREAM_1761739200_B3C4',
    userId: 'user-uuid-102',
    userRole: 'guest',
    userNickname: '010-****-1234',
    userPhone: '01012345678',
    dreamContent: '오래된 시계탑 꼭대기에 갇혀 있었는데, 시계 침이 거꾸로 돌면서 어린 시절 살던 집의 다락방으로 문이 열렸습니다.',
    expertField: 'freud',
    includesImage: false,
    totalAmount: 1500,
    paymentStatus: 'paid',
    analysisStatus: 'completed',
    createdAt: '2026-10-29T20:30:00Z',
    approvedAt: '2026-10-29T20:30:15Z',
  },
  {
    id: 'ord-uuid-003',
    orderNumber: 'DREAM_1761738120_C5D6',
    userId: 'user-uuid-103',
    userRole: 'member',
    userNickname: '네오뉴런',
    userPhone: null,
    dreamContent: '내일 있을 프레젠테이션 무대에서 발표를 하려는데 마이크가 갑자기 녹아내리고 글자가 모두 흩어지는 악몽을 반복해서 꿨어요.',
    expertField: 'neuroscience',
    includesImage: true,
    totalAmount: 2000,
    paymentStatus: 'paid',
    analysisStatus: 'pending',
    createdAt: '2026-10-29T20:12:00Z',
    approvedAt: '2026-10-29T20:12:22Z',
  },
  {
    id: 'ord-uuid-004',
    orderNumber: 'DREAM_1761736400_E7F8',
    userId: 'user-uuid-104',
    userRole: 'guest',
    userNickname: '010-****-9876',
    userPhone: '01098765432',
    dreamContent: '가족들과 식사를 하다가 아무도 내 목소리를 듣지 못하는 것 같아서 테이블을 박차고 나갔는데 숲속이었습니다.',
    expertField: 'gestalt',
    includesImage: false,
    totalAmount: 1500,
    paymentStatus: 'pending',
    analysisStatus: 'pending',
    createdAt: '2026-10-29T19:40:00Z',
    approvedAt: null,
  },
  {
    id: 'ord-uuid-005',
    orderNumber: 'DREAM_1761734500_G9H0',
    userId: 'user-uuid-105',
    userRole: 'member',
    userNickname: '보라색나비',
    userPhone: null,
    dreamContent: '하늘에서 투명한 유리 계단이 내려왔고, 맨 위 칸에는 빛나는 황금 열쇠가 공중에 떠 있었습니다.',
    expertField: 'jung',
    includesImage: true,
    totalAmount: 2000,
    paymentStatus: 'failed',
    analysisStatus: 'failed',
    createdAt: '2026-10-29T19:15:00Z',
    approvedAt: null,
  },
  {
    id: 'ord-uuid-006',
    orderNumber: 'DREAM_1761732000_J1K2',
    userId: 'user-uuid-106',
    userRole: 'member',
    userNickname: '새벽별빛',
    userPhone: null,
    dreamContent: '깊은 동굴 속에서 물방울이 떨어지는 소리가 음악처럼 들렸고, 물속에 비친 내 얼굴이 호랑이로 변했습니다.',
    expertField: 'jung',
    includesImage: true,
    totalAmount: 2000,
    paymentStatus: 'paid',
    analysisStatus: 'completed',
    createdAt: '2026-10-29T18:20:00Z',
    approvedAt: '2026-10-29T18:20:25Z',
  },
  {
    id: 'ord-uuid-007',
    orderNumber: 'DREAM_1761729000_L3M4',
    userId: 'user-uuid-107',
    userRole: 'guest',
    userNickname: '010-****-5555',
    userPhone: '01055554444',
    dreamContent: '지하철을 탔는데 목적지 역을 지나쳐 끝없는 은하수로 향하는 열차였습니다.',
    expertField: 'freud',
    includesImage: false,
    totalAmount: 1500,
    paymentStatus: 'refunded',
    analysisStatus: 'completed',
    createdAt: '2026-10-29T17:10:00Z',
    approvedAt: '2026-10-29T17:10:30Z',
  },
];

// 관리자 유저 목록 목 데이터
export const MOCK_ADMIN_USERS: AdminUserListItem[] = [
  {
    id: 'user-uuid-101',
    role: 'member',
    provider: 'kakao',
    email: 'moonlight@kakao.com',
    nickname: '달빛항해자',
    phoneNumber: null,
    totalOrders: 12,
    totalSpent: 23500,
    createdAt: '2026-03-15T09:00:00Z',
    lastOrderAt: '2026-10-29T20:45:00Z',
  },
  {
    id: 'user-uuid-102',
    role: 'guest',
    provider: 'guest',
    email: null,
    nickname: '010-****-1234',
    phoneNumber: '01012345678',
    totalOrders: 3,
    totalSpent: 4500,
    createdAt: '2026-08-20T14:10:00Z',
    lastOrderAt: '2026-10-29T20:30:00Z',
  },
  {
    id: 'user-uuid-103',
    role: 'member',
    provider: 'google',
    email: 'neuron.mind@gmail.com',
    nickname: '네오뉴런',
    phoneNumber: null,
    totalOrders: 8,
    totalSpent: 16000,
    createdAt: '2026-04-10T11:20:00Z',
    lastOrderAt: '2026-10-29T20:12:00Z',
  },
  {
    id: 'user-uuid-104',
    role: 'guest',
    provider: 'guest',
    email: null,
    nickname: '010-****-9876',
    phoneNumber: '01098765432',
    totalOrders: 1,
    totalSpent: 1500,
    createdAt: '2026-10-29T19:40:00Z',
    lastOrderAt: '2026-10-29T19:40:00Z',
  },
  {
    id: 'user-uuid-105',
    role: 'member',
    provider: 'google',
    email: 'purple.butterfly@gmail.com',
    nickname: '보라색나비',
    phoneNumber: null,
    totalOrders: 5,
    totalSpent: 10000,
    createdAt: '2026-05-02T16:45:00Z',
    lastOrderAt: '2026-10-29T19:15:00Z',
  },
  {
    id: 'user-uuid-999',
    role: 'admin',
    provider: 'google',
    email: 'admin@ai-dreamteller.com',
    nickname: '운영총괄마스터',
    phoneNumber: null,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: '2026-01-01T00:00:00Z',
    lastOrderAt: null,
  },
];

/**
 * 특정 주문 ID에 대한 상세 정보 목 데이터 생성기
 */
export const getMockOrderDetail = (orderId: string): AdminOrderDetail => {
  const baseOrder = MOCK_ADMIN_ORDERS.find((o) => o.id === orderId) || MOCK_ADMIN_ORDERS[0];
  
  return {
    ...baseOrder,
    paymentKey: baseOrder.paymentStatus === 'paid' ? `toss_test_pk_${baseOrder.orderNumber}` : null,
    errorMessage: baseOrder.paymentStatus === 'failed' ? '고객 카드 한도 초과로 인한 결제 승인 거절' : null,
    userEmail: baseOrder.userRole === 'member' ? `${baseOrder.userId}@example.com` : null,
    userProvider: baseOrder.userRole === 'member' ? 'kakao' : 'guest',
    dreamResult: baseOrder.analysisStatus === 'completed'
      ? {
          id: `res-${baseOrder.id}`,
          orderId: baseOrder.id,
          title: '심연의 바다와 자아의 거대한 통찰',
          summary: '의식의 한계를 넘어선 원초적 무의식과의 대면 및 내면의 잠재력 각성',
          interpretation:
            '칼 융의 원형 심리학에 따르면, 바다는 인류 공통의 집단 무의식을 상징합니다. 고래와의 조우는 억압되었거나 잊혔던 거대한 자아(Self)의 부름을 의미하며, 별조각은 당신의 현실 세계에 창의적 영감과 통찰이 피어날 징조입니다.',
          jungAnalysis:
            '심연의 고래는 모성적 지혜와 신성한 안내자를 의미합니다. 현재 일상에서의 불안은 새로운 정신적 성숙 단계로 도약하기 위한 필연적 전조입니다.',
          imageUrl: baseOrder.includesImage ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop' : null,
          recommendations: [
            '아침 기상 직후 5분간 꿈 일기를 기록하며 감정의 잔향을 음미해 보세요.',
            '새로운 프로젝트나 창작 활동을 시작하기에 매우 이상적인 시기입니다.',
            '과거의 실수나 미련을 심연 속에 내려놓고 직관을 신뢰하세요.',
          ],
          luckScore: 92,
          createdAt: baseOrder.approvedAt || baseOrder.createdAt,
        }
      : null,
  };
};

/**
 * 프론트엔드 목 API 헬퍼 함수군
 * TODO: 추후 'src/app/actions/admin.ts'의 실제 비동기 함수로 치환 가능
 */
export const fetchMockAdminMetrics = async (): Promise<AdminMetricsData> => {
  // 실제 API 호출 딜레이 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_ADMIN_METRICS;
};

export const fetchMockAdminOrders = async (
  params?: AdminOrderFilterParams
): Promise<{ orders: AdminOrderListItem[]; total: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  let filtered = [...MOCK_ADMIN_ORDERS];

  if (params?.paymentStatus && params.paymentStatus !== 'all') {
    filtered = filtered.filter((o) => o.paymentStatus === params.paymentStatus);
  }
  if (params?.analysisStatus && params.analysisStatus !== 'all') {
    filtered = filtered.filter((o) => o.analysisStatus === params.analysisStatus);
  }
  if (params?.expertField && params.expertField !== 'all') {
    filtered = filtered.filter((o) => o.expertField === params.expertField);
  }
  if (params?.searchKeyword) {
    const q = params.searchKeyword.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.userNickname.toLowerCase().includes(q) ||
        o.dreamContent.toLowerCase().includes(q)
    );
  }

  return {
    orders: filtered,
    total: filtered.length,
  };
};

export const fetchMockAdminUsers = async (): Promise<AdminUserListItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_ADMIN_USERS;
};
