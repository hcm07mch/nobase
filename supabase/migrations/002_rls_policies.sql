-- =====================================================
-- 노베이스구조대 SaaS MVP - RLS 정책
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- 본인 프로필 조회
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- 본인 프로필 수정
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admin 전체 조회/수정
CREATE POLICY "profiles_admin_all" ON profiles
    FOR ALL
    USING (is_admin());

-- =====================================================
-- COURSES POLICIES
-- =====================================================

-- 발행된 강좌는 등록된 cohort가 있는 사용자만 조회 가능
CREATE POLICY "courses_select_enrolled" ON courses
    FOR SELECT
    USING (
        is_published = TRUE
        AND EXISTS (
            SELECT 1 FROM cohorts c
            JOIN enrollments e ON e.cohort_id = c.id
            WHERE c.course_id = courses.id
            AND e.user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- Admin 전체 CRUD
CREATE POLICY "courses_admin_all" ON courses
    FOR ALL
    USING (is_admin());

-- =====================================================
-- COHORTS POLICIES
-- =====================================================

-- 등록된 cohort만 조회 가능
CREATE POLICY "cohorts_select_enrolled" ON cohorts
    FOR SELECT
    USING (
        is_active = TRUE
        AND EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.cohort_id = cohorts.id
            AND e.user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- /start 페이지에서 cohort 정보 조회용 (활성화된 cohort 기본 정보)
CREATE POLICY "cohorts_select_active_for_enrollment" ON cohorts
    FOR SELECT
    USING (is_active = TRUE);

-- Admin 전체 CRUD
CREATE POLICY "cohorts_admin_all" ON cohorts
    FOR ALL
    USING (is_admin());

-- =====================================================
-- LESSONS POLICIES
-- =====================================================

-- 등록된 cohort의 lesson만 조회 가능
CREATE POLICY "lessons_select_enrolled" ON lessons
    FOR SELECT
    USING (
        is_published = TRUE
        AND EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.cohort_id = lessons.cohort_id
            AND e.user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- Admin 전체 CRUD
CREATE POLICY "lessons_admin_all" ON lessons
    FOR ALL
    USING (is_admin());

-- =====================================================
-- ENROLLMENTS POLICIES
-- =====================================================

-- 본인 enrollment만 조회
CREATE POLICY "enrollments_select_own" ON enrollments
    FOR SELECT
    USING (auth.uid() = user_id);

-- 본인 enrollment INSERT (온보딩용)
CREATE POLICY "enrollments_insert_own" ON enrollments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin 전체 CRUD
CREATE POLICY "enrollments_admin_all" ON enrollments
    FOR ALL
    USING (is_admin());

-- =====================================================
-- LESSON_PROGRESS POLICIES
-- =====================================================

-- 본인 진도만 조회
CREATE POLICY "lesson_progress_select_own" ON lesson_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- 본인 진도 생성 (등록된 lesson만)
CREATE POLICY "lesson_progress_insert_own" ON lesson_progress
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND can_access_lesson(lesson_id)
    );

-- 본인 진도 수정
CREATE POLICY "lesson_progress_update_own" ON lesson_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admin 전체 CRUD
CREATE POLICY "lesson_progress_admin_all" ON lesson_progress
    FOR ALL
    USING (is_admin());

-- =====================================================
-- ANNOUNCEMENTS POLICIES
-- =====================================================

-- 등록된 cohort의 공지사항만 조회
CREATE POLICY "announcements_select_enrolled" ON announcements
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollments e
            WHERE e.cohort_id = announcements.cohort_id
            AND e.user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- Admin 전체 CRUD
CREATE POLICY "announcements_admin_all" ON announcements
    FOR ALL
    USING (is_admin());
