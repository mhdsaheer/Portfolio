import "server-only"

import { cache } from "react"
import { z } from "zod"

import { fromRow, insightRowSchema } from "@/lib/insight-content"
import { newestFirst, prepare, type Insight } from "@/lib/insights"
import { createPublicClient } from "@/lib/supabase/public"

export const INSIGHT_COLUMNS = "slug, status, published_on, updated_on, document"

/**
 * Every published article, newest first - the single source for the home
 * page teaser, the index at /insights, the article pages and the sitemap.
 *
 * Pages read this when they are built and stay static; saving in the admin
 * rebuilds them (app/admin/actions.ts). `cache` shares one query between
 * everything rendered in the same pass.
 *
 * If Supabase can't be reached the error is thrown, not swallowed: a build
 * fails instead of publishing an empty blog, and a background rebuild keeps
 * serving the last good page. A single article that fails the schema is
 * skipped and logged, so one bad row can't take the others down.
 */
export const getInsights = cache(async (): Promise<Insight[]> => {
  const { data, error } = await createPublicClient()
    .from("insights")
    .select(INSIGHT_COLUMNS)
    .eq("status", "published")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Could not load insights from Supabase: ${error.message}`)

  const insights = data.flatMap((row) => {
    const parsed = insightRowSchema.safeParse(row)
    if (!parsed.success) {
      console.error(`Skipping insight "${row.slug}", which does not match the schema:\n${z.prettifyError(parsed.error)}`)
      return []
    }
    return [prepare(fromRow(parsed.data))]
  })

  return newestFirst(insights)
})

export async function getInsight(slug: string) {
  return (await getInsights()).find((insight) => insight.slug === slug)
}
