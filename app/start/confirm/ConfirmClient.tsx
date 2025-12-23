'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { Button } from '@/components';
import { Course, Cohort } from '@/lib/database.types';
import styles from '../start.module.css';

interface ConfirmClientProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
  course: Course;
  cohort: Cohort;
  isAlreadyEnrolled: boolean;
}

export default function ConfirmClient({
  user,
  course,
  cohort,
  isAlreadyEnrolled,
}: ConfirmClientProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnroll = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('enrollments')
        .upsert(
          {
            user_id: user.id,
            cohort_id: cohort.id,
            status: 'active' as const,
          } as any,
          {
            onConflict: 'user_id,cohort_id',
          }
        );

      if (insertError) {
        console.error('Enrollment error:', insertError);
        setError('수강 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      // 성공 - done 페이지로 이동
      router.push(`/start/done?courseId=${course.id}&cohortId=${cohort.id}`);
    } catch (err) {
      setError('수강 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이미 등록된 경우
  if (isAlreadyEnrolled) {
    return (
      <div className={styles.onboardingPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.alreadyEnrolled}>
              <div className={styles.alreadyEnrolledIcon}>✅</div>
              <h1 className={styles.alreadyEnrolledTitle}>이미 수강 중입니다</h1>
              <p className={styles.alreadyEnrolledText}>
                <strong>{course.title}</strong>의 <strong>{cohort.title}</strong>에 
                이미 등록되어 있습니다.
              </p>
              
              <div className={styles.actions}>
                <Button 
                  href={`/courses/${course.id}/cohorts/${cohort.id}`}
                  fullWidth
                >
                  강좌로 이동
                </Button>
                <Button href="/dashboard" variant="outline" fullWidth>
                  대시보드로 이동
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.icon}>🎓</div>
            <h1 className={styles.title}>수강 등록 확인</h1>
            <p className={styles.subtitle}>
              아래 정보를 확인하고 수강을 시작하세요
            </p>
          </div>

          <div className={styles.courseInfo}>
            <div className={styles.courseTitle}>{course.title}</div>
            <span className={styles.cohortBadge}>📅 {cohort.title}</span>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userInfoItem}>
              <div className={styles.userInfoLabel}>로그인 계정</div>
              <div className={styles.userInfoValue}>{user.email}</div>
            </div>
            <div className={styles.userInfoItem}>
              <div className={styles.userInfoLabel}>이름</div>
              <div className={styles.userInfoValue}>{user.name}</div>
            </div>
          </div>

          <div className={styles.warningBox}>
            <span className={styles.warningIcon}>⚠️</span>
            <p className={styles.warningText}>
              위 계정으로 수강이 등록됩니다. 다른 계정으로 수강하시려면 
              로그아웃 후 해당 계정으로 다시 로그인해 주세요.
            </p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.actions}>
            <Button onClick={handleEnroll} loading={loading} fullWidth>
              이 계정으로 수강 시작
            </Button>
            <Button href="/dashboard" variant="outline" fullWidth>
              나중에 하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
