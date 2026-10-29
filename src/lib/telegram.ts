/**
 * 텔레그램 운영자 알림 봇 클라이언트 모듈
 * 토스 결제 승인/실패 및 AI 해몽 분석 결과(SUCCESS/FAIL)를 실시간으로 운영자에게 푸시합니다.
 * 
 * Non-blocking 설계:
 * 텔레그램 API 지연 또는 일시적 네트워크 장애가 사용자 결제나 AI 파이프라인 본체에
 * 악영향을 주지 않도록 모든 호출은 안전한 try/catch 예외 격리를 보장합니다.
 */

export interface PaymentSuccessAlertParams {
  orderNumber: string;
  productName: string;
  totalAmount: number;
  userIdentifier: string;
  expertField: string;
  dreamContent: string;
}

export interface PaymentFailureAlertParams {
  orderNumber: string;
  totalAmount: number;
  userIdentifier?: string;
  errorCode: string;
  errorMessage: string;
}

export interface AiProcessingAlertParams {
  status: 'SUCCESS' | 'FAIL';
  orderNumber: string;
  userIdentifier: string;
  executionSeconds?: number;
  summaryText?: string;
  imageUrl?: string | null;
  errorStage?: string;
  errorDetail?: string;
}

/**
 * 텔레그램 HTML 태그 깨짐 및 XSS 방지를 위한 특수문자 이스케이프 함수
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * 꿈 내용 본문의 개행을 정리하고 앞부분 일부(80~100자)만 안전하게 추출하는 유틸리티
 */
const getDreamPreview = (content: string, maxLength = 90): string => {
  if (!content) return '(입력된 꿈 내용 없음)';
  const sanitized = content.replace(/\s+/g, ' ').trim();
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  return `${sanitized.slice(0, maxLength)}...`;
};

/**
 * 영문 학파 코드를 한국어 정식 명칭으로 변환
 */
const getExpertFieldLabel = (field: string): string => {
  const map: Record<string, string> = {
    jung: '칼 융 (원형·그림자 분석)',
    freud: '지그문트 프로이트 (무의식·억압 욕망)',
    neuroscience: '현대 뇌인지과학 (기억 통합·신경 반응)',
    gestalt: '게슈탈트 (지금-여기 통합과 미해결 과제)',
  };
  return map[field.toLowerCase()] || field;
};

/**
 * 텔레그램 봇 API 공통 전송 함수
 */
export const sendTelegramMessage = async (htmlMessage: string): Promise<boolean> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // 환경변수가 미등록된 개발 환경에서는 경고 로그만 남기고 조용히 통과
  if (!token || !chatId) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않아 알림이 전송되지 않았습니다.');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Telegram] 메시지 전송 실패 (상태 코드: %d): %s', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    // 네트워크 오류 등으로 인한 메인 비즈니스 영향 차단
    console.error('[Telegram] 네트워크 예외 발생:', error instanceof Error ? error.message : error);
    return false;
  }
};

/**
 * [알림 1] 유저 결제 완료 및 AI 해몽 분석 요청 순간 알림
 */
export const notifyPaymentCompletedAndAiRequested = async (
  params: PaymentSuccessAlertParams
): Promise<boolean> => {
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const preview = escapeHtml(getDreamPreview(params.dreamContent));

  const message = [
    `<b>🚀 [AI 꿈 해몽] 결제 완료 및 분석 요청 접수</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `• <b>결제 상품</b>: ${escapeHtml(params.productName)}`,
    `• <b>주문 번호</b>: <code>${escapeHtml(params.orderNumber)}</code>`,
    `• <b>결제 가격</b>: <b>${params.totalAmount.toLocaleString()}원</b>`,
    `• <b>고객 식별</b>: <code>${escapeHtml(params.userIdentifier)}</code>`,
    `• <b>선택 학파</b>: ${escapeHtml(getExpertFieldLabel(params.expertField))}`,
    `• <b>꿈 미리보기</b>:`,
    `  <i>"${preview}"</i>`,
    `• <b>접수 일시</b>: ${now} (KST)`,
  ].join('\n');

  return sendTelegramMessage(message);
};

/**
 * [알림 2] 결제 실패 발생 순간 알림
 */
export const notifyPaymentFailed = async (
  params: PaymentFailureAlertParams
): Promise<boolean> => {
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  const message = [
    `<b>⚠️ [AI 꿈 해몽] 결제 승인 실패 경보</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `• <b>주문 번호</b>: <code>${escapeHtml(params.orderNumber)}</code>`,
    `• <b>시도 금액</b>: ${params.totalAmount.toLocaleString()}원`,
    params.userIdentifier ? `• <b>고객 식별</b>: <code>${escapeHtml(params.userIdentifier)}</code>` : '',
    `• <b>실패 코드</b>: <code>${escapeHtml(params.errorCode)}</code>`,
    `• <b>실패 사유</b>: ${escapeHtml(params.errorMessage)}`,
    `• <b>발생 시각</b>: ${now} (KST)`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendTelegramMessage(message);
};

/**
 * [알림 3 & 4] AI 해몽 완료 및 DB 적재 순간 알림 (SUCCESS or FAIL)
 */
export const notifyAiInterpretationResult = async (
  params: AiProcessingAlertParams
): Promise<boolean> => {
  const isSuccess = params.status === 'SUCCESS';
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-dream-teller-cyan.vercel.app';

  if (isSuccess) {
    const lines = [
      `<b>✅ [AI 꿈 해몽] 해독 완료 및 DB 저장 성공 (SUCCESS)</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `• <b>처리 상태</b>: <b>SUCCESS</b>`,
      `• <b>주문 번호</b>: <code>${escapeHtml(params.orderNumber)}</code>`,
      `• <b>고객 식별</b>: <code>${escapeHtml(params.userIdentifier)}</code>`,
      params.executionSeconds !== undefined ? `• <b>소요 시간</b>: ${params.executionSeconds.toFixed(1)}초` : '',
      params.summaryText ? `• <b>결과 요약</b>: ${escapeHtml(params.summaryText)}` : '',
      params.imageUrl ? `• <b>꿈 일러스트</b>: <a href="${params.imageUrl}">이미지 보기</a>` : '• <b>이미지 생성</b>: 미포함 (텍스트 전용)',
      `• <b>완료 일시</b>: ${now} (KST)`,
    ];

    return sendTelegramMessage(lines.filter(Boolean).join('\n'));
  }

  // FAIL 알림
  const adminDetailUrl = `${siteUrl}/admin/orders/${params.orderNumber}`;
  const lines = [
    `<b>🚨 [AI 꿈 해몽] 해독 처리 실패 경보 (FAIL)</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `• <b>처리 상태</b>: <b>FAIL</b>`,
    `• <b>주문 번호</b>: <code>${escapeHtml(params.orderNumber)}</code>`,
    `• <b>고객 식별</b>: <code>${escapeHtml(params.userIdentifier)}</code>`,
    params.errorStage ? `• <b>실패 단계</b>: <code>${escapeHtml(params.errorStage)}</code>` : '',
    `• <b>오류 상세</b>: ${escapeHtml(params.errorDetail || '상세 에러 원인 미상')}`,
    `• <b>발생 일시</b>: ${now} (KST)`,
    `• <b>관리자 조치</b>: <a href="${adminDetailUrl}">주문 상세 및 수동 재생성</a>`,
  ];

  return sendTelegramMessage(lines.filter(Boolean).join('\n'));
};
