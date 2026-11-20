import { notFound } from "next/navigation"
import type { z } from "zod"

import { requireAdmin } from "@/lib/admin/auth"
import { AboutPageEditor, FooterEditor, HomePageEditor, WorkPageEditor } from "@/components/admin/page-editors"
import { PAGES, PAGE_DEFAULTS, PAGE_SCHEMAS, type PageContent, type PageKey } from "@/lib/page-content"

/**
 * Never saved: the copy the site is showing. Saved, but somehow failing its
 * schema: read leniently, so it still opens to be fixed - every section that
 * checks out is kept, and only one that doesn't starts again from the shipped copy.
 */
function contentFrom<K extends PageKey>(key: K, value: unknown): PageContent<K> {
  const defaults = PAGE_DEFAULTS[key]
  if (value === undefined || value === null) return defaults

  const schema = PAGE_SCHEMAS[key]
  const whole = schema.safeParse(value)
  if (whole.success) return whole.data as PageContent<K>

  const stored = value as Record<string, unknown>
  const shipped = defaults as Record<string, unknown>
  return Object.fromEntries(
    Object.entries(schema.shape).map(([section, part]) => {
      const parsed = (part as z.ZodType).safeParse(stored[section])
      return [section, parsed.success ? parsed.data : shipped[section]]
    }),
  ) as PageContent<K>
}

export default async function EditPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: id } = await params
  const { supabase } = await requireAdmin()

  const page = PAGES.find((entry) => entry.id === id)
  if (!page) notFound()

  const { data } = await supabase.from("settings").select("value").eq("key", page.key).maybeSingle()
  const value: unknown = data?.value

  switch (page.key) {
    case "page-home":
      return <HomePageEditor initial={contentFrom("page-home", value)} />
    case "page-about":
      return <AboutPageEditor initial={contentFrom("page-about", value)} />
    case "page-work":
      return <WorkPageEditor initial={contentFrom("page-work", value)} />
    case "page-footer":
      return <FooterEditor initial={contentFrom("page-footer", value)} />
  }
}
