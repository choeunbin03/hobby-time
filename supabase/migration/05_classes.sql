-- =========================================================
-- HobbyTime - classes
-- =========================================================

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios(id) on delete cascade,
  name text not null,
  category text not null,
  description text not null,
  price integer not null,                 -- KRW integer
  duration_minutes integer not null,
  cover_image_path text,                  -- Supabase Storage path (nullable, MVP soon)
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_price_non_negative check (price >= 0),
  constraint classes_duration_positive check (duration_minutes > 0)
);

create index if not exists idx_classes_studio_id on public.classes(studio_id);
create index if not exists idx_classes_category on public.classes(category);
create index if not exists idx_classes_created_at on public.classes(created_at desc);

drop trigger if exists trg_classes_updated_at on public.classes;
create trigger trg_classes_updated_at
before update on public.classes
for each row execute function public.set_updated_at();
