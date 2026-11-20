/**
 * Copies the projects in content/projects into Supabase, as published, in the
 * order the site showed them.
 *
 *   npx tsx scripts/seed-projects.ts --dry-run   check every project, write nothing
 *   npx tsx scripts/seed-projects.ts             check, then write
 *
 * Writing needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in
 * .env.local. The secret key bypasses Row Level Security, so it belongs on
 * this machine only - never in Vercel, never in the browser.
 *
 * Running it again overwrites these projects with the file versions, undoing
 * any edits made to them in the admin. Once the live site reads from
 * Supabase, delete content/projects and this script.
 */
import { existsSync } from "node:fs"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

import { caseStudies } from "@/content/projects/case-studies"
import { workFiles } from "@/content/projects/work-files"
import { caseStudyRowSchema, workFileRowSchema } from "@/lib/project-content"

/** The object without the given keys. */
function without(source: object, ...keys: string[]): Record<string, unknown> {
  return Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key)))
}

/** Same JSON in, same JSON out: validating must not change a word. */
function changedPaths(before: unknown, after: unknown, path = "", out: string[] = []) {
  if (JSON.stringify(before) === JSON.stringify(after)) return out
  if (before && after && typeof before === "object" && typeof after === "object") {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      changedPaths((before as Record<string, unknown>)[key], (after as Record<string, unknown>)[key], `${path}.${key}`, out)
    }
  } else out.push(path)
  return out
}

function prepare<T extends { slug: string }>(
  label: string,
  sources: T[],
  schema: typeof caseStudyRowSchema | typeof workFileRowSchema,
  toDocument: (source: T) => Record<string, unknown>,
) {
  return sources.flatMap((source, position) => {
    const document = toDocument(source)
    const parsed = schema.safeParse({ slug: source.slug, status: "published", position, document })
    if (!parsed.success) {
      console.error(`✗ ${label} ${source.slug}\n${z.prettifyError(parsed.error)}\n`)
      return []
    }
    const changed = changedPaths(JSON.parse(JSON.stringify(document)), parsed.data.document)
    if (changed.length) {
      console.error(`✗ ${label} ${source.slug}: validating would change ${changed.join(", ")}`)
      return []
    }
    console.log(`✓ ${label} ${source.slug}`)
    return [parsed.data]
  })
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")

  // Check everything before writing anything. The slug becomes a column, and the
  // old `index` field is replaced by the row's position.
  const studyRows = prepare("case study", caseStudies, caseStudyRowSchema, (source) => without(source, "slug", "index"))
  const fileRows = prepare("work file", workFiles, workFileRowSchema, (source) => without(source, "slug"))

  if (studyRows.length < caseStudies.length || fileRows.length < workFiles.length) {
    console.error("Nothing was written. Fix the projects above and run it again.")
    process.exit(1)
  }

  const summary = `${studyRows.length}/${caseStudies.length} case studies and ${fileRows.length}/${workFiles.length} work files`
  if (dryRun) {
    console.log(`\n${summary} are valid. Dry run: nothing was written.`)
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
  for (const [table, rows] of [
    ["case_studies", studyRows],
    ["work_files", fileRows],
  ] as const) {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: "slug" })
    if (error) {
      console.error(`Supabase refused the write to ${table}: ${error.message}`)
      process.exit(1)
    }
  }

  console.log(`\n${summary} written to Supabase as published.`)
}

main()
