'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { Button, Input } from '@/components';
import styles from '../auth.module.css';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClientSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/update`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('비밀번호 재설정 메일 발송 중 오류가 발생했습니다.');
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

          <h1 className={styles.title}>비밀번호 재설정</h1>
          <p className={styles.subtitle}>
            가입한 이메일 주소를 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다
          </p>

          {error && <div className={styles.errorAlert}>{error}</div>}
          
          {success ? (
            <div className={styles.successAlert}>
              비밀번호 재설정 링크가 이메일로 전송되었습니다.<br />
              이메일을 확인해 주세요.
            </div>
          ) : (
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

              <Button type="submit" fullWidth loading={loading}>
                재설정 링크 보내기
              </Button>
            </form>
          )}

          <div className={styles.footer}>
            <p className={styles.footerText}>
              <Link href="/login" className={styles.footerLink}>
                ← 로그인으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
