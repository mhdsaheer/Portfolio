import Link from "next/link"

import { requireAdmin } from "@/lib/admin/auth"
import { BUTTON_PRIMARY, CARD } from "@/components/admin/styles"

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T12:00:00Z`),
  )
}

export default async function AdminHome() {
  const { supabase } = await requireAdmin()

  // An admin sees drafts too; Row Level Security hides them from everyone else
  const { data: insights, error } = await supabase
    .from("insights")
    .select("slug, status, published_on, updated_at, title:document->>title, layout:document->>layout")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Insights</h1>
          <p className="mt-1 text-sm text-neutral-500">Saved changes appear on the live site within a few seconds.</p>
        </div>
        <Link href="/admin/insights/new" className={BUTTON_PRIMARY}>
          + New insight
        </Link>
      </div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">Could not load insights: {error.message}</p>}

      <div className={`${CARD} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Design</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {insights?.map((insight) => (
              <tr key={insight.slug} className="hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/insights/${insight.slug}`} className="font-medium text-neutral-900 hover:underline">
                    {insight.title || insight.slug}
                  </Link>
                  <div className="font-mono text-xs text-neutral-400">/insights/{insight.slug}</div>
                </td>
                <td className="px-5 py-3 text-neutral-600">{insight.layout === "guide" ? "Guide" : "Standard"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      insight.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {insight.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-neutral-600">{formatDate(insight.published_on)}</td>
              </tr>
            ))}
            {insights?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-neutral-500">
                  No insights yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
