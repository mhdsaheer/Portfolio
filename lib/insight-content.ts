import { z } from "zod"

import {
  STATUSES,
  blankToUndefined,
  imageSrc,
  optionalText,
  optionalTextList,
  slug,
  text,
  textList,
  type Status,
} from "@/lib/schema-fields"

export { SLUG_PATTERN, STATUSES, type Status } from "@/lib/schema-fields"

/**
 * What an article is written in. Articles are stored in Supabase as one JSON
 * document each and checked against the schema below whenever they are saved
 * or read, so the page can trust their shape. The TypeScript types are
 * inferred from the schema, so the two cannot drift apart.
 *
 * Any text field takes a small inline syntax, rendered by `InlineText`:
 *   `code`   **strong**   *emphasis*   [link text](/a/path or https://...)
 * Paths starting with "/" become client-side links; anything else opens in a
 * new tab and says so.
 */

/**
 * A heading's anchor, from its words: "1. Read the design" -> "1-read-the-design".
 * Inline syntax is dropped first, so a link or code span reads as its text.
 */
export function slugify(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*]/g, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Lets a code sample be written indented: the shared indent and the blank
 * lines at either end are taken off. Running it twice changes nothing.
 */
export function dedent(source: string) {
  const lines = source.replace(/^\n+|\s+$/g, "").split("\n")
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length),
  )
  return lines.map((line) => line.slice(indent)).join("\n")
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export const CODE_LANGUAGES = ["tsx", "ts", "css"] as const
export type CodeLanguage = (typeof CODE_LANGUAGES)[number]

/**
 * What kind of decision a design type answers. Lists of "types of website
 * design" mix several, so the guide layout labels each one.
 */
export const DESIGN_KINDS = ["Visual style", "Website type", "Site structure", "Layout approach", "Technique"] as const
export type DesignKind = (typeof DESIGN_KINDS)[number]

/** A live website or official reference worth studying, checked before it is cited. */
const designReferenceSchema = z.object({ name: text, href: z.url(), note: text })
export type DesignReference = z.infer<typeof designReferenceSchema>

/**
 * One design type in a guide: what it is, an example image, where it works
 * and where it does not, and real sites that use it. The section's heading
 * comes from `name`, and its anchor from `id`.
 */
const designTypeSchema = z.object({
  type: z.literal("designType"),
  id: slug,
  number: z.number().int().positive(),
  name: text,
  kind: z.enum(DESIGN_KINDS),
  intro: textList.min(1, "Add at least one paragraph"),
  image: z.object({
    src: imageSrc,
    alt: text,
    caption: text,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  characteristics: textList,
  bestFor: textList,
  advantages: textList,
  limitations: textList,
  references: z.array(designReferenceSchema),
  /** Ids of other design types this one combines well with. */
  pairsWith: z.array(slug),
  /** A practical note set apart in the section, such as a pitfall or a technique. */
  tip: optionalText,
})
export type DesignTypeBlock = z.infer<typeof designTypeSchema>

export const CARD_STYLES = ["steps", "trends", "mistakes"] as const

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text }),
  /** An empty `id` is filled in from the words when the article is saved. */
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text,
    id: z.union([slug, z.literal("")]),
  }),
  z.object({ type: z.literal("list"), ordered: z.boolean(), items: textList.min(1, "Add at least one item") }),
  z.object({
    type: z.literal("code"),
    language: z.enum(CODE_LANGUAGES),
    code: z.string().transform(dedent).pipe(z.string().min(1, "Required")),
    /** Usually the file the code would live in. */
    caption: optionalText,
  }),
  z.object({ type: z.literal("quote"), text }),
  designTypeSchema,
  /** Every design type in the body, grouped by kind, each with the question its kind answers. */
  z.object({
    type: z.literal("kindMap"),
    kinds: z.array(z.object({ kind: z.enum(DESIGN_KINDS), question: text })).min(1),
  }),
  /** A comparison of the body's design types; names and kinds come from their own sections. */
  z.object({
    type: z.literal("comparison"),
    caption: text,
    rows: z.array(z.object({ id: slug, bestFor: text, strength: text, watchOut: text })).min(1),
  }),
  /** Short titled points laid out as cards: steps in order, or a set of equals. */
  z.object({
    type: z.literal("cards"),
    style: z.enum(CARD_STYLES),
    items: z.array(z.object({ title: text, text })).min(1),
  }),
  z.object({ type: z.literal("callout"), title: text, text }),
])

