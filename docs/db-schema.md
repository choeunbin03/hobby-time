# HobbyTime 데이터베이스 설계 가이드

PRD §3 데이터 모델링을 바탕으로 한 PostgreSQL 테이블 구조와 RLS(Row Level Security) 정책 요약입니다.  
실제 구현 시 Supabase 대시보드 또는 마이그레이션 파일로 반영합니다.

---

## 1. 테이블 구조 (PostgreSQL / Supabase)

### 1.1 `users` (또는 auth.users 연동 프로파일)

서비스 로그인 사용자 식별. Supabase Auth 사용 시 `auth.users` 존재.  
프로필·추가 속성만 별도 테이블로 둘 경우 예시:

```sql
-- auth.users와 1:1로 연결하는 프로파일 테이블 예시
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

- **Phase 1**: 필요 시 `auth.users`만 사용하고, 예약/후기 등은 `auth.uid()`로 사용자 참조.

---

### 1.2 `studios`

클래스를 운영하는 가게(스튜디오) 단위.

```sql
create table public.studios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  region text,                    -- 지역 필터용
  approval_mode text not null default 'INSTANT',  -- 'INSTANT' | 'APPROVAL' (Phase 2)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

- `region`: PRD의 “지역 필터”에 사용.
- `approval_mode`: Phase 2 예약 승인 방식(즉시 확정 vs 관리자 승인).

---

### 1.3 `classes`

스튜디오가 제공하는 취미 클래스 정적 정보.

```sql
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios(id) on delete cascade,
  name text not null,
  category text not null,         -- 카테고리 필터용
  description text,
  price decimal(12,2) not null,
  duration_minutes int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_classes_studio on public.classes(studio_id);
create index idx_classes_category on public.classes(category);
create index idx_classes_created_at on public.classes(created_at desc);
```

---

### 1.4 `sessions` (회차)

“이 클래스가 언제 열리는가”를 표현. 예약은 회차 단위로 발생.

```sql
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  start_at timestamptz not null,
  capacity int not null,
  booked_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint capacity_non_negative check (capacity >= 0),
  constraint booked_count_check check (booked_count >= 0 and booked_count <= capacity)
);

create index idx_sessions_class on public.sessions(class_id);
create index idx_sessions_start_at on public.sessions(start_at);
```

- `booked_count`: 예약 생성/취소 시 트랜잭션 내에서 갱신.  
- **정합성**: 예약 생성 시 “현재 booked_count + 인원 ≤ capacity” 검사 후 INSERT 및 `sessions.booked_count` 증가를 한 트랜잭션으로 처리.

---

### 1.5 `reservations`

사용자–회차 연결, 예약 인원·상태 관리.

```sql
-- Phase 1: status는 'CONFIRMED' 위주. Phase 2에서 확장.
create type reservation_status as enum (
  'PENDING', 'CONFIRMED', 'APPROVED', 'CANCELLED'
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.sessions(id) on delete restrict,
  head_count int not null,
  status reservation_status not null default 'CONFIRMED',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint head_count_positive check (head_count > 0)
);

create index idx_reservations_user on public.reservations(user_id);
create index idx_reservations_session on public.reservations(session_id);
```

- Phase 1: 기본값 `CONFIRMED`, 즉시 확정만 사용.
- Phase 2: 스튜디오 `approval_mode`에 따라 `PENDING` 생성 후 `APPROVED`/`CANCELLED` 처리.

---

### 1.6 `reviews` (Phase 2)

클래스 후기. 예약 완료/승인된 사용자만 작성 가능은 RLS 또는 API 단 검사로 보장.

```sql
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  rating int not null,
  body text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint rating_range check (rating >= 1 and rating <= 5)
);

create index idx_reviews_class on public.reviews(class_id);
create index idx_reviews_user on public.reviews(user_id);
```

---

### 1.7 `payments` (Phase 2·3)

예약과 연결된 결제 정보.

```sql
create type payment_status as enum (
  'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete restrict,
  amount decimal(12,2) not null,
  status payment_status not null default 'PENDING',
  external_id text,               -- PG사 거래 ID 등
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_payments_reservation on public.payments(reservation_id);
```

---

### 1.8 AI 결과 저장 (Phase 1 검증용)

“텍스트 입력 → AI 응답 → DB 저장” 검증을 위한 최소 테이블.

```sql
create table public.ai_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  input_text text not null,
  output_text text not null,
  context_type text,              -- 'class_summary' 등
  reference_id uuid,             -- classes.id 등
  created_at timestamptz default now()
);

create index idx_ai_results_user on public.ai_results(user_id);
create index idx_ai_results_reference on public.ai_results(reference_id);
```

---

## 2. RLS(보안) 정책 요약

- **원칙**: 모든 `public.*` 테이블에 `enable row level security` 적용하고, 필요한 정책만 추가.

### 2.1 `studios`, `classes`

- **조회**: `select`는 모든 역할 허용(비로그인 포함).  
  - PRD: 비로그인 사용자도 클래스 목록·상세 조회 가능.
- **변경**: 관리자만 가능하도록 `admin` 역할 또는 `studio.owner_id = auth.uid()` 등으로 제한.  
  - Phase 1에서 관리자 테이블이 없다면, 특정 이메일/역할로 제한하는 정책 또는 API 전용 서비스 롤 사용.

### 2.2 `sessions`

- **조회**: 모든 역할 `select` 허용.
- **갱신**(`booked_count` 등):  
  - 백엔드(API)·트리거에서만 갱신하고, 클라이언트는 RLS로 `update` 불가하도록 두는 것을 권장.

### 2.3 `reservations`

- **조회**:  
  - `auth.uid() = user_id` → 본인 예약만 조회.  
  - 관리자는 별도 정책으로 전체 조회(Phase 2).
- **삽입**:  
  - `auth.uid() = user_id`이고, `session_id`가 유효한 회차이며, 잔여 좌석 검사는 API/트리거에서 처리.
- **갱신/삭제**:  
  - 본인은 취소만 허용 등으로 제한.  
  - 승인/거절은 관리자만(Phase 2).

### 2.4 `reviews`

- **조회**: 모든 역할 `select` 허용(클래스 상세 등에서 노출).
- **삽입**: `auth.uid() = user_id`이고, “해당 클래스에 대한 완료/승인 예약 존재”는 애플리케이션 또는 DB 트리거로 검증.

### 2.5 `payments`, `ai_results`

- **payments**: 예약 소유자·관리자만 조회. 변경은 서버·PG 연동 로직에서만.
- **ai_results**: 본인(`user_id = auth.uid()`)만 조회/삽입하거나, 필요 시 관리자 정책 추가.

---

## 3. 데이터 정합성 요약 (PRD 반영)

1. **예약 생성 시 트랜잭션**  
   - `reservations` INSERT + `sessions.booked_count` UPDATE를 한 트랜잭션으로 처리.
2. **정원 초과 방지**  
   - 트랜잭션 내에서 `booked_count + head_count <= capacity` 검사 후 진행.
3. **Phase 확장**  
   - Phase 2에서 `reservation_status`, `studios.approval_mode`, `reviews`, `payments` 추가해도 기존 테이블 관계는 유지.

이 문서는 스키마·RLS의 “설계 요약”이며, 실제 DDL·정책 문은 Supabase SQL 에디터 또는 마이그레이션 레포에 별도로 두고, 변경 시 이 가이드와 동기화하는 것을 권장합니다.
