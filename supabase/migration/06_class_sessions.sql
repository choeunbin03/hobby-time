-- =========================================================
-- HobbyTime - class_sessions (source of truth: start_at)
-- =========================================================

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  start_at timestamptz not null,          -- source of truth
  capacity integer not null,
  booked_count integer not null default 0,
  status public.session_status not null default 'SCHEDULED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_sessions_capacity_non_negative check (capacity >= 0),
  constraint class_sessions_booked_count_valid check (booked_count >= 0 and booked_count <= capacity),
  constraint class_sessions_unique_per_class_time unique (class_id, start_at)
);

create index if not exists idx_class_sessions_class_id on public.class_sessions(class_id);
create index if not exists idx_class_sessions_start_at on public.class_sessions(start_at);

drop trigger if exists trg_class_sessions_updated_at on public.class_sessions;
create trigger trg_class_sessions_updated_at
before update on public.class_sessions
for each row execute function public.set_updated_at();
