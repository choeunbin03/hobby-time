-- HobbyTime - Common Code Tables (reference schema)
-- NOTE: This file documents the shared code tables used by seed data.

create table if not exists public.common_code_master (
  id uuid primary key,
  code text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint common_code_master_code_format check (code ~ '^BH_[A-Z0-9_]+$')
);

create table if not exists public.common_code_detail (
  id uuid primary key,
  master_id uuid not null references public.common_code_master(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint common_code_detail_unique unique (master_id, code)
);
