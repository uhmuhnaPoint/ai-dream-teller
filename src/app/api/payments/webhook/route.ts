import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/payments/webhook
 * 토스페이먼츠로부터 결제 상태 변경(승인 완료, 결제 취소 등) 비동기 이벤트를 수신하여 DB 상태를 안전하게 동기화합니다.
 * 보안 요건:
 * 1. 페이로드 필수 필드(eventType, data.paymentKey, data.orderId, data.status) 검증
 * 2. 멱등성 보장: 이미 상태가 일치하는 경우 중복 트랜잭션 방어 및 200 반환
 * 3. status에 따라 orders.payment_status 원자적 동기화
 */
export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json();
    const { eventType, data } = payload || {};

    if (!eventType || !data || !data.orderId || !data.status) {
      return NextResponse.json(
        { code: 'INVALID_WEBHOOK_PAYLOAD', message: '웹훅 페이로드 필수 규격이 누락되었습니다.' },
        { status: 400 }
      );
    }

    const { orderId, paymentKey, status } = data;
    const adminSupabase = createAdminClient();

    // 주문서 조회
    const { data: order, error: fetchError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('order_number', orderId)
      .maybeSingle();

    if (fetchError || !order) {
      return NextResponse.json(
        { code: 'ORDER_NOT_FOUND', message: `웹훅 대상 주문(${orderId})을 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    // 토스 상태를 DB 상태로 매핑
    let targetPaymentStatus: string = order.payment_status;
    if (status === 'DONE') {
      targetPaymentStatus = 'paid';
    } else if (status === 'CANCELED' || status === 'PARTIAL_CANCELED') {
      targetPaymentStatus = 'canceled';
    } else if (status === 'ABORTED' || status === 'EXPIRED') {
      targetPaymentStatus = 'failed';
    }

    // 멱등성 검증: 이미 동일한 상태이면 추가 업데이트 없이 즉시 200 응답
    if (order.payment_status === targetPaymentStatus) {
      return NextResponse.json({
        success: true,
        message: '이미 최신 상태로 동기화되어 있습니다.',
        orderNumber: order.order_number,
        paymentStatus: order.payment_status,
      });
    }

    // 상태 동기화 업데이트
    const { error: updateError } = await adminSupabase
      .from('orders')
      .update({
        payment_status: targetPaymentStatus,
        payment_key: paymentKey || order.payment_key,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('웹훅 동기화 DB 업데이트 실패:', updateError.message);
    }

    // 만약 유료 승인 완료(DONE)로 바뀌었고 dream_results가 없다면 생성
    if (targetPaymentStatus === 'paid') {
      const { data: existingDreamResult } = await adminSupabase
        .from('dream_results')
        .select('id')
        .eq('order_id', order.id)
        .maybeSingle();

      if (!existingDreamResult) {
        await adminSupabase.from('dream_results').insert({
          order_id: order.id,
          analysis_status: 'processing',
          is_public: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: '웹훅 이벤트가 성공적으로 반영되었습니다.',
      orderNumber: order.order_number,
      paymentStatus: targetPaymentStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '웹훅 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'WEBHOOK_PROCESS_ERROR', message },
      { status: 500 }
    );
  }
};
