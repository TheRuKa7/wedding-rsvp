-- 15 submissions / 10 min / IP (hashed IP).
create or replace function check_rate_limit(p_ip_hash text) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  delete from rate_limit_events where at < now() - interval '1 hour';
  select count(*) into v_count from rate_limit_events
    where ip_hash = p_ip_hash and at > now() - interval '10 minutes';
  if v_count >= 15 then
    return false;
  end if;
  insert into rate_limit_events(ip_hash) values (p_ip_hash);
  return true;
end;
$$;
