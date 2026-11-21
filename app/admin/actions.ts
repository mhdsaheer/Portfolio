"use server"

import { createHash } from "node:crypto"

import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/lib/admin/auth"
import { recordLoginAttempt } from "@/lib/admin/login-limit"
import { errorsOf, failed, type SaveResult } from "@/lib/admin/results"
import { revalidateSite } from "@/lib/admin/revalidate"
import { insightDocumentSchema } from "@/lib/insight-content"
import { STATUSES, editableSlug } from "@/lib/schema-fields"
import { createSessionClient } from "@/lib/supabase/server"

/*
 * Every action here is its own way in, reachable without the page around it,
 * so each one checks the login itself before doing anything.
 * Projects have their own actions in app/admin/project-actions.ts.
 */

const saveSchema = z.object({
  /** The slug the article was loaded with; null for a new one. */
  originalSlug: z.string().nullable(),
  slug: editableSlug,
  status: z.enum(STATUSES),
  publishedOn: z.iso.date("Pick a date"),
  updatedOn: z.preprocess((value) => (value === "" ? null : value), z.iso.date().nullable()),
  document: insightDocumentSchema,
})

export async function saveInsight(input: unknown): Promise<SaveResult> {
  const { supabase } = await requireAdmin()

  const parsed = saveSchema.safeParse(input)
  if (!parsed.success) {
    return failed("Some fields need attention before this can be saved.", errorsOf(parsed.error))
  }
  const { originalSlug, slug, status, publishedOn, updatedOn, document } = parsed.data

  // Related articles are picked by slug, so each must exist and not be this one
  if (document.related?.length) {
    const { data } = await supabase.from("insights").select("slug").in("slug", document.related)
    const known = new Set((data ?? []).map((row) => row.slug))
    const unknown = document.related.filter((related) => !known.has(related) || related === slug)
    if (unknown.length) {
      return failed("Some related articles can't be used.", {
        "document.related": `Not available: ${unknown.join(", ")}`,
      })
    }
  }

  const row = { slug, status, published_on: publishedOn, updated_on: updatedOn, document }

  if (originalSlug === null) {
    const { error } = await supabase.from("insights").insert(row)
    if (error?.code === "23505") return failed("That slug is taken.", { slug: "Another article already uses this slug" })
    if (error) return failed(`Supabase refused the save: ${error.message}`)
  } else {
    // A published article's address is already shared and indexed, so it stays put
    if (slug !== originalSlug) {
      const { data: current } = await supabase.from("insights").select("status").eq("slug", originalSlug).maybeSingle()
      if (current?.status === "published") {
        return failed("Published articles keep their address.", {
          slug: "Can't change the slug of a published article. Switch it to draft first, or keep the slug.",
        })
      }
    }

    const { data, error } = await supabase.from("insights").update(row).eq("slug", originalSlug).select("slug")
    if (error?.code === "23505") return failed("That slug is taken.", { slug: "Another article already uses this slug" })
    if (error) return failed(`Supabase refused the save: ${error.message}`)
    if (!data?.length) return failed("This article no longer exists. It may have been deleted in another tab.")
  }

  revalidateSite()
  return { ok: true, slug, savedAt: new Date().toISOString() }
}

export async function deleteInsight(slug: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from("insights").delete().eq("slug", slug)
  if (error) throw new Error(`Supabase refused the delete: ${error.message}`)

  revalidateSite()
  redirect("/admin")
}

/** The Cloudinary folders uploads may land in, one per kind of content. */
const UPLOAD_FOLDERS = ["insights", "case-studies", "work-files", "profile"] as const
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number]

/**
 * Lets the browser upload one image straight to Cloudinary, so the file never
 * passes through Vercel. The signature proves the upload was approved by a
 * logged-in admin, and only holds for that folder for about an hour.
 */
export async function signCloudinaryUpload(folder: UploadFolder) {
  await requireAdmin()
  if (!UPLOAD_FOLDERS.includes(folder)) throw new Error("Unknown upload folder")

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set the three CLOUDINARY variables (see .env.example).")
  }

  const timestamp = Math.round(Date.now() / 1000)
  const params = { folder: `saheer-portfolio/${folder}`, timestamp }

  // Cloudinary's scheme: the parameters sorted and joined, then the secret, hashed with SHA-1
  const toSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex")

  return { cloudName, apiKey, signature, ...params }
}

export type LoginState = { error?: string }

export async function signIn(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Enter your email and password." }

  const supabase = await createSessionClient()

  // Counted before the password is checked, and refused outright past the limit
  const attempt = await recordLoginAttempt(supabase, email)
  if (!attempt.ok) return { error: attempt.error }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "That email and password don't match." }

  // A valid login that isn't an admin gets nothing, not even a session
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle()
  if (!admin) {
    await supabase.auth.signOut()
    return { error: "This account doesn't have admin access." }
  }

  await attempt.clear()
  redirect("/admin")
}

export async function signOut() {
  const supabase = await createSessionClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
