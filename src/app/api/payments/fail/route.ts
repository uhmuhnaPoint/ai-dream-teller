import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notifyPaymentFailed } from '@/lib/telegram';

/**
 * POST /api/payments/fail
 * 결제 진행 중 카드사 한도 초과, 잔액 부족, 사용자 취소 등으로 결제 실패 시
 * 주문서의 상태를 'failed'로 갱신하고 에러 사유를 기록하며 운영자 텔레그램으로 경보를 발송합니다.
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { orderId, code, message } = body;

    if (!orderId) {
      return NextResponse.json(
        { code: 'INVALID_REQUEST', message: '주문 번호가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 주문서 정보 사전 조회 (알림용 금액 및 유저 식별자 확보)
    const { data: order } = await adminSupabase
      .from('orders')
      .select('total_amount, user_id')
      .eq('order_number', orderId)
      .maybeSingle();

    const { error: updateError } = await adminSupabase
      .from('orders')
      .update({
        payment_status: 'failed',
        error_message: `[${code || 'FAIL'}] ${message || '결제 실패'}`,
        updated_at: new Date().toISOString(),
      })
      .eq('order_number', orderId);

    if (updateError) {
      console.error('결제 실패 사유 기록 중 오류:', updateError.message);
    }

    // [알림 2] 운영자 텔레그램 결제 실패 경보 발송 (Non-blocking)
    notifyPaymentFailed({
      orderNumber: orderId,
      totalAmount: order?.total_amount || 0,
      userIdentifier: order?.user_id,
      errorCode: code || 'UNKNOWN_ERROR',
      errorMessage: message || '결제 처리 중 실패 발생',
    }).catch((tgError) => {
      console.error('[Telegram] 결제 실패 알림 발송 에러:', tgError);
    });

    return NextResponse.json({
      success: true,
      message: '결제 실패 내역이 정상적으로 기록되었습니다.',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '결제 실패 기록 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'PAYMENT_FAIL_RECORD_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
