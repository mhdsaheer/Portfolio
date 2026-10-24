import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccentStar } from "@/components/about/accent-star"

export const metadata: Metadata = {
  title: "Page not found | Muhammed Saheer",
}

const inlineLink = "text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"

/**
 * "404" in Inter Tight ExtraBold, tracked -0.02em, kept as outlines rather
 * than live text. The frost behind it is cut out with a CSS mask, and a mask
 * image cannot load the page's web fonts - so the letterforms travel as a
 * path. A 1000-unit em, with 20 units of air around the ink.
 */
const NUMERAL = {
  width: 1950,
  height: 787,
  d: "M371.6 636.7L20 636.7L20 499.5L318.3 29.8L539.5 29.8L539.5 498.5L626.9 498.5L626.9 636.7L539.5 636.7L539.5 757.3L371.6 757.3L371.6 636.7ZM194.8 498.5L375.5 498.5L375.5 216.3L369.6 216.3L194.8 492.7L194.8 498.5ZM972.2 767.1L972.2 767.1Q875.5 767.1 806.9 722.6Q738.3 678.2 701.7 595.0Q665.0 511.7 665.0 394.0L665.0 394.0Q665.0 276.3 701.7 192.6Q738.3 108.9 807.1 64.4Q876.0 20 972.7 20L972.7 20Q1069.3 20 1138.2 64.7Q1207.0 109.4 1243.7 192.9Q1280.3 276.3 1280.3 394.0L1280.3 394.0Q1280.3 511.7 1243.7 595.0Q1207.0 678.2 1138.4 722.6Q1069.8 767.1 972.2 767.1ZM972.2 623.5L972.2 623.5Q1013.2 623.5 1041.5 596.9Q1069.8 570.3 1084.5 519.0Q1099.1 467.8 1099.1 394.0L1099.1 394.0Q1099.1 319.8 1084.5 268.3Q1069.8 216.8 1041.5 189.7Q1013.2 162.6 972.2 162.6L972.2 162.6Q911.1 162.6 878.4 222.9Q845.7 283.2 845.7 394.0L845.7 394.0Q845.7 467.8 860.1 519.0Q874.5 570.3 903.1 596.9Q931.6 623.5 972.2 623.5ZM1674.8 636.7L1323.3 636.7L1323.3 499.5L1621.6 29.8L1842.8 29.8L1842.8 498.5L1930.2 498.5L1930.2 636.7L1842.8 636.7L1842.8 757.3L1674.8 757.3L1674.8 636.7ZM1498.1 498.5L1678.7 498.5L1678.7 216.3L1672.9 216.3L1498.1 492.7L1498.1 498.5Z",
}

const NUMERAL_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${NUMERAL.width} ${NUMERAL.height}"><path d="${NUMERAL.d}"/></svg>`,
)}")`

/** Sized by whichever runs out first: the column's width, or most of the height left over. */
const NUMERAL_WIDTH = `min(100cqw, ${((NUMERAL.width / NUMERAL.height) * 78).toFixed(1)}cqh)`

/**
 * The mesh behind, blurred and washed toward white - only where the
 * letterforms are. Contrast comes down before brightness goes up, so the
 * navy patches lift to pale instead of settling into grey.
 */
const FROST = "blur(24px) saturate(0.35) contrast(0.55) brightness(1.6)"

/**
 * Every URL nothing else answers, set like the home hero: the words gather at
 * the foot of the screen, and the headline's place is taken by a 404 cut from
 * frosted glass, so the moving mesh still shows through it.
 */
export default function NotFound() {
  return (
    <>
      <Header />

      <main>
        <section className="relative flex min-h-svh flex-col pt-24 md:pt-28">
          <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 pb-10 md:px-12 md:pb-12">
            {/* The container is pinned inside the flex slot rather than being the slot
                itself: Chrome reads cqh as 0 on a container whose height comes from flex-grow */}
            <div className="relative min-h-40 flex-1">
              <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
                <div style={{ width: NUMERAL_WIDTH }}>
                  <GlassNumeral />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,23.5rem)_auto] lg:gap-x-10 xl:gap-x-16">
              <div className="md:col-span-2 lg:col-span-1">
                <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-white/80">
                  <AccentStar className="h-3 w-3 shrink-0 text-accent" />
                  Page not found
                </p>
                <h1 className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
                  sorry for{" "}
                  <br />
                  the friction
                </h1>
              </div>

              <p className="max-w-[23.5rem] text-pretty text-[15px] leading-relaxed text-white/75">
                The link may be broken, or the page may have moved. Head back home,{" "}
                <Link href="/work" className={inlineLink}>
                  browse the work
                </Link>{" "}
                or{" "}
                <Link href="/contact" className={inlineLink}>
                  get in touch
                </Link>
                .
              </p>

              <Link
                href="/"
                className="group inline-flex items-center gap-4 whitespace-nowrap text-base font-medium text-white md:justify-self-end"
              >
                <span className="grid size-12 place-items-center rounded-full border border-white/35 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0d1b2c]">
                  <ArrowLeft
                    className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </span>
                Back home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

/**
 * Frosted white glass in four layers: the frost (the backdrop, blurred and
 * washed out, masked to the letterforms), a milky white body lit from the top
 * left with a fine grain through it, a soft bevel for the pane's thickness,
 * and a hairline edge that catches the light hardest on the shoulders.
 * Decorative - the label and the title already say 404.
 */
function GlassNumeral() {
  const { width, height, d } = NUMERAL

  return (
    <div aria-hidden className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: FROST,
          WebkitBackdropFilter: FROST,
          maskImage: NUMERAL_MASK,
          WebkitMaskImage: NUMERAL_MASK,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />

      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 size-full overflow-visible">
        <defs>
          {/* Milky white, densest where the light falls at the top left */}
          <linearGradient id="glass-404-sheen" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.74" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.66" />
          </linearGradient>
          <linearGradient id="glass-404-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.6" />
          </linearGradient>
          {/* Frosting: fine specks in the site's dark ink, which still show on white glass */}
          <filter id="glass-404-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.07  0 0 0 0 0.11  1.6 0 0 0 -0.55" />
          </filter>
          {/* The pane's thickness: each letterform's own outline, softened and
              nudged, leaves light along its top-left inside edges and a faint
              shade along the bottom-right */}
          <filter id="glass-404-bevel" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="soft" />
            <feOffset in="soft" dx="16" dy="20" result="down" />
            <feComposite in="SourceAlpha" in2="down" operator="out" result="litEdge" />
            <feFlood floodColor="#fff" floodOpacity="0.95" />
            <feComposite in2="litEdge" operator="in" result="lit" />
            <feOffset in="soft" dx="-16" dy="-20" result="up" />
            <feComposite in="SourceAlpha" in2="up" operator="out" result="shadeEdge" />
            <feFlood floodColor="#0a121c" floodOpacity="0.2" />
            <feComposite in2="shadeEdge" operator="in" result="shade" />
            <feMerge>
              <feMergeNode in="shade" />
              <feMergeNode in="lit" />
            </feMerge>
          </filter>
          <clipPath id="glass-404-shape">
            <path d={d} />
          </clipPath>
        </defs>

        <path d={d} fill="url(#glass-404-sheen)" />
        <rect width={width} height={height} filter="url(#glass-404-grain)" clipPath="url(#glass-404-shape)" opacity={0.14} />
        <path d={d} fill="#fff" filter="url(#glass-404-bevel)" />
        <path
          d={d}
          fill="none"
          stroke="url(#glass-404-edge)"
          strokeWidth={1.25}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
