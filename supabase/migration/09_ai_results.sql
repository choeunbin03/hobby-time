-- =========================================================
-- HobbyTime - ai_results (Phase 1: store input/output)
-- =========================================================

create table if not exists public.ai_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  input_text text not null,
  output_text text not null,
  context_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_results_user_id on public.ai_results(user_id);
create index if not exists idx_ai_results_reference_id on public.ai_results(reference_id);
