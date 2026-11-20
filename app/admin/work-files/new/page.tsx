import { requireAdmin } from "@/lib/admin/auth"
import { WorkFileEditor } from "@/components/admin/work-file-editor"
import { emptyWorkFile } from "@/components/admin/project-state"

export default async function NewWorkFile() {
  await requireAdmin()
  return <WorkFileEditor initial={emptyWorkFile()} />
}
