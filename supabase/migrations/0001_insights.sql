-- Insights: one row per article.
--
-- Everything the page renders lives in `document`, checked by the schema in
-- lib/insight-content.ts whenever it is saved or read. The columns are what
-- the site filters and sorts by.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table public.insights (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_on date not null default current_date,
  updated_on date,
  document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index insights_listing_idx on public.insights (status, published_on desc, created_at desc);

-- Keeps updated_at honest without the app having to remember it
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger insights_touch_updated_at
before update on public.insights
for each row execute function public.touch_updated_at();

-- Who may write. A login alone is not enough: the user must also be listed here.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Security definer so the policies below can read `admins` without exposing it
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- What each role may attempt through the Data API. Granted here rather than
-- relying on the project's "grant API access to new tables" setting; Row Level
-- Security below then narrows it to the rows each role may actually touch.
grant select on public.insights to anon, authenticated;
grant insert, update, delete on public.insights to authenticated;
grant select on public.admins to authenticated;
-- The secret key, used only by scripts/seed-insights.ts on your machine
grant all on public.insights, public.admins to service_role;

-- Row Level Security: with it on, nothing is allowed unless a policy says so.
alter table public.insights enable row level security;
alter table public.admins enable row level security;

create policy "Anyone can read published insights"
on public.insights for select to anon, authenticated
using (status = 'published');

create policy "Admins can read every insight"
on public.insights for select to authenticated
using ((select public.is_admin()));

create policy "Admins can add insights"
on public.insights for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins can edit insights"
on public.insights for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete insights"
on public.insights for delete to authenticated
using ((select public.is_admin()));

-- Lets the app check whether the logged-in user is an admin, and nothing more
create policy "Users can see their own admin row"
on public.admins for select to authenticated
using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- After creating your login (Authentication -> Users -> Add user), make it an
-- admin by running this with your own email address:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com';
-- ---------------------------------------------------------------------------
