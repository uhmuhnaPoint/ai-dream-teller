import { NextRequest, NextResponse } from 'next/server';
import { confirmTossPayment, getTossPayment, TossApiError, TossPaymentResponse } from '@/lib/tosspayments';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/payments/confirm
 * 토스페이먼츠 결제 승인 API를 호출하여 최종 결제 처리를 수행하고 DB 상태를 원자적으로 갱신합니다.
 *
 * 백엔드 핵심 무결성 파이프라인:
 * 1. 파라미터 무결성 검증 (paymentKey, orderId, amount)
 * 2. DB 주문서 대조: DB의 `total_amount`와 클라이언트 승인 요청 `amount`가 1원이라도 불일치 시 토스 API 호출 차단
 * 3. 멱등성(Idempotency) 및 동시성(Replay Attack) 방어: 이미 승인 완료(`paid`)된 주문 재요청 시 중복 과금 차단 및 기존 성공 응답 반환
 * 4. 토스페이먼츠 승인 API 호출 (Basic Auth via TOSS_SECRET_KEY)
 *    - ALREADY_PROCESSING_REQUEST / ALREADY_PROCESSED_PAYMENT 발생 시 결제 상태 조회로 안전하게 복구
 * 5. DB 원자적 상태 전이: `orders.payment_status = 'paid'` 및 `dream_results(analysis_status = 'processing')` 초기화
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

    const adminSupabase = createAdminClient();

    // 1. 주문서 사전 조회
    const { data: order, error: orderFetchError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('order_number', orderId)
      .maybeSingle();

    if (orderFetchError || !order) {
      return NextResponse.json(
        { code: 'ORDER_NOT_FOUND', message: `주문 번호(${orderId})에 해당하는 주문서를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    // 2. 결제 금액 위변조 검증 (1원 단위 엄격 대조)
    if (Number(order.total_amount) !== Number(amount)) {
      return NextResponse.json(
        {
          code: 'AMOUNT_MISMATCH',
          message: `주문서 금액(${order.total_amount}원)과 결제 승인 요청 금액(${amount}원)이 일치하지 않습니다.`,
        },
        { status: 400 }
      );
    }

    // 3. 멱등성 및 중복 승인(Replay Attack) 방어 (이미 paid 상태인 경우 즉시 성공 반환)
    if (order.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        message: '이미 결제가 완료된 주문입니다.',
        data: {
          orderId: order.id,
          orderNumber: order.order_number,
          totalAmount: order.total_amount,
          approvedAt: order.approved_at,
        },
      });
    }

    // 4. 토스페이먼츠 승인 API 호출 (동시성 충돌 감지 시 결제 조회로 복구)
    let paymentResult: TossPaymentResponse;
    try {
      paymentResult = await confirmTossPayment({
        paymentKey,
        orderId,
        amount: Number(amount),
      });
    } catch (confirmError) {
      // 이미 처리 중이거나 처리된 결제 요청(React Strict Mode 또는 동시 재시도)인 경우
      if (
        confirmError instanceof TossApiError &&
        (confirmError.code === 'ALREADY_PROCESSING_REQUEST' ||
          confirmError.code === 'ALREADY_PROCESSED_PAYMENT')
      ) {
        // 토스 결제 상태를 직접 조회하여 정상 승인 여부 판별
        await new Promise((resolve) => setTimeout(resolve, 800));
        try {
          const verifiedPayment = await getTossPayment(paymentKey);
          if (verifiedPayment.status === 'DONE') {
            paymentResult = verifiedPayment;
          } else {
            throw confirmError;
          }
        } catch {
          // 결제 조회 실패 시 DB에 다른 스레드가 이미 paid로 업데이트했는지 재확인
          const { data: latestOrder } = await adminSupabase
            .from('orders')
            .select('*')
            .eq('id', order.id)
            .single();

          if (latestOrder && latestOrder.payment_status === 'paid') {
            return NextResponse.json({
              success: true,
              data: {
                orderId: latestOrder.id,
                orderNumber: latestOrder.order_number,
                totalAmount: latestOrder.total_amount,
                approvedAt: latestOrder.approved_at,
              },
            });
          }
          throw confirmError;
        }
      } else {
        throw confirmError;
      }
    }

    const approvedAt = paymentResult.approvedAt || new Date().toISOString();

    // 5. DB 주문 상태 'paid' 갱신
    const { error: updateOrderError } = await adminSupabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_key: paymentKey,
        approved_at: approvedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateOrderError) {
      console.error('주문 상태 갱신 실패:', updateOrderError.message);
    }

    // 6. dream_results 초기 레코드 생성 (analysis_status: 'processing')
    const { data: existingDreamResult } = await adminSupabase
      .from('dream_results')
      .select('id')
      .eq('order_id', order.id)
      .maybeSingle();

    if (!existingDreamResult) {
      const { error: dreamResultError } = await adminSupabase
        .from('dream_results')
        .insert({
          order_id: order.id,
          analysis_status: 'processing',
          is_public: false,
        });

      if (dreamResultError) {
        console.error('해몽 결과 초기화 실패:', dreamResultError.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        approvedAt,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '결제 승인 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'PAYMENT_CONFIRM_ERROR', message: errorMessage },
      { status: 500 }
    );
  }
};
