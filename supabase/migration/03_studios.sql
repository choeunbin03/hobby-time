-- =========================================================
-- HobbyTime - studios
-- =========================================================

create table if not exists public.studios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location_text text not null,     -- UI display text (e.g., "서울 강남")
  region_code text,                -- minimal filter/aggregation key (e.g., "SEOUL"), nullable
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint studios_region_code_format check (
    region_code is null or region_code ~ '^[A-Z][A-Z0-9_]*$'
  )
);

create index if not exists idx_studios_region_code on public.studios(region_code);
create index if not exists idx_studios_location_text on public.studios(location_text);

drop trigger if exists trg_studios_updated_at on public.studios;
create trigger trg_studios_updated_at
before update on public.studios
for each row execute function public.set_updated_at();
