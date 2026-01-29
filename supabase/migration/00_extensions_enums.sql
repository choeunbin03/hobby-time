-- =========================================================
-- HobbyTime - Extensions & Enums
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- Enums
-- ---------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'studio_membership_role') then
    create type public.studio_membership_role as enum ('OWNER', 'MEMBER');
  end if;

  if not exists (select 1 from pg_type where typname = 'reservation_status') then
    create type public.reservation_status as enum ('CONFIRMED', 'PENDING', 'APPROVED', 'CANCELLED');
  end if;

  if not exists (select 1 from pg_type where typname = 'session_status') then
    create type public.session_status as enum ('SCHEDULED', 'CANCELLED');
  end if;
end $$;
