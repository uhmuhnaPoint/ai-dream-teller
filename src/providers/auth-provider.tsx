'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * - Supabase Auth 세션과 로컬 데모 세션을 통합 관리하여 하위 전역 컴포넌트에 공급합니다.
 * - 로그인/로그아웃 상태 변경 시 즉시 반영하여 Header 네비게이션 및 마이페이지 접근성을 보장합니다.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 로컬 데모 세션 확인 헬퍼
  const checkLocalStorageDemoSession = useCallback((): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('dream_teller_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.user) {
          return {
            id: parsed.user.id || 'demo-user',
            email: parsed.user.email,
            user_metadata: parsed.user.user_metadata || {},
          };
        }
      }
    } catch (err) {
      console.error('[AuthProvider] 데모 세션 파싱 오류:', err);
    }
    return null;
  }, []);

  // 전체 세션 갱신 로직
  const refreshSession = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (currentSession?.user) {
        setSession(currentSession);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email,
          user_metadata: currentSession.user.user_metadata,
        });
      } else {
        // Supabase 세션이 없을 경우 로컬 데모 계정 확인
        const demoUser = checkLocalStorageDemoSession();
        setSession(null);
        setUser(demoUser);
      }
    } catch (err) {
      console.error('[AuthProvider] 세션 갱신 실패:', err);
      const demoUser = checkLocalStorageDemoSession();
      setUser(demoUser);
    } finally {
      setLoading(false);
    }
  }, [checkLocalStorageDemoSession]);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    // 1. 초기 세션 조회
    refreshSession();

    // 2. Supabase 인증 이벤트 구독 (로그인, 로그아웃, 토큰 갱신)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email,
          user_metadata: currentSession.user.user_metadata,
        });
        setLoading(false);
      } else {
        const demoUser = checkLocalStorageDemoSession();
        setSession(null);
        setUser(demoUser);
        setLoading(false);
      }
    });

    // 3. 브라우저 스토리지 이벤트 동기화 (다른 탭 또는 데모 로그인 발생 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dream_teller_auth_session') {
        refreshSession();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshSession, checkLocalStorageDemoSession]);

  // 통합 로그아웃 함수
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Supabase 클라이언트 세션 종료
      await supabase.auth.signOut();

      // 서버 쿠키 정리 API 호출
      await fetch('/api/auth/logout', { method: 'POST' });

      // 로컬 스토리지 데모 세션 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dream_teller_auth_session');
      }

      setSession(null);
      setUser(null);
    } catch (err) {
      console.error('[AuthProvider] 로그아웃 중 오류 발생:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth: 전역 인증 상태를 참조하는 커스텀 훅
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
