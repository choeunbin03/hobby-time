-- =========================================================
-- HobbyTime - View for UI (derived session_date/start_time)
-- =========================================================
-- NOTE: timezone is fixed to Asia/Seoul for UI convenience.
-- If you want to keep everything UTC in UI, change this view.
-- ---------------------------------------------------------

create or replace view public.class_sessions_ui as
select
  cs.id,
  cs.class_id,
  cs.start_at,
  (cs.start_at at time zone 'Asia/Seoul')::date as session_date,
  (cs.start_at at time zone 'Asia/Seoul')::time as start_time,
  cs.capacity,
  cs.booked_count,
  (cs.capacity - cs.booked_count) as available_seats,
  cs.status,
  cs.created_at,
  cs.updated_at
from public.class_sessions cs;
