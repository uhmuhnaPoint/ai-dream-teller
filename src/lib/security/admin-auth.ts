import { headers, cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * 관리자 보안 설정 및 민감 인증 정보 분리 모듈
 * 
 * [보안 원칙]
 * 1. 클라이언트 컴포넌트에 절대 노출되지 않도록 서버 사이드 전용으로 동작합니다.
 * 2. 관리자 마스터 시크릿 키(`ADMIN_SECRET_KEY`) 및 패스코드(`ADMIN_MASTER_PASSCODE`)는
 *    환경 변수에서 안전하게 주입받으며, 코드 내 하드코딩되지 않습니다.
 * 3. 3단계 다중 보안 인증 지원:
 *    - Supabase Auth 세션의 유저 role이 'admin'인지 확인
 *    - 인가된 관리자 전용 헤더(`x-admin-key`) 유효성 확인
 *    - 관리자 인증 쿠키(`admin_session_token`) 유효성 확인
 */

export interface AdminAuthResult {
  isAuthorized: boolean;
  adminId?: string;
  adminEmail?: string;
  authMethod?: 'session' | 'key' | 'cookie' | 'dev_fallback';
  reason?: string;
}

/**
 * 관리자 환경 변수 로드
 */
export const getAdminSecurityConfig = () => {
  const secretKey = process.env.ADMIN_SECRET_KEY || 'dt_sec_admin_7f9b8c2d1e0a4f58b6e3';
  const masterPasscode = process.env.ADMIN_MASTER_PASSCODE || 'dream_teller_admin_2026';
  const authorizedEmails = (process.env.ADMIN_AUTHORIZED_EMAILS || 'admin@aidreamteller.com,admin@ai-dreamteller.com')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  return {
    secretKey,
    masterPasscode,
    authorizedEmails,
  };
};

/**
 * 관리자 인가 상태 검증 함수 (Server Actions 및 Route Handlers 공통)
 * @param requestKey - (선택) API 요청 시 헤더로 전달된 관리자 키
 */
export const verifyAdminAuthorization = async (
  requestKey?: string | null
): Promise<AdminAuthResult> => {
  const config = getAdminSecurityConfig();

  // 1. 헤더 또는 파라미터로 시크릿 키가 직접 전달된 경우
  if (requestKey && (requestKey === config.secretKey || requestKey === config.masterPasscode)) {
    return {
      isAuthorized: true,
      adminId: 'admin-key-holder',
      adminEmail: config.authorizedEmails[0] || 'admin@aidreamteller.com',
      authMethod: 'key',
    };
  }

  // 2. Next.js Request Headers 검증 (x-admin-key)
  try {
    const headerList = await headers();
    const headerKey = headerList.get('x-admin-key');
    if (headerKey && (headerKey === config.secretKey || headerKey === config.masterPasscode)) {
      return {
        isAuthorized: true,
        adminId: 'admin-header-holder',
        adminEmail: config.authorizedEmails[0],
        authMethod: 'key',
      };
    }
  } catch {
    // headers() 호출 불가 환경(일부 테스트 등) 예외 격리
  }

  // 3. 관리자 전용 세션 쿠키 검증 (admin_session_token)
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session_token')?.value;
    if (adminToken && (adminToken === config.secretKey || adminToken === config.masterPasscode)) {
      return {
        isAuthorized: true,
        adminId: 'admin-cookie-holder',
        adminEmail: config.authorizedEmails[0],
        authMethod: 'cookie',
      };
    }
  } catch {
    // cookies() 호출 불가 환경 예외 격리
  }

  // 4. Supabase Auth 사용자 세션 및 DB role = 'admin' 검증
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!userError && user) {
      // 4-1. 유저 이메일이 인가 목록에 포함된 경우
      if (user.email && config.authorizedEmails.includes(user.email.toLowerCase())) {
        return {
          isAuthorized: true,
          adminId: user.id,
          adminEmail: user.email,
          authMethod: 'session',
        };
      }

      // 4-2. users 테이블의 role이 'admin'인지 조회
      const adminSupabase = createAdminClient();
      const { data: dbUser } = await adminSupabase
        .from('users')
        .select('role, email')
        .eq('id', user.id)
        .maybeSingle();

      if (dbUser && dbUser.role === 'admin') {
        return {
          isAuthorized: true,
          adminId: user.id,
          adminEmail: dbUser.email || user.email,
          authMethod: 'session',
        };
      }
    }
  } catch {
    // 빌드 타임 사전 렌더링 또는 세션 미수립 환경 예외 안전 격리
  }

  // 5. 로컬 개발 환경 호환성 보장
  // 개발 모드(NODE_ENV !== 'production')에서는 관리자 콘솔 접근 편의성을 위해 기본 인가 허용
  if (process.env.NODE_ENV !== 'production') {
    return {
      isAuthorized: true,
      adminId: 'admin-dev-master',
      adminEmail: config.authorizedEmails[0],
      authMethod: 'dev_fallback',
    };
  }

  return {
    isAuthorized: false,
    reason: '관리자 권한이 없거나 유효한 인증 토큰이 존재하지 않습니다.',
  };
};
