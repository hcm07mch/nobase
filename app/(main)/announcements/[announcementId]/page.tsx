import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, getUser, getProfile } from '@/lib/supabase-server';
import { Header, ErrorPage } from '@/components';
import { Profile, Announcement } from '@/lib/database.types';
import styles from '../announcements.module.css';

interface AnnouncementDetailPageProps {
  params: Promise<{
    announcementId: string;
  }>;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const { announcementId } = await params;
  
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const profileData = await getProfile();
  const profile = profileData as Profile | null;
  const supabase = await createServerSupabaseClient();

  // 공지사항 조회
  const { data: announcementData } = await supabase
    .from('announcements')
    .select(`
      *,
      cohorts (
        id,
        title,
        courses (title)
      )
    `)
    .eq('id', announcementId)
    .single();

  const announcement = announcementData as (Announcement & { cohorts: any }) | null;

  if (!announcement) {
    notFound();
  }

  // 접근 권한 확인 (해당 cohort에 등록되어 있는지)
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('cohort_id', announcement.cohort_id)
    .eq('status', 'active')
    .single();

  if (!enrollment) {
    return (
      <div className={styles.detailPage}>
        <Header userName={profile?.name || user.email} isLoggedIn={true} />
        <ErrorPage
          icon="🔒"
          title="접근 권한이 없습니다"
          description="이 공지사항을 볼 수 있는 권한이 없습니다."
          primaryAction={{
            label: '대시보드로 이동',
            href: '/dashboard',
          }}
        />
      </div>
    );
  }

  const cohort = announcement.cohorts as any;
  const course = cohort?.courses;

  return (
    <div className={styles.detailPage}>
      <Header userName={profile?.name || user.email} isLoggedIn={true} />

      <main className={styles.detailMain}>
        <Link href="/announcements" className={styles.backLink}>
          ← 공지사항 목록으로
        </Link>

        <article className={styles.detailCard}>
          <header className={styles.detailHeader}>
            <h1 className={styles.detailTitle}>{announcement.title}</h1>
            <div className={styles.detailMeta}>
              {announcement.is_pinned && (
                <span className={styles.pinnedBadge}>
                  📌 고정됨
                </span>
              )}
              <span className={styles.cohortBadge}>
                {course?.title} - {cohort?.title}
              </span>
              <span className={styles.date}>
                {formatDate(announcement.created_at)}
              </span>
            </div>
          </header>

          <div className={styles.detailBody}>
            {announcement.body}
          </div>
        </article>
      </main>
    </div>
  );
}
