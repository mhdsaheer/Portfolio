import { CopyButton } from "@/components/insights/copy-button"
import { cn } from "@/lib/utils"

const PILL =
  "inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-mono text-xs text-white/80 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"

/**
 * Plain share links - no third-party scripts, nothing loaded until a reader
 * chooses one. LinkedIn leads, because that is where this writing is most
 * likely to be passed on; copying the link is the one part that needs code.
 *
 * The label is a caption for the group rather than a heading: the links show
 * up twice on a page and aren't a section of the article.
 */
export function ShareLinks({
  id,
  url,
  title,
  label = "Share this article",
  className,
}: {
  /** Names the group; unique per page. */
  id: string
  url: string
  title: string
  label?: string
  className?: string
}) {
  const link = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  const targets = [
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}` },
    { name: "X", href: `https://x.com/intent/tweet?url=${link}&text=${text}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ]

  return (
    <div role="group" aria-labelledby={id} className={cn("flex flex-col gap-3", className)}>
      <p id={id} className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
        {label}
      </p>
      <ul className="flex flex-wrap gap-2">
        {targets.map((target) => (
          <li key={target.name}>
            <a href={target.href} target="_blank" rel="noopener noreferrer" className={PILL}>
              <span className="sr-only">Share on </span>
              {target.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
        <li>
          <a href={`mailto:?subject=${text}&body=${link}`} className={PILL}>
            <span className="sr-only">Share by </span>Email
          </a>
        </li>
        <li>
          <CopyButton
            text={url}
            label="Copy link"
            copiedLabel="Link copied"
            className="border border-white/20 px-3 hover:border-white/50"
          />
        </li>
      </ul>
    </div>
  )
}
