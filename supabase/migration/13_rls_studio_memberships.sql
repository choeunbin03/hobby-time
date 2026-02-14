-- =========================================================
-- HobbyTime - RLS: studio_memberships
-- =========================================================

alter table public.studio_memberships enable row level security;

drop policy if exists "studio_memberships_select_self_or_admin" on public.studio_memberships;
create policy "studio_memberships_select_self_or_admin"
on public.studio_memberships for select
using (public.is_admin() or user_id = auth.uid() or public.is_studio_owner(studio_id));

-- Owner can add members; user can add self as OWNER if they created the studio

drop policy if exists "studio_memberships_insert_owner" on public.studio_memberships;
create policy "studio_memberships_insert_owner"
on public.studio_memberships for insert
with check (
  public.is_admin()
  or (
    user_id = auth.uid()
    and role = 'OWNER'
    and exists (
      select 1 from public.studios s
      where s.id = studio_id
        and s.created_by = auth.uid()
    )
  )
  or (
    public.is_studio_owner(studio_id)
    and user_id is not null
  )
);

drop policy if exists "studio_memberships_update_owner_or_admin" on public.studio_memberships;
create policy "studio_memberships_update_owner_or_admin"
on public.studio_memberships for update
using (public.is_admin() or public.is_studio_owner(studio_id))
with check (public.is_admin() or public.is_studio_owner(studio_id));

drop policy if exists "studio_memberships_delete_owner_or_admin" on public.studio_memberships;
create policy "studio_memberships_delete_owner_or_admin"
on public.studio_memberships for delete
using (public.is_admin() or public.is_studio_owner(studio_id));
