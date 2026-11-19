import { article as figmaToReactWorkflow } from "@/content/insights/figma-to-react-workflow"
import { article as futureOfFrontEnd } from "@/content/insights/future-of-front-end-development"
import { article as reactBestPractices } from "@/content/insights/react-best-practices-performance"
import { article as uiUxAndFrontEnd } from "@/content/insights/ui-ux-design-and-front-end-development"
import { LOCATION, socials } from "@/lib/contact"
import type { Block, InsightSource } from "@/lib/insight-content"
import { SITE_URL } from "@/lib/site"

export type TocItem = { id: string; text: string }

export type Insight = InsightSource & {
  seoTitle: string
  description: string
  social: { title: string; description: string }
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
  bio: "I’m a front-end developer and UI/UX designer based in Kerala, India, with a degree in multimedia from the University of Calicut. I design interfaces in Figma and build them in React and Next.js, with a focus on design systems, motion and interfaces that stay fast and accessible in production.",
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

function proseOf(source: InsightSource) {
  return [
    ...source.intro,
    ...source.body.flatMap((block) =>
      block.type === "list" ? block.items : block.type === "code" ? [] : [block.text],
    ),
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

/** Two headings with the same words would share an anchor; the later ones get a number. */
function withUniqueIds(blocks: Block[]) {
  const taken = new Set([FAQ_ID])

  return blocks.map((block) => {
    if (block.type !== "heading") return block
    let id = block.id
    for (let n = 2; taken.has(id); n++) id = `${block.id}-${n}`
    taken.add(id)
    return id === block.id ? block : { ...block, id }
  })
}

function prepare(source: InsightSource): Insight {
  const body = withUniqueIds(source.body)
  const wordCount = proseOf(source).reduce((sum, text) => sum + countWords(text), 0)
  const codeWords = body.reduce((sum, block) => sum + (block.type === "code" ? countWords(block.code) : 0), 0)

  const toc: TocItem[] = body.flatMap((block) =>
    block.type === "heading" && block.level === 2 ? [{ id: block.id, text: plain(block.text) }] : [],
  )
  if (source.faq?.length) toc.push({ id: FAQ_ID, text: "Frequently asked questions" })

  const seoTitle = source.seoTitle ?? source.title
  const description = source.description ?? source.excerpt

  return {
    ...source,
    body,
    seoTitle,
    description,
    social: source.social ?? { title: seoTitle, description },
    readTime: readingTime(wordCount, codeWords),
    wordCount,
    toc,
  }
}

/**
 * The midday-UTC timestamp of a written date.
 *
 * `new Date("Dec 15, 2025")` is midnight *local*, which on any build machine
 * east of UTC serialises as the day before. Anchoring to midday UTC keeps the
 * date in the markup the same as the date on the page, wherever it is built.
 */
function toIso(date: string) {
  return new Date(`${date} 12:00:00 UTC`).toISOString()
}

/**
 * The single source for the home page teaser, the index at /insights and the
 * article pages. Newest first - the home section takes the first three, and
 * articles published on the same day keep the order they are listed in.
 */
export const insights: Insight[] = [
  uiUxAndFrontEnd,
  reactBestPractices,
  figmaToReactWorkflow,
  futureOfFrontEnd,
]
  .map(prepare)
  .sort((a, b) => toIso(b.date).localeCompare(toIso(a.date)))

/** The machine-readable publish date. */
export function publishedAt(insight: Pick<InsightSource, "date">) {
  return toIso(insight.date)
}

/** The last revision, or the publish date if there hasn't been one. */
export function modifiedAt(insight: Pick<InsightSource, "date" | "updated">) {
  return toIso(insight.updated ?? insight.date)
}

export function insightPath(slug: string) {
  return `/insights/${slug}`
}

export function insightUrl(slug: string) {
  return `${SITE_URL}${insightPath(slug)}`
}

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug)
}

/** The neighbours in the index's own order: `previous` is newer, `next` is older. Neither wraps. */
export function getAdjacentInsights(slug: string) {
  const index = insights.findIndex((insight) => insight.slug === slug)
  if (index === -1) return { previous: undefined, next: undefined }
  return { previous: insights[index - 1], next: insights[index + 1] }
}

/**
 * What to read next: the article's own picks first, then whatever shares the
 * most tags with it, newest first among equals.
 */
export function getRelatedInsights(insight: Insight, count = 3) {
  const picked = (insight.related ?? [])
    .map((slug) => getInsight(slug))
    .filter((candidate): candidate is Insight => candidate !== undefined && candidate.slug !== insight.slug)

  const shared = (candidate: Insight) => candidate.tags.filter((tag) => insight.tags.includes(tag)).length

  const rest = insights
    .filter((candidate) => candidate.slug !== insight.slug && !picked.includes(candidate))
    .sort((a, b) => shared(b) - shared(a))

  return [...picked, ...rest].slice(0, count)
}
