/**
 * 관리자(Admin) 전용 타입 정의 모듈
 * PRD.md 5.3(관리자 UX) 및 6.6(관리자 API), 7.1~7.3(DB 스키마) 기준
 */

import { PerspectiveType } from './dream-teller';
import { PaymentStatus } from './order';

// 학파 필드 타입 (PerspectiveType과 동일)
export type ExpertField = PerspectiveType;

// AI 해몽 생성 상태 타입 (orders와 1:1 매핑되는 dream_results의 상태)
export type AnalysisStatus = 'pending' | 'completed' | 'failed';

// 사용자 권한 역할 타입
export type UserRole = 'member' | 'guest' | 'admin';

// 소셜/게스트 가입 제공자
export type AuthProviderType = 'google' | 'kakao' | 'guest';

/**
 * 1. 관리자 대시보드 메트릭스 (PRD 6.6 GET /api/admin/metrics 대응)
 */
export interface AdminMetricsSummary {
  todayRevenue: number;          // 오늘 총 매출액
  todayOrderCount: number;       // 오늘 주문 건수
  monthlyRevenue: number;        // 당월 누적 매출액
  monthlyOrderCount: number;     // 당월 주문 건수
  totalRevenue: number;          // 서비스 런칭 이후 전체 누적 매출
  totalOrderCount: number;        // 서비스 런칭 이후 전체 누적 주문
  completedAnalysisCount: number; // AI 해몽 완료 건수
  pendingAnalysisCount: number;   // AI 해몽 처리 대기 건수
  conversionRate: number;        // 결제 전환율 (%)
  averageOrderValue: number;     // 평균 주문 단가 (원)
}

// 8개월 매출 및 주문량 차트 데이터 포인트 (PRD 5.3 관리자 메인 8개월 차트)
export interface MonthlyRevenueChartPoint {
  month: string;          // 예: '2026.03', '2026.04'
  revenue: number;        // 해당 월 매출
  orderCount: number;     // 해당 월 주문 건수
}

// 옵션별 / 학파별 분포 통계
export interface PlanDistribution {
  textOnlyCount: number;    // 기본 텍스트 해몽 (1,500원)
  withImageCount: number;   // AI 이미지 포함 해몽 (2,000원)
}

export interface ExpertFieldDistribution {
  freud: number;
  jung: number;
  neuroscience: number;
  gestalt: number;
}

export interface AdminMetricsData {
  summary: AdminMetricsSummary;
  monthlyTrends: MonthlyRevenueChartPoint[];
  planDistribution: PlanDistribution;
  expertDistribution: ExpertFieldDistribution;
}

/**
 * 2. 관리자 주문 목록 아이템 (PRD 6.6 GET /api/admin/orders 대응)
 */
export interface AdminOrderListItem {
  id: string;                    // 주문 고유 식별자 (UUID)
  orderNumber: string;           // 토스 결제 주문 식별번호 (DREAM_xxx)
  userId: string;                // 사용자 ID
  userRole: UserRole;            // 'member' | 'guest'
  userNickname: string;          // 사용자 닉네임 (비회원의 경우 전화번호 일부 마스킹 표기 가능)
  userPhone: string | null;      // 비회원 연락처
  dreamContent: string;          // 입력한 꿈 텍스트 원문 (목록에서는 축약 표시)
  expertField: ExpertField;      // 선택 학파 ('freud' | 'jung' | 'neuroscience' | 'gestalt')
  includesImage: boolean;        // AI 이미지 생성 옵션 구매 여부
  totalAmount: number;           // 결제 금액 (1,500원 or 2,000원)
  paymentStatus: PaymentStatus;  // 결제 상태
  analysisStatus: AnalysisStatus;// AI 해몽 분석 상태
  createdAt: string;             // 주문 접수 일시 (ISO string)
  approvedAt: string | null;     // 결제 승인 일시
}

/**
 * 3. 관리자 주문 상세 정보 (PRD 6.6 GET /api/admin/orders/[id] 대응)
 */
export interface AdminDreamResultDetail {
  id: string;
  orderId: string;
  title: string;
  summary: string;
  interpretation: string;
  freudAnalysis?: string | null;
  jungAnalysis?: string | null;
  scientificAnalysis?: string | null;
  imageUrl?: string | null;
  recommendations: string[];
  luckScore?: number | null;
  createdAt: string;
}

export interface AdminOrderDetail extends AdminOrderListItem {
  paymentKey: string | null;     // 토스페이먼츠 승인 키
  errorMessage: string | null;   // 결제/분석 실패 메시지
  userEmail: string | null;      // 회원 이메일
  userProvider: AuthProviderType;// 가입 경로
  dreamResult: AdminDreamResultDetail | null; // 1:1 매핑 해몽 결과
}

/**
 * 4. 관리자 유저 리스트 아이템 (PRD 6.6 GET /api/admin/users 대응)
 */
export interface AdminUserListItem {
  id: string;                    // users.id
  role: UserRole;                // 'member' | 'guest' | 'admin'
  provider: AuthProviderType;    // 'google' | 'kakao' | 'guest'
  email: string | null;          // 이메일
  nickname: string | null;       // 닉네임
  phoneNumber: string | null;    // 전화번호
  totalOrders: number;           // 누적 주문 건수
  totalSpent: number;            // 누적 결제 금액
  createdAt: string;             // 가입 일시
  lastOrderAt: string | null;    // 최근 주문 일시
}

/**
 * 주문 목록 검색 및 필터링 쿼리 파라미터 규격
 */
export interface AdminOrderFilterParams {
  page?: number;
  limit?: number;
  paymentStatus?: PaymentStatus | 'all';
  analysisStatus?: AnalysisStatus | 'all';
  expertField?: ExpertField | 'all';
  searchKeyword?: string;
}
