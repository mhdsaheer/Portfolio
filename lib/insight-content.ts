/**
 * What an article is written in. Each article lives in content/insights as
 * plain data built from the helpers below, so the words can be edited without
 * touching the page that renders them - and the page can change without
 * touching the words.
 *
 * Any text field takes a small inline syntax, rendered by `InlineText`:
 *   `code`   **strong**   *emphasis*   [link text](/a/path or https://...)
 * Paths starting with "/" become client-side links; anything else opens in a
 * new tab and says so.
 */

export type CodeLanguage = "tsx" | "ts" | "css"

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language: CodeLanguage; code: string; caption?: string }
  | { type: "quote"; text: string }

export type Faq = { question: string; answer: string }

/** An article as it is written. `lib/insights` derives the rest - read time, contents, word count. */
export type InsightSource = {
  slug: string
  /** The headline: the page's h1, and the title on every card. */
  title: string
  /** The browser tab and search result title. Kept under 60 characters; defaults to `title`. */
  seoTitle?: string
  /** The search result snippet, about 150-160 characters. Defaults to `excerpt`. */
  description?: string
  /** The standfirst on the cover and the line under the title on cards. */
  excerpt: string
  /** How the article reads when shared. Defaults to the SEO title and description. */
  social?: { title: string; description: string }
  /** The 16:9 cover, also the share image. */
  image: string
  /** The cover again at 4:3 and 1:1, for search engines that crop. */
  imageCrops?: string[]
  imageAlt: string
  /** Written as it should read on the page, e.g. "Nov 19, 2026". */
  date: string
  /** Set when the article is revised after publishing. */
  updated?: string
  /** The one label on cards and the cover. */
  category: string
  tags: string[]
  /** The search strategy the article is written around. Documents intent; only the keywords reach the page. */
  seo?: {
    focusKeyword: string
    secondaryKeywords: string[]
    searchIntent: string
    semanticKeywords: string[]
  }
  /** Set larger than the body, before the first heading. */
  intro: string[]
  body: Block[]
  /** A closing note, set apart from the body. */
  outro?: string[]
  faq?: Faq[]
  /** Slugs to suggest after the article, in order. Topped up from shared tags. */
  related?: string[]
}

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
 * Lets a code sample be written indented to match the file around it: the
 * shared indent and the blank lines at either end are taken off.
 */
function dedent(source: string) {
  const lines = source.replace(/^\n+|\s+$/g, "").split("\n")
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length),
  )
  return lines.map((line) => line.slice(indent)).join("\n")
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
