import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { insightPath, type Insight } from "@/lib/insights"
import { cn } from "@/lib/utils"

/**
 * The articles either side of this one, in the index's order: newer on the
 * left, older on the right. At either end of the list only one side shows.
 */
export function ArticlePager({ previous, next }: { previous?: Insight; next?: Insight }) {
  if (!previous && !next) return null

  return (
    <nav aria-label="Previous and next articles" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {previous && <PagerLink insight={previous} direction="previous" />}
      {next && <PagerLink insight={next} direction="next" />}
    </nav>
  )
}

function PagerLink({ insight, direction }: { insight: Insight; direction: "previous" | "next" }) {
  const isNext = direction === "next"
  const Arrow = isNext ? ArrowRight : ArrowLeft

  return (
    <Link
      href={insightPath(insight.slug)}
      rel={isNext ? "next" : "prev"}
      className={cn(
        "group flex flex-col gap-4 rounded-3xl border border-white/15 bg-[#07111c]/30 p-6 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-[#07111c]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:p-7",
        isNext && "md:col-start-2 md:items-end md:text-right",
      )}
    >
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-white/75">
        {!isNext && (
          <Arrow aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        )}
        {isNext ? "Next article" : "Previous article"}
        {isNext && (
          <Arrow aria-hidden className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </span>
      <span className="text-balance text-xl font-semibold leading-snug tracking-[-0.02em] text-white md:text-2xl">
        {insight.title}
      </span>
    </Link>
  )
}
