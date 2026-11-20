-- Documents: files that aren't images - for now, the resume PDF. Images stay
-- on Cloudinary; free Cloudinary won't deliver PDFs, so they live here.
--
-- The bucket is public: anyone with a file's address can read it, the way
-- anyone can download the resume from the site. Only an admin can add or
-- remove files. Which file is the current resume is the `profile` setting
-- (lib/settings-content.ts); the site serves it at /muhammed-saheer-resume.pdf.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 10485760, array['application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- is_admin() comes from 0001_insights.sql: a login listed in public.admins.
-- Uploads go through a signed upload URL, which needs insert; removing an old
-- file needs select and delete. Public reads need no policy.
create policy "Admins can add documents"
on storage.objects for insert to authenticated
with check (bucket_id = 'documents' and (select public.is_admin()));

create policy "Admins can see documents"
on storage.objects for select to authenticated
using (bucket_id = 'documents' and (select public.is_admin()));

create policy "Admins can remove documents"
on storage.objects for delete to authenticated
using (bucket_id = 'documents' and (select public.is_admin()));
