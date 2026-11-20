import { ProjectList } from "@/components/admin/project-list"

export default function WorkFilesAdmin() {
  return (
    <ProjectList
      kind="work-files"
      title="Work files"
      intro="Pieces that open straight from the work index, which lays them out in this order."
      newLabel="New work file"
      detailField="kind"
    />
  )
}
