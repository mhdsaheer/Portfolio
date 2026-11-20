import { z } from "zod"

import { DISCIPLINES, serviceFilters, type ServiceFilter } from "@/lib/case-studies"
import {
  STATUSES,
  blankToUndefined,
  imageSrc,
  optionalText,
  optionalWebUrl,
  slug,
  text,
  textList,
} from "@/lib/schema-fields"

/**
 * What projects are written in: case studies (the write-ups at /work/[slug])
 * and work files (pieces that open straight from the index). Each is stored
 * in Supabase as one JSON document, checked against these schemas whenever it
 * is saved or read. The TypeScript types are inferred from them.
 *
 * Imported by the server and the admin only - visitors' pages use the types
 * through lib/case-studies.ts and lib/work-files.ts, which don't pull in zod.
 */

const hex = z
  .string()
  .trim()
  .regex(/^#[0-9a-f]{6}$/i, "Use a six-digit hex colour, like #1e3a8a")
const optionalHex = z.preprocess(blankToUndefined, hex.optional())

/* ------------------------------------------------------------------ */
/* Case studies                                                        */
/* ------------------------------------------------------------------ */

/** One colour from a product's design system, read from its code rather than its spec. */
const swatchSchema = z.object({
  name: text,
  hex,
  /** What the colour is for. Leave out where the name already says it. */
  role: optionalText,
  /** The darker shade a filled button sits on and presses into. */
  lip: optionalHex,
  /** The pale tint the colour is laid on: badges, active rows, module bands. */
  soft: optionalHex,
  /** The words on the sample button or badge. Defaults to the name. */
  sample: optionalText,
})
export type Swatch = z.infer<typeof swatchSchema>

const designSystemSchema = z.object({
  /** What the section is called beside its number. Defaults to "The design system". */
  label: optionalText,
  title: text,
  intro: text,
  palettes: z
    .array(z.object({ name: text, note: text, swatches: z.array(swatchSchema).min(1, "Add at least one colour") }))
    .min(1, "Add at least one palette"),
  typeface: z
    .object({
      family: text,
      weights: z
        .array(z.object({ label: text, weight: z.number().int().min(100).max(900) }))
        .min(1, "Add at least one weight"),
      /** A line from the product, set in the typeface. */
      sample: text,
      note: text,
    })
    .optional(),
})

export const caseStudyDocumentSchema = z.object({
  title: text,
  category: text,
  /** The service on offer, not the domain - this is what the index lists. */
  discipline: z.enum(DISCIPLINES),
  description: text,
  /** The work index's one line: where the project started, and what it became. */
  summary: text,
  image: imageSrc,
  tags: textList.min(1, "Add at least one tag"),
  year: text,
  role: optionalText,
  timeline: text,
  client: text,
  platform: text,
  /** The finished work, where it can be seen. Shows as a link under the title. */
  liveUrl: optionalWebUrl,
  overview: textList.min(1, "Add at least one paragraph"),
  challenge: z.object({
    title: text,
    body: textList.min(1, "Add at least one paragraph"),
    pains: textList,
  }),
  approach: z.array(z.object({ step: text, title: text, body: text })).min(1, "Add at least one step"),
  /** The product's own design system. Leave out when there is none to show; the section goes with it. */
  designSystem: designSystemSchema.optional(),
  gallery: z
    .array(z.object({ src: imageSrc, alt: text, caption: optionalText }))
    .min(1, "Add at least one image"),
  results: z.array(z.object({ value: text, label: text })),
  /** The outcome section's heading, for work with no before and after to report. Defaults to "What changed". */
  outcomeHeading: optionalText,
  outcome: textList.min(1, "Add at least one paragraph"),
  /** Leave out when there is no real quote to show; the section goes with it. */
  testimonial: z.object({ quote: text, author: text, role: text }).optional(),
  stack: textList,
})

export type CaseStudyDocument = z.infer<typeof caseStudyDocumentSchema>
export type CaseStudy = CaseStudyDocument & { slug: string }

/* ------------------------------------------------------------------ */
/* Work files                                                          */
/* ------------------------------------------------------------------ */

export const SERVICES = Object.keys(serviceFilters) as [ServiceFilter, ...ServiceFilter[]]
export const FORMATS = ["image", "link"] as const

/** One picture of a piece, and what it shows. */
const shotSchema = z.object({ src: imageSrc, alt: text })
export type Shot = z.infer<typeof shotSchema>

export const workFileDocumentSchema = z
  .object({
    title: text,
    /** What the piece is, in a word or two - "Brand identity", "Pitch deck". */
    kind: text,
    services: z.array(z.enum(SERVICES)).min(1, "Pick at least one service"),
    year: text,
    /** Decides how it opens: the viewer for images, a new tab for links. */
    format: z.enum(FORMATS),
    /** The image, or the address for a link. */
    src: text,
    /** A cover for the card. A link without one gets a lettered cover. */
    cover: z.preprocess(blankToUndefined, imageSrc.optional()),
    /** What the image shows, for anyone who cannot see it. Images only. */
    alt: optionalText,
    /**
     * Further views of the same piece - the other side, another angle. The index
     * still shows one card; the viewer lists these after `src`. Images only.
     */
    more: z.preprocess(blankToUndefined, z.array(shotSchema).optional()),
  })
  .superRefine((file, ctx) => {
    if (file.format === "image") {
      if (!/^(\/|https:\/\/)/.test(file.src)) {
        ctx.addIssue({ code: "custom", path: ["src"], message: "Upload an image, or use a path in /public" })
      }
      if (!file.alt) {
        ctx.addIssue({ code: "custom", path: ["alt"], message: "Images need alt text" })
      }
    } else {
      if (!/^https?:\/\/[^\s]+$/.test(file.src)) {
        ctx.addIssue({ code: "custom", path: ["src"], message: "Use a full address starting with https://" })
      }
      if (file.more?.length) {
        ctx.addIssue({ code: "custom", path: ["more"], message: "Extra views are for images only" })
      }
    }
  })

export type WorkFileDocument = z.infer<typeof workFileDocumentSchema>
export type WorkFile = WorkFileDocument & { slug: string }

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

const rowFields = { slug, status: z.enum(STATUSES), position: z.number().int() }

/** One row of `case_studies` or `work_files`, as Supabase returns it. */
export const caseStudyRowSchema = z.object({ ...rowFields, document: caseStudyDocumentSchema })
export const workFileRowSchema = z.object({ ...rowFields, document: workFileDocumentSchema })

export type ProjectKind = "case-studies" | "work-files"

/* ------------------------------------------------------------------ */
/* The files in content/projects                                       */
/* ------------------------------------------------------------------ */
/*
 * The original projects were written as TypeScript arrays. These types are
 * kept only so scripts/seed-projects.ts can copy them into Supabase, and can
 * be deleted with content/projects once that is done.
 */
export type CaseStudySource = z.input<typeof caseStudyDocumentSchema> & { slug: string; index?: number }
export type WorkFileSource = z.input<typeof workFileDocumentSchema> & { slug: string }
