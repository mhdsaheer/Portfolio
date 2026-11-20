import Link from "next/link"

import { requireAdmin } from "@/lib/admin/auth"
import { BUTTON, CARD } from "@/components/admin/styles"
import { TIME_ZONE } from "@/lib/contact"
import { PAGES } from "@/lib/page-content"

/** In the site's own time zone, so it reads the same wherever the admin is opened. */
function formatSaved(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  })
}

export default async function PagesAdmin() {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from("settings")
    .select("key, updated_at")
    .in(
      "key",
      PAGES.map((page) => page.key),
    )
  const savedAt = new Map((data ?? []).map((row) => [row.key as string, row.updated_at as string]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pages</h1>
        <p className="mt-1 text-sm text-neutral-500">
          The words on the site’s own pages: headings, introductions and lists. Saved changes go live within a few seconds.
        </p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">Could not load the pages: {error.message}</p>}

      <ul className="grid gap-4 sm:grid-cols-2">
        {PAGES.map((page) => {
          const saved = savedAt.get(page.key)
          return (
            <li key={page.id} className={`${CARD} flex flex-col gap-4`}>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-base font-semibold text-neutral-900">{page.title}</h2>
                  <code className="text-xs text-neutral-500">{page.path}</code>
                </div>
                <p className="mt-1 text-sm text-neutral-500">{page.summary}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-500">
                  {saved ? `Last saved ${formatSaved(saved)}` : "Not edited yet - showing the original copy"}
                </span>
                <Link href={`/admin/pages/${page.id}`} className={BUTTON}>
                  Edit
                </Link>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-sm text-neutral-500">
        The Contact page’s details - email, phone and profile links - aren’t editable here yet.
      </p>
    </div>
  )
}
