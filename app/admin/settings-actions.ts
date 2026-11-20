"use server"

import { randomUUID } from "node:crypto"

import { requireAdmin } from "@/lib/admin/auth"
import { errorsOf, failed, type SaveResult } from "@/lib/admin/results"
import { revalidateSite } from "@/lib/admin/revalidate"
import { DOCUMENTS_BUCKET } from "@/lib/documents"
import { PAGE_SCHEMAS, type PageKey } from "@/lib/page-content"
import { profileSchema, servicesSchema } from "@/lib/settings-content"

/*
 * Saving site settings. Like every action, reachable without the page around
 * it, so it checks the login first; Row Level Security checks it again.
 */

export async function saveServices(input: unknown): Promise<SaveResult> {
  const { supabase } = await requireAdmin()

  const parsed = servicesSchema.safeParse(input)
  if (!parsed.success) return failed("Some fields need attention before this can be saved.", errorsOf(parsed.error))

  const { error } = await supabase.from("settings").upsert({ key: "services", value: parsed.data }, { onConflict: "key" })
  if (error) return failed(`Supabase refused the save: ${error.message}`)

  revalidateSite()
  return { ok: true, slug: "services", savedAt: new Date().toISOString() }
}

/** One page's words, as edited under Pages. */
export async function savePage(key: PageKey, input: unknown): Promise<SaveResult> {
  const { supabase } = await requireAdmin()

  // An action can be called with anything, so the key is checked, not trusted
  if (!Object.hasOwn(PAGE_SCHEMAS, key)) return failed("There is no page by that name.")

  const parsed = PAGE_SCHEMAS[key].safeParse(input)
  if (!parsed.success) return failed("Some fields need attention before this can be saved.", errorsOf(parsed.error))

  const { error } = await supabase.from("settings").upsert({ key, value: parsed.data }, { onConflict: "key" })
  if (error) return failed(`Supabase refused the save: ${error.message}`)

  revalidateSite()
  return { ok: true, slug: key, savedAt: new Date().toISOString() }
}

/**
 * Lets the browser upload one resume straight to Supabase Storage, so the
 * file never passes through Vercel. The server picks the name - a new one
 * every time, so a cached copy of the old resume can never stand in for the
 * new one - and the signed URL works for that one path only.
 */
export async function signResumeUpload() {
  const { supabase } = await requireAdmin()

  const path = `resume/${new Date().toISOString().slice(0, 10)}-${randomUUID().slice(0, 8)}.pdf`
  const { data, error } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUploadUrl(path)
  if (error) throw new Error(`Supabase refused the upload: ${error.message}`)

  return { path: data.path, token: data.token }
}

export async function saveProfile(input: unknown): Promise<SaveResult> {
  const { supabase } = await requireAdmin()

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return failed("Some fields need attention before this can be saved.", errorsOf(parsed.error))
  const profile = parsed.data

  // The live link must never point at nothing, so the file has to be there first
  const storage = supabase.storage.from(DOCUMENTS_BUCKET)
  const { data: uploaded } = await storage.exists(profile.resume.path)
  if (!uploaded) return failed("The resume file isn't in storage. Upload it again.", { resume: "Upload the PDF again" })

  const { data: previous } = await supabase.from("settings").select("value").eq("key", "profile").maybeSingle()

  const { error } = await supabase.from("settings").upsert({ key: "profile", value: profile }, { onConflict: "key" })
  if (error) return failed(`Supabase refused the save: ${error.message}`)

  // The replaced resume is no longer linked from anywhere. Tidying it up is a
  // nicety: if it fails, the save has still succeeded.
  const previousPath = profileSchema.shape.resume.shape.path.safeParse(previous?.value?.resume?.path)
  if (previousPath.success && previousPath.data !== profile.resume.path) {
    await storage.remove([previousPath.data])
  }

  revalidateSite()
  return { ok: true, slug: "profile", savedAt: new Date().toISOString() }
}
