-- Create a stored procedure for atomic cancellation
create or replace function cancel_reservation(
  p_reservation_id uuid,
  p_user_id uuid
) returns boolean as $$
declare
  v_session_id uuid;
  v_head_count int;
  v_status public.reservation_status;
begin
  -- 1. Get reservation details and lock the row
  select session_id, head_count, status
  into v_session_id, v_head_count, v_status
  from public.reservations
  where id = p_reservation_id and user_id = p_user_id
  for update;

  if not found then
    raise exception 'Reservation not found or does not belong to user';
  end if;

  -- 2. Check if already cancelled
  if v_status = 'CANCELLED' then
    raise exception 'Reservation is already cancelled';
  end if;

  -- 3. Update Reservation Status
  update public.reservations
  set status = 'CANCELLED',
      cancelled_at = now(),
      updated_at = now()
  where id = p_reservation_id;

  -- 4. Restore Session Capacity
  update public.class_sessions
  set booked_count = booked_count - v_head_count,
      updated_at = now()
  where id = v_session_id;

  return true;
end;
$$ language plpgsql security definer;
