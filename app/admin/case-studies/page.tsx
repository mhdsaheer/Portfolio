import { ProjectList } from "@/components/admin/project-list"

export default function CaseStudiesAdmin() {
  return (
    <ProjectList
      kind="case-studies"
      title="Case studies"
      intro="The write-ups at /work, in the order the home page and the work index show them."
      newLabel="New case study"
      detailField="category"
    />
  )
}
