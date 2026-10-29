import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PerspectiveType } from '@/types/dream-teller';
import { CreateOrderRequest } from '@/types/order';

const VALID_PERSPECTIVES: PerspectiveType[] = ['freud', 'jung', 'neuroscience', 'gestalt'];

/**
 * 비밀번호 단방향 암호화 해시 함수 (SHA-256 + Salt)
 * 평문 비밀번호 저장 방지 (개인정보보호법 및 PRD 요구사항 준수)
 */
const hashGuestPassword = (password: string): string => {
  const salt = process.env.TOSS_SECRET_KEY || 'dream_teller_guest_salt_2026';
  return crypto.createHash('sha256').update(`${password}:${salt}`).digest('hex');
};

/**
 * POST /api/orders
 * 회원 및 비회원의 주문서(Pending Order)를 DB에 사전 생성합니다.
 * 보안 요건:
 * 1. 인증/인가 분기: 로그인 회원(세션 user_id) 또는 비회원(guestInfo: phone, password) 검증
 * 2. 금액 위변조(Tampering) 검증: 텍스트(1,500원), 이미지 포함(2,000원) 외 위변조 전송 차단
 * 3. 비회원 비밀번호 단방향 암호화: guest_password_hash 솔트 해시 적용 및 평문 저장 절대 차단
 * 4. 토스페이먼츠 v2 위젯 규격(6~64자)에 부합하는 고유 order_number 발급
 */
export const POST = async (request: NextRequest) => {
  try {
    const body: CreateOrderRequest = await request.json();
    const { dreamContent, expertField, includesImage, totalAmount, guestInfo } = body;

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetUserId: string;
    let guestTokenToSet: string | null = null;

    // 4. 회원 / 비회원 분기
    if (user) {
      // 4-A. 로그인 회원: users 레코드 동기화
      targetUserId = user.id;

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
    } else {
      // 4-B. 비회원(게스트): guestInfo 필수 검증 및 비밀번호 단방향 해시 생성
      if (!guestInfo || !guestInfo.phone || !guestInfo.password) {
        return NextResponse.json(
          {
            code: 'UNAUTHORIZED',
            message: '로그인이 필요하거나 비회원 주문 정보(전화번호, 비밀번호)가 필요합니다.',
          },
          { status: 401 }
        );
      }

      const cleanPhone = guestInfo.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return NextResponse.json(
          { code: 'INVALID_PHONE_FORMAT', message: '올바른 휴대폰 번호(10~11자리)를 입력해주세요.' },
          { status: 400 }
        );
      }

      if (guestInfo.password.trim().length < 4) {
        return NextResponse.json(
          { code: 'INVALID_PASSWORD_LENGTH', message: '비회원 조회 비밀번호는 4자리 이상이어야 합니다.' },
          { status: 400 }
        );
      }

      const passwordHash = hashGuestPassword(guestInfo.password.trim());

      // users 테이블에서 기존 동일 전화번호 게스트 조회
      const { data: existingGuest } = await adminSupabase
        .from('users')
        .select('id, guest_password_hash')
        .eq('phone_number', cleanPhone)
        .eq('role', 'guest')
        .maybeSingle();

      if (existingGuest) {
        // 기존 게스트 비밀번호 대조
        if (existingGuest.guest_password_hash && existingGuest.guest_password_hash !== passwordHash) {
          return NextResponse.json(
            { code: 'GUEST_AUTH_FAILED', message: '기존에 등록된 비회원 주문 비밀번호와 일치하지 않습니다.' },
            { status: 401 }
          );
        }
        targetUserId = existingGuest.id;
      } else {
        // 신규 게스트 생성 (비밀번호 단방향 암호화 저장, 평문 저장 절대 차단)
        const guestNickname = `게스트_${cleanPhone.slice(-4)}`;
        const { data: newGuest, error: guestInsertError } = await adminSupabase
          .from('users')
          .insert({
            role: 'guest',
            provider: 'guest',
            phone_number: cleanPhone,
            guest_password_hash: passwordHash,
            nickname: guestNickname,
          })
          .select('id')
          .single();

        if (guestInsertError || !newGuest) {
          throw new Error(guestInsertError?.message || '비회원 사용자 등록에 실패했습니다.');
        }

        targetUserId = newGuest.id;
      }

      // 비회원 인증용 게스트 토큰 발급
      guestTokenToSet = `gst_${Buffer.from(`${cleanPhone}:${Date.now()}`).toString('base64url')}`;
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
        user_id: targetUserId,
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

    const response = NextResponse.json({
      success: true,
      data: {
        orderId: newOrder.id,
        orderNumber: newOrder.order_number,
        totalAmount: newOrder.total_amount,
        orderName,
      },
    });

    // 비회원인 경우 브라우저 쿠키에 게스트 세션 토큰 설정
    if (guestTokenToSet) {
      response.cookies.set('dream_teller_guest_token', guestTokenToSet, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7일 유효
      });
    }

    return response;
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
