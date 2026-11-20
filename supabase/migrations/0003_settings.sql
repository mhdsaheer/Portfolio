-- Settings: site-wide content that isn't an article or a project, one value
-- per key - the About page's services first, contact details later.
--
-- Each value is checked by its schema in lib/settings-content.ts. Everything
-- here is readable by anyone, so nothing secret goes in this table.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table public.settings (
  key text primary key check (key ~ '^[a-z][a-z0-9-]*$'),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- touch_updated_at() comes from 0001_insights.sql
create trigger settings_touch_updated_at
before update on public.settings
for each row execute function public.touch_updated_at();

grant select on public.settings to anon, authenticated;
grant insert, update, delete on public.settings to authenticated;
-- The secret key, used only by scripts/seed-settings.ts on your machine
grant all on public.settings to service_role;

alter table public.settings enable row level security;

create policy "Anyone can read settings"
on public.settings for select to anon, authenticated
using (true);

-- is_admin() comes from 0001_insights.sql: a login listed in public.admins
create policy "Admins can add settings"
on public.settings for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins can edit settings"
on public.settings for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete settings"
on public.settings for delete to authenticated
using ((select public.is_admin()));
