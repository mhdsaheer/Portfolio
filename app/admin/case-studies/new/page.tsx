import { requireAdmin } from "@/lib/admin/auth"
import { CaseStudyEditor } from "@/components/admin/case-study-editor"
import { emptyCaseStudy } from "@/components/admin/project-state"

export default async function NewCaseStudy() {
  await requireAdmin()
  return <CaseStudyEditor initial={emptyCaseStudy()} />
}
