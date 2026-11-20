import { notFound } from "next/navigation"

import { requireAdmin } from "@/lib/admin/auth"
import { PROJECT_COLUMNS } from "@/lib/projects-data"
import { CaseStudyEditor } from "@/components/admin/case-study-editor"
import { caseStudyStateFromRow } from "@/components/admin/project-state"

export default async function EditCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { supabase } = await requireAdmin()

  const { data: row } = await supabase.from("case_studies").select(PROJECT_COLUMNS).eq("slug", slug).maybeSingle()
  if (!row) notFound()

  // Keyed by slug, so moving to another case study starts a fresh editor
  return <CaseStudyEditor key={slug} initial={caseStudyStateFromRow(row)} />
}
