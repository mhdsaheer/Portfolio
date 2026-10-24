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
  SHEET,
} from "@/components/about/tokens"

/**
 * Named for what someone would actually hire him for, and every skill listed is
 * one he claims - nothing inferred. Counts run five to seven, which the row
 * padding absorbs so the column beside the titles stays near their height.
 */
const services = [
  {
    number: "01",
    title: "Front-End Development",
    skills: ["React.js", "Next.js", "JavaScript (ES6+)", "HTML5 & CSS3", "Tailwind CSS", "Bootstrap"],
  },
  {
    number: "02",
    title: "Back-End & CMS",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Strapi CMS", "Moodle"],
  },
  {
    number: "03",
    title: "UI/UX Design",
    skills: ["Figma", "Adobe XD", "Responsive Design", "Cross-Browser Compatibility", "Canva","Notion"],
  },
  {
    number: "04",
    title: "Branding & Identity",
    skills: ["Logo Design", "Brand Identity", "Photoshop", "Illustrator", "InDesign"],
  },
]

/**
 * Where each service takes over, as a fraction of the pin's scroll. Deliberately
 * uneven - the first card is brief and the rest get room to be read.
 */
const STEP_TRIGGERS = [0, 0.2, 0.5, 0.8]

/**
 * The white sheet both layouts sit on. Screen keeps the white and lets the
 * page's moving background through wherever the text is black. It is set on
 * the panel itself: the sticky pane is its own stacking context, so a blend on
 * anything inside it would only ever see the white.
 */
const SHEET_STYLE = { backgroundColor: SHEET, mixBlendMode: "screen" } as const

export function Services() {
  return (
    // No z-index here, unlike every other section: one would seal the panel's
    // blend off from the background behind the page (see app/about/page.tsx)
    <section id="services" aria-label="Services" style={{ fontSize: FLUID, zIndex: "auto" }}>
      <ServicesPinned />
      <ServicesStacked />
    </section>
  )
}

/**
 * One full-width panel rather than a split: the label and the counter across
 * the top, then the titles with the skills alongside them, set between two
 * spacers so the slack is shared above and beneath instead of pooling in one
 * hole beside the titles.
 */
function ServicesPinned() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()

  // 400vh of section behind a 100dvh sticky pane leaves exactly 300vh of travel
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    let next = 0
    for (let i = STEP_TRIGGERS.length - 1; i >= 0; i--) {
      if (value >= STEP_TRIGGERS[i]) {
        next = i
        break
      }
    }
    setActive((current) => (current === next ? current : next))
  })

  const current = services[active]
  const still = Boolean(reduceMotion)

  return (
    <div ref={sectionRef} className="relative hidden h-[400vh] min-[992px]:block">
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
                    onClick={() => scrollToStep(sectionRef.current, index)}
                    aria-current={index === active ? "true" : undefined}
                    className="block w-full text-left text-[3.2em] font-medium leading-[1.3] tracking-[-0.03em]"
                    style={{ color: CUT }}
                    initial={false}
                    animate={{ opacity: index === active ? 1 : 0.4 }}
                    transition={
                      still
                        ? { duration: 0 }
                        : index === active
                          ? { duration: 0.3, delay: 0.15, ease: EASE_OUT_QUAD }
                          : { duration: 0.25, ease: EASE_OUT_QUAD }
                    }
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

        {/* Four stacked segments, one per service, filling as you scroll it */}
        <div className="flex shrink-0 pt-[1.5em] pb-[2.5em] pr-[2.5em]">
          <div className="flex h-full w-px flex-col">
            {services.map((service, index) => (
              <ProgressSegment
                key={service.number}
                progress={scrollYProgress}
                start={STEP_TRIGGERS[index]}
                end={STEP_TRIGGERS[index + 1] ?? 1}
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

function SkillColumn({ service, still }: { service: (typeof services)[number]; still: boolean }) {
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

/**
 * The section label, with the total beside it so it reads against the counter
 * across the top row - "(04)" here, "02" there.
 */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-[0.5em] text-[0.875em] font-medium italic uppercase leading-none tracking-[0.04em]"
      style={{ color: CUT }}
    >
      <AccentStar className="h-[0.75em] w-[0.75em] shrink-0" />
      {children}
      <span className="tabular-nums" style={{ color: CUT_DIM }}>
        ({String(services.length).padStart(2, "0")})
      </span>
    </span>
  )
}

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
function scrollToStep(section: HTMLDivElement | null, index: number) {
  if (!section) return
  const travel = section.offsetHeight - window.innerHeight
  const start = STEP_TRIGGERS[index]
  const end = STEP_TRIGGERS[index + 1] ?? 1
  const top = section.getBoundingClientRect().top + window.scrollY + travel * ((start + end) / 2)

  if (window.__lenis) {
    window.__lenis.scrollTo(top)
    return
  }
  window.scrollTo({ top, behavior: "smooth" })
}

/** One quarter of the track, filling across its own slice of the scroll. */
function ProgressSegment({ progress, start, end }: { progress: MotionValue<number>; start: number; end: number }) {
  const height = useTransform(progress, [start, end], ["0%", "100%"], { clamp: true })

  return (
    <div className="h-1/4 w-px overflow-hidden" style={{ backgroundColor: CUT_HAIRLINE }}>
      <motion.div className="w-px" style={{ height, backgroundColor: CUT }} />
    </div>
  )
}

/** Below the pin's breakpoint the four services simply stack, skills and all. */
function ServicesStacked() {
  return (
    <div className="py-[4em] min-[992px]:hidden" style={SHEET_STYLE}>
      <div className="px-[2.5em]">
        <Eyebrow>My services</Eyebrow>

        <ol className="mt-[2.5em] flex flex-col gap-[3.75em]">
          {services.map((service) => (
            <li key={service.number}>
              <div className="flex items-start justify-between gap-[1em]">
                <h3
                  className="text-[1.875em] font-medium leading-[1.2] tracking-[-0.03em] md:text-[2.625em]"
                  style={{ color: CUT }}
                >
                  {service.title}
                </h3>
                <div className="flex shrink-0 items-start gap-[0.25em]" style={{ color: CUT_DIM }}>
                  <span className="text-[1.5em] font-medium italic uppercase leading-none">{service.number}</span>
                  <AccentStar className="mt-[0.25em] h-[0.5em] w-[0.5em]" />
                </div>
              </div>

              <ul className="mt-[1.5em] grid grid-cols-2 gap-x-[1.5em] gap-y-[1em] md:grid-cols-3">
                {service.skills.map((skill, index) => (
                  <li key={skill} className="border-t pt-[0.75em]" style={{ borderColor: CUT_HAIRLINE }}>
                    <span
                      className="block text-[0.875em] font-medium italic uppercase leading-none"
                      style={{ color: CUT_DIM }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-[0.4em] block text-[1.0625em] font-medium leading-[1.25]" style={{ color: CUT }}>
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
