import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, getUser, getProfile } from '@/lib/supabase-server';
import { Header } from '@/components';
import { Profile, Enrollment } from '@/lib/database.types';
import styles from './announcements.module.css';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export default async function AnnouncementsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const profileData = await getProfile();
  const profile = profileData as Profile | null;
  const supabase = await createServerSupabaseClient();

  // 내 enrollment가 있는 cohort ID 조회
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select(`
      cohort_id,
      cohorts (
        id,
        title,
        courses (title)
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active');

  const enrollments = (enrollmentsData || []) as any[];
  const cohortIds = enrollments.map(e => e.cohort_id);

  // 공지사항 조회
  let announcements: any[] = [];
  
  if (cohortIds.length > 0) {
    const { data } = await supabase
      .from('announcements')
      .select(`
        *,
        cohorts (
          id,
          title,
          courses (title)
        )
      `)
      .in('cohort_id', cohortIds)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    
    announcements = data || [];
  }

  // cohort 정보 매핑
  const cohortMap = new Map(
    enrollments.map(e => {
      const cohort = e.cohorts as any;
      return [cohort?.id, cohort];
    })
  );

  return (
    <div className={styles.page}>
      <Header userName={profile?.name || user.email} isLoggedIn={true} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>📢 공지사항</h1>
          <p className={styles.subtitle}>
            내 강좌의 중요한 소식을 확인하세요
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h2 className={styles.emptyTitle}>공지사항이 없습니다</h2>
            <p className={styles.emptyDescription}>
              아직 등록된 공지사항이 없거나, 수강 중인 강좌가 없습니다.
            </p>
          </div>
        ) : (
          <div className={styles.announcementsList}>
            {announcements.map((announcement) => {
              const cohort = announcement.cohorts as any;
              const course = cohort?.courses;
              
              return (
                <article key={announcement.id} className={styles.announcementCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardMeta}>
                      {announcement.is_pinned && (
                        <span className={styles.pinnedBadge}>
                          📌 고정됨
                        </span>
                      )}
                      <span className={styles.cohortBadge}>
                        {course?.title} - {cohort?.title}
                      </span>
                    </div>
                    <span className={styles.date}>
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>
                  
                  <h2 className={styles.cardTitle}>{announcement.title}</h2>
                  
                  <div className={`${styles.cardBody} ${styles.cardBodyPreview}`}>
                    {announcement.body}
                  </div>

                  <Link 
                    href={`/announcements/${announcement.id}`}
                    className={styles.readMore}
                  >
                    자세히 보기 →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
