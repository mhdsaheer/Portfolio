import Link from "next/link"

import { Lines } from "@/components/about/lines"
import { AccentStar } from "@/components/about/accent-star"
import {
  ACCENT,
  ACCENT_GLOW,
  CTA_GRADIENT,
  CTA_SHADOW,
  FLUID,
  HAIRLINE,
  INK,
  MUTED,
  SURFACE,
} from "@/components/about/tokens"

/**
 * Written as explicit lines so each one can rise from its own mask. Roughly
 * forty characters is what the nine-column measure holds at this size - longer
 * lines wrap and break the stagger into an uneven stack.
 */
const headingLines = [
  <>
    Hi, I&apos;m Muhammed &ndash; also just{" "}
    <em
      className="font-serif italic font-normal text-[1.06em]"
      style={{ color: ACCENT, textShadow: ACCENT_GLOW }}
    >
      Saheer
    </em>
    .
  </>,
  <>I design and build interfaces that</>,
  <>stand out and perform in production.</>,
]

const paragraphs = [
  "With a background in design and real mileage in React and Next.js, I have the knowledge to both make a design that holds together and bring it to life with the right animations.",
  "I only ship work I would put my own name on, and I keep going until you are completely happy with it. Whatever your vision is, together we get it built and live.",
]

export function WhatIDo() {
  return (
    <section className="px-[2.5em] pt-[3em] pb-[4em]" style={{ backgroundColor: SURFACE, fontSize: FLUID }}>
      <div className="w-full">
        {/* Twelve columns at full width: the statement takes nine, the star the last */}
        <div className="grid grid-cols-4 gap-[1.5em] md:grid-cols-6 min-[992px]:grid-cols-12">
          <div className="col-span-4 flex flex-col gap-[2.5em] md:col-span-6 min-[992px]:col-span-9">
            <h2
              className="text-[1.875em] font-medium leading-[1.2] tracking-[-0.03em] md:text-[2.625em] min-[992px]:text-[3.5em]"
              style={{ color: INK }}
            >
              <Lines lines={headingLines} />
            </h2>

            <div className="flex flex-col items-start gap-[2.5em]">
              <ContactButton />
            </div>
          </div>

          <AccentStar
            className="hidden h-[2em] w-[2em] self-start justify-self-end min-[992px]:col-start-12 min-[992px]:block"
            style={{ color: ACCENT, opacity: 0.55 }}
          />
        </div>

        {/* Rule, then the label against the two columns of copy */}
        <div className="mt-[3.75em] grid grid-cols-1 gap-[1.5em] md:grid-cols-6 min-[992px]:mt-[5em] min-[992px]:grid-cols-2">
          <div className="col-span-full mb-[1.5em] h-px" style={{ backgroundColor: HAIRLINE }} />

          <div className="md:col-span-2 min-[992px]:col-span-1">
            <div className="flex items-center gap-[0.25em]" style={{ color: ACCENT }}>
              <AccentStar className="h-[0.625em] w-[0.625em] shrink-0" />
              <span className="text-[0.875em] font-medium italic uppercase leading-none">What I do</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[1.5em] md:col-span-4 md:grid-cols-2 min-[992px]:col-span-1">
            {paragraphs.map((copy) => (
              <p key={copy} className="text-[1.0625em] leading-[1.45]" style={{ color: MUTED }}>
                <Lines lines={[copy]} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The site's gradient pill, built to the reference's geometry - a ringed star
 * rather than an arrow, and the glow the rest of the site's buttons carry.
 */
function ContactButton() {
  return (
    <Link
      href="/contact"
      className="group relative flex items-center justify-center gap-[1em] overflow-hidden rounded-full px-[1.5em] py-[1em] text-[1em] font-medium leading-none text-white no-underline transition-shadow hover:shadow-2xl"
      style={{ background: CTA_GRADIENT, boxShadow: CTA_SHADOW }}
    >
      <span className="relative z-[1]">Get in touch</span>

      <span className="relative z-[1] flex h-[0.75em] w-[0.75em] items-center justify-center rounded-full border border-white/70">
        <AccentStar className="h-[0.5em] w-[0.5em]" />
      </span>

      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#203eec] to-[#00d4ff] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
      />
    </Link>
  )
}
