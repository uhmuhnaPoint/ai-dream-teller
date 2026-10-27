-- ==============================================================================
-- AI Dream Teller - Database Initial Schema Migration
-- Reference: PRD.md Section 7 (Database Schema)
-- ==============================================================================

-- 1. UUID 확장 활성화 (필요 시)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 7.1 Users Table (`users`)
-- 회원(소셜)과 비회원의 정보를 통합 관리하는 테이블
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL DEFAULT 'guest' CHECK (role IN ('member', 'guest', 'admin')),
    provider VARCHAR(20) NOT NULL DEFAULT 'guest' CHECK (provider IN ('google', 'kakao', 'guest')),
    email VARCHAR(255) NULL,
    nickname VARCHAR(100) NULL,
    phone_number VARCHAR(20) NULL,
    guest_password_hash VARCHAR(255) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 인덱스 생성 (users)
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ------------------------------------------------------------------------------
-- 7.2 Orders Table (`orders`)
-- 사용자의 꿈 분석 요청 및 토스페이먼츠 결제 내역을 매핑하는 테이블
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'canceled')),
    payment_key VARCHAR(255) NULL,
    approved_at TIMESTAMPTZ NULL,
    error_message TEXT NULL,
    dream_content TEXT NOT NULL,
    expert_field VARCHAR(50) NOT NULL,
    includes_image BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 인덱스 생성 (orders)
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7.3 Dream Results Table (`dream_results`)
-- 결제 완료 후 생성되는 AI 해몽 결과물과 이미지 URL, 피드 공개 여부를 담당하는 테이블
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dream_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    analysis_status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (analysis_status IN ('processing', 'completed', 'failed')),
    analysis_text TEXT NULL,
    image_url TEXT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 인덱스 생성 (dream_results)
CREATE INDEX IF NOT EXISTS idx_dream_results_order_id ON public.dream_results(order_id);
CREATE INDEX IF NOT EXISTS idx_dream_results_is_public ON public.dream_results(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_dream_results_created_at ON public.dream_results(created_at DESC);

-- ------------------------------------------------------------------------------
-- updated_at 자동 갱신 트리거 함수
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_dream_results_updated_at ON public.dream_results;
CREATE TRIGGER trigger_dream_results_updated_at
    BEFORE UPDATE ON public.dream_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) 설정
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_results ENABLE ROW LEVEL SECURITY;

-- 1) Dream Results: 공개(is_public=true)된 해몽 결과는 누구나 조회 가능 (Feed용)
CREATE POLICY "Public dream results are viewable by everyone" 
    ON public.dream_results 
    FOR SELECT 
    USING (is_public = true);
