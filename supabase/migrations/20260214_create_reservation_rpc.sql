-- Create a stored procedure for atomic reservation
create or replace function create_reservation(
  p_user_id uuid,
  p_session_id uuid,
  p_head_count int
) returns uuid as $$
declare
  v_reservation_id uuid;
  v_class_id uuid;
  v_valid_session boolean;
  v_current_booked int;
  v_capacity int;
  v_class_name text;
  v_studio_name text;
  v_price numeric;
begin
  -- 1. Lock the session row to prevent race conditions
  select class_id, booked_count, capacity
  into v_class_id, v_current_booked, v_capacity
  from public.class_sessions
  where id = p_session_id
  for update; -- Lock this row

  if not found then
    raise exception 'Session not found';
  end if;

  -- 2. Check capacity
  if (v_current_booked + p_head_count) > v_capacity then
    raise exception 'Capacity exceeded';
  end if;

  -- 3. Get Snapshots for Reservation (Class Name, Studio Name, Price)
  -- This ensures historical data integrity even if class/studio changes later
  select c.name, s.name, c.price
  into v_class_name, v_studio_name, v_price
  from public.classes c
  join public.studios s on c.studio_id = s.id
  where c.id = v_class_id;

  -- 4. Insert Reservation
  insert into public.reservations (
    user_id,
    session_id,
    head_count,
    status,
    class_name_snapshot,
    studio_name_snapshot,
    price_snapshot
  ) values (
    p_user_id,
    p_session_id,
    p_head_count,
    'CONFIRMED', -- Default status for Phase 1
    v_class_name,
    v_studio_name,
    v_price * p_head_count -- Total price snapshot
  ) returning id into v_reservation_id;

  -- 5. Update Session Booked Count
  update public.class_sessions
  set booked_count = booked_count + p_head_count,
      updated_at = now()
  where id = p_session_id;

  return v_reservation_id;
end;
$$ language plpgsql;
