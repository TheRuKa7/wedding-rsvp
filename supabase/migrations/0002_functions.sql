-- RSVP functions. Counting is row-based; dedup is anchor-gated with conflict vetoes.

create or replace function normalize_name(p text) returns text
  language sql immutable as $$
  select lower(trim(regexp_replace(coalesce(p, ''), '\s+', ' ', 'g')))
$$;

create or replace function find_or_create_guest(
  p_party uuid, p_name text, p_email text, p_phone text,
  p_age age_band, p_source guest_source, p_added_by uuid, p_approved boolean
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_norm  text := normalize_name(p_name);
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
  v_phone text := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), '');
  v_match uuid;
  v_cand  record;
begin
  if v_email is not null then
    select id into v_match from guests
      where merged_into_guest_id is null and lower(email) = v_email
        and (v_phone is null or phone_e164 is null or phone_e164 = v_phone)
      limit 1;
  end if;
  if v_match is null and v_phone is not null then
    select id into v_match from guests
      where merged_into_guest_id is null and phone_e164 = v_phone
        and (v_email is null or email is null or lower(email) = v_email)
      limit 1;
  end if;
  if v_match is null then
    select id into v_match from guests
      where merged_into_guest_id is null and party_id = p_party and name_normalized = v_norm
        and (v_email is null or email is null or lower(email) = v_email)
        and (v_phone is null or phone_e164 is null or phone_e164 = v_phone)
      limit 1;
  end if;

  if v_match is not null then
    update guests set email = coalesce(email, v_email), phone_e164 = coalesce(phone_e164, v_phone)
      where id = v_match;
    return v_match;
  end if;

  insert into guests(party_id, full_name, name_normalized, age_band, email, phone_e164, source, added_by_guest_id, is_approved)
  values (p_party, trim(p_name), v_norm, p_age, v_email, v_phone, p_source, p_added_by, p_approved)
  returning id into v_match;

  for v_cand in
    select id, similarity(name_normalized, v_norm) as sim from guests
      where id <> v_match and merged_into_guest_id is null
        and name_normalized % v_norm and similarity(name_normalized, v_norm) > 0.6
  loop
    insert into dedup_candidates(guest_a, guest_b, score, reason)
      values (v_match, v_cand.id, v_cand.sim, 'fuzzy name match');
    update guests set dedup_status = 'candidate'
      where id in (v_match, v_cand.id) and dedup_status <> 'merged';
  end loop;

  return v_match;
end;
$$;

create or replace function submit_rsvp(payload jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_token     text := nullif(payload->>'token', '');
  v_attending boolean := coalesce((payload->>'attending')::boolean, false);
  v_meal      text := nullif(payload->>'meal', '');
  v_notes     text := nullif(payload->>'notes', '');
  v_party uuid; v_party_token text; v_prelisted boolean := false; v_approved boolean := true;
  v_primary uuid; v_guest_ids uuid[]; v_gid uuid; v_comp jsonb; v_evt text; v_event_id uuid;
begin
  if v_token is not null then
    select id, magic_token, is_prelisted, is_approved
      into v_party, v_party_token, v_prelisted, v_approved
      from parties where magic_token = v_token;
  end if;

  if v_party is null then
    insert into parties(magic_token, display_name, is_prelisted, is_approved)
      values (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
              payload#>>'{primary,name}', false, false)
      returning id, magic_token into v_party, v_party_token;
    v_approved := false;
  end if;

  v_primary := find_or_create_guest(
    v_party, payload#>>'{primary,name}', payload#>>'{primary,email}', payload#>>'{primary,phone}',
    coalesce((payload#>>'{primary,age_band}')::age_band, 'adult'::age_band),
    (case when v_prelisted then 'claimed' else 'self_added' end)::guest_source, null::uuid, v_approved);
  v_guest_ids := array[v_primary];

  for v_comp in select * from jsonb_array_elements(coalesce(payload->'companions', '[]'::jsonb)) loop
    if coalesce(trim(v_comp->>'name'), '') <> '' then
      v_gid := find_or_create_guest(v_party, v_comp->>'name', v_comp->>'email', v_comp->>'phone',
        coalesce((v_comp->>'age_band')::age_band, 'adult'::age_band),
        'companion'::guest_source, v_primary, v_approved);
      v_guest_ids := array_append(v_guest_ids, v_gid);
    end if;
  end loop;

  if v_attending then
    for v_evt in select value from jsonb_array_elements_text(coalesce(payload->'events', '[]'::jsonb)) loop
      select id into v_event_id from events where slug = v_evt;
      if v_event_id is not null then
        foreach v_gid in array v_guest_ids loop
          insert into rsvp_responses(guest_id, event_id, status, meal_choice, notes)
            values (v_gid, v_event_id, 'attending', v_meal, v_notes)
          on conflict (guest_id, event_id) do update
            set status = 'attending', meal_choice = excluded.meal_choice, notes = excluded.notes, updated_at = now();
        end loop;
      end if;
    end loop;
  else
    for v_event_id in select id from events loop
      foreach v_gid in array v_guest_ids loop
        insert into rsvp_responses(guest_id, event_id, status, notes)
          values (v_gid, v_event_id, 'declined', v_notes)
        on conflict (guest_id, event_id) do update
          set status = 'declined', notes = excluded.notes, updated_at = now();
      end loop;
    end loop;
  end if;

  insert into audit_log(action, party_id, detail)
    values ('submit_rsvp', v_party,
      jsonb_build_object('attending', v_attending, 'guests', array_length(v_guest_ids, 1), 'approved', v_approved));

  return jsonb_build_object('ok', true, 'party_id', v_party, 'token', v_party_token,
    'attending', v_attending, 'guest_count', array_length(v_guest_ids, 1), 'approved', v_approved);
end;
$$;

create or replace function get_party_by_token(p_token text)
returns jsonb language sql security definer set search_path = public as $$
  select case when p.id is null then null else jsonb_build_object(
    'party_id', p.id, 'display_name', p.display_name,
    'allow_companions', p.allow_companions, 'max_party_size', p.max_party_size,
    'guests', coalesce((select jsonb_agg(jsonb_build_object('id', g.id, 'name', g.full_name, 'age_band', g.age_band) order by g.created_at)
                        from guests g where g.party_id = p.id and g.merged_into_guest_id is null), '[]'::jsonb)
  ) end
  from parties p where p.magic_token = p_token;
$$;
