import { Suspense } from 'react';
import LoginForm from './LoginForm';
import styles from '../auth.module.css';

function LoginLoading() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>🛟</div>
            <div className={styles.logoText}>노베이스구조대</div>
          </div>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>로딩 중...</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
