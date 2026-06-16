-- Stuti & Rushil — RSVP schema
-- Core principle: one guests row = one real person = counted once.
-- Counting is row-based, never submission-based. Every entry path resolves to a row.

create extension if not exists pg_trgm;
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- parties: the household / invite unit
-- ---------------------------------------------------------------------------
create table parties (
  id            uuid primary key default uuid_generate_v4(),
  invite_code   text unique,                       -- short human code (optional)
  magic_token   text unique not null,              -- long random; gates the session
  display_name  text,                              -- e.g. "The Sharma Family"
  max_party_size int not null default 8,
  allow_companions boolean not null default true,
  anchor_email  text,
  anchor_phone  text,                              -- E.164
  is_prelisted  boolean not null default false,    -- couple pre-loaded this household
  is_approved   boolean not null default true,     -- self-added parties start false
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- guests: ONE ROW PER REAL PERSON (the unit we count)
-- ---------------------------------------------------------------------------
create type age_band as enum ('adult', 'child', 'infant');
create type guest_source as enum ('prelisted', 'claimed', 'self_added', 'companion');
create type dedup_status as enum ('clean', 'candidate', 'merged');

create table guests (
  id                 uuid primary key default uuid_generate_v4(),
  party_id           uuid not null references parties(id) on delete cascade,
  full_name          text not null,
  name_normalized    text not null,                -- lower, trimmed, collapsed spaces
  age_band           age_band not null default 'adult',
  email              text,
  phone_e164         text,
  source             guest_source not null default 'self_added',
  dedup_status       dedup_status not null default 'clean',
  merged_into_guest_id uuid references guests(id),  -- soft-merge target (reversible)
  added_by_guest_id  uuid references guests(id),    -- provenance
  is_approved        boolean not null default true, -- self-added await moderation
  created_at         timestamptz not null default now()
);
create index guests_party_idx on guests(party_id);
create index guests_email_idx on guests(lower(email)) where email is not null;
create index guests_phone_idx on guests(phone_e164) where phone_e164 is not null;
create index guests_name_trgm_idx on guests using gin (name_normalized gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- events: the two days + sub-events (also drives the timeline content)
-- ---------------------------------------------------------------------------
create table events (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  day         int not null check (day in (1, 2)),
  starts_at   timestamptz,
  venue       text,                                -- null until revealed
  dress_code  text,
  sort_order  int not null default 0
);

-- party can RSVP only to events it is invited to (tiered invites)
create table party_event_invitations (
  party_id  uuid not null references parties(id) on delete cascade,
  event_id  uuid not null references events(id) on delete cascade,
  primary key (party_id, event_id)
);

-- ---------------------------------------------------------------------------
-- rsvp_responses: one row per (guest, event); UNIQUE = idempotent upsert target
-- ---------------------------------------------------------------------------
create type rsvp_status as enum ('pending', 'attending', 'declined');

create table rsvp_responses (
  id          uuid primary key default uuid_generate_v4(),
  guest_id    uuid not null references guests(id) on delete cascade,
  event_id    uuid not null references events(id) on delete cascade,
  status      rsvp_status not null default 'pending', -- declined = "will be missed"
  meal_choice text,
  notes       text,
  updated_at  timestamptz not null default now(),
  unique (guest_id, event_id)
);
create index rsvp_event_idx on rsvp_responses(event_id);

create table meal_options (
  id     uuid primary key default uuid_generate_v4(),
  label  text not null,
  sort_order int not null default 0
);

-- admin merge queue: fuzzy candidates, NEVER auto-merged
create table dedup_candidates (
  id          uuid primary key default uuid_generate_v4(),
  guest_a     uuid not null references guests(id) on delete cascade,
  guest_b     uuid not null references guests(id) on delete cascade,
  score       real not null,
  reason      text,
  resolution  text not null default 'open',        -- open | merged | rejected
  created_at  timestamptz not null default now()
);

create table audit_log (
  id         bigint generated always as identity primary key,
  at         timestamptz not null default now(),
  action     text not null,
  party_id   uuid,
  detail     jsonb
);

create table rate_limit_events (
  id        bigint generated always as identity primary key,
  ip_hash   text not null,
  at        timestamptz not null default now()
);
create index rate_limit_ip_idx on rate_limit_events(ip_hash, at);

-- ---------------------------------------------------------------------------
-- v_live_guests: the de-duplicated, approved population we count
-- ---------------------------------------------------------------------------
create view v_live_guests as
  select g.*
  from guests g
  where g.merged_into_guest_id is null
    and g.is_approved = true;

-- Headcount summary: unique people, per status, per age band.
create view v_headcount as
  select
    count(distinct r.guest_id) filter (where r.status = 'attending')          as attending_people,
    count(distinct r.guest_id) filter (where r.status = 'declined')           as declined_people,
    count(distinct g.id) filter (where g.age_band = 'adult')                  as adults_total,
    count(distinct g.id) filter (where g.age_band in ('child','infant'))      as kids_total
  from v_live_guests g
  left join rsvp_responses r on r.guest_id = g.id;

-- Per-event attending counts (adults vs kids), de-duplicated.
create view v_event_counts as
  select
    e.id, e.slug, e.name, e.day,
    count(*) filter (where r.status = 'attending' and g.age_band = 'adult')             as adults,
    count(*) filter (where r.status = 'attending' and g.age_band in ('child','infant')) as kids,
    count(*) filter (where r.status = 'declined')                                       as declined
  from events e
  left join rsvp_responses r on r.event_id = e.id
  left join v_live_guests g on g.id = r.guest_id
  group by e.id, e.slug, e.name, e.day
  order by e.sort_order;

-- ---------------------------------------------------------------------------
-- RLS: default-deny. All public access goes through SECURITY DEFINER RPCs
-- (server uses the service role, which bypasses RLS). No anon table reads.
-- ---------------------------------------------------------------------------
alter table parties enable row level security;
alter table guests enable row level security;
alter table events enable row level security;
alter table party_event_invitations enable row level security;
alter table rsvp_responses enable row level security;
alter table meal_options enable row level security;
alter table dedup_candidates enable row level security;
alter table audit_log enable row level security;
alter table rate_limit_events enable row level security;
-- (no policies created → anon/auth roles can read/write nothing)

-- Public read of events + meals only (safe, non-personal) via anon.
create policy events_public_read on events for select using (true);
create policy meals_public_read on meal_options for select using (true);

-- ---------------------------------------------------------------------------
-- Seed: events + meal options
-- ---------------------------------------------------------------------------
insert into events (slug, name, day, dress_code, sort_order) values
  ('mehndi-maenziraat', 'Mehndi · Maenziraat', 1, 'Marigold & mustard', 1),
  ('sangeet',           'Sangeet',             1, 'Jewel tones', 2),
  ('haldi',             'Haldi',               2, 'Sunshine yellow', 3),
  ('chooda-devgon',     'Chooda · Devgon',     2, 'Ivory & gold', 4),
  ('lagan-nethar',      'Lagan · Nethar',      2, 'Wedding finery', 5),
  ('reception',         'Reception',           2, 'Black-tie, desi twist', 6);

insert into meal_options (label, sort_order) values
  ('Vegetarian', 1), ('Non-vegetarian', 2), ('Jain', 3), ('No preference', 4);
