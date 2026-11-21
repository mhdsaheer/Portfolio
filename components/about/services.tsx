"use client"

import { useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { AccentStar } from "@/components/about/accent-star"
import {
  CUT,
  CUT_DIM,
  CUT_HAIRLINE,
  EASE_IN_QUAD,
  EASE_OUT_QUAD,
  EASE_OUT_QUART,
  FLUID,
  GUTTER,
  SHEET,
} from "@/components/about/tokens"
import type { Service } from "@/lib/settings-content"

/*
 * The services themselves are edited in the admin and stored in Supabase
 * (lib/settings-data.ts); their limits - six services, six skills each - are
 * in lib/settings-content.ts. Every skill listed is one he claims, nothing
 * inferred.
 */

/**
 * Where each service takes over, as a fraction of the pin's scroll. Deliberately
 * uneven - the first and last bands are brief, and the ones between get room to
 * be read: weights of 2 at the ends and 3 between, so four services land on
 * 0, 0.2, 0.5 and 0.8.
 */
function stepTriggers(count: number) {
  const weights = Array.from({ length: count }, (_, index) => (index === 0 || index === count - 1 ? 2 : 3))
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let passed = 0
  return weights.map((weight) => {
    const start = passed / total
    passed += weight
    return start
  })
}

/**
 * Which service a pinned panel is on. Both panels run the same way: a screen of
 * track per service behind a sticky pane, the service changing as the scroll
 * crosses each trigger.
 */
function useServiceSteps(count: number) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const triggers = stepTriggers(count)

  // Four services behind a full-screen pane leave exactly 300vh of travel
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    let next = 0
    for (let i = triggers.length - 1; i >= 0; i--) {
      if (value >= triggers[i]) {
        next = i
        break
      }
    }
    setActive((current) => (current === next ? current : next))
  })

  return { trackRef, active, triggers, progress: scrollYProgress }
}

/**
 * The white sheet both layouts sit on. Screen keeps the white and lets the
 * page's moving background through wherever the text is black. It is set on
 * the panel itself: the sticky pane is its own stacking context, so a blend on
 * anything inside it would only ever see the white.
 */
const SHEET_STYLE = { backgroundColor: SHEET, mixBlendMode: "screen" } as const

export function Services({ services }: { services: Service[] }) {
  return (
    // No z-index here, unlike every other section: one would seal the panel's
    // blend off from the background behind the page (see app/about/page.tsx)
    <section id="services" aria-label="Services" style={{ fontSize: FLUID, zIndex: "auto" }}>
      <ServicesPinned services={services} />
      <ServicesPinnedCompact services={services} />
    </section>
  )
}

/**
 * One full-width panel rather than a split: the label and the counter across
 * the top, then the titles with the skills alongside them, set between two
 * spacers so the slack is shared above and beneath instead of pooling in one
 * hole beside the titles.
 */
