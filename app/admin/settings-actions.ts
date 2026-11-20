"use server"

import { requireAdmin } from "@/lib/admin/auth"
import { errorsOf, failed, type SaveResult } from "@/lib/admin/results"
import { revalidateSite } from "@/lib/admin/revalidate"
import { servicesSchema } from "@/lib/settings-content"

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
