import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

/** The inline syntax from lib/insight-content: code, strong, emphasis and links. */
const INLINE = /`([^`]+)`|\*\*(.+?)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/** Underlined in the pale accent, so a link reads as one inside a paragraph of white text. */
export const TEXT_LINK =
  "font-medium text-white underline decoration-accent/60 decoration-1 underline-offset-[5px] transition-colors hover:decoration-white"

/** The same on a light page: the guide layout's blue, which clears 5.6:1 on every one of its tints. */
export const TEXT_LINK_LIGHT =
  "font-medium text-[#3451D1] underline decoration-[#4263EB]/35 decoration-1 underline-offset-[5px] transition-colors hover:decoration-[#3451D1]"

/** Dark pages are the default; "light" is the guide layout's paper. */
export type Tone = "dark" | "light"

const STYLES: Record<Tone, { link: string; code: string; strong: string }> = {
  dark: {
    link: TEXT_LINK,
    code: "rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.86em] text-white",
    strong: "font-semibold text-white",
  },
  light: {
    link: TEXT_LINK_LIGHT,
    code: "rounded-md bg-[#F1ECFF] px-1.5 py-0.5 font-mono text-[0.86em] text-[#5B21B6]",
    strong: "font-semibold text-[#20212A]",
  },
}

/**
 * Renders a text field's inline syntax as elements. Everything else stays
 * text, so nothing in an article is ever parsed as HTML.
 */
export function InlineText({ text, tone = "dark" }: { text: string; tone?: Tone }) {
  return <>{parse(text, STYLES[tone])}</>
}

function parse(text: string, styles: (typeof STYLES)[Tone]): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(INLINE)) {
    const [whole, codeText, strong, emphasis, linkText, href] = match
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))

    if (codeText !== undefined) {
      nodes.push(
        <code key={index} className={styles.code}>
          {codeText}
        </code>,
      )
    } else if (strong !== undefined) {
      nodes.push(
        <strong key={index} className={styles.strong}>
          {parse(strong, styles)}
        </strong>,
      )
    } else if (emphasis !== undefined) {
      nodes.push(<em key={index}>{parse(emphasis, styles)}</em>)
    } else {
      nodes.push(
        <TextLink key={index} href={href} className={styles.link}>
          {parse(linkText, styles)}
        </TextLink>,
      )
    }

    last = index + whole.length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** A page on this site navigates in place; anywhere else opens in a new tab and says so. */
function TextLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      <ArrowUpRight aria-hidden className="ml-0.5 inline size-[0.8em] -translate-y-px opacity-70" />
    </a>
  )
}
