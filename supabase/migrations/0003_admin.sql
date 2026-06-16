-- Admin: private config + secret-gated RPCs. Admin auth verifies against the DB
-- (no env var needed), so it works on any host without extra configuration.

create table if not exists app_config (key text primary key, value text not null);
alter table app_config enable row level security;

create or replace function assert_admin(p_secret text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select value from app_config where key = 'admin_secret') then
    raise exception 'unauthorized';
  end if;
end;
$$;

-- returns true if the supplied password matches the stored admin secret
create or replace function verify_admin_password(p_secret text) returns boolean
language sql security definer set search_path = public as $$
  select exists (select 1 from app_config where key = 'admin_secret' and value = p_secret);
$$;

create or replace function admin_summary(p_secret text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  perform assert_admin(p_secret);
  return jsonb_build_object(
    'headcount', (select to_jsonb(h) from v_headcount h),
    'events', (select coalesce(jsonb_agg(to_jsonb(e) order by e.day, e.name), '[]'::jsonb) from v_event_counts e),
    'queue_count', (select count(*) from dedup_candidates where resolution = 'open'),
    'pending_parties', (select count(*) from parties where is_approved = false),
    'total_live_guests', (select count(*) from v_live_guests)
  );
end;
$$;

create or replace function admin_guests(p_secret text)
returns table(guest text, age_band text, party text, email text, phone text, source text,
              status text, is_approved boolean, dedup_status text)
language plpgsql security definer set search_path = public as $$
begin
  perform assert_admin(p_secret);
  return query
    select g.full_name, g.age_band::text, coalesce(p.display_name, left(p.magic_token, 8)),
           g.email, g.phone_e164, g.source::text,
           coalesce((select string_agg(distinct r.status::text, ',') from rsvp_responses r where r.guest_id = g.id), 'pending'),
           g.is_approved, g.dedup_status::text
    from guests g join parties p on p.id = g.party_id
    where g.merged_into_guest_id is null
    order by p.display_name nulls last, g.created_at;
end;
$$;

create or replace function admin_dedup_queue(p_secret text)
returns table(candidate_id uuid, score real, reason text,
              a_id uuid, a_name text, a_email text, a_phone text, a_party text,
              b_id uuid, b_name text, b_email text, b_phone text, b_party text)
language plpgsql security definer set search_path = public as $$
begin
  perform assert_admin(p_secret);
  return query
    select c.id, c.score, c.reason,
           ga.id, ga.full_name, ga.email, ga.phone_e164, pa.display_name,
           gb.id, gb.full_name, gb.email, gb.phone_e164, pb.display_name
    from dedup_candidates c
    join guests ga on ga.id = c.guest_a join parties pa on pa.id = ga.party_id
    join guests gb on gb.id = c.guest_b join parties pb on pb.id = gb.party_id
    where c.resolution = 'open'
    order by c.score desc;
end;
$$;

create or replace function admin_merge(p_secret text, p_keep uuid, p_merge uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform assert_admin(p_secret);
  update guests set merged_into_guest_id = p_keep, dedup_status = 'merged' where id = p_merge;
  update rsvp_responses r set guest_id = p_keep where guest_id = p_merge
    and not exists (select 1 from rsvp_responses x where x.guest_id = p_keep and x.event_id = r.event_id);
  delete from rsvp_responses where guest_id = p_merge;
  update dedup_candidates set resolution = 'merged' where (guest_a = p_merge or guest_b = p_merge) and resolution = 'open';
  insert into audit_log(action, detail) values ('admin_merge', jsonb_build_object('keep', p_keep, 'merge', p_merge));
end;
$$;

create or replace function admin_reject_candidate(p_secret text, p_candidate uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform assert_admin(p_secret);
  update dedup_candidates set resolution = 'rejected' where id = p_candidate;
  update guests g set dedup_status = 'clean'
    where g.id in (select guest_a from dedup_candidates where id = p_candidate
                   union select guest_b from dedup_candidates where id = p_candidate)
      and g.dedup_status = 'candidate'
      and not exists (select 1 from dedup_candidates d where d.resolution = 'open'
                      and (d.guest_a = g.id or d.guest_b = g.id));
end;
$$;

create or replace function admin_approve_party(p_secret text, p_party uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform assert_admin(p_secret);
  update parties set is_approved = true where id = p_party;
  update guests set is_approved = true where party_id = p_party;
end;
$$;
