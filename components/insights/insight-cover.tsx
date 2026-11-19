import type { ReactNode } from "react"
import Image from "next/image"

import { Reveal } from "@/components/case-study/reveal"
import { publishedAt, type Insight } from "@/lib/insights"
import { cn } from "@/lib/utils"

/** Lifts the words off light art; on dark art it does not show. */
const LIFT = "[text-shadow:0_2px_28px_rgba(7,17,28,0.45)]"

/**
 * The longer the title, the smaller it is set, so a long headline keeps to
 * about three lines instead of filling the screen and burying the art.
 */
function titleSize(title: string) {
  if (title.length > 60) return "text-[2.125rem] leading-[1.05] md:text-5xl xl:text-[3.75rem]"
  if (title.length > 40) return "text-[2.375rem] leading-[1.03] md:text-6xl xl:text-[4.25rem]"
  return "text-5xl leading-[0.98] md:text-7xl xl:text-[5.5rem]"
}

/**
 * The art is cropped to fill the cover, so on a screen taller than 16:9 it is
 * drawn by the cover's height, wider than the screen - ask for an image that
 * wide, or a phone gets one a third of the size it shows and blurs it.
 */
const COVER_SIZES = "(max-aspect-ratio: 16/9) 178vh, 100vw"

/**
 * An article's art as the page's opening screen, its title set large over the
 * foot - laid out like the home hero. The index opens on its newest article
 * this way, and every article opens on its own.
 *
 * The title is the article page's main heading; on the index the page's own
 * heading is the label, so there it steps down to an h2. The label and the
 * way on come from the page, styled with `cover-styles`.
 *
 * On the article the art is the featured image and is described; on the index
 * it only dresses a link whose title says it all, so it stays decorative.
 */
export function InsightCover({
  insight,
  label,
  action,
  titleAs: Title = "h2",
}: {
  insight: Insight
  /** Sits at the head of the cover, if the page has one. */
  label?: ReactNode
  /** The way on, under the excerpt. */
  action: ReactNode
  titleAs?: "h1" | "h2"
}) {
  const isArticle = Title === "h1"

  return (
    <section className="relative isolate flex h-[100svh] max-h-[60rem] min-h-[38rem] flex-col overflow-hidden">
      {/* The art fades into the page's own mesh at the foot, rather than ending on a hard edge */}
      <div
        aria-hidden={isArticle ? undefined : true}
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
      >
        <Image
          src={insight.image}
          alt={isArticle ? insight.imageAlt : ""}
          fill
          preload
          sizes={COVER_SIZES}
          className="object-cover"
        />
      </div>
      {/* Shade where the words sit - the head for the nav, the lower half for the title -
          and clear again at the very foot, so the section ends on the mesh with no seam */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(7,17,28,0.72)_0%,rgba(7,17,28,0.4)_12%,rgba(7,17,28,0)_26%,rgba(7,17,28,0)_40%,rgba(7,17,28,0.42)_66%,rgba(7,17,28,0.38)_88%,rgba(7,17,28,0)_100%)]"
      />

      {/* Without a label the words still settle at the foot */}
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-10 px-6 pb-10 pt-28 md:px-12 md:pb-14 md:pt-36",
          label ? "justify-between" : "justify-end",
        )}
      >
        {label}

        <Reveal className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="inline-flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-full bg-[#07111c]/45 py-1.5 pl-1.5 pr-4 text-xs uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
              <span className="rounded-full bg-white/15 px-2.5 py-1 normal-case tracking-normal text-white">
                {insight.category}
              </span>{" "}
              <time dateTime={publishedAt(insight)}>{insight.date}</time>{" "}
              <span aria-hidden>·</span> {insight.readTime}
            </p>
            <Title
              className={cn(
                "mt-5 text-balance font-semibold tracking-[-0.045em] text-white",
                titleSize(insight.title),
                LIFT,
              )}
            >
              {insight.title}
            </Title>
          </div>

          <div className="flex flex-col items-start gap-7 lg:col-span-4 lg:pb-3">
            <p className={cn("max-w-sm text-pretty text-[15px] leading-relaxed text-white/85", LIFT)}>{insight.excerpt}</p>
            {action}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
