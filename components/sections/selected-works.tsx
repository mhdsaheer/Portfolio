import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ACCENT } from "@/components/about/tokens"
import { TileStack } from "@/components/sections/tile-stack"
import { SectionTitle } from "@/components/ui/section-title"
import { getCaseStudies } from "@/lib/projects-data"

/** The folder tab's outline. Wide enough for the number and the category. */
const TAB_WIDTH = 212
const TAB_HEIGHT = 32
const TAB_PATH = `M 0,${TAB_HEIGHT} L 0,12 A 12,12 0 0,1 12,0 L ${TAB_WIDTH - 36},0 A 12,12 0 0,1 ${TAB_WIDTH - 26},5 L ${TAB_WIDTH - 10},27 A 12,12 0 0,0 ${TAB_WIDTH},${TAB_HEIGHT}`

/** How far each pinned card sits below the one before it, which leaves that card's tab on show. */
const STACK_STEP = 32
/** The space above a card that its folder tab sits in: the Link's pt-12. */
const TAB_SPACE = 48

/**
 * The panel's colour running up into the image, masked along an S-curve. A straight
 * ramp leaves a visible edge where it meets the panel, most of all over a bright image.
 */
const FADE =
  "bg-background [mask-image:linear-gradient(to_top,#000,rgb(0_0_0/0.9)_20%,rgb(0_0_0/0.65)_40%,rgb(0_0_0/0.35)_60%,rgb(0_0_0/0.1)_80%,transparent)]"

export async function SelectedWorks() {
  const caseStudies = await getCaseStudies()
  const LAST_CARD = caseStudies.length - 1
  // The stack's step is shared between the cards after the first; one card alone has none to share
  const STEPS = Math.max(LAST_CARD, 1)

  return (
    <section id="works" className="py-20 md:py-10 md:pt-32 pb-4">
      {/* SVG clipPath definition for the folder tabs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="tab-clip">
            <path d={`${TAB_PATH} Z`} />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Selected work
          </SectionTitle>
          <Link
            href="/work"
            className="hidden md:inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: ACCENT }}
          >
            View all works
            <ArrowUpRight className="w-4 h-4" style={{ color: ACCENT }} />
          </Link>
        </div>

        {/* Cards pin and stack at every size, but a pinned card's foot can never scroll into view.
            So below 992px each is held to the height left under the stack's tabs, and the pins
            come from the room a card leaves on screen: with plenty they sit a full step apart,
            with less the step tightens so the last still ends on screen, and with none they all
            pin by the foot, the next sliding up over the whole card. */}
        <TileStack
          style={
            {
              "--stack-depth": `${TAB_SPACE + LAST_CARD * STACK_STEP}px`,
              "--stack-room": "calc(100svh - var(--card-height, 0px))",
            } as CSSProperties
          }
        >
          {caseStudies.map((work, index) => (
            <div
              key={work.slug}
              className="sticky"
              style={{
                top: `calc(min(0px, var(--stack-room)) + ${index} * clamp(0px, var(--stack-room) / ${STEPS}, ${STACK_STEP}px))`,
                zIndex: index + 1,
              }}
            >
              <Link href={`/work/${work.slug}`} className="group block pt-12 relative">
                {/* Folder Tab */}
                <div
                  className="absolute top-[16px] left-[var(--tab-left-narrow)] min-[992px]:left-[var(--tab-left)] z-10 select-none pointer-events-none transition-transform duration-300 group-hover:-translate-y-1"
                  style={
                    {
                      "--tab-left": `${48 + index * 48}px`,
                      "--tab-left-narrow": `${24 + index * 16}px`,
                      width: TAB_WIDTH,
                      height: TAB_HEIGHT,
                    } as CSSProperties
                  }
                >
                  {/* Clipped background with blur, lit from the top edge */}
                  <div
                    className="absolute inset-0 backdrop-blur-xl bg-gradient-to-b from-[#4c76a3]/90 to-[#3a5f87]/85 transition-colors duration-300"
                    style={{ clipPath: "url(#tab-clip)" }}
                  />

                  {/* SVG Border overlay */}
                  <svg
                    width={TAB_WIDTH}
                    height={TAB_HEIGHT}
                    viewBox={`0 0 ${TAB_WIDTH} ${TAB_HEIGHT}`}
                    fill="none"
                    className="absolute inset-0"
                  >
                    <path d={TAB_PATH} stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
                  </svg>

                  {/* Tab Label */}
                  <div className="absolute inset-0 z-10 flex items-center gap-2.5 pl-4 pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em]">
                    <span className="font-sans font-semibold tabular-nums" style={{ color: ACCENT }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-3 w-px bg-white/25" />
                    <span className="text-white/85 truncate">{work.category}</span>
                  </div>
                </div>

                <article className="group relative flex h-[max(24rem,min(100svh_-_var(--stack-depth),36rem))] min-h-fit flex-col min-[992px]:block min-[992px]:h-auto overflow-hidden rounded-2xl md:rounded-3xl border border-border transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                  {/* Image container: below 992px it takes all the height the words leave */}
                  <div className="relative min-h-40 flex-1 min-[992px]:aspect-[2/1] overflow-hidden bg-secondary">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      // The card spans the column: 1280px less its padding (px-6, md:px-12)
                      sizes="(min-width: 1280px) 1184px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content: sits under the image below 992px, floats over it from there up */}
                  <div className="relative shrink-0 min-[992px]:absolute min-[992px]:bottom-8 min-[992px]:right-8 min-[992px]:w-[460px] lg:w-[520px] p-6 pt-1 min-[992px]:pt-6 lg:p-7 min-[992px]:rounded-2xl bg-background min-[992px]:bg-background/80 min-[992px]:backdrop-blur-xl min-[992px]:border border-border min-[992px]:shadow-2xl transition-all duration-500 min-[992px]:group-hover:bg-background/90">
                    <div
                      aria-hidden
                      className={`absolute inset-x-0 bottom-full h-24 pointer-events-none min-[992px]:hidden ${FADE}`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                          {work.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{work.description}</p>
                      </div>
                      <div className="p-2.5 rounded-full bg-secondary/80 border border-border transition-colors group-hover:bg-secondary shrink-0">
                        <ArrowUpRight
                          className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: ACCENT }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4 min-[992px]:mt-6">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3.5 py-1.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </TileStack>

        {/* Mobile View All */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full hover:bg-secondary transition-colors"
            style={{ color: ACCENT, borderColor: ACCENT }}
          >
            View all works
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
