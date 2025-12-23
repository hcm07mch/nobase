-- =====================================================
-- 노베이스구조대 SaaS MVP - 샘플 데이터 (개발용)
-- =====================================================

-- 샘플 강좌
INSERT INTO courses (id, title, slug, description, is_published) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '노베이스 웹개발 부트캠프',
    'web-dev-bootcamp',
    '프로그래밍 경험이 전혀 없어도 괜찮아요! 웹개발의 기초부터 실전까지 차근차근 배워봅시다.',
    TRUE
),
(
    '22222222-2222-2222-2222-222222222222',
    '데이터 분석 입문',
    'data-analysis-intro',
    '엑셀만 쓸 줄 알면 됩니다. 파이썬과 데이터 분석의 세계로 안내합니다.',
    TRUE
);

-- 샘플 기수
INSERT INTO cohorts (id, course_id, title, slug, starts_at, ends_at, is_active) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '2024년 1월 1기',
    '2024-jan-1st',
    '2024-01-08 00:00:00+09',
    '2024-03-08 23:59:59+09',
    TRUE
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '2024년 3월 2기',
    '2024-mar-2nd',
    '2024-03-11 00:00:00+09',
    '2024-05-11 23:59:59+09',
    TRUE
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    '데이터분석 1기',
    'data-1st',
    '2024-02-01 00:00:00+09',
    '2024-04-01 23:59:59+09',
    TRUE
);

-- 샘플 레슨 (웹개발 1기)
INSERT INTO lessons (id, cohort_id, title, sort_order, vimeo_url, description, resources) VALUES
(
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '오리엔테이션: 강의 소개와 준비물',
    1,
    'https://player.vimeo.com/video/76979871',
    '강좌 전체 커리큘럼을 소개하고, 개발 환경을 설정합니다.',
    '[{"type": "link", "title": "VS Code 다운로드", "url": "https://code.visualstudio.com"}]'
),
(
    'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'HTML 기초: 웹페이지의 뼈대',
    2,
    'https://player.vimeo.com/video/76979871',
    'HTML 태그의 기본 개념과 문서 구조를 배웁니다.',
    '[{"type": "pdf", "title": "HTML 치트시트", "url": "/resources/html-cheatsheet.pdf"}]'
),
(
    'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'CSS 기초: 스타일링의 시작',
    3,
    'https://player.vimeo.com/video/76979871',
    'CSS 선택자와 기본 속성을 배웁니다.',
    '[]'
),
(
    'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'JavaScript 입문: 프로그래밍의 첫걸음',
    4,
    'https://player.vimeo.com/video/76979871',
    '변수, 조건문, 반복문 등 기초 문법을 배웁니다.',
    '[]'
),
(
    'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '실습: 나만의 포트폴리오 만들기',
    5,
    'https://player.vimeo.com/video/76979871',
    '배운 내용을 활용해 간단한 포트폴리오 페이지를 만듭니다.',
    '[]'
);

-- 샘플 레슨 (데이터분석 1기)
INSERT INTO lessons (id, cohort_id, title, sort_order, vimeo_url, description, resources) VALUES
(
    'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '데이터 분석 오리엔테이션',
    1,
    'https://player.vimeo.com/video/76979871',
    '데이터 분석이란 무엇인지, 어디에 활용되는지 알아봅니다.',
    '[]'
),
(
    'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '파이썬 설치 및 기초',
    2,
    'https://player.vimeo.com/video/76979871',
    '파이썬을 설치하고 기본 문법을 배웁니다.',
    '[{"type": "link", "title": "Python 다운로드", "url": "https://python.org"}]'
);

-- 샘플 공지사항
INSERT INTO announcements (cohort_id, title, body, is_pinned) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '🎉 웹개발 1기 강의를 시작합니다!',
    '안녕하세요, 수강생 여러분!\n\n드디어 웹개발 부트캠프 1기가 시작되었습니다. 앞으로 8주간 함께 열심히 공부해봐요!\n\n문의사항은 언제든 카카오톡 채널로 연락주세요.',
    TRUE
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '첫 번째 과제 안내',
    '이번 주 과제: HTML로 간단한 자기소개 페이지를 만들어주세요.\n\n제출 기한: 1월 15일까지',
    FALSE
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '📊 데이터분석 1기 시작!',
    '데이터 분석 1기 수강생 여러분 환영합니다!\n\n매주 화/목 저녁 8시에 라이브 세션이 있습니다.',
    TRUE
);
