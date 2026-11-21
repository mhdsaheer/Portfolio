import type React from "react"

import Image from "next/image"
import { Download } from "lucide-react"

import { ACCENT } from "@/components/about/tokens"
import { AccentText } from "@/components/ui/accent-text"
import { AVAILABILITY, LOCATION, RESUME_FILENAME, RESUME_PATH } from "@/lib/contact"
import type { HomePage } from "@/lib/page-content"
import type { Profile } from "@/lib/settings-content"
import { cn } from "@/lib/utils"

/** Edited in the admin, under Pages → Home. */
type Intro = HomePage["intro"]

/** "Based in" follows the contact details, so it is never typed twice. */
function factsOf(intro: Intro) {
  return [
    { label: "Currently", value: intro.currently },
    { label: "Based in", value: `${LOCATION} · ${AVAILABILITY}` },
    { label: "Focus", value: intro.focus },
  ]
}

/** Beat one: who I am. */
export function AboutIntro({ intro }: { intro: Intro }) {
  return (
    <div className="w-full">
      {/* Display lede - the hero's sans/serif-italic pairing, one statement only */}
      <p className="font-sans font-semibold tracking-tight text-[1.75rem] lg:text-[2rem] xl:text-[2.5rem] leading-[1.12] text-white text-balance">
        <AccentText text={intro.lede} />
      </p>

      {/* Supporting line, set the way the hero sets its sub-paragraph */}
      <p className="mt-5 max-w-[32rem] text-base xl:text-lg leading-relaxed text-white/65 text-pretty">
        {intro.supporting}
      </p>
    </div>
  )
}

/**
 * Beat two: the facts and the resume.
 *
 * The rules are real elements rather than borders so they can draw themselves
 * in from the right, one after the next, when `active` turns true.
 */
export function AboutFacts({ intro, active = true }: { intro: Intro; active?: boolean }) {
  const facts = factsOf(intro)

  return (
    // The shadow carries legibility where the photograph is bright, so the
    // frame needs no heavy scrim behind it
    <div className="w-full" style={{ textShadow: "0 2px 18px rgba(8, 14, 22, 0.75)" }}>
      <dl>
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className="relative grid grid-cols-[minmax(88px,7rem)_1fr] gap-4 py-3 xl:py-4"
          >
            <Rule active={active} delay={index * 130} />

            <dt className="text-[10px] xl:text-[11px] font-mono uppercase tracking-[0.18em] text-white/75 pt-0.5">
              <Rise active={active} delay={index * 130 + 90}>
                {fact.label}
              </Rise>
            </dt>
            <dd className="text-sm md:text-base font-medium text-white leading-snug">
              <Rise active={active} delay={index * 130 + 150}>
                {fact.value}
              </Rise>
            </dd>

            {index === facts.length - 1 && <Rule active={active} delay={facts.length * 130} atBottom />}
          </div>
        ))}
      </dl>

      <a
        href={RESUME_PATH}
        download={RESUME_FILENAME}
        className={cn(
          "group inline-flex items-center gap-2.5 mt-8 xl:mt-10 px-6 py-3 text-sm font-medium rounded-full border border-white/35 bg-[#0a121c]/55 backdrop-blur-md",
          "transition-[background-color,border-color,opacity,transform] duration-[800ms] ease-out hover:bg-[#0a121c]/75 hover:border-white/55",
          "motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100",
          active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        style={{ color: ACCENT, transitionDelay: `${facts.length * 130 + 180}ms` }}
      >
        Download Resume
        <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
      </a>
    </div>
  )
}

/**
 * Text rising into place behind a mask. The inner padding plus the matching
 * negative margin on the mask keep descenders from being clipped at rest
 * without changing the line's layout.
 */
function Rise({ active, delay, children }: { active: boolean; delay: number; children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden -mb-[0.18em]">
      <span
        className={cn(
          "block pb-[0.18em] transition-transform duration-[800ms] ease-out",
          "motion-reduce:transition-none motion-reduce:translate-y-0",
          active ? "translate-y-0" : "translate-y-[110%]",
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  )
}

/** A hairline that draws itself from the right edge toward the left. */
function Rule({ active, delay, atBottom = false }: { active: boolean; delay: number; atBottom?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-0 h-px bg-white/25 origin-right transition-transform duration-[900ms] ease-out",
        "motion-reduce:transition-none motion-reduce:scale-x-100",
        atBottom ? "bottom-0" : "top-0",
        active ? "scale-x-100" : "scale-x-0",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    />
  )
}

// Only the last stretch goes see-through, and the scrim has darkened it by then,
// so the page's bright background can't wash over the photograph
const FADE_OUT = "linear-gradient(to bottom, #000 72%, transparent 100%)"

/**
 * Both beats stacked under the photograph, for viewports too narrow to pin it.
 * `photo` is set in the admin, under Photo & resume.
 */
export function AboutMe({ photo, intro }: { photo: Profile["photo"]; intro: Intro }) {
  return (
    <section id="about-me" className="lg:hidden py-16 md:py-24">
      {/* Full-bleed like the pinned frame, centred like it too, and fading into
          the page at its foot. The same `sizes` as the pinned image, so the
          browser reuses the copy that one preloads rather than fetching another */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10]"
        style={{ maskImage: FADE_OUT, WebkitMaskImage: FADE_OUT }}
      >
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover object-center" />

        {/* Darkens the foot of the frame, where the intro sits over it */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,18,28,0.95) 0%, rgba(10,18,28,0.75) 28%, rgba(10,18,28,0.3) 48%, rgba(10,18,28,0) 65%)",
          }}
        />
      </div>

      {/* Pulled up over the faded foot of the photograph. Relative, so it paints
          above the frame rather than under it */}
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 -mt-20 md:-mt-28">
        <div className="max-w-[42rem]" style={{ textShadow: "0 2px 18px rgba(8, 14, 22, 0.75)" }}>
          <AboutIntro intro={intro} />
          <div className="mt-8">
            <AboutFacts intro={intro} />
          </div>
        </div>
      </div>
    </section>
  )
}
