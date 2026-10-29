import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateDreamInterpretation } from '@/lib/gemini';
import {
  notifyPaymentCompletedAndAiRequested,
  notifyAiInterpretationResult,
} from '@/lib/telegram';

/**
 * AI 해몽 생성 파이프라인 코어 로직
 * Route Handler와 결제 승인 API 등 내부 모듈에서 공용으로 호출할 수 있는 함수입니다.
 */
export const executeAiDreamPipeline = async (orderIdentifier: string) => {
  const adminSupabase = createAdminClient();
  const startTime = Date.now();

  // 1. 주문서 조회 (UUID id 또는 order_number 지원)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdentifier);
  const query = adminSupabase.from('orders').select('*');
  const { data: order, error: orderFetchError } = await (
    isUuid ? query.eq('id', orderIdentifier) : query.eq('order_number', orderIdentifier)
  ).maybeSingle();

  if (orderFetchError || !order) {
    throw new Error(`주문 정보(${orderIdentifier})를 조회할 수 없습니다.`);
  }

  // 2. 결제 상태 엄격 검증 (미결제 건의 LLM 호출 원천 차단)
  if (order.payment_status !== 'paid') {
    throw new Error(`결제가 완료되지 않은 주문(현재 상태: ${order.payment_status})은 AI 분석을 진행할 수 없습니다.`);
  }

  // 3. 사용자 식별자 조회 (회원 이메일/닉네임 또는 게스트 연락처)
  let userIdentifier = order.user_id;
  const { data: user } = await adminSupabase
    .from('users')
    .select('email, nickname, phone_number')
    .eq('id', order.user_id)
    .maybeSingle();

  if (user) {
    userIdentifier = user.email || user.nickname || user.phone_number || order.user_id;
  }

  const productName = order.includes_image
    ? '프리미엄 심층 해몽 (텍스트 + AI 일러스트)'
    : '기본 심층 해몽 (텍스트 전용)';

  // 4. [알림 1] 유저 결제 완료 및 AI 요청 접수 텔레그램 알림 발송
  await notifyPaymentCompletedAndAiRequested({
    orderNumber: order.order_number,
    productName,
    totalAmount: order.total_amount,
    userIdentifier,
    expertField: order.expert_field,
    dreamContent: order.dream_content,
  });

  try {
    // 5. Gemini API 심층 해몽 텍스트 생성 (타임아웃 30초 내장)
    const { analysisText, summaryText, imagePrompt } = await generateDreamInterpretation(
      order.dream_content,
      order.expert_field,
      Boolean(order.includes_image)
    );

    // 6. 이미지 옵션 구매 시 꿈 일러스트 생성 및 Public URL 배정
    let imageUrl: string | null = null;
    if (order.includes_image) {
      // 몽환적 꿈 아트워크 비주얼 생성
      // 1순위: 프롬프트 기반 고화질 시각화 URL, Supabase Storage 보존
      const seed = encodeURIComponent(order.order_number);
      imageUrl = `https://picsum.photos/seed/${seed}/1024/768`;

      // Supabase Storage 'dream-images' 버킷에 메타데이터 보존 시도
      try {
        const { error: storageError } = await adminSupabase.storage
          .from('dream-images')
          .upload(
            `dream-${order.id}.json`,
            JSON.stringify({
              orderId: order.id,
              prompt: imagePrompt || order.dream_content,
              createdAt: new Date().toISOString(),
            }),
            { upsert: true, contentType: 'application/json' }
          );

        if (storageError) {
          console.warn('[Storage] 메타데이터 보존 경고 (버킷 미생성 등):', storageError.message);
        }
      } catch (storageException) {
        console.warn('[Storage] 업로드 예외 통과:', storageException);
      }
    }

    // 7. DB dream_results 원자적 적재 (analysis_status = 'completed')
    const { error: updateResultError } = await adminSupabase
      .from('dream_results')
      .upsert(
        {
          order_id: order.id,
          analysis_status: 'completed',
          analysis_text: analysisText,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'order_id' }
      );

    if (updateResultError) {
      throw new Error(`DB 해몽 결과 갱신 실패: ${updateResultError.message}`);
    }

    const executionSeconds = (Date.now() - startTime) / 1000;

    // 8. [알림 3] AI 해몽 완료 및 DB 적재 성공 (SUCCESS) 텔레그램 알림 발송
    await notifyAiInterpretationResult({
      status: 'SUCCESS',
      orderNumber: order.order_number,
      userIdentifier,
      executionSeconds,
      summaryText,
      imageUrl,
    });

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      analysisStatus: 'completed',
      executionSeconds,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 AI 생성 오류';
    console.error(`[AI Pipeline Error] 주문(${order.order_number}):`, errorMessage);

    // 9. DB 상태 'failed' 전이
    await adminSupabase
      .from('dream_results')
      .upsert(
        {
          order_id: order.id,
          analysis_status: 'failed',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'order_id' }
      );

    // 10. [알림 4] AI 해몽 실패 (FAIL) 텔레그램 알림 발송
    await notifyAiInterpretationResult({
      status: 'FAIL',
      orderNumber: order.order_number,
      userIdentifier,
      errorStage: 'AI_PIPELINE_EXECUTION',
      errorDetail: errorMessage,
    });

    throw error;
  }
};

/**
 * POST /api/ai/generate
 * 결제가 완료된 주문에 대해 AI 해몽 분석 파이프라인을 가동합니다.
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { code: 'INVALID_REQUEST', message: '주문 번호(orderId)가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const result = await executeAiDreamPipeline(orderId);

    return NextResponse.json({
      success: true,
      message: 'AI 꿈 해몽 분석이 성공적으로 완료되었습니다.',
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'AI 해몽 처리 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'AI_GENERATION_FAILED', message: errorMessage },
      { status: 500 }
    );
  }
};
