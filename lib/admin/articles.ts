import "server-only"

import type { requireAdmin } from "@/lib/admin/auth"
import type { ArticleOption } from "@/components/admin/editor-state"

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"]

/** Every article's slug and title, drafts included, for the related-articles picker. */
export async function articleOptions(supabase: AdminClient): Promise<ArticleOption[]> {
  const { data } = await supabase
    .from("insights")
    .select("slug, title:document->>title")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false })

  return (data ?? []).map((row) => ({ slug: row.slug, title: row.title || row.slug }))
}
