-- =========================================================
-- HobbyTime - studio_memberships
-- =========================================================

create table if not exists public.studio_memberships (
  studio_id uuid not null references public.studios(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.studio_membership_role not null,
  created_at timestamptz not null default now(),
  primary key (studio_id, user_id)
);

create index if not exists idx_studio_memberships_user_id on public.studio_memberships(user_id);
