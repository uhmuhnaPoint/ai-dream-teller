import { NextRequest, NextResponse } from 'next/server';
import { confirmTossPayment } from '@/lib/tosspayments';

/**
 * POST /api/payments/confirm
 * 토스페이먼츠 결제 승인 API를 호출하여 최종 결제 처리를 수행합니다.
 * 보안 요구사항: 클라이언트가 보낸 amount의 무결성 검증 및 Secret Key를 통한 안전한 승인 요청
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || amount === undefined) {
      return NextResponse.json(
        { code: 'INVALID_REQUEST', message: '필수 결제 승인 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 승인 API 호출 (Basic Auth via TOSS_SECRET_KEY)
    const paymentResult = await confirmTossPayment({
      paymentKey,
      orderId,
      amount: Number(amount),
    });

    // TODO: 결제 성공 시 DB 주문 상태 'paid' 업데이트 및 AI 해몽 파이프라인 비동기 트리거
    return NextResponse.json({
      success: true,
      data: paymentResult,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '결제 승인 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'PAYMENT_CONFIRM_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
