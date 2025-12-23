'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { Button, Input } from '@/components';
import styles from '../auth.module.css';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClientSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : error.message
        );
        return;
      }

      router.push(returnTo);
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>🛟</div>
            <div className={styles.logoText}>노베이스구조대</div>
          </div>

          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            계정에 로그인하여 학습을 시작하세요
          </p>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              type="email"
              label="이메일"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div>
              <Input
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className={styles.forgotPassword}>
                <Link href="/reset-password" className={styles.forgotPasswordLink}>
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              로그인
            </Button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              아직 계정이 없으신가요?
              <Link 
                href={`/signup${returnTo !== '/dashboard' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} 
                className={styles.footerLink}
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
