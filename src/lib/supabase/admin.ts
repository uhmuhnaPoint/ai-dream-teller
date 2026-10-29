import { createClient } from '@supabase/supabase-js';

/**
 * 서버 사이드 전용 Supabase Admin (Service Role) 클라이언트
 * RLS(Row Level Security) 정책을 우회하여 결제 상태 원자적 업데이트,
 * 금액 무결성 검증, 주문-결과 1:1 트랜잭션 처리를 안전하게 수행합니다.
 * 주의: 절대 클라이언트 컴포넌트에 노출되어서는 안 됩니다.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL 또는 Service Role Key가 환경 변수에 설정되지 않았습니다.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
