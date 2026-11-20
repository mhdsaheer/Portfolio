import { articleOptions } from "@/lib/admin/articles"
import { requireAdmin } from "@/lib/admin/auth"
import { InsightEditor } from "@/components/admin/insight-editor"
import { emptyState } from "@/components/admin/editor-state"

export default async function NewInsight() {
  const { supabase } = await requireAdmin()
  return <InsightEditor initial={emptyState()} others={await articleOptions(supabase)} />
}
