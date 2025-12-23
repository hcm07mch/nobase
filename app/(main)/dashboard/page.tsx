import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, getUser, getProfile } from '@/lib/supabase-server';
import { Header, CourseCard } from '@/components';
import { Profile, Enrollment, Lesson, LessonProgress, Announcement } from '@/lib/database.types';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }

  const profile = await getProfile() as Profile | null;
  const supabase = await createServerSupabaseClient();

  // 내 수강 목록 조회
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select(`
      *,
      cohorts (
        *,
        courses (*)
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const enrollments = (enrollmentsData || []) as any[];

  // 각 enrollment별 레슨 정보 및 진도 조회
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const cohort = enrollment.cohorts;
      const course = cohort?.courses;

      // 해당 cohort의 레슨들
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, sort_order')
        .eq('cohort_id', cohort.id)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      const lessons = (lessonsData || []) as any[];

      // 완료한 레슨
      const lessonIds = lessons.map(l => l.id);
      const { data: progressData } = lessonIds.length > 0
        ? await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .in('lesson_id', lessonIds)
        : { data: [] };

      const progress = (progressData || []) as any[];
      const completedLessonIds = new Set(progress.map(p => p.lesson_id));

      // 다음 레슨 찾기 (완료하지 않은 첫 번째 레슨)
      const nextLesson = lessons.find(l => !completedLessonIds.has(l.id));

      return {
        ...enrollment,
        course,
        cohort,
        totalLessons: lessons.length,
        completedLessons: progress.length,
        nextLessonId: nextLesson?.id || null,
      };
    })
  );

  // 공지사항 조회 (내 enrollment가 있는 cohort의 공지)
  const cohortIds = enrollments.map(e => e.cohorts?.id).filter(Boolean);
  
  const { data: announcementsData } = cohortIds.length > 0 
    ? await supabase
        .from('announcements')
        .select(`
          *,
          cohorts (title)
        `)
        .in('cohort_id', cohortIds)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] };

  const announcements = (announcementsData || []) as any[];

  return (
    <div className={styles.page}>
      <Header 
        userName={profile?.name || user.email} 
        isLoggedIn={true} 
      />
      
      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            안녕하세요, {profile?.name || '학습자'}님! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            오늘도 함께 성장해볼까요?
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainContent}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📚</span>
                  내 강좌
                </h2>
              </div>

              {enrollmentsWithProgress.length > 0 ? (
                <div className={styles.coursesGrid}>
                  {enrollmentsWithProgress.map((item) => (
                    <CourseCard
                      key={item.id}
                      courseId={item.course.id}
                      cohortId={item.cohort.id}
                      courseTitle={item.course.title}
                      cohortTitle={item.cohort.title}
                      description={item.course.description}
                      thumbnailUrl={item.course.thumbnail_url}
                      totalLessons={item.totalLessons}
                      completedLessons={item.completedLessons}
                      nextLessonId={item.nextLessonId}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📭</div>
                  <h3 className={styles.emptyTitle}>수강 중인 강좌가 없습니다</h3>
                  <p className={styles.emptyDescription}>
                    강좌를 구매하신 후, 이메일로 받은 수강 시작 링크를 클릭하시면
                    자동으로 강좌가 등록됩니다.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.announcementsCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📢</span>
                  공지사항
                </h2>
                {announcements.length > 0 && (
                  <Link href="/announcements" className={styles.sectionLink}>
                    전체보기
                  </Link>
                )}
              </div>

              {announcements.length > 0 ? (
                <div>
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className={styles.announcementItem}>
                      <div className={styles.announcementBadge}>
                        {announcement.is_pinned && (
                          <span className={styles.announcementPinned}>📌</span>
                        )}
                        <span>{announcement.cohorts?.title}</span>
                      </div>
                      <Link 
                        href={`/announcements/${announcement.id}`}
                        className={styles.announcementTitle}
                      >
                        {announcement.title}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyAnnouncements}>
                  공지사항이 없습니다
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
