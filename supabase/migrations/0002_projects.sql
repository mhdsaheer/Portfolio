-- Projects: case studies (the write-ups at /work/[slug]) and work files
-- (pieces that open straight from the /work index).
--
-- Same shape and rules as insights (0001_insights.sql): the page's content
-- lives in `document`, checked by lib/project-content.ts; `position` is the
-- order on the site, lowest first; visitors read published rows, admins write.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table public.case_studies (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  position integer not null default 0,
  document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_files (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  position integer not null default 0,
  document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index case_studies_listing_idx on public.case_studies (status, position);
create index work_files_listing_idx on public.work_files (status, position);

-- touch_updated_at() comes from 0001_insights.sql
create trigger case_studies_touch_updated_at
before update on public.case_studies
for each row execute function public.touch_updated_at();

create trigger work_files_touch_updated_at
before update on public.work_files
for each row execute function public.touch_updated_at();

-- What each role may attempt; Row Level Security below narrows it to rows
grant select on public.case_studies, public.work_files to anon, authenticated;
grant insert, update, delete on public.case_studies, public.work_files to authenticated;
-- The secret key, used only by scripts/seed-projects.ts on your machine
grant all on public.case_studies, public.work_files to service_role;

alter table public.case_studies enable row level security;
alter table public.work_files enable row level security;

-- is_admin() comes from 0001_insights.sql: a login listed in public.admins
create policy "Anyone can read published case studies"
on public.case_studies for select to anon, authenticated
using (status = 'published');

create policy "Admins can read every case study"
on public.case_studies for select to authenticated
using ((select public.is_admin()));

create policy "Admins can add case studies"
on public.case_studies for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins can edit case studies"
on public.case_studies for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete case studies"
on public.case_studies for delete to authenticated
using ((select public.is_admin()));

create policy "Anyone can read published work files"
on public.work_files for select to anon, authenticated
using (status = 'published');

create policy "Admins can read every work file"
on public.work_files for select to authenticated
using ((select public.is_admin()));

create policy "Admins can add work files"
on public.work_files for insert to authenticated
with check ((select public.is_admin()));

create policy "Admins can edit work files"
on public.work_files for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete work files"
on public.work_files for delete to authenticated
using ((select public.is_admin()));
