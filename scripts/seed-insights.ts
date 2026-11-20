/**
 * Copies the articles in content/insights into Supabase, as published.
 *
 *   npx tsx scripts/seed-insights.ts --dry-run   check every article, write nothing
 *   npx tsx scripts/seed-insights.ts             check, then write
 *
 * Writing needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in
 * .env.local. The secret key bypasses Row Level Security, so it belongs on
 * this machine only - never in Vercel, never in the browser.
 *
 * Running it again overwrites those five articles with the file versions,
 * undoing any edits made to them in the admin. Once the live site reads from
 * Supabase, delete content/insights and this script.
 */
import { existsSync } from "node:fs"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

import { article as figmaToReactWorkflow } from "@/content/insights/figma-to-react-workflow"
import { article as futureOfFrontEnd } from "@/content/insights/future-of-front-end-development"
import { article as reactBestPractices } from "@/content/insights/react-best-practices-performance"
import { article as typesOfWebsiteDesign } from "@/content/insights/types-of-website-design"
import { article as uiUxAndFrontEnd } from "@/content/insights/ui-ux-design-and-front-end-development"
import { insightRowSchema, type InsightFile } from "@/lib/insight-content"

/** Newest first, as the site listed them. Same-day articles keep this order. */
const articles: InsightFile[] = [
  typesOfWebsiteDesign,
  uiUxAndFrontEnd,
  reactBestPractices,
  figmaToReactWorkflow,
  futureOfFrontEnd,
]

/** "Nov 19, 2026" -> "2026-11-19" */
function isoDate(written: string) {
  const date = new Date(`${written} 12:00:00 UTC`)
  if (Number.isNaN(date.getTime())) throw new Error(`Unreadable date "${written}"`)
  return date.toISOString().slice(0, 10)
}

function toRow({ slug, date, updated, ...document }: InsightFile) {
  return {
    slug,
    status: "published" as const,
    published_on: isoDate(date),
    updated_on: updated ? isoDate(updated) : null,
    document,
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const now = Date.now()

  // Check everything before writing anything
  const rows = articles.flatMap((article, index) => {
    const parsed = insightRowSchema.safeParse(toRow(article))
    if (!parsed.success) {
      console.error(`✗ ${article.slug}\n${z.prettifyError(parsed.error)}\n`)
      return []
    }
    console.log(`✓ ${article.slug} (${parsed.data.document.layout}, ${parsed.data.document.body.length} blocks)`)
    // A second apart, newest first, so same-day articles keep their order on the site
    return [{ ...parsed.data, created_at: new Date(now - index * 1000).toISOString() }]
  })

  if (rows.length < articles.length) {
    console.error("Nothing was written. Fix the articles above and run it again.")
    process.exit(1)
  }

  if (dryRun) {
    console.log(`\n${rows.length}/${articles.length} articles are valid. Dry run: nothing was written.`)
    return
  }

  if (existsSync(".env.local")) process.loadEnvFile(".env.local")
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.")
    process.exit(1)
  }

  const supabase = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await supabase.from("insights").upsert(rows, { onConflict: "slug" })

  if (error) {
    console.error(`Supabase refused the write: ${error.message}`)
    process.exit(1)
  }

  console.log(`\n${rows.length}/${articles.length} articles written to Supabase as published.`)
}

main()
