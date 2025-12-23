import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, getUser, getProfile } from '@/lib/supabase-server';
import { Header, ErrorPage } from '@/components';
import LessonClient from './LessonClient';
import styles from './lesson.module.css';
import { Resource, Profile, Lesson, LessonProgress } from '@/lib/database.types';

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const profileData = await getProfile();
  const profile = profileData as Profile | null;
  const supabase = await createServerSupabaseClient();

  // 레슨 조회
  const { data: lessonData } = await supabase
    .from('lessons')
    .select(`
      *,
      cohorts (
        *,
        courses (*)
      )
    `)
    .eq('id', lessonId)
    .single();

  const lesson = lessonData as (Lesson & { cohorts: any }) | null;

  if (!lesson) {
    notFound();
  }

  const cohort = lesson.cohorts as any;
  const course = cohort?.courses;

  // 등록 확인
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('cohort_id', cohort.id)
    .eq('status', 'active')
    .single();

  if (!enrollment) {
    return (
      <div className={styles.page}>
        <Header userName={profile?.name || user.email} isLoggedIn={true} />
        <ErrorPage
          icon="🔒"
          title="접근 권한이 없습니다"
          description="이 레슨에 대한 수강 등록이 필요합니다."
          primaryAction={{
            label: '대시보드로 이동',
            href: '/dashboard',
          }}
        />
      </div>
    );
  }

  // 진도 조회
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  const progress = progressData as LessonProgress | null;

  // 전체 레슨 목록 (이전/다음 레슨용)
  const { data: allLessonsData } = await supabase
    .from('lessons')
    .select('id, title, sort_order')
    .eq('cohort_id', cohort.id)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  const allLessons = (allLessonsData || []) as { id: string; title: string; sort_order: number }[];

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Vimeo URL 파싱
  let vimeoEmbedUrl: string | null = null;
  if (lesson.vimeo_url) {
    const vimeoMatch = lesson.vimeo_url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    } else if (lesson.vimeo_url.includes('player.vimeo.com')) {
      vimeoEmbedUrl = lesson.vimeo_url;
    }
  }

  const resources = (lesson.resources || []) as Resource[];

  return (
    <div className={styles.page}>
      <Header userName={profile?.name || user.email} isLoggedIn={true} />

      <main className={styles.main}>
        <nav className={styles.breadcrumb}>
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            대시보드
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link 
            href={`/courses/${course.id}/cohorts/${cohort.id}`}
            className={styles.breadcrumbLink}
          >
            {course.title}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link 
            href={`/courses/${course.id}/cohorts/${cohort.id}/curriculum`}
            className={styles.breadcrumbLink}
          >
            커리큘럼
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>레슨 {currentIndex + 1}</span>
        </nav>

        <div className={styles.lessonHeader}>
          <span className={styles.lessonNumber}>
            레슨 {currentIndex + 1} / {allLessons.length}
          </span>
          <h1 className={styles.lessonTitle}>{lesson.title}</h1>
          {lesson.description && (
            <p className={styles.lessonDescription}>{lesson.description}</p>
          )}
        </div>

        <div className={styles.videoContainer}>
          {vimeoEmbedUrl ? (
            <div className={styles.videoWrapper}>
              <iframe
                src={vimeoEmbedUrl}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          ) : (
            <div className={styles.noVideo}>
              <div className={styles.noVideoIcon}>🎬</div>
              <p>영상이 준비 중입니다</p>
            </div>
          )}
        </div>

        <LessonClient
          lessonId={lessonId}
          userId={user.id}
          isCompleted={progress?.completed || false}
        />

        {resources.length > 0 && (
          <div className={styles.resourcesCard}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📎</span>
              학습 자료
            </h2>
            <div className={styles.resourceList}>
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resourceItem}
                >
                  <span className={styles.resourceIcon}>
                    {resource.type === 'pdf' ? '📄' : resource.type === 'link' ? '🔗' : '📁'}
                  </span>
                  <span className={styles.resourceTitle}>{resource.title}</span>
                  <span className={styles.resourceArrow}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className={styles.navigation}>
          {prevLesson ? (
            <Link 
              href={`/lessons/${prevLesson.id}`}
              className={styles.navButton}
            >
              ← 이전 레슨
            </Link>
          ) : (
            <span className={`${styles.navButton} ${styles.navButtonDisabled}`}>
              ← 이전 레슨
            </span>
          )}

          {nextLesson ? (
            <Link 
              href={`/lessons/${nextLesson.id}`}
              className={styles.navButton}
            >
              다음 레슨 →
            </Link>
          ) : (
            <Link 
              href={`/courses/${course.id}/cohorts/${cohort.id}`}
              className={styles.navButton}
            >
              강좌 홈으로 →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
