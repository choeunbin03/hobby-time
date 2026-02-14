-- =========================================================
-- HobbyTime - RLS: classes
-- =========================================================

alter table public.classes enable row level security;

drop policy if exists "classes_select_public" on public.classes;
create policy "classes_select_public"
on public.classes for select
using (is_published = true);

drop policy if exists "classes_insert_member_or_admin" on public.classes;
create policy "classes_insert_member_or_admin"
on public.classes for insert
with check (
  public.is_admin()
  or public.is_studio_member(studio_id)
);

drop policy if exists "classes_update_member_or_admin" on public.classes;
create policy "classes_update_member_or_admin"
on public.classes for update
using (public.is_admin() or public.is_studio_member(studio_id))
with check (public.is_admin() or public.is_studio_member(studio_id));

drop policy if exists "classes_delete_member_or_admin" on public.classes;
create policy "classes_delete_member_or_admin"
on public.classes for delete
using (public.is_admin() or public.is_studio_member(studio_id));
