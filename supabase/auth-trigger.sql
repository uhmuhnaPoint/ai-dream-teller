-- ==============================================================================
-- Supabase Auth Sync Trigger: auth.users -> public.users
-- 소셜 로그인(구글/카카오) 성공 시 자동으로 public.users 에 프로필을 동기화합니다.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_provider VARCHAR(20);
  v_nickname VARCHAR(100);
BEGIN
  -- 1. OAuth 제공자 추출
  v_provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'google');
  IF v_provider NOT IN ('google', 'kakao', 'guest') THEN
    v_provider := 'google';
  END IF;

  -- 2. 닉네임 추출 (이름/풀네임/이메일 앞부분)
  v_nickname := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- 3. public.users 테이블에 Upsert
  INSERT INTO public.users (id, role, provider, email, nickname, created_at, updated_at)
  VALUES (
    NEW.id,
    'member',
    v_provider,
    NEW.email,
    v_nickname,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    nickname = COALESCE(EXCLUDED.nickname, public.users.nickname),
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users 트리거 연결
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
