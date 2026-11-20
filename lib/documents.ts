/**
 * Files that aren't images live in Supabase Storage, in one public bucket
 * (supabase/migrations/0004_documents.sql). Nothing here is secret: the
 * project URL is public, and so is every file in the bucket.
 */

export const DOCUMENTS_BUCKET = "documents"

/** Uploaded resumes are named by the server, so a stored path always looks like this. */
export const RESUME_PATH_PATTERN = /^resume\/[a-z0-9-]+\.pdf$/

/** Supabase caps the bucket at 10 MB; a resume is rarely a tenth of that. */
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

/** A stored file's public address. */
export function documentUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${DOCUMENTS_BUCKET}/${path}`
}
