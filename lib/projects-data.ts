import "server-only"

import { cache } from "react"
import { z } from "zod"

import { caseStudyRowSchema, workFileRowSchema, type CaseStudy, type WorkFile } from "@/lib/project-content"
import { createPublicClient } from "@/lib/supabase/public"

export const PROJECT_COLUMNS = "slug, status, position, document"

/**
 * Published rows of a project table, in the order the site shows them, each
 * checked against its schema. As with insights (lib/insights-data.ts): if
 * Supabase can't be reached the error is thrown, so a build fails instead of
 * publishing an empty page; a single row that fails the schema is skipped and
 * logged, so it can't take the others down.
 */
async function loadPublished<Row extends { slug: string; document: object }>(
  table: "case_studies" | "work_files",
  schema: z.ZodType<Row>,
) {
  const { data, error } = await createPublicClient()
    .from(table)
    .select(PROJECT_COLUMNS)
    .eq("status", "published")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Could not load ${table} from Supabase: ${error.message}`)

  return data.flatMap((row) => {
    const parsed = schema.safeParse(row)
    if (!parsed.success) {
      console.error(`Skipping ${table} row "${row.slug}", which does not match the schema:\n${z.prettifyError(parsed.error)}`)
      return []
    }
    return [{ slug: parsed.data.slug, ...parsed.data.document }]
  })
}

/** Every published case study - the home page stack, the work index, each write-up and the sitemap. */
export const getCaseStudies = cache(
  async (): Promise<CaseStudy[]> => (await loadPublished("case_studies", caseStudyRowSchema)) as CaseStudy[],
)

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((study) => study.slug === slug)
}

/** Every published work file, for the work index. */
export const getWorkFiles = cache(
  async (): Promise<WorkFile[]> => (await loadPublished("work_files", workFileRowSchema)) as WorkFile[],
)
