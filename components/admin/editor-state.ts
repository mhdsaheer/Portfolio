import {
  DESIGN_KINDS,
  type Block,
  type BlockType,
  type Faq,
  type Layout,
  type Status,
} from "@/lib/insight-content"

/*
 * The article as the editor holds it: every field present, blanks as empty
 * strings and empty lists, so each input always has a value. The schema in
 * lib/insight-content.ts turns blanks back into "not set" when it is saved.
 *
 * Works on the server and in the browser - the admin pages build the first
 * state, and the editor changes it.
 */

/** A body block with a key that survives reordering, so React keeps each form with its block. */
export type KeyedBlock = { key: string; block: Block }

export type DocumentDraft = {
  title: string
  seoTitle: string
  description: string
  excerpt: string
  social: { title: string; description: string }
  image: string
  imageCrops: string[]
  imageAlt: string
  category: string
  tags: string[]
  seo: { focusKeyword: string; secondaryKeywords: string[]; searchIntent: string; semanticKeywords: string[] }
  intro: string[]
  body: KeyedBlock[]
  outro: string[]
  faq: Faq[]
  related: string[]
  layout: Layout
}

export type EditorState = {
  /** The slug the article was loaded with; null until a new article is first saved. */
  originalSlug: string | null
  slug: string
  status: Status
  publishedOn: string
  /** "" when the article hasn't been revised. */
  updatedOn: string
  doc: DocumentDraft
}

/** Another article, for the related-articles picker. */
export type ArticleOption = { slug: string; title: string }

export const newKey = () => crypto.randomUUID()

/** Today in India, where the articles are written, as "2026-11-20". */
export function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date())
}

const str = (value: unknown) => (typeof value === "string" ? value : "")
const strs = (value: unknown) => (Array.isArray(value) ? value.filter((item) => typeof item === "string") : [])

/**
 * The editor state for a stored row. The row is read leniently - an article
 * that somehow fails the schema still opens, so it can be fixed here.
 */
export function stateFromRow(row: {
  slug: string
  status: Status
  published_on: string
  updated_on: string | null
  document: unknown
}): EditorState {
  const doc = (row.document ?? {}) as Record<string, unknown>
  const social = (doc.social ?? {}) as Record<string, unknown>
  const seo = (doc.seo ?? {}) as Record<string, unknown>

  return {
    originalSlug: row.slug,
    slug: row.slug,
    status: row.status,
    publishedOn: row.published_on,
    updatedOn: row.updated_on ?? "",
    doc: {
      title: str(doc.title),
      seoTitle: str(doc.seoTitle),
      description: str(doc.description),
      excerpt: str(doc.excerpt),
      social: { title: str(social.title), description: str(social.description) },
      image: str(doc.image),
      imageCrops: strs(doc.imageCrops),
      imageAlt: str(doc.imageAlt),
      category: str(doc.category),
      tags: strs(doc.tags),
      seo: {
        focusKeyword: str(seo.focusKeyword),
        secondaryKeywords: strs(seo.secondaryKeywords),
        searchIntent: str(seo.searchIntent),
        semanticKeywords: strs(seo.semanticKeywords),
      },
      intro: strs(doc.intro),
      body: (Array.isArray(doc.body) ? (doc.body as Block[]) : []).map((block) => ({ key: newKey(), block })),
      outro: strs(doc.outro),
      faq: Array.isArray(doc.faq) ? (doc.faq as Faq[]) : [],
      related: strs(doc.related),
      layout: doc.layout === "guide" ? "guide" : "standard",
    },
  }
}

export function emptyState(): EditorState {
  return {
    originalSlug: null,
    slug: "",
    status: "draft",
    publishedOn: today(),
    updatedOn: "",
    doc: {
      title: "",
      seoTitle: "",
      description: "",
      excerpt: "",
      social: { title: "", description: "" },
      image: "",
      imageCrops: [],
      imageAlt: "",
      category: "Design",
      tags: [],
      seo: { focusKeyword: "", secondaryKeywords: [], searchIntent: "", semanticKeywords: [] },
      intro: [],
      body: [],
      outro: [],
      faq: [],
      related: [],
      layout: "standard",
    },
  }
}

/** What saveInsight receives. */
export function toPayload(state: EditorState) {
  return {
    originalSlug: state.originalSlug,
    slug: state.slug,
    status: state.status,
    publishedOn: state.publishedOn,
    updatedOn: state.updatedOn,
    document: { ...state.doc, body: state.doc.body.map(({ block }) => block) },
  }
}

/** A fresh block of each type, with the fields it needs. */
export function newBlock(type: BlockType, body: KeyedBlock[]): Block {
  switch (type) {
    case "paragraph":
      return { type, text: "" }
    case "heading":
      return { type, level: 2, text: "", id: "" }
    case "list":
      return { type, ordered: false, items: [] }
    case "code":
      return { type, language: "tsx", code: "" }
    case "quote":
      return { type, text: "" }
    case "callout":
      return { type, title: "", text: "" }
    case "cards":
      return { type, style: "steps", items: [{ title: "", text: "" }] }
    case "kindMap":
      return { type, kinds: DESIGN_KINDS.map((kind) => ({ kind, question: "" })) }
    case "comparison":
      return { type, caption: "", rows: [] }
    case "designType": {
      const numbers = body.flatMap(({ block }) => (block.type === "designType" ? [block.number] : []))
      return {
        type,
        id: "",
        number: numbers.length ? Math.max(...numbers) + 1 : 1,
        name: "",
        kind: "Visual style",
        intro: [],
        image: { src: "", alt: "", caption: "", width: 2400, height: 1500 },
        characteristics: [],
        bestFor: [],
        advantages: [],
        limitations: [],
        references: [],
        pairsWith: [],
      }
    }
  }
}

/** The design types in the body, for pickers that point at them by id. */
export function designTypesIn(body: KeyedBlock[]) {
  return body.flatMap(({ block }) => (block.type === "designType" ? [{ id: block.id, name: block.name }] : []))
}