export type Block = z.infer<typeof blockSchema>
export type BlockType = Block["type"]

/**
 * Blocks only the guide layout renders. The standard layout has nowhere to
 * put them, so an article must be a guide to use them.
 */
export const GUIDE_ONLY_BLOCKS = ["designType", "kindMap", "comparison", "cards", "callout"] as const satisfies BlockType[]

export function isGuideOnly(type: BlockType) {
  return (GUIDE_ONLY_BLOCKS as readonly BlockType[]).includes(type)
}

/* ------------------------------------------------------------------ */
/* The article                                                         */
/* ------------------------------------------------------------------ */

const faqSchema = z.object({ question: text, answer: text })
export type Faq = z.infer<typeof faqSchema>

export const LAYOUTS = ["standard", "guide"] as const
export type Layout = (typeof LAYOUTS)[number]

/** Everything stored in an article's `document` column. */
export const insightDocumentSchema = z
  .object({
    /** The headline: the page's h1, and the title on every card. */
    title: text,
    /** The browser tab and search result title. Kept under 60 characters; defaults to `title`. */
    seoTitle: optionalText,
    /** The search result snippet, about 150-160 characters. Defaults to `excerpt`. */
    description: optionalText,
    /** The standfirst on the cover and the line under the title on cards. */
    excerpt: text,
    /** How the article reads when shared. Defaults to the SEO title and description. */
    social: z.preprocess(
      (value) => (value && typeof value === "object" && Object.values(value).every((v) => !String(v ?? "").trim()) ? undefined : value),
      z.object({ title: text, description: text }).optional(),
    ),
    /** The 16:9 cover, also the share image. */
    image: imageSrc,
    /**
     * The cover again at 4:3 and 1:1, for search engines that crop. An
     * uploaded cover gets these from Cloudinary, so it needs none here.
     */
    imageCrops: z.preprocess(blankToUndefined, z.array(imageSrc).optional()),
    imageAlt: text,
    /** The one label on cards and the cover. */
    category: text,
    tags: textList.min(1, "Add at least one tag"),
    /** The search strategy the article is written around. Documents intent; only the keywords reach the page. */
    seo: z.preprocess(
      (value) =>
        value && typeof value === "object" && !String((value as { focusKeyword?: unknown }).focusKeyword ?? "").trim()
          ? undefined
          : value,
      z
        .object({
          focusKeyword: text,
          secondaryKeywords: textList,
          searchIntent: z.string().trim(),
          semanticKeywords: textList,
        })
        .optional(),
    ),
    /** Set larger than the body, before the first heading. */
    intro: textList.min(1, "Add at least one paragraph"),
    body: z
      .array(blockSchema)
      .transform((blocks) =>
        blocks.map((block) => (block.type === "heading" && !block.id ? { ...block, id: slugify(block.text) } : block)),
      ),
    /** A closing note, set apart from the body. */
    outro: optionalTextList,
    faq: z.preprocess(blankToUndefined, z.array(faqSchema).optional()),
    /** Slugs to suggest after the article, in order. Topped up from shared tags. */
    related: z.preprocess(blankToUndefined, z.array(slug).optional()),
    /**
     * "guide" sets the article on the light, full-colour reading layout built
     * for visual guides: wide figures, a lightbox and design-type sections.
     * "standard" is the site's dark reading layout.
     */
    layout: z.enum(LAYOUTS).default("standard"),
  })
  .superRefine((doc, ctx) => {
    const typeIds = new Set<string>()

    doc.body.forEach((block, index) => {
      if (doc.layout !== "guide" && isGuideOnly(block.type)) {
        ctx.addIssue({
          code: "custom",
          path: ["body", index, "type"],
          message: `${BLOCK_LABELS[block.type]} blocks only show in the guide design. Switch the design to Guide or remove this block.`,
        })
      }
      if (block.type === "designType") {
        if (typeIds.has(block.id)) {
          ctx.addIssue({ code: "custom", path: ["body", index, "id"], message: `Another design type already uses the id "${block.id}"` })
        }
        typeIds.add(block.id)
      }
    })

    // Comparison rows and pairings point at design types by id, so each id must exist
    doc.body.forEach((block, index) => {
      if (block.type === "comparison") {
        block.rows.forEach((row, rowIndex) => {
          if (!typeIds.has(row.id)) {
            ctx.addIssue({
              code: "custom",
              path: ["body", index, "rows", rowIndex, "id"],
              message: `No design type has the id "${row.id}"`,
            })
          }
        })
      }
      if (block.type === "designType") {
        block.pairsWith.forEach((id, pairIndex) => {
          if (!typeIds.has(id) || id === block.id) {
            ctx.addIssue({
              code: "custom",
              path: ["body", index, "pairsWith", pairIndex],
              message: id === block.id ? "A design type cannot pair with itself" : `No design type has the id "${id}"`,
            })
          }
        })
      }
    })
  })