function ServicesPinned({ services }: { services: Service[] }) {
  const { trackRef, active, triggers, progress } = useServiceSteps(services.length)
  const reduceMotion = useReducedMotion()

  // A list that shrinks while someone is on the page can leave `active` past its end
  const current = services[Math.min(active, services.length - 1)]
  const still = Boolean(reduceMotion)

  return (
    <div ref={trackRef} className="relative hidden min-[992px]:block" style={{ height: `${services.length * 100}vh` }}>
      <div className="sticky top-0 flex h-[100dvh] w-full overflow-hidden" style={SHEET_STYLE}>
        <div className="flex flex-1 flex-col px-[2.5em] pt-[1.5em] pb-[2.5em]">
          <div className="flex items-start justify-between gap-[4em]">
            <Eyebrow>My services</Eyebrow>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.number}
                className="mt-[3.5em] flex shrink-0 items-start gap-[0.75em]"
                style={{ color: CUT_DIM }}
                initial={{ y: still ? 0 : 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: still ? 0 : -40, opacity: 0 }}
                transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT_QUART }}
              >
                <span className="text-[3.5em] font-medium italic uppercase leading-none">{current.number}</span>
                <AccentStar className="mt-[0.3em] h-[0.9em] w-[0.9em] shrink-0" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* A third of the free height above the band, two thirds below, so
              it rides high in the panel rather than dead centre */}
          <div className="flex-[1]" />

          {/* Reserved to the tallest it can ever be - six skill rows - so the
              band does not resize when a service carries fewer of them */}
          <div className="flex min-h-[20.5em] shrink-0 items-start gap-[4em]">
            <ol>
              {services.map((service, index) => (
                <li key={service.number}>
                  <motion.button
                    type="button"
                    onClick={() => scrollToStep(trackRef.current, triggers, index)}
                    aria-current={index === active ? "true" : undefined}
                    className="block w-full text-left text-[3.2em] font-medium leading-[1.3] tracking-[-0.03em]"
                    style={{ color: CUT }}
                    initial={false}
                    animate={{ opacity: index === active ? 1 : 0.4 }}
                    transition={titleFade(still, index === active)}
                  >
                    {service.title}
                  </motion.button>
                </li>
              ))}
            </ol>

            {/* The toolkit for the current service, centred in the space the
                titles leave */}
            <SkillColumn service={current} still={still} />
          </div>

          <div className="flex-[2]" />
        </div>

        {/* Stacked segments, one per service, filling as you scroll it */}
        <div className="flex shrink-0 pt-[1.5em] pb-[2.5em] pr-[2.5em]">
          <div className="flex h-full w-px flex-col">
            {services.map((service, index) => (
              <ProgressSegment
                key={service.number}
                progress={progress}
                start={triggers[index]}
                end={triggers[index + 1] ?? 1}
                share={1 / services.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Six rows is what sits level with the four titles. Rather than let a longer
 * list grow down the panel and push the band out of the frame, the
 * overflow turns into another column - so the block's height is capped by
 * construction and no count can break the band.
 */
const MAX_ROWS = 6

function SkillColumn({ service, still }: { service: Service; still: boolean }) {
  const columns = Math.max(1, Math.ceil(service.skills.length / MAX_ROWS))
  const rows = Math.ceil(service.skills.length / columns)
  // Narrower columns need smaller type, or the longer names wrap
  const size = columns === 1 ? "text-[1.375em]" : columns === 2 ? "text-[1.125em]" : "text-[0.95em]"

  return (
    <div className="mx-auto min-w-0" style={{ width: `${Math.min(columns === 1 ? 30 : columns * 22, 52)}em` }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={service.number}
          className="grid border-t"
          style={{
            borderColor: CUT_HAIRLINE,
            gridTemplateRows: `repeat(${rows}, auto)`,
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(0, 1fr)",
            columnGap: "2em",
          }}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={stagger(still)}
        >
          {service.skills.map((skill, index) => (
            <motion.li
              key={skill}
              className="flex items-baseline justify-between gap-[1em] border-b py-[0.8em]"
              style={{ borderColor: CUT_HAIRLINE }}
              variants={itemVariants(still)}
            >
              <span
                className={`font-medium leading-[1.3] ${size}`}
                style={{ color: CUT }}
              >
                {skill}
              </span>
              <span
                className="shrink-0 text-[0.875em] font-medium italic uppercase leading-none"
                style={{ color: CUT_DIM }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

/*
 * The compact panel's parts in its own ems, for the sum that sizes it. A title
 * is 1.625em type on a 1.2 line with 0.1em above and below; a skill row is 1em
 * type on a 1.3 line with 0.7em above and below, and its hairline.
 */
const TITLE_LINE = 1.625 * (1.2 + 0.2)
const SKILL_ROW = 1.3 + 0.7 * 2 + 0.07
/** Between the titles and the skills, when one is set above the other. */
const BAND_GAP = 2
/**
 * Everything else, top to bottom: the padding, the label row, the two spacers
 * at their least and the progress line, with a couple of ems spare so a title
 * that wraps doesn't push the foot off the screen.
 */
const FRAME = 11

/**
 * Below the pin's breakpoint the panel is pinned all the same, its parts set
 * one above the next: the label and the counter across the top, the titles,
 * the current service's skills beneath them, and the progress drawn across the
 * foot. Where there's no height to stack them - a phone on its side - the
 * skills move up beside the titles, down two columns.
 *
 * Its em is the page's, but no less than 2.6vw: at the page's tablet scale
 * the pane would sit mostly empty. And since a pinned pane's foot never
 * scrolls into view, it's capped at whatever lets the tallest the pane can be -
 * every title, and the longest list of skills - fit the smallest the viewport
 * gets.
 */
function ServicesPinnedCompact({ services }: { services: Service[] }) {
  const { trackRef, active, triggers, progress } = useServiceSteps(services.length)
  const still = Boolean(useReducedMotion())
  const current = services[Math.min(active, services.length - 1)]

  const rows = Math.max(...services.map((service) => service.skills.length))
  const rowsWide = Math.ceil(rows / 2)
  const titles = services.length * TITLE_LINE

  const sizing = {
    height: `${services.length * 100}vh`,
    fontSize: `min(max(${FLUID}, 2.6vw), calc(100svh / var(--ems)))`,
    "--ems-stacked": (FRAME + titles + BAND_GAP + rows * SKILL_ROW).toFixed(2),
    "--ems-wide": (FRAME + Math.max(titles, rowsWide * SKILL_ROW)).toFixed(2),
    // Kept to the longest list, so the band holds still as the lists change
    "--skills": `${(rows * SKILL_ROW).toFixed(2)}em`,
    "--skills-wide": `${(rowsWide * SKILL_ROW).toFixed(2)}em`,
  } as React.CSSProperties

  return (
    <div
      ref={trackRef}
      className="relative [--ems:var(--ems-stacked)] services-wide:[--ems:var(--ems-wide)] min-[992px]:hidden"
      style={sizing}
    >
      {/* As tall as the viewport gets - toolbars gone, gesture bar over it - as
          the background is, so no strip of page shows beneath the sheet. Its
          contents keep to the smallest the viewport gets, clear of both. */}
      <div
        className="sticky top-0 h-[calc(100lvh_+_var(--safe-bottom))] overflow-hidden"
        style={{ ...SHEET_STYLE, paddingInline: GUTTER }}
      >
        <div className="flex h-[100svh] flex-col pt-[1.5em] pb-[1.75em]">
          <div className="flex items-start justify-between gap-[2em]">
            <Eyebrow>My services</Eyebrow>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.number}
                className="flex shrink-0 items-start gap-[0.4em]"
                style={{ color: CUT_DIM }}
                initial={{ y: still ? 0 : 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: still ? 0 : -24, opacity: 0 }}
                transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT_QUART }}
              >
                <span className="text-[2.5em] font-medium italic uppercase leading-none">{current.number}</span>
                <AccentStar className="mt-[0.2em] h-[0.7em] w-[0.7em] shrink-0" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* A third of the slack above the band and two thirds below, as on
              the panel */}
          <div className="min-h-[1.5em] flex-[1]" />

          <div className="flex shrink-0 flex-col gap-[2em] services-wide:flex-row services-wide:items-start services-wide:gap-[3em]">
            <ol className="services-wide:w-[45%] services-wide:shrink-0">
              {services.map((service, index) => (
                <li key={service.number}>
                  <motion.button
                    type="button"
                    onClick={() => scrollToStep(trackRef.current, triggers, index)}
                    aria-current={index === active ? "true" : undefined}
                    className="block w-full py-[0.1em] text-left text-[1.625em] font-medium leading-[1.2] tracking-[-0.03em] [-webkit-tap-highlight-color:transparent]"
                    style={{ color: CUT }}
                    initial={false}
                    animate={{ opacity: index === active ? 1 : 0.4 }}
                    transition={titleFade(still, index === active)}
                  >
                    {service.title}
                  </motion.button>
                </li>
              ))}
            </ol>

            <SkillRows service={current} still={still} />
          </div>

          <div className="min-h-[1.5em] flex-[2]" />

          {/* The panel's progress, laid across: a segment per service */}
          <div className="flex">
            {services.map((service, index) => (
              <ProgressSegment
                key={service.number}
                progress={progress}
                start={triggers[index]}
                end={triggers[index + 1] ?? 1}
                share={1 / services.length}
                across
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** The current service's skills as the panel's numbered rows - two columns of them where there's the width. */
function SkillRows({ service, still }: { service: Service; still: boolean }) {
  return (
    <div className="min-h-[var(--skills)] min-w-0 services-wide:min-h-[var(--skills-wide)] services-wide:flex-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={service.number}
          className="grid border-t services-wide:grid-flow-col services-wide:grid-rows-[repeat(var(--rows),auto)] services-wide:auto-cols-[minmax(0,1fr)] services-wide:gap-x-[2em]"
          style={{ borderColor: CUT_HAIRLINE, "--rows": Math.ceil(service.skills.length / 2) } as React.CSSProperties}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={stagger(still)}
        >
          {service.skills.map((skill, index) => (
            <motion.li
              key={skill}
              className="flex items-baseline justify-between gap-[1em] border-b py-[0.7em]"
              style={{ borderColor: CUT_HAIRLINE }}
              variants={itemVariants(still)}
            >
              <span className="font-medium leading-[1.3]" style={{ color: CUT }}>
                {skill}
              </span>
              <span
                className="shrink-0 text-[0.75em] font-medium italic leading-none tabular-nums"
                style={{ color: CUT_DIM }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

/** The section label. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-[0.5em] text-[0.875em] font-medium italic uppercase leading-none tracking-[0.04em]"
      style={{ color: CUT }}
    >
      <AccentStar className="h-[0.75em] w-[0.75em] shrink-0" />
      {children}
    </span>
  )
}

/** A title comes up once its service has the panel, and falls back at once when it goes. */
const titleFade = (still: boolean, on: boolean) =>
  still
    ? { duration: 0 }
    : on
      ? { duration: 0.3, delay: 0.15, ease: EASE_OUT_QUAD }
      : { duration: 0.25, ease: EASE_OUT_QUAD }

/** Outgoing items leave together, incoming ones arrive one after the next. */
const stagger = (still: boolean) => ({
  enter: { transition: { staggerChildren: still ? 0 : 0.06 } },
  exit: { transition: { staggerChildren: still ? 0 : 0.04 } },
})

const itemVariants = (still: boolean) => ({
  initial: { y: still ? 0 : 40, opacity: 0 },
  enter: {
    y: 0,
    opacity: 1,
    transition: still ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT_QUART },
  },
  exit: {
    y: still ? 0 : -40,
    opacity: 0,
    transition: still ? { duration: 0 } : { duration: 0.3, ease: EASE_IN_QUAD },
  },
})

/**
 * Puts the reader in the middle of a service's band of scroll.
 *
 * The pin's place on the page comes from its box, not `offsetTop`: every
 * section is positioned, so `offsetTop` is measured from the services section
 * itself and reads as zero. Lenis owns the scroll, so it is asked first.
 */
function scrollToStep(track: HTMLDivElement | null, triggers: number[], index: number) {
  if (!track) return
  const travel = track.offsetHeight - window.innerHeight
  const start = triggers[index]
  const end = triggers[index + 1] ?? 1
  const top = track.getBoundingClientRect().top + window.scrollY + travel * ((start + end) / 2)

  if (window.__lenis) {
    window.__lenis.scrollTo(top)
    return
  }
  window.scrollTo({ top, behavior: "smooth" })
}

/**
 * One service's share of the track, filling across its own slice of the
 * scroll - down the panel's, or along the compact panel's with `across`.
 */
function ProgressSegment({
  progress,
  start,
  end,
  share,
  across = false,
}: {
  progress: MotionValue<number>
  start: number
  end: number
  /** The fraction of the track this segment takes: a quarter, with four services. */
  share: number
  across?: boolean
}) {
  const fill = useTransform(progress, [start, end], ["0%", "100%"], { clamp: true })
  const length = `${share * 100}%`

  if (across) {
    return (
      <div className="h-px overflow-hidden" style={{ width: length, backgroundColor: CUT_HAIRLINE }}>
        <motion.div className="h-px" style={{ width: fill, backgroundColor: CUT }} />
      </div>
    )
  }

  return (
    <div className="w-px overflow-hidden" style={{ height: length, backgroundColor: CUT_HAIRLINE }}>
      <motion.div className="w-px" style={{ height: fill, backgroundColor: CUT }} />
    </div>
  )
}
