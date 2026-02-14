-- =========================================================
-- HobbyTime - Seed Data (Supabase SQL Editor)
-- Order: common code master -> common code detail -> users -> posts
-- =========================================================

-- 1) Common code master
insert into public.common_code_master (
  id, code, name, description, is_active, created_at, updated_at
) values
  (
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1001',
    'BH_ST_APPLICATION',
    '신청 상태',
    '예약 승인 흐름에서 사용하는 신청 상태',
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  ),
  (
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1002',
    'BH_USER_ROLE',
    '유저 권한',
    '서비스 접근 권한 구분',
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  )
on conflict (code) do nothing;

-- 2) Common code detail
insert into public.common_code_detail (
  id, master_id, code, name, description, sort_order, is_active, created_at, updated_at
) values
  (
    '6b7a1f0d-5e2c-4a91-9d2c-0a1b2c3d4001',
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1001',
    'PENDING',
    '대기',
    '관리자 승인 대기 상태',
    1,
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  ),
  (
    '6b7a1f0d-5e2c-4a91-9d2c-0a1b2c3d4002',
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1001',
    'APPROVED',
    '승인',
    '관리자 승인 완료 상태',
    2,
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  ),
  (
    '6b7a1f0d-5e2c-4a91-9d2c-0a1b2c3d4003',
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1001',
    'CANCELLED',
    '취소',
    '승인 거절 또는 신청 취소 상태',
    3,
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  ),
  (
    '6b7a1f0d-5e2c-4a91-9d2c-0a1b2c3d4004',
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1002',
    'USER',
    '일반 사용자',
    '클래스 탐색 및 예약 가능',
    1,
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  ),
  (
    '6b7a1f0d-5e2c-4a91-9d2c-0a1b2c3d4005',
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1002',
    'ADMIN',
    '관리자',
    '승인 및 콘텐츠 관리 권한',
    2,
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  ),
  (
    '6b7a1f0d-5e2c-4a91-9d2c-0a1b2c3d4006',
    '9f1b0d5a-2c41-4a6f-8f28-3f1c9c1a1002',
    'GUEST',
    '비로그인',
    '목록/상세 조회만 가능',
    3,
    true,
    '2026-01-29T09:00:00+09:00',
    '2026-01-29T09:00:00+09:00'
  )
on conflict (master_id, code) do nothing;

-- 3) Auth users
insert into auth.users (
  id,
  email,
  raw_user_meta_data,
  raw_app_meta_data,
  aud,
  role,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  created_at,
  updated_at
) values
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f001',
    'jiyun.admin@hobbytime.dev',
    '{"name":"김지윤","avatar_url":"https://images.example.com/avatars/jiyun.png"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    crypt('HobbyTime!2026', gen_salt('bf')),
    '2026-01-10T09:00:00+09:00',
    '2026-01-10T09:00:00+09:00',
    '2026-01-10T09:00:00+09:00',
    '2026-01-10T09:00:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f002',
    'minsu.park@hobbytime.dev',
    '{"name":"박민수","avatar_url":"https://images.example.com/avatars/minsu.png"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    crypt('HobbyTime!2026', gen_salt('bf')),
    '2026-01-12T10:30:00+09:00',
    '2026-01-12T10:30:00+09:00',
    '2026-01-12T10:30:00+09:00',
    '2026-01-12T10:30:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f003',
    'seoyeon.lee@hobbytime.dev',
    '{"name":"이서연","avatar_url":"https://images.example.com/avatars/seoyeon.png"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    crypt('HobbyTime!2026', gen_salt('bf')),
    '2026-01-15T14:00:00+09:00',
    '2026-01-15T14:00:00+09:00',
    '2026-01-15T14:00:00+09:00',
    '2026-01-15T14:00:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f004',
    'dahun.jeong@hobbytime.dev',
    '{"name":"정다훈","avatar_url":"https://images.example.com/avatars/dahun.png"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    crypt('HobbyTime!2026', gen_salt('bf')),
    '2026-01-18T11:20:00+09:00',
    '2026-01-18T11:20:00+09:00',
    '2026-01-18T11:20:00+09:00',
    '2026-01-18T11:20:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f005',
    'eunji.choi@hobbytime.dev',
    '{"name":"최은지","avatar_url":"https://images.example.com/avatars/eunji.png"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    crypt('HobbyTime!2026', gen_salt('bf')),
    '2026-01-20T16:45:00+09:00',
    '2026-01-20T16:45:00+09:00',
    '2026-01-20T16:45:00+09:00',
    '2026-01-20T16:45:00+09:00'
  )
