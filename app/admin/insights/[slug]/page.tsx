import { notFound } from "next/navigation"

import { articleOptions } from "@/lib/admin/articles"
import { requireAdmin } from "@/lib/admin/auth"
import { INSIGHT_COLUMNS } from "@/lib/insights-data"
import { InsightEditor } from "@/components/admin/insight-editor"
import { stateFromRow } from "@/components/admin/editor-state"

export default async function EditInsight({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { supabase } = await requireAdmin()

  const { data: row } = await supabase.from("insights").select(INSIGHT_COLUMNS).eq("slug", slug).maybeSingle()
  if (!row) notFound()

  // Keyed by slug, so moving to another article starts a fresh editor
  return <InsightEditor key={slug} initial={stateFromRow(row)} others={await articleOptions(supabase)} />
}
