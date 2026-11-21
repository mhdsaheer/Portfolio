-- Login attempts: the rate limit on the admin sign-in (app/admin/actions.ts).
--
-- Each sign-in attempt is written here before the password is checked, and a
-- successful sign-in clears its own record, so what stays is failed attempts.
-- They are counted over the last 15 minutes. Once any limit below is reached,
-- the form refuses to check passwords until enough of those attempts age out:
--
--   5 from one IP address       one machine guessing
--   10 against one email        guessing spread over many addresses
--   100 across the whole site   a ceiling, so the table stays small whatever happens
--
-- Addresses and emails are stored as SHA-256 hashes (lib/admin/login-limit.ts),
-- and no row outlives the 15 minutes it counts for.
--
-- Locked yourself out? Clear the record here in the SQL Editor:
--   delete from public.login_attempts;
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table public.login_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  email_hash text not null,
  created_at timestamptz not null default now()
);

create index login_attempts_ip_idx on public.login_attempts (ip_hash, created_at);
create index login_attempts_email_idx on public.login_attempts (email_hash, created_at);
create index login_attempts_created_idx on public.login_attempts (created_at);

-- No role touches the table directly; only the two functions below do, running
-- as its owner. Row Level Security with no policies keeps the Data API out.
revoke all on public.login_attempts from anon, authenticated;
alter table public.login_attempts enable row level security;

-- Counts one attempt, unless a limit is already reached. Returns 0 when the
-- password may be checked, otherwise how many seconds until it may be tried.
--
-- It runs before anyone is signed in, so the publishable key can call it. A
-- direct caller can only use up allowances - which failing to sign in through
-- the form does too - and the 100 ceiling stops them growing the table.
create function public.login_attempt(hashed_ip text, hashed_email text)
returns integer
language plpgsql security definer set search_path = '' as $$
declare
  per_address constant integer := 5;
  per_email constant integer := 10;
  per_site constant integer := 100;
  span constant interval := interval '15 minutes';
  blocked_until timestamptz;
begin
  -- One attempt at a time, so a burst of requests can't all slip under a limit together
  perform pg_advisory_xact_lock(hashtext('public.login_attempts'));

  delete from public.login_attempts where created_at <= now() - span;

  -- For each limit that is full: when its oldest counted attempt ages out
  select max(frees_at) into blocked_until from (
    (select created_at + span as frees_at from public.login_attempts
      where ip_hash = hashed_ip order by created_at desc offset per_address - 1 limit 1)
    union all
    (select created_at + span from public.login_attempts
      where email_hash = hashed_email order by created_at desc offset per_email - 1 limit 1)
    union all
    (select created_at + span from public.login_attempts
      order by created_at desc offset per_site - 1 limit 1)
  ) as full_limits;

  if blocked_until is not null then
    return greatest(1, ceil(extract(epoch from blocked_until - now())))::integer;
  end if;

  insert into public.login_attempts (ip_hash, email_hash) values (hashed_ip, hashed_email);
  return 0;
end;
$$;

-- After a successful sign-in, forgets that address's attempts on that email, so
-- a few typos before getting it right don't count. Admins only: anyone else
-- could use it to wipe their own record and keep guessing.
create function public.clear_login_attempts(hashed_ip text, hashed_email text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Only an admin can clear login attempts' using errcode = '42501';
  end if;

  delete from public.login_attempts where ip_hash = hashed_ip and email_hash = hashed_email;
end;
$$;

revoke execute on function public.login_attempt(text, text) from public;
grant execute on function public.login_attempt(text, text) to anon, authenticated;

revoke execute on function public.clear_login_attempts(text, text) from public, anon;
grant execute on function public.clear_login_attempts(text, text) to authenticated;
