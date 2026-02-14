-- =========================================================
-- HobbyTime - reservations (includes minimal snapshots + cancellation fields)
-- =========================================================

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid not null references public.class_sessions(id) on delete restrict,
  head_count integer not null,
  status public.reservation_status not null default 'CONFIRMED',

  -- Minimal snapshots (MVP)
  class_name_snapshot text not null,
  studio_name_snapshot text not null,
  price_snapshot integer not null,

  cancelled_at timestamptz,
  cancel_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reservations_head_count_positive check (head_count > 0),
  constraint reservations_price_snapshot_non_negative check (price_snapshot >= 0),
  constraint reservations_cancel_fields_consistency check (
    (status = 'CANCELLED' and cancelled_at is not null) or
    (status <> 'CANCELLED' and cancelled_at is null)
  )
);

create index if not exists idx_reservations_user_id on public.reservations(user_id);
create index if not exists idx_reservations_session_id on public.reservations(session_id);
create index if not exists idx_reservations_status on public.reservations(status);
create index if not exists idx_reservations_created_at on public.reservations(created_at desc);

drop trigger if exists trg_reservations_updated_at on public.reservations;
create trigger trg_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Reservation integrity triggers:
-- - On INSERT: lock session row, check capacity, fill snapshots, increment booked_count
-- - On UPDATE: prevent changing immutable fields; on CANCELLED transition decrement booked_count
-- ---------------------------------------------------------
create or replace function public.handle_reservation_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  v_capacity int;
  v_booked int;
  v_status public.session_status;
  v_class_name text;
  v_studio_name text;
  v_price int;
begin
  -- Lock the session row to guarantee capacity consistency.
  select cs.capacity, cs.booked_count, cs.status
    into v_capacity, v_booked, v_status
  from public.class_sessions cs
  where cs.id = new.session_id
  for update;

  if not found then
    raise exception 'Invalid session_id: %', new.session_id;
  end if;

  if v_status <> 'SCHEDULED' then
    raise exception 'Session is not schedulable (status=%)', v_status;
  end if;

  if new.head_count is null or new.head_count <= 0 then
    raise exception 'head_count must be positive';
  end if;

  -- MVP: allow creating only CONFIRMED or PENDING (future)
  if new.status not in ('CONFIRMED', 'PENDING') then
    raise exception 'Invalid reservation status on create: %', new.status;
  end if;

  if (v_booked + new.head_count) > v_capacity then
    raise exception 'Not enough seats: capacity=%, booked=%, requested=%', v_capacity, v_booked, new.head_count;
  end if;

  -- Fill snapshots
  select c.name, s.name, c.price
    into v_class_name, v_studio_name, v_price
  from public.class_sessions cs
  join public.classes c on c.id = cs.class_id
  join public.studios s on s.id = c.studio_id
  where cs.id = new.session_id;

  if not found then
    raise exception 'Failed to resolve snapshots for session_id=%', new.session_id;
  end if;

  new.class_name_snapshot := v_class_name;
  new.studio_name_snapshot := v_studio_name;
  new.price_snapshot := v_price;

  -- Ensure cancellation fields are empty on create
  new.cancelled_at := null;

  -- Apply seat increment
  update public.class_sessions
    set booked_count = booked_count + new.head_count,
        updated_at = now()
  where id = new.session_id;

  return new;
end;
$$;

drop trigger if exists trg_reservations_before_insert on public.reservations;
create trigger trg_reservations_before_insert
before insert on public.reservations
for each row execute function public.handle_reservation_before_insert();

create or replace function public.handle_reservation_before_update()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  -- Immutable fields
  if new.user_id <> old.user_id then
    raise exception 'user_id is immutable';
  end if;

  if new.session_id <> old.session_id then
    raise exception 'session_id is immutable';
  end if;

  if new.head_count <> old.head_count then
    raise exception 'head_count is immutable (cancel and re-book instead)';
  end if;

  if new.class_name_snapshot <> old.class_name_snapshot
     or new.studio_name_snapshot <> old.studio_name_snapshot
     or new.price_snapshot <> old.price_snapshot then
    raise exception 'snapshot fields are immutable';
  end if;

  -- Cancellation transition: CONFIRMED/PENDING/APPROVED -> CANCELLED only once
  if old.status <> 'CANCELLED' and new.status = 'CANCELLED' then
    if new.cancelled_at is null then
      new.cancelled_at := now();
    end if;

    update public.class_sessions
      set booked_count = booked_count - old.head_count,
          updated_at = now()
    where id = old.session_id;

  elsif old.status = 'CANCELLED' and new.status <> 'CANCELLED' then
    raise exception 'cannot transition from CANCELLED to %', new.status;

  else
    -- For non-cancel updates, prevent setting cancelled_at
    if new.cancelled_at is not null then
      raise exception 'cancelled_at can only be set when status=CANCELLED';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_reservations_before_update on public.reservations;
create trigger trg_reservations_before_update
before update on public.reservations
for each row execute function public.handle_reservation_before_update();
