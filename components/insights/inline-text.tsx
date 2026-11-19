import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

/** The inline syntax from lib/insight-content: code, strong, emphasis and links. */
const INLINE = /`([^`]+)`|\*\*(.+?)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/** Underlined in the pale accent, so a link reads as one inside a paragraph of white text. */
export const TEXT_LINK =
  "font-medium text-white underline decoration-accent/60 decoration-1 underline-offset-[5px] transition-colors hover:decoration-white"

/**
 * Renders a text field's inline syntax as elements. Everything else stays
 * text, so nothing in an article is ever parsed as HTML.
 */
export function InlineText({ text }: { text: string }) {
  return <>{parse(text)}</>
}

function parse(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(INLINE)) {
    const [whole, codeText, strong, emphasis, linkText, href] = match
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))

    if (codeText !== undefined) {
      nodes.push(
        <code key={index} className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.86em] text-white">
          {codeText}
        </code>,
      )
    } else if (strong !== undefined) {
      nodes.push(
        <strong key={index} className="font-semibold text-white">
          {parse(strong)}
        </strong>,
      )
    } else if (emphasis !== undefined) {
      nodes.push(<em key={index}>{parse(emphasis)}</em>)
    } else {
      nodes.push(
        <TextLink key={index} href={href}>
          {parse(linkText)}
        </TextLink>,
      )
    }

    last = index + whole.length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** A page on this site navigates in place; anywhere else opens in a new tab and says so. */
function TextLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={TEXT_LINK}>
        {children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={TEXT_LINK}>
        {children}
      </a>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={TEXT_LINK}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      <ArrowUpRight aria-hidden className="ml-0.5 inline size-[0.8em] -translate-y-px opacity-70" />
    </a>
  )
}
