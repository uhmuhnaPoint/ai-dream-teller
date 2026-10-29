import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PerspectiveType } from '@/types/dream-teller';
import { CreateOrderRequest } from '@/types/order';

const VALID_PERSPECTIVES: PerspectiveType[] = ['freud', 'jung', 'neuroscience', 'gestalt'];

/**
 * POST /api/orders
 * 소셜 로그인 회원의 주문서(Pending Order)를 DB에 사전 생성합니다.
 * 보안 요건:
 * 1. Supabase Auth 세션 검증 (미인증 시 401)
 * 2. 금액 위변조(Tampering) 검증: 텍스트(1,500원), 이미지 포함(2,000원) 외 위변조 전송 차단
 * 3. 토스페이먼츠 v2 위젯 규격(6~64자)에 부합하는 고유 order_number 발급
 */
export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      );
    }

    const body: CreateOrderRequest = await request.json();
    const { dreamContent, expertField, includesImage, totalAmount } = body;

    // 1. 꿈 본문 유효성 검증
    if (!dreamContent || dreamContent.trim().length < 20) {
      return NextResponse.json(
        { code: 'INVALID_DREAM_CONTENT', message: '꿈 내용은 20자 이상 입력하셔야 합니다.' },
        { status: 400 }
      );
    }

    // 2. 전문 학파 유효성 검증
    if (!VALID_PERSPECTIVES.includes(expertField)) {
      return NextResponse.json(
        { code: 'INVALID_EXPERT_FIELD', message: '유효한 분석 학파를 선택해주세요.' },
        { status: 400 }
      );
    }

    // 3. 금액 무결성(Tampering) 검증
    const expectedAmount = includesImage ? 2000 : 1500;
    if (Number(totalAmount) !== expectedAmount) {
      return NextResponse.json(
        {
          code: 'AMOUNT_TAMPERING_DETECTED',
          message: `주문 금액이 유효하지 않습니다. (요청: ${totalAmount}원, 책정: ${expectedAmount}원)`,
        },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 4. users 테이블 레코드 동기화 (소셜 로그인 후 users 테이블 누락 방어)
    const { data: userProfile } = await adminSupabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!userProfile) {
      const nickname =
        (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
        (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
        (user.email ? user.email.split('@')[0] : '무의식 탐험가');

      await adminSupabase.from('users').insert({
        id: user.id,
        role: 'member',
        provider: user.app_metadata?.provider || 'social',
        email: user.email || null,
        nickname,
      });
    }

    // 5. 토스페이먼츠 규격 고유 order_number 생성 (영문/숫자/-/_ 6~64자)
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `DREAM_${timestamp}_${randomSuffix}`;

    // 6. orders 테이블에 pending 주문서 생성
    const { data: newOrder, error: insertError } = await adminSupabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        total_amount: expectedAmount,
        payment_status: 'pending',
        dream_content: dreamContent.trim(),
        expert_field: expertField,
        includes_image: Boolean(includesImage),
      })
      .select()
      .single();

    if (insertError || !newOrder) {
      throw new Error(insertError?.message || '주문서 생성에 실패했습니다.');
    }

    const perspectiveNames: Record<PerspectiveType, string> = {
      freud: '지그문트 프로이트',
      jung: '칼 구스타프 융',
      neuroscience: '신경과학',
      gestalt: '게슈탈트',
    };
    const orderName = `AI 꿈 해몽 (${perspectiveNames[expertField]}${includesImage ? ' + 아트워크' : ''})`;

    return NextResponse.json({
      success: true,
      data: {
        orderId: newOrder.id,
        orderNumber: newOrder.order_number,
        totalAmount: newOrder.total_amount,
        orderName,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '주문서 생성 중 알 수 없는 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'ORDER_CREATE_ERROR', message },
      { status: 500 }
    );
  }
};

/**
 * GET /api/orders
 * 현재 로그인한 회원의 전체 구매 이력 목록을 최신순으로 조회합니다.
 */
export const GET = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      );
    }

    const adminSupabase = createAdminClient();
    const { data: orders, error: selectError } = await adminSupabase
      .from('orders')
      .select('*, dream_results(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (selectError) {
      throw new Error(selectError.message);
    }

    return NextResponse.json({
      success: true,
      data: orders || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '주문 내역을 불러오는 중 오류가 발생했습니다.';
    return NextResponse.json(
      { code: 'ORDER_FETCH_ERROR', message },
      { status: 500 }
    );
  }
};
