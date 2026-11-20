import { notFound } from "next/navigation"

import { requireAdmin } from "@/lib/admin/auth"
import { PROJECT_COLUMNS } from "@/lib/projects-data"
import { WorkFileEditor } from "@/components/admin/work-file-editor"
import { workFileStateFromRow } from "@/components/admin/project-state"

export default async function EditWorkFile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { supabase } = await requireAdmin()

  const { data: row } = await supabase.from("work_files").select(PROJECT_COLUMNS).eq("slug", slug).maybeSingle()
  if (!row) notFound()

  // Keyed by slug, so moving to another work file starts a fresh editor
  return <WorkFileEditor key={slug} initial={workFileStateFromRow(row)} />
}
