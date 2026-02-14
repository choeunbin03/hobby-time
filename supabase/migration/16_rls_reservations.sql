-- =========================================================
-- HobbyTime - RLS: reservations
-- =========================================================

alter table public.reservations enable row level security;

drop policy if exists "reservations_select_own_or_admin_or_studio" on public.reservations;
create policy "reservations_select_own_or_admin_or_studio"
on public.reservations for select
using (
  auth.uid() = user_id
  or public.is_admin()
  or public.is_session_studio_member(session_id)
);

drop policy if exists "reservations_insert_own" on public.reservations;
create policy "reservations_insert_own"
on public.reservations for insert
with check (auth.uid() = user_id);

drop policy if exists "reservations_update_own_or_admin_or_studio" on public.reservations;
create policy "reservations_update_own_or_admin_or_studio"
on public.reservations for update
using (
  auth.uid() = user_id
  or public.is_admin()
  or public.is_session_studio_member(session_id)
)
with check (
  auth.uid() = user_id
  or public.is_admin()
  or public.is_session_studio_member(session_id)
);