on conflict do nothing;

-- 4) Profiles (safety insert if trigger is not enabled)
insert into public.profiles (
  id, email, display_name, avatar_url, role, created_at, updated_at
) values
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f001',
    'jiyun.admin@hobbytime.dev',
    '김지윤',
    'https://images.example.com/avatars/jiyun.png',
    'admin',
    '2026-01-10T09:00:00+09:00',
    '2026-01-10T09:00:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f002',
    'minsu.park@hobbytime.dev',
    '박민수',
    'https://images.example.com/avatars/minsu.png',
    'user',
    '2026-01-12T10:30:00+09:00',
    '2026-01-12T10:30:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f003',
    'seoyeon.lee@hobbytime.dev',
    '이서연',
    'https://images.example.com/avatars/seoyeon.png',
    'user',
    '2026-01-15T14:00:00+09:00',
    '2026-01-15T14:00:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f004',
    'dahun.jeong@hobbytime.dev',
    '정다훈',
    'https://images.example.com/avatars/dahun.png',
    'user',
    '2026-01-18T11:20:00+09:00',
    '2026-01-18T11:20:00+09:00'
  ),
  (
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f005',
    'eunji.choi@hobbytime.dev',
    '최은지',
    'https://images.example.com/avatars/eunji.png',
    'user',
    '2026-01-20T16:45:00+09:00',
    '2026-01-20T16:45:00+09:00'
  )
on conflict (id) do nothing;

-- Ensure admin role even if the profile already exists via trigger
update public.profiles
  set role = 'admin',
      updated_at = now()
where id = '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f001'
  and role <> 'admin';

-- 5) Studios
insert into public.studios (
  id, name, description, location_text, region_code, created_by, created_at, updated_at
) values
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100001',
    '라탄하우스 스튜디오',
    '따뜻한 분위기의 라탄 공예 전문 스튜디오입니다.',
    '서울 강남',
    'SEOUL_GANGNAM',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f001',
    '2026-01-21T10:00:00+09:00',
    '2026-01-21T10:00:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100002',
    '오늘의 집밥 스튜디오',
    '집에서 쉽게 따라 할 수 있는 한식 클래스가 중심입니다.',
    '서울 마포',
    'SEOUL_MAPO',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f002',
    '2026-01-21T11:00:00+09:00',
    '2026-01-21T11:00:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100003',
    '코어랩 필라테스',
    '소규모 그룹으로 정확한 자세를 집중 코칭합니다.',
    '서울 성수',
    'SEOUL_SEONGSU',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f003',
    '2026-01-21T12:00:00+09:00',
    '2026-01-21T12:00:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100004',
    '오픈에어 포토랩',
    '도심 야외 촬영을 중심으로 구성된 사진 워크숍입니다.',
    '서울 서초',
    'SEOUL_SEOCHO',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f004',
    '2026-01-22T10:30:00+09:00',
    '2026-01-22T10:30:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100005',
    '스텝업 댄스룸',
    'K-POP 안무를 쉽고 재미있게 배울 수 있습니다.',
    '서울 용산',
    'SEOUL_YONGSAN',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f005',
    '2026-01-22T14:15:00+09:00',
    '2026-01-22T14:15:00+09:00'
  )
on conflict (id) do nothing;

-- 6) Studio memberships (owners)
insert into public.studio_memberships (
  studio_id, user_id, role, created_at
) values
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100001',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f001',
    'OWNER',
    '2026-01-21T10:05:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100002',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f002',
    'OWNER',
    '2026-01-21T11:05:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100003',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f003',
    'OWNER',
    '2026-01-21T12:05:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100004',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f004',
    'OWNER',
    '2026-01-22T10:35:00+09:00'
  ),
  (
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100005',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f005',
    'OWNER',
    '2026-01-22T14:20:00+09:00'
  )
on conflict (studio_id, user_id) do nothing;