export type InsightDocument = z.infer<typeof insightDocumentSchema>
/** What the admin sends before it is checked: blanks and defaults not yet resolved. */
export type InsightDocumentInput = z.input<typeof insightDocumentSchema>

/** An ISO calendar date, "2026-11-19". */
const isoDate = z.iso.date()

/** One row of the `insights` table, as Supabase returns it. */
export const insightRowSchema = z.object({
  slug,
  status: z.enum(STATUSES),
  published_on: isoDate,
  updated_on: isoDate.nullable(),
  document: insightDocumentSchema,
})

/** An article as it is written and stored. `lib/insights` derives the rest - read time, contents, word count. */
export type InsightSource = InsightDocument & {
  slug: string
  status: Status
  /** The publish date, "2026-11-19". */
  publishedOn: string
  /** Set when the article is revised after publishing. */
  updatedOn?: string
}

export function fromRow(row: z.infer<typeof insightRowSchema>): InsightSource {
  return {
    ...row.document,
    slug: row.slug,
    status: row.status,
    publishedOn: row.published_on,
    updatedOn: row.updated_on ?? undefined,
  }
}

/** How each block is named in the admin and in error messages. */
export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  list: "List",
  code: "Code",
  quote: "Quote",
  designType: "Design type",
  kindMap: "Kind map",
  comparison: "Comparison table",
  cards: "Cards",
  callout: "Callout",
}

/* ------------------------------------------------------------------ */
/* Authoring helpers for the files in content/insights                 */
/* ------------------------------------------------------------------ */
/*
 * The original articles were written as TypeScript files with the helpers
 * below. They are kept only so scripts/seed-insights.ts can copy them into
 * Supabase, and can be deleted with content/insights once that is done.
 */

/** The file format: dates as they read on the page, e.g. "Nov 19, 2026". */
export type InsightFile = Omit<InsightDocumentInput, "layout"> & {
  slug: string
  date: string
  updated?: string
  layout?: "guide"
}

export const p = (text: string): Block => ({ type: "paragraph", text })

export const h2 = (text: string, id = slugify(text)): Block => ({ type: "heading", level: 2, text, id })

export const h3 = (text: string, id = slugify(text)): Block => ({ type: "heading", level: 3, text, id })

export const ul = (items: string[]): Block => ({ type: "list", ordered: false, items })

export const ol = (items: string[]): Block => ({ type: "list", ordered: true, items })

/** The caption is usually the file the code would live in. */
export const code = (language: CodeLanguage, source: string, caption?: string): Block => ({
  type: "code",
  language,
  code: dedent(source),
  caption,
})

export const quote = (text: string): Block => ({ type: "quote", text })

export const callout = (title: string, text: string): Block => ({ type: "callout", title, text })

export const cards = (style: (typeof CARD_STYLES)[number], items: { title: string; text: string }[]): Block => ({
  type: "cards",
  style,
  items,
})

/** A design type section. Example images are 2400 x 1500 unless stated. */
export const designType = (
  block: Omit<DesignTypeBlock, "type" | "image"> & {
    image: Omit<DesignTypeBlock["image"], "width" | "height"> & { width?: number; height?: number }
  },
): Block => ({
  ...block,
  type: "designType",
  image: { width: 2400, height: 1500, ...block.image },
})
