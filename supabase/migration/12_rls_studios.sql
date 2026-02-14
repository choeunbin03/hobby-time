-- =========================================================
-- HobbyTime - RLS: studios
-- =========================================================

alter table public.studios enable row level security;

drop policy if exists "studios_select_public" on public.studios;
create policy "studios_select_public"
on public.studios for select
using (true);

drop policy if exists "studios_insert_authenticated" on public.studios;
create policy "studios_insert_authenticated"
on public.studios for insert
with check (auth.uid() = created_by);

drop policy if exists "studios_update_owner_or_admin" on public.studios;
create policy "studios_update_owner_or_admin"
on public.studios for update
using (public.is_admin() or public.is_studio_owner(id) or created_by = auth.uid())
with check (public.is_admin() or public.is_studio_owner(id) or created_by = auth.uid());

drop policy if exists "studios_delete_owner_or_admin" on public.studios;
create policy "studios_delete_owner_or_admin"
on public.studios for delete
using (public.is_admin() or public.is_studio_owner(id) or created_by = auth.uid());
