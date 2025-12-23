import Link from 'next/link';
import { getUser } from '@/lib/supabase-server';
import { Button, ThemeToggle, Footer } from '@/components';
import styles from './home.module.css';

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🛟</span>
            <span className={styles.logoText}>노베이스구조대</span>
          </Link>
          <nav className={styles.nav}>
            <ThemeToggle />
            {user ? (
              <Button href="/dashboard" size="sm">
                대시보드
              </Button>
            ) : (
              <div className={styles.authButtons}>
                <Button href="/login" variant="ghost" size="sm">
                  로그인
                </Button>
                <Button href="/signup" size="sm">
                  시작하기
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            프로그래밍,<br />
            <span className={styles.highlight}>노베이스</span>도 할 수 있어요
          </h1>
          <p className={styles.heroDescription}>
            코딩 경험이 전혀 없어도 괜찮아요.<br />
            노베이스구조대가 처음부터 끝까지 함께합니다.
          </p>
          <div className={styles.heroActions}>
            <Button href={user ? "/dashboard" : "/signup"} size="lg">
              {user ? "내 강좌 보기" : "무료로 시작하기"}
            </Button>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>기초부터 차근차근</h3>
            <p className={styles.featureDescription}>
              어려운 전문용어 없이, 누구나 이해할 수 있는 쉬운 설명
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎬</div>
            <h3 className={styles.featureTitle}>영상으로 쉽게</h3>
            <p className={styles.featureDescription}>
              따라하기 쉬운 영상 강의로 실습하며 배워요
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💬</div>
            <h3 className={styles.featureTitle}>질문은 언제든</h3>
            <p className={styles.featureDescription}>
              막히는 부분은 카카오톡으로 바로 질문하세요
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
