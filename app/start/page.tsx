import { redirect } from 'next/navigation';
import { createServerSupabaseClient, getUser } from '@/lib/supabase-server';
import { ErrorPage } from '@/components';
import { Course, Cohort, Enrollment } from '@/lib/database.types';

interface StartPageProps {
  searchParams: Promise<{
    course?: string;
    cohort?: string;
  }>;
}

export default async function StartPage({ searchParams }: StartPageProps) {
  const { course: courseSlug, cohort: cohortIdOrSlug } = await searchParams;

  // 파라미터 검증
  if (!courseSlug || !cohortIdOrSlug) {
    return (
      <ErrorPage
        icon="🔗"
        title="잘못된 링크입니다"
        description="수강 시작 링크가 올바르지 않습니다. 이메일 또는 카카오톡으로 받은 링크를 다시 확인해 주세요."
        primaryAction={{
          label: '대시보드로 이동',
          href: '/dashboard',
        }}
      />
    );
  }

  const supabase = await createServerSupabaseClient();
  const user = await getUser();

  // 비로그인 사용자 -> 로그인 페이지로 리다이렉트
  if (!user) {
    const returnTo = `/start?course=${courseSlug}&cohort=${cohortIdOrSlug}`;
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // Course 조회
  const { data: courseData } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .eq('is_published', true)
    .single();

  const course = courseData as Course | null;

  if (!course) {
    return (
      <ErrorPage
        icon="📚"
        title="강좌를 찾을 수 없습니다"
        description="요청하신 강좌가 존재하지 않거나 현재 운영 중이 아닙니다."
        primaryAction={{
          label: '대시보드로 이동',
          href: '/dashboard',
        }}
      />
    );
  }

  // Cohort 조회 (ID 또는 slug로)
  let cohort: Cohort | null = null;
  
  // UUID 형식인지 확인
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cohortIdOrSlug);
  
  if (isUUID) {
    const { data } = await supabase
      .from('cohorts')
      .select('*')
      .eq('id', cohortIdOrSlug)
      .eq('course_id', course.id)
      .eq('is_active', true)
      .single();
    cohort = data as Cohort | null;
  } else {
    const { data } = await supabase
      .from('cohorts')
      .select('*')
      .eq('slug', cohortIdOrSlug)
      .eq('course_id', course.id)
      .eq('is_active', true)
      .single();
    cohort = data as Cohort | null;
  }

  if (!cohort) {
    return (
      <ErrorPage
        icon="📅"
        title="기수를 찾을 수 없습니다"
        description="요청하신 기수가 존재하지 않거나 현재 모집 중이 아닙니다."
        primaryAction={{
          label: '대시보드로 이동',
          href: '/dashboard',
        }}
      />
    );
  }

  // 이미 등록되어 있는지 확인
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('cohort_id', cohort.id)
    .single();

  // /start/confirm 페이지로 리다이렉트 (쿼리로 정보 전달)
  redirect(`/start/confirm?courseId=${course.id}&cohortId=${cohort.id}&hasEnrollment=${!!existingEnrollment}`);
}
