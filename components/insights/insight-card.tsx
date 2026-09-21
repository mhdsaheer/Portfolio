import Image from "next/image"

import type { Insight } from "@/lib/insights"

/**
 * Shared by the home page teaser and the index, so a change to the card shape
 * lands in both. Not a link: there are no article pages to point at yet.
 */
export function InsightCard({ insight, priority = false }: { insight: Insight; priority?: boolean }) {
  return (
    <article className="group h-full">
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

      <h3 className="text-lg font-semibold">{insight.title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{insight.excerpt}</p>
    </article>
  )
}
