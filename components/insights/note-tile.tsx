import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/case-study/reveal"
import { publishedAt, type Insight } from "@/lib/insights"
import { cn } from "@/lib/utils"

/**
 * A tile's one control, its title, stretched over the whole tile. The outline
 * is drawn inside, where the tile's own clipping cannot shave it off.
 */
const STRETCH =
  "focus-visible:outline-hidden after:absolute after:inset-0 after:z-10 after:rounded-[1.75rem] focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-accent"

/** Darkens the foot of a cover so the words set over it stay readable. */
const SCRIM =
  "bg-[linear-gradient(to_top,rgba(7,17,28,0.94)_0%,rgba(7,17,28,0.55)_38%,rgba(7,17,28,0)_70%)]"

/**
 * An article as a tile in the Work page's manner: the cover run edge to edge,
 * the words over its foot. `wide` takes a whole row - for an odd one out in a
 * grid of two, or a tile standing on its own.
 */
export function NoteTile({
  insight,
  delay = 0,
  wide = false,
  as = "li",
}: {
  insight: Insight
  delay?: number
  wide?: boolean
  as?: "li" | "div"
}) {
  return (
    <Reveal as={as} delay={delay} className={wide ? "md:col-span-2" : ""}>
      <article
        className={cn(
          "group relative isolate flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10",
          wide ? "aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/5] sm:aspect-[5/4]",
        )}
      >
        <Image
          src={insight.image}
          alt=""
          fill
          sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="-z-10 scale-[1.06] object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 motion-reduce:transition-none"
        />
        <div aria-hidden className={cn("absolute inset-0 -z-10", SCRIM)} />

        <div className="flex items-start justify-between p-5 md:p-7">
          <span className="rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-medium uppercase italic leading-none text-white backdrop-blur-md">
            {insight.category}
          </span>
          <span
            aria-hidden
            className="grid size-11 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0d1b2c]"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="p-5 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-white/65">
            <time dateTime={publishedAt(insight)}>{insight.date}</time> · {insight.readTime}
          </p>
          <h3 className="mt-3 text-balance text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-white md:text-3xl xl:text-4xl">
            <Link href={`/insights/${insight.slug}`} className={STRETCH}>
              {insight.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-2 max-w-md text-pretty text-sm leading-relaxed text-white/70">{insight.excerpt}</p>
        </div>
      </article>
    </Reveal>
  )
}
