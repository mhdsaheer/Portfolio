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
  ACCENT,
  DIM,
  EASE_IN_QUAD,
  EASE_OUT_QUAD,
  EASE_OUT_QUART,
  FLUID,
  HAIRLINE,
  INK,
  PANEL,
  TRACK,
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
    body: "Every screen gets built the way it was drawn. React and Next.js, componentised and responsive, with the loading and empty states handled rather than bolted on once something breaks.",
    skills: ["React.js", "Next.js", "JavaScript (ES6+)", "HTML5 & CSS3", "Tailwind CSS", "Bootstrap"],
  },
  {
    number: "02",
    title: "Back-End & CMS",
    body: "The half nobody sees. Node and Express behind a Mongo database, REST endpoints that stay predictable, and Strapi, Moodle or Notion wired up so your team can edit the content without calling me.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Strapi CMS", "Moodle"],
  },
  {
    number: "03",
    title: "UI/UX Design",
    body: "Every aspect of the design is thought through, and you can see it. Figma and XD from the first wireframe to the final state, laid out to hold up on a phone and in every browser you care about.",
    skills: ["Figma", "Adobe XD", "Responsive Design", "Cross-Browser Compatibility", "Canva","Notion"],
  },
  {
    number: "04",
    title: "Branding & Identity",
    body: "A strong identity is the base the rest of it sits on. Logo, type and colour built into a system, so the site, the deck and anything printed all read as one thing.",
    skills: ["Logo Design", "Brand Identity", "Photoshop", "Illustrator", "InDesign"],
  },
]

/**
 * Where each service takes over, as a fraction of the pin's scroll. Deliberately
 * uneven - the first card is brief and the rest get room to be read.
 */
const STEP_TRIGGERS = [0, 0.2, 0.5, 0.8]

export function Services() {
  return (
    <section id="services" aria-label="Services" style={{ fontSize: FLUID }}>
      <ServicesPinned />
      <ServicesStacked />
    </section>
  )
}

/**
 * One full-width panel rather than a split. Three bands - the label, then the
 * titles with the skills and the counter alongside them, then the description
 * under a rule - spaced apart by `justify-between`, so the slack is shared
 * between them instead of pooling in one hole beside the titles.
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
      <div className="sticky top-0 flex h-[100dvh] w-full overflow-hidden" style={{ backgroundColor: PANEL }}>
        <div className="flex flex-1 flex-col justify-between px-[2.5em] pt-[1.5em] pb-[2.5em]">
          <Eyebrow>My services</Eyebrow>

          {/* Reserved to the tallest it can ever be - six skill rows - so the
              band does not resize when a service carries fewer of them */}
          <div className="flex min-h-[20.5em] items-start justify-between gap-[4em]">
            <ol>
              {services.map((service, index) => (
                <li key={service.number}>
                  <motion.button
                    type="button"
                    onClick={() => scrollToStep(sectionRef.current, index)}
                    aria-current={index === active ? "true" : undefined}
                    className="block w-full text-left text-[3.2em] font-medium leading-[1.3] tracking-[-0.03em]"
                    style={{ color: INK }}
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

            {/* The toolkit for the current service, filling the middle */}
            <SkillColumn service={current} still={still} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.number}
                className="flex shrink-0 items-start gap-[0.25em]"
                style={{ color: DIM }}
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

          {/* Likewise reserved for four lines of copy, so the rule keeps its
              place whether the description runs to two lines or four */}
          <div className="min-h-[8.25em]">
            <div className="h-px" style={{ backgroundColor: HAIRLINE }} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.number}
                className="mt-[2em] max-w-[34em] text-[1.0625em] leading-[1.45]"
                style={{ color: INK }}
                initial={{ y: still ? 0 : 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: still ? 0 : -40, opacity: 0 }}
                transition={still ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT_QUART }}
              >
                {current.body}
              </motion.p>
            </AnimatePresence>
          </div>
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
 * list grow down the panel and shove the description out of the frame, the
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
    <div className="min-w-0" style={{ width: `${Math.min(columns === 1 ? 30 : columns * 22, 52)}em` }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={service.number}
          className="grid border-t"
          style={{
            borderColor: HAIRLINE,
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
              style={{ borderColor: HAIRLINE }}
              variants={itemVariants(still)}
            >
              <span
                className={`font-medium leading-[1.3] ${size}`}
                style={{ color: INK }}
              >
                {skill}
              </span>
              <span
                className="shrink-0 text-[0.875em] font-medium italic uppercase leading-none"
                style={{ color: DIM }}
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-[0.25em] text-[0.875em] font-medium italic uppercase leading-none"
      style={{ color: INK }}
    >
      <AccentStar className="h-[0.625em] w-[0.625em] shrink-0" style={{ color: ACCENT }} />
      {children}
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

/** Puts the reader in the middle of a service's band of scroll. */
function scrollToStep(section: HTMLDivElement | null, index: number) {
  if (!section) return
  const travel = section.offsetHeight - window.innerHeight
  const start = STEP_TRIGGERS[index]
  const end = STEP_TRIGGERS[index + 1] ?? 1
  window.scrollTo({ top: section.offsetTop + travel * ((start + end) / 2), behavior: "smooth" })
}

/** One quarter of the track, filling across its own slice of the scroll. */
function ProgressSegment({ progress, start, end }: { progress: MotionValue<number>; start: number; end: number }) {
  const height = useTransform(progress, [start, end], ["0%", "100%"], { clamp: true })

  return (
    <div className="h-1/4 w-px overflow-hidden" style={{ backgroundColor: TRACK }}>
      <motion.div className="w-px" style={{ height, backgroundColor: INK }} />
    </div>
  )
}

/** Below the pin's breakpoint the four services simply stack, skills and all. */
function ServicesStacked() {
  return (
    <div className="py-[4em] min-[992px]:hidden" style={{ backgroundColor: PANEL }}>
      <div className="px-[2.5em]">
        <Eyebrow>My services</Eyebrow>

        <ol className="mt-[2.5em] flex flex-col gap-[3.75em]">
          {services.map((service) => (
            <li key={service.number}>
              <div className="flex items-start justify-between gap-[1em]">
                <h3
                  className="text-[1.875em] font-medium leading-[1.2] tracking-[-0.03em] md:text-[2.625em]"
                  style={{ color: INK }}
                >
                  {service.title}
                </h3>
                <div className="flex shrink-0 items-start gap-[0.25em]" style={{ color: DIM }}>
                  <span className="text-[1.5em] font-medium italic uppercase leading-none">{service.number}</span>
                  <AccentStar className="mt-[0.25em] h-[0.5em] w-[0.5em]" />
                </div>
              </div>

              <p className="mt-[0.75em] text-[1.0625em] leading-[1.45]" style={{ color: INK }}>
                {service.body}
              </p>

              <ul className="mt-[1.5em] grid grid-cols-2 gap-x-[1.5em] gap-y-[1em] md:grid-cols-3">
                {service.skills.map((skill, index) => (
                  <li key={skill} className="border-t pt-[0.75em]" style={{ borderColor: HAIRLINE }}>
                    <span
                      className="block text-[0.875em] font-medium italic uppercase leading-none"
                      style={{ color: DIM }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-[0.4em] block text-[1.0625em] font-medium leading-[1.25]" style={{ color: INK }}>
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
