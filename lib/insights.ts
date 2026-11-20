import { isCloudinaryUrl, withTransform } from "@/lib/cloudinary"
import { LOCATION, socials } from "@/lib/contact"
import type { Block, InsightSource } from "@/lib/insight-content"
import { SITE_URL } from "@/lib/site"

/*
 * Everything here works on articles already loaded, so it is safe to import
 * anywhere. Loading them from Supabase lives in lib/insights-data.ts.
 */

/** A contents entry. Design-type sections carry their number, e.g. "07". */
export type TocItem = { id: string; text: string; number?: string }

export type Insight = InsightSource & {
  seoTitle: string
  description: string
  social: { title: string; description: string }
  /** The publish date as it reads on the page, e.g. "Nov 19, 2026". */
  date: string
  /** The last revision as it reads on the page, if there has been one. */
  updated?: string
  /** Derived from the word count, not written by hand. */
  readTime: string
  /** The article's own words, without code. */
  wordCount: number
  /** Every h2, then the FAQ if there is one. */
  toc: TocItem[]
}

/** The FAQ's anchor. Article headings are kept off it. */
export const FAQ_ID = "faq"

/** The byline on every article and the author in its structured data. */
export const AUTHOR = {
  name: "Muhammed Saheer",
  role: "Front-end developer & UI/UX designer",
  jobTitle: "Front-End Developer and UI/UX Designer",
  location: LOCATION,
  /** The page that identifies the author, as search engines ask for. */
  path: "/about",
  image: "/images/saheer_portrait.png",
  bio: "I’m a front-end developer and UI/UX designer in Kerala, India, with a degree in multimedia from the University of Calicut. I design in Figma and build in React and Next.js, with a focus on fast, accessible interfaces.",
  /** Profiles that are the author's own - the WhatsApp link is a way to reach him, not a profile. */
  profiles: socials.filter((social) => social.label === "LinkedIn" || social.label === "GitHub"),
}

/** Inline syntax out, so links count as their words and code spans as theirs. */
function plain(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "")
}

function countWords(text: string) {
  return plain(text).split(/\s+/).filter(Boolean).length
}

/** The words a reader reads in one block. Code is counted separately; names repeated from elsewhere are not. */
function wordsOf(block: Block): string[] {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "quote":
      return [block.text]
    case "list":
      return block.items
    case "code":
    case "kindMap":
      return []
    case "callout":
      return [block.title, block.text]
    case "cards":
      return block.items.flatMap((item) => [item.title, item.text])
    case "comparison":
      return [block.caption, ...block.rows.flatMap((row) => [row.bestFor, row.strength, row.watchOut])]
    case "designType":
      return [
        block.name,
        ...block.intro,
        block.image.caption,
        ...block.characteristics,
        ...block.bestFor,
        ...block.advantages,
        ...block.limitations,
        ...block.references.flatMap((reference) => [reference.name, reference.note]),
        ...(block.tip ? [block.tip] : []),
      ]
  }
}

function proseOf(source: InsightSource) {
  return [
    ...source.intro,
    ...source.body.flatMap(wordsOf),
    ...(source.outro ?? []),
    ...(source.faq ?? []).flatMap((item) => [item.question, item.answer]),
  ]
}

/**
 * Read times are computed rather than written down, so they cannot drift away
 * from the article as it is edited. 200 words a minute is the usual estimate
 * for screen reading; code is skimmed more than read, so it counts for half.
 */
function readingTime(proseWords: number, codeWords: number) {
  return `${Math.max(1, Math.round((proseWords + codeWords / 2) / 200))} min read`
}

/**
 * Two headings with the same words would share an anchor; the later ones get
 * a number. Design-type sections name their own anchors, so those are held
 * back from the start and a heading never takes one.
 */
function withUniqueIds(blocks: Block[]) {
  const taken = new Set([FAQ_ID, ...blocks.flatMap((block) => (block.type === "designType" ? [block.id] : []))])

  return blocks.map((block) => {
    if (block.type !== "heading") return block
    let id = block.id
    for (let n = 2; taken.has(id); n++) id = `${block.id}-${n}`
    taken.add(id)
    return id === block.id ? block : { ...block, id }
  })
}

