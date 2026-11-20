import "server-only"

import { redirect } from "next/navigation"
import { cache } from "react"

import { createSessionClient } from "@/lib/supabase/server"

/**
 * The logged-in admin, or null. A login alone is not enough: the user must
 * also be listed in the `admins` table, the same rule Row Level Security
 * applies to every write.
 *
 * `getClaims()` verifies the session token rather than trusting the cookie.
 */
export const getAdmin = cache(async () => {
  const supabase = await createSessionClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub
  if (!userId) return null

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle()
  if (!admin) return null

  return { supabase, userId, email: typeof data.claims.email === "string" ? data.claims.email : undefined }
})

/**
 * Every admin page and every admin action calls this first. A page's check
 * does not cover the actions on it - each action is its own way in.
 */
export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}
