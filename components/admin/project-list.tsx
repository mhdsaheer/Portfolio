import Link from "next/link"

import { requireAdmin } from "@/lib/admin/auth"
import type { ProjectKind } from "@/lib/project-content"
import { MoveButtons } from "@/components/admin/move-buttons"
import { BUTTON_PRIMARY, CARD } from "@/components/admin/styles"

const TABLES = { "case-studies": "case_studies", "work-files": "work_files" } as const

/**
 * Every project of one kind, drafts included, in the order the site shows
 * them - the arrows change that order.
 */
export async function ProjectList({
  kind,
  title,
  intro,
  newLabel,
  detailField,
}: {
  kind: ProjectKind
  title: string
  intro: string
  newLabel: string
  /** The document field shown under each title, e.g. "category" or "kind". */
  detailField: "category" | "kind"
}) {
  const { supabase } = await requireAdmin()
  const { data: rows, error } = await supabase
    .from(TABLES[kind])
    .select(`slug, status, title:document->>title, detail:document->>${detailField}`)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{intro}</p>
        </div>
        <Link href={`/admin/${kind}/new`} className={BUTTON_PRIMARY}>
          + {newLabel}
        </Link>
      </div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">Could not load them: {error.message}</p>}

      <div className={`${CARD} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="w-24 px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows?.map((row, index) => (
              <tr key={row.slug} className="hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <MoveButtons kind={kind} slug={row.slug} first={index === 0} last={index === rows.length - 1} />
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/${kind}/${row.slug}`} className="font-medium text-neutral-900 hover:underline">
                    {row.title || row.slug}
                  </Link>
                  {row.detail && <div className="text-xs text-neutral-500">{row.detail}</div>}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {row.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
            {rows?.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-neutral-500">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
