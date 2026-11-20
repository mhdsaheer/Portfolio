import { requireAdmin } from "@/lib/admin/auth"
import type { ServiceEntry } from "@/lib/settings-content"
import { ServicesEditor } from "@/components/admin/services-editor"

/** Read leniently, so a list that somehow fails its schema still opens to be fixed. */
function entriesFrom(value: unknown): ServiceEntry[] {
  if (!Array.isArray(value)) return []
  return value.map((entry) => ({
    title: typeof entry?.title === "string" ? entry.title : "",
    skills: Array.isArray(entry?.skills) ? entry.skills.filter((skill: unknown) => typeof skill === "string") : [],
  }))
}

export default async function ServicesAdmin() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("settings").select("value").eq("key", "services").maybeSingle()
  return <ServicesEditor initial={entriesFrom(data?.value)} />
}
