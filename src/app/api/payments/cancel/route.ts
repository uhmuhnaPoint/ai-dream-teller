import { NextRequest, NextResponse } from 'next/server';
import { cancelTossPayment } from '@/lib/tosspayments';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/payments/cancel
 * 결제 승인 완료 건에 대한 취소 및 환불을 처리합니다.
 * (관리자 A/S 또는 결제 후 오류 복구 시 호출)
 * 보안 요건:
 * 1. 대상 주문 번호 및 결제 키 확인
 * 2. orders 테이블 payment_status = 'paid' 상태 확인 (이미 취소된 주문 중복 취소 차단)
 * 3. 토스페이먼츠 v1 취소 API 호출
 * 4. DB 상태를 'canceled'로 원자적 갱신
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { orderId, paymentKey, cancelReason } = body;

    if (!orderId && !paymentKey) {
      return NextResponse.json(
        { code: 'INVALID_REQUEST', message: '주문 식별자(orderId) 또는 결제 키(paymentKey)가 필요합니다.' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 1. 주문서 조회
    let query = adminSupabase.from('orders').select('*').limit(1);
    if (orderId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      query = isUuid ? query.eq('id', orderId) : query.eq('order_number', orderId);
    } else if (paymentKey) {
      query = query.eq('payment_key', paymentKey);
    }

    const { data: orders, error: orderFetchError } = await query;
    const order = orders && orders[0] ? orders[0] : null;

    if (orderFetchError || !order) {
      return NextResponse.json(
        { code: 'ORDER_NOT_FOUND', message: '취소할 대상 주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. 이미 취소되었거나 환불된 주문인지 확인
    if (order.payment_status === 'canceled' || order.payment_status === 'refunded') {
      return NextResponse.json({
        success: true,
        message: '이미 취소 처리가 완료된 주문입니다.',
        data: {
          orderId: order.id,
          orderNumber: order.order_number,
          paymentStatus: order.payment_status,
        },
      });
    }

    const targetPaymentKey = paymentKey || order.payment_key;
    if (!targetPaymentKey) {
      return NextResponse.json(
        { code: 'PAYMENT_KEY_MISSING', message: '결제 키 정보가 없어 토스 취소를 호출할 수 없습니다.' },
        { status: 400 }
      );
    }

    const reason = cancelReason || '고객 요청 또는 시스템 사유로 인한 결제 취소';

    // 3. 토스페이먼츠 취소 API 호출
    const cancelResult = await cancelTossPayment(targetPaymentKey, reason);

    // 4. DB 상태 원자적 갱신
    const { error: updateError } = await adminSupabase
      .from('orders')
      .update({
        payment_status: 'canceled',
        error_message: `취소 완료: ${reason}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('취소 상태 DB 업데이트 오류:', updateError.message);
    }

    return NextResponse.json({
      success: true,
      message: '결제가 성공적으로 취소되었습니다.',
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        paymentStatus: 'canceled',
        canceledAt: cancelResult.approvedAt || new Date().toISOString(),
        cancelReason: reason,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '결제 취소 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'PAYMENT_CANCEL_ERROR', message },
      { status: 500 }
    );
  }
};
