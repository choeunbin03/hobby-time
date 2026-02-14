-- =========================================================
-- HobbyTime - RLS: ai_results
-- =========================================================

alter table public.ai_results enable row level security;

drop policy if exists "ai_results_select_own_or_admin" on public.ai_results;
create policy "ai_results_select_own_or_admin"
on public.ai_results for select
using (
  public.is_admin()
  or user_id = auth.uid()
  or user_id is null -- allow anonymous results if needed
);

drop policy if exists "ai_results_insert_own_or_anonymous" on public.ai_results;
create policy "ai_results_insert_own_or_anonymous"
on public.ai_results for insert
with check (
  user_id is null
  or user_id = auth.uid()
);

-- (optional) prevent updates/deletes from clients; manage via server if needed

drop policy if exists "ai_results_update_admin_only" on public.ai_results;
create policy "ai_results_update_admin_only"
on public.ai_results for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "ai_results_delete_admin_only" on public.ai_results;
create policy "ai_results_delete_admin_only"
on public.ai_results for delete
using (public.is_admin());
