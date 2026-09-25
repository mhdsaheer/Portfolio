import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { Insight } from "@/lib/insights"

/**
 * Shared by the home page teaser and the index, so a change to the card shape
 * lands in both. The whole card is the link - a "read more" beneath it would
 * be a second target for the same destination.
 */
export function InsightCard({ insight, priority = false }: { insight: Insight; priority?: boolean }) {
  return (
    <article className="h-full">
      <Link href={`/insights/${insight.slug}`} className="group block h-full">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-secondary mb-4">
          <Image
            src={insight.image || "/placeholder.svg"}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <time>{insight.date}</time>
          <span aria-hidden>•</span>
          <span>{insight.readTime}</span>
        </div>

        <h3 className="flex items-start gap-2 text-lg font-semibold">
          <span className="underline-offset-4 group-hover:underline">{insight.title}</span>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            style={{ color: "#c8e0f5" }}
            aria-hidden
          />
        </h3>

        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{insight.excerpt}</p>
      </Link>
    </article>
  )
}
