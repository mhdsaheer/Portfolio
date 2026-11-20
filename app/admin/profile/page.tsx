import { requireAdmin } from "@/lib/admin/auth"
import { DEFAULT_PORTRAIT, profileSchema, type ProfileDraft } from "@/lib/settings-content"
import { ProfileEditor } from "@/components/admin/profile-editor"

/** Read leniently, so a profile that somehow fails its schema still opens to be fixed. */
function profileFrom(value: unknown): ProfileDraft {
  const stored = (value ?? {}) as { photo?: { src?: unknown; alt?: unknown }; portrait?: { src?: unknown }; resume?: unknown }
  const resume = profileSchema.shape.resume.safeParse(stored.resume)
  return {
    photo: {
      src: typeof stored.photo?.src === "string" ? stored.photo.src : "",
      alt: typeof stored.photo?.alt === "string" ? stored.photo.alt : "",
    },
    // Not saved yet: the one the site is showing
    portrait: { src: typeof stored.portrait?.src === "string" ? stored.portrait.src : DEFAULT_PORTRAIT },
    resume: resume.success ? resume.data : null,
  }
}

export default async function ProfileAdmin() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("settings").select("value").eq("key", "profile").maybeSingle()
  return <ProfileEditor initial={profileFrom(data?.value)} />
}
