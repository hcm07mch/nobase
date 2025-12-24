'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function SignupForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setLoading(provider);
    setError('');

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>소셜 계정으로 간편하게 시작하세요</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.socialButtons}>
          <button
            type="button"
            onClick={() => handleSocialLogin('kakao')}
            disabled={loading !== null}
            className={`${styles.socialButton} ${styles.kakaoButton}`}
          >
            {loading === 'kakao' ? (
              '연결 중...'
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.906-.128.467-.82 2.997-.85 3.2 0 0-.017.134.07.186.088.052.19.012.19.012.25-.035 2.9-1.9 3.36-2.22.39.055.79.084 1.195.084 5.523 0 10-3.477 10-7.668C20 6.477 17.523 3 12 3z"/>
                </svg>
                카카오로 시작하기
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading !== null}
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            {loading === 'google' ? (
              '연결 중...'
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 시작하기
              </>
            )}
          </button>
        </div>

        <p className={styles.footerText}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className={styles.link}>
            로그인
          </Link>
        </p>

        <p className={styles.termsText}>
          가입 시{' '}
          <Link href="/terms" className={styles.link}>이용약관</Link>
          {' '}및{' '}
          <Link href="/privacy" className={styles.link}>개인정보처리방침</Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