/** "2026-11-19" -> "Nov 19, 2026", the same wherever the page is built. */
function displayDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(toIso(isoDate)),
  )
}

/**
 * The cover at 4:3 and 1:1. Files in /public list theirs by hand; an uploaded
 * cover is cropped by Cloudinary, centred on what matters in the picture.
 */
function cropsOf(source: InsightSource) {
  if (source.imageCrops?.length || !isCloudinaryUrl(source.image)) return source.imageCrops
  return ["ar_4:3", "ar_1:1"].map((ratio) => withTransform(source.image, `c_fill,${ratio},g_auto`))
}

export function prepare(source: InsightSource): Insight {
  const body = withUniqueIds(source.body)
  const wordCount = proseOf(source).reduce((sum, text) => sum + countWords(text), 0)
  const codeWords = body.reduce((sum, block) => sum + (block.type === "code" ? countWords(block.code) : 0), 0)

  const toc: TocItem[] = body.flatMap((block) => {
    if (block.type === "heading" && block.level === 2) return [{ id: block.id, text: plain(block.text) }]
    if (block.type === "designType") {
      return [{ id: block.id, text: block.name, number: String(block.number).padStart(2, "0") }]
    }
    return []
  })
  if (source.faq?.length) toc.push({ id: FAQ_ID, text: "Frequently asked questions" })

  const seoTitle = source.seoTitle ?? source.title
  const description = source.description ?? source.excerpt

  return {
    ...source,
    body,
    seoTitle,
    description,
    social: source.social ?? { title: seoTitle, description },
    imageCrops: cropsOf(source),
    date: displayDate(source.publishedOn),
    updated: source.updatedOn ? displayDate(source.updatedOn) : undefined,
    readTime: readingTime(wordCount, codeWords),
    wordCount,
    toc,
  }
}

/**
 * The midday-UTC timestamp of a calendar date, "2026-11-19".
 *
 * Midnight would fall on the day before anywhere west of UTC. Anchoring to
 * midday keeps the date in the markup the same as the date on the page,
 * wherever it is built or read.
 */
function toIso(isoDate: string) {
  return `${isoDate}T12:00:00.000Z`
}

/**
 * Newest first - the home section takes the first three. The sort is stable,
 * so articles published on the same day keep the order they arrive in.
 */
export function newestFirst(list: Insight[]) {
  return [...list].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
}

/** The machine-readable publish date. */
export function publishedAt(insight: Pick<InsightSource, "publishedOn">) {
  return toIso(insight.publishedOn)
}

/** The last revision, or the publish date if there hasn't been one. */
export function modifiedAt(insight: Pick<InsightSource, "publishedOn" | "updatedOn">) {
  return toIso(insight.updatedOn ?? insight.publishedOn)
}

/** Every image an article shows: its cover, then any example images in the body. */
export function imagesOf(insight: Insight) {
  return [
    insight.image,
    ...insight.body.flatMap((block) => (block.type === "designType" ? [block.image.src] : [])),
  ]
}

export function insightPath(slug: string) {
  return `/insights/${slug}`
}

export function insightUrl(slug: string) {
  return `${SITE_URL}${insightPath(slug)}`
}

/**
 * What to read next, from `all` (newest first): the article's own picks
 * first, then whatever shares the most tags with it, newest first among equals.
 */
export function getRelatedInsights(insight: Insight, all: Insight[], count = 3) {
  const picked = (insight.related ?? [])
    .map((slug) => all.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Insight => candidate !== undefined && candidate.slug !== insight.slug)

  const shared = (candidate: Insight) => candidate.tags.filter((tag) => insight.tags.includes(tag)).length

  const rest = all
    .filter((candidate) => candidate.slug !== insight.slug && !picked.includes(candidate))
    .sort((a, b) => shared(b) - shared(a))

  return [...picked, ...rest].slice(0, count)
}
