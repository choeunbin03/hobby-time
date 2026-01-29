-- =========================================================
-- HobbyTime - RLS: class_sessions
-- =========================================================

alter table public.class_sessions enable row level security;

drop policy if exists "class_sessions_select_public" on public.class_sessions;
create policy "class_sessions_select_public"
on public.class_sessions for select
using (true);

drop policy if exists "class_sessions_insert_member_or_admin" on public.class_sessions;
create policy "class_sessions_insert_member_or_admin"
on public.class_sessions for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.classes c
    where c.id = class_id
      and public.is_studio_member(c.studio_id)
  )
);

drop policy if exists "class_sessions_update_member_or_admin" on public.class_sessions;
create policy "class_sessions_update_member_or_admin"
on public.class_sessions for update
using (
  public.is_admin()
  or exists (
    select 1
    from public.classes c
    where c.id = class_id
      and public.is_studio_member(c.studio_id)
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.classes c
    where c.id = class_id
      and public.is_studio_member(c.studio_id)
  )
);

drop policy if exists "class_sessions_delete_member_or_admin" on public.class_sessions;
create policy "class_sessions_delete_member_or_admin"
on public.class_sessions for delete
using (
  public.is_admin()
  or exists (
    select 1
    from public.classes c
    where c.id = class_id
      and public.is_studio_member(c.studio_id)
  )
);
