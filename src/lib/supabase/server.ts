import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 서버 환경(Route Handler, Server Actions, Server Components)에서 사용하는 Supabase 클라이언트
 * 최신 @supabase/ssr 규격(getAll, setAll)을 적용하여 청크 쿠키 및 세션 동기화를 보장합니다.
 */
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서는 쿠키를 직접 쓸 수 없으므로 무시
          }
        },
      },
    }
  );
};
