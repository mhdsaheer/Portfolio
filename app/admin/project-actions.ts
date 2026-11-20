"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/lib/admin/auth"
import { errorsOf, failed, type SaveResult } from "@/lib/admin/results"
import { revalidateSite } from "@/lib/admin/revalidate"
import { caseStudyDocumentSchema, workFileDocumentSchema, type ProjectKind } from "@/lib/project-content"
import { STATUSES, editableSlug } from "@/lib/schema-fields"

/*
 * Saving, deleting and reordering projects. Every action is its own way in,
 * reachable without the page around it, so each checks the login first; Row
 * Level Security checks it again in the database.
 */

const TABLES = { "case-studies": "case_studies", "work-files": "work_files" } as const
const kindSchema = z.enum(["case-studies", "work-files"])

const saveFields = {
  /** The slug the project was loaded with; null for a new one. */
  originalSlug: z.string().nullable(),
  slug: editableSlug,
  status: z.enum(STATUSES),
}

const caseStudySave = z.object({ ...saveFields, document: caseStudyDocumentSchema })
const workFileSave = z.object({ ...saveFields, document: workFileDocumentSchema })

async function saveProject(kind: ProjectKind, schema: typeof caseStudySave | typeof workFileSave, input: unknown): Promise<SaveResult> {
  const { supabase } = await requireAdmin()

  const parsed = schema.safeParse(input)
  if (!parsed.success) return failed("Some fields need attention before this can be saved.", errorsOf(parsed.error))

  const { originalSlug, slug, status, document } = parsed.data
  const table = TABLES[kind]

  if (originalSlug === null) {
    // New work goes to the top; the arrows in the list move it from there
    const { data: first } = await supabase
      .from(table)
      .select("position")
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle()
    const position = first ? first.position - 1 : 0

    const { error } = await supabase.from(table).insert({ slug, status, position, document })
    if (error?.code === "23505") return failed("That slug is taken.", { slug: "Another project already uses this slug" })
    if (error) return failed(`Supabase refused the save: ${error.message}`)
  } else {
    // A published case study's address is already shared and indexed, so it stays put
    if (slug !== originalSlug && kind === "case-studies") {
      const { data: current } = await supabase.from(table).select("status").eq("slug", originalSlug).maybeSingle()
      if (current?.status === "published") {
        return failed("Published case studies keep their address.", {
          slug: "Can't change the slug of a published case study. Switch it to draft first, or keep the slug.",
        })
      }
    }

    const { data, error } = await supabase.from(table).update({ slug, status, document }).eq("slug", originalSlug).select("slug")
    if (error?.code === "23505") return failed("That slug is taken.", { slug: "Another project already uses this slug" })
    if (error) return failed(`Supabase refused the save: ${error.message}`)
    if (!data?.length) return failed("This project no longer exists. It may have been deleted in another tab.")
  }

  revalidateSite()
  return { ok: true, slug, savedAt: new Date().toISOString() }
}

export async function saveCaseStudy(input: unknown): Promise<SaveResult> {
  return saveProject("case-studies", caseStudySave, input)
}

export async function saveWorkFile(input: unknown): Promise<SaveResult> {
  return saveProject("work-files", workFileSave, input)
}

export async function deleteProject(kind: ProjectKind, slug: string) {
  const { supabase } = await requireAdmin()
  const validKind = kindSchema.parse(kind)

  const { error } = await supabase.from(TABLES[validKind]).delete().eq("slug", slug)
  if (error) throw new Error(`Supabase refused the delete: ${error.message}`)

  revalidateSite()
  redirect(`/admin/${validKind}`)
}

/**
 * Moves a project one place up or down. The whole list is renumbered from
 * its current order first, so gaps or ties left by earlier edits can't make
 * a move do nothing.
 */
export async function moveProject(kind: ProjectKind, slug: string, direction: "up" | "down") {
  const { supabase } = await requireAdmin()
  const table = TABLES[kindSchema.parse(kind)]

  const { data: rows, error } = await supabase
    .from(table)
    .select("slug, position")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })
  if (error) throw new Error(`Could not load the order: ${error.message}`)

  const from = rows.findIndex((row) => row.slug === slug)
  const to = direction === "up" ? from - 1 : from + 1
  if (from === -1 || to < 0 || to >= rows.length) return

  const order = rows.map((row) => row.slug)
  ;[order[from], order[to]] = [order[to], order[from]]

  for (const [position, each] of order.entries()) {
    if (rows.find((row) => row.slug === each)?.position === position) continue
    const { error: moveError } = await supabase.from(table).update({ position }).eq("slug", each)
    if (moveError) throw new Error(`Could not save the order: ${moveError.message}`)
  }

  revalidateSite()
}
