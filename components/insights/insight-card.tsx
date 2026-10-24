import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { publishedAt, type Insight } from "@/lib/insights"

/**
 * The card's one control, its title, stretched over the whole card - the way
 * the work tiles do it. The outline is drawn inside, in ink: the site's pale
 * accent would all but vanish on the white card.
 */
const STRETCH =
  "focus-visible:outline-hidden after:absolute after:inset-0 after:z-10 after:rounded-3xl focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-[#0a121c]"

/** Every article's tags lead with "AI", so the pills are its category and the first tag that adds something. */
function pillsFor(insight: Insight) {
  const extra = insight.tags.find((tag) => tag !== "AI" && tag !== insight.category)
  return extra ? [insight.category, extra] : [insight.category]
}

/**
 * The home page teaser's card. A white card with the cover inset in it; the
 * read time above the title, two pills and the date at the foot,
 * pinned there so cards in a row line up whatever their excerpt.
 */
export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-[#ececec] bg-white p-3 text-[#171717]">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-[#f2f2f2]">
        <Image
          src={insight.image}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-7.5">
        <p className="text-xs capitalize text-[#6b6b6b]">{insight.readTime}</p>

        <h3 className="mt-3 flex items-start justify-between gap-6 text-lg font-medium leading-[1.35] tracking-[-0.01em] text-[#171717]">
          <Link href={`/insights/${insight.slug}`} className={STRETCH}>
            {insight.title}
          </Link>
          <ArrowUpRight
            strokeWidth={1.5}
            className="mt-0.5 size-[18px] shrink-0 text-[#404040] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </h3>

        <p className="mt-2 line-clamp-2 text-pretty text-sm leading-normal text-[#6b6b6b]">{insight.excerpt}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {pillsFor(insight).map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-[#e5e5e5] px-3 py-[9px] text-xs font-medium leading-none text-[#262626]"
            >
              {pill}
            </span>
          ))}
          <time dateTime={publishedAt(insight)} className="ml-1.5 text-xs text-[#8a8a8a]">
            {insight.date}
          </time>
        </div>
      </div>
    </article>
  )
}
