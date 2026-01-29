-- =========================================================
-- HobbyTime - Helper functions for RLS checks
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.is_studio_member(p_studio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.studio_memberships m
    where m.studio_id = p_studio_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_studio_owner(p_studio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.studio_memberships m
    where m.studio_id = p_studio_id
      and m.user_id = auth.uid()
      and m.role = 'OWNER'
  );
$$;

create or replace function public.is_session_studio_member(p_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.class_sessions cs
    join public.classes c on c.id = cs.class_id
    join public.studio_memberships m on m.studio_id = c.studio_id
    where cs.id = p_session_id
      and m.user_id = auth.uid()
  );
$$;
