/**
 * 토스페이먼츠 연동을 위한 공통 유틸리티 및 설정 모듈
 * 공식 v2 SDK 규격에 맞추어 클라이언트 키 검증 및 서버 승인 Authorization 헤더 생성을 처리합니다.
 */

export interface TossConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResponse {
  mId: string;
  version: string;
  paymentKey: string;
  status: string;
  lastTransactionKey: string | null;
  orderId: string;
  orderName: string;
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  cultureExpense: boolean;
  card?: {
    issuerCode: string;
    acquirerCode?: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    amount: number;
  };
  easyPay?: {
    provider: string;
    amount: number;
    discountAmount: number;
  };
  totalAmount: number;
  balanceAmount: number;
  method?: string;
}

export interface TossPaymentErrorResponse {
  code: string;
  message: string;
}

/**
 * 클라이언트 사이드 토스페이먼츠 클라이언트 키를 안전하게 반환합니다.
 */
export const getTossClientKey = (): string => {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다. .env.local을 확인해주세요.');
  }
  return clientKey;
};

/**
 * 서버 사이드 전용: 결제 승인 API 호출 시 필요한 Basic base64(TOSS_SECRET_KEY:) Authorization 헤더를 반환합니다.
 * 토스페이먼츠 보안 규칙: 시크릿 키 뒤에 콜론(:)을 붙이고 base64로 인코딩해야 합니다.
 */
export const getTossSecretAuthHeader = (): string => {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    throw new Error('TOSS_SECRET_KEY가 설정되지 않았습니다. .env.local을 확인해주세요.');
  }
  const encoded = Buffer.from(`${secretKey}:`).toString('base64');
  return `Basic ${encoded}`;
};

/**
 * 서버 사이드 전용: 토스페이먼츠 결제 최종 승인 API를 호출합니다.
 * @param request paymentKey, orderId, amount 객체
 */
export const confirmTossPayment = async (
  request: TossConfirmPaymentRequest
): Promise<TossPaymentResponse> => {
  const authorization = getTossSecretAuthHeader();

  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorData = responseData as TossPaymentErrorResponse;
    throw new Error(`[${errorData.code || 'PAYMENT_CONFIRM_FAIL'}] ${errorData.message || '결제 승인에 실패했습니다.'}`);
  }

  return responseData as TossPaymentResponse;
};