-- 7) Classes (posts)
insert into public.classes (
  id, studio_id, name, category, description, price, duration_minutes, cover_image_path,
  is_published, created_at, updated_at
) values
  (
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100001',
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100001',
    '라탄 소품 원데이 클래스',
    '공예',
    '라탄 바구니를 직접 만들어 보는 입문 클래스입니다. 재료 제공, 완성품은 당일 가져가실 수 있어요.',
    55000,
    120,
    null,
    true,
    '2026-01-23T09:00:00+09:00',
    '2026-01-23T09:00:00+09:00'
  ),
  (
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100002',
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100002',
    '집밥 한식 클래스',
    '요리',
    '제철 재료로 만드는 집밥 한 끼. 기본 양념부터 반찬 구성까지 함께 배워요.',
    65000,
    150,
    null,
    true,
    '2026-01-23T10:00:00+09:00',
    '2026-01-23T10:00:00+09:00'
  ),
  (
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100003',
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100003',
    '필라테스 코어 강화',
    '운동',
    '기초 호흡부터 코어 강화 루틴까지 진행합니다. 소규모라 처음 오시는 분도 안전해요.',
    40000,
    60,
    null,
    true,
    '2026-01-23T11:00:00+09:00',
    '2026-01-23T11:00:00+09:00'
  ),
  (
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100004',
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100004',
    'DSLR 야외 사진 워크숍',
    '사진',
    '구도와 노출을 배우고 실제 야외 촬영까지 진행하는 워크숍입니다.',
    70000,
    180,
    null,
    true,
    '2026-01-23T13:00:00+09:00',
    '2026-01-23T13:00:00+09:00'
  ),
  (
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100005',
    '4c6c6f7a-1c2d-4edb-9e1a-6c6f7a100005',
    'K-POP 댄스 입문',
    '댄스',
    '기본 스텝과 안무를 익히고, 마지막에는 함께 촬영까지 진행합니다.',
    35000,
    90,
    null,
    true,
    '2026-01-23T14:00:00+09:00',
    '2026-01-23T14:00:00+09:00'
  )
on conflict (id) do nothing;

-- 8) Class sessions
insert into public.class_sessions (
  id, class_id, start_at, capacity, booked_count, status, created_at, updated_at
) values
  (
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100001',
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100001',
    '2026-02-01T10:00:00+09:00',
    8,
    0,
    'SCHEDULED',
    '2026-01-25T09:00:00+09:00',
    '2026-01-25T09:00:00+09:00'
  ),
  (
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100002',
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100002',
    '2026-02-03T19:00:00+09:00',
    10,
    0,
    'SCHEDULED',
    '2026-01-25T10:00:00+09:00',
    '2026-01-25T10:00:00+09:00'
  ),
  (
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100003',
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100003',
    '2026-02-04T07:30:00+09:00',
    6,
    0,
    'SCHEDULED',
    '2026-01-25T11:00:00+09:00',
    '2026-01-25T11:00:00+09:00'
  ),
  (
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100004',
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100004',
    '2026-02-08T15:00:00+09:00',
    12,
    0,
    'SCHEDULED',
    '2026-01-25T12:00:00+09:00',
    '2026-01-25T12:00:00+09:00'
  ),
  (
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100005',
    '7f2a6c1b-0f4b-4c7d-8a1b-7f2a6c100005',
    '2026-02-05T20:00:00+09:00',
    20,
    0,
    'SCHEDULED',
    '2026-01-25T13:00:00+09:00',
    '2026-01-25T13:00:00+09:00'
  )
on conflict (class_id, start_at) do nothing;

-- 9) Reservations (for UI test)
insert into public.reservations (
  id, user_id, session_id, head_count, status, created_at, updated_at
) values
  (
    '5e1c2a7b-4d5f-4f6a-8b7c-5e1c2a100001',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f002',
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100001',
    2,
    'CONFIRMED',
    '2026-01-26T09:10:00+09:00',
    '2026-01-26T09:10:00+09:00'
  ),
  (
    '5e1c2a7b-4d5f-4f6a-8b7c-5e1c2a100002',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f003',
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100002',
    1,
    'PENDING',
    '2026-01-26T13:40:00+09:00',
    '2026-01-26T13:40:00+09:00'
  ),
  (
    '5e1c2a7b-4d5f-4f6a-8b7c-5e1c2a100003',
    '2a9b5f8a-9d6b-4b8c-9a7f-2b8b78a1f005',
    '1c9e6f2a-3d4b-4d2e-9a2b-1c9e6f100005',
    3,
    'CONFIRMED',
    '2026-01-27T18:20:00+09:00',
    '2026-01-27T18:20:00+09:00'
  )
on conflict (id) do nothing;
