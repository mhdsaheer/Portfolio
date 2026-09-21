"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

import type { CaseStudy } from "@/lib/case-studies"
import { ACCENT, EASE_OUT_QUART, FLUID, HAIRLINE, INK, MUTED, PANEL } from "@/components/about/tokens"

/** The easing the row fill and the follower share, so the two read as one move. */
const SWEEP = "cubic-bezier(0.65, 0.1, 0, 1)"
const LABEL = "View"

/**
 * The project index.
 *
 * Above 992px it is a list of full-width rows - category, title, year - with
 * the thumbnail lifted out of the row and carried by the cursor instead. The
 * hovered row fills with accent from its baseline and every other row steps
 * back, so only one project is ever in focus.
 *
 * Below that, and on any pointer that cannot hover, the same projects are
 * stacked as cards with their thumbnails back in place.
 */
export function ProjectList({ projects }: { projects: CaseStudy[] }) {
  const [active, setActive] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <>
      <Follower project={active === null ? null : projects[active]} />

      <section className="hidden min-[992px]:block" style={{ fontSize: FLUID }}>
        <ul>
          {projects.map((project, index) => {
            const isActive = active === index
            const isDimmed = active !== null && !isActive

            return (
              <motion.li
                key={project.slug}
                initial={{ opacity: 0, y: "1.5em" }}
                whileInView={{ opacity: 1, y: "0em" }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT_QUART }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive((current) => (current === index ? null : current))}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive((current) => (current === index ? null : current))}
                  className="relative block overflow-hidden border-b px-[2.5em] pb-[2em] pt-[2.5em] no-underline transition-opacity duration-500"
                  style={{
                    borderColor: HAIRLINE,
                    color: isActive ? PANEL : INK,
                    opacity: isDimmed ? 0.5 : 1,
                    transitionTimingFunction: SWEEP,
                  }}
                >
                  {/* Fills from the baseline up, behind the row's own text */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 z-0"
                    style={{
                      backgroundColor: ACCENT,
                      height: isActive ? "100%" : "0%",
                      transition: reduceMotion ? "none" : `height 0.5s ${SWEEP}`,
                    }}
                  />

                  <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-row items-end justify-between gap-[1.5em]">
                    <div className="flex flex-1 items-center pt-[0.5em]">
                      <span className="text-[1.0625em] font-medium leading-none">{project.category}</span>
                    </div>

                    <div className="relative flex flex-none items-center justify-center">
                      <h2 className="text-[4em] font-normal italic leading-[1.1] tracking-[-0.03em]">
                        {project.title}
                      </h2>

                      {/* Just outside the title's baseline corner, so a long
                          title never collides with the label */}
                      <span className="absolute bottom-0 right-0 translate-x-[calc(100%+1em)]">
                        <ViewLabel active={isActive} />
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-end pt-[0.5em]">
                      <span className="text-right text-[1.0625em] font-medium leading-none">{project.year}</span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </section>

      <section className="px-[2.5em] min-[992px]:hidden" style={{ fontSize: FLUID }}>
        <ul className="flex flex-col gap-[3em]">
          {projects.map((project, index) => (
            <motion.li
              key={project.slug}
              initial={{ opacity: 0, y: "1.5em" }}
              whileInView={{ opacity: 1, y: "0em" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT_QUART }}
            >
              <Link href={`/work/${project.slug}`} className="block no-underline">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[0.75em]">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover"
                  />

                  <span className="absolute left-[1em] top-[1em] rounded-full bg-black/45 px-[0.85em] py-[0.4em] text-[0.75em] font-medium uppercase italic leading-none text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                <div className="mt-[1em] flex items-baseline justify-between gap-[1em]">
                  <h2
                    className="text-[1.75em] font-normal italic leading-[1.1] tracking-[-0.03em]"
                    style={{ color: INK }}
                  >
                    {project.title}
                  </h2>
                  <span className="shrink-0 text-[0.9375em] font-medium" style={{ color: MUTED }}>
                    {project.year}
                  </span>
                </div>

                <div className="mt-[0.75em] h-px" style={{ backgroundColor: HAIRLINE }} />

                <p className="mt-[0.75em] text-[1em] leading-[1.45]" style={{ color: MUTED }}>
                  {project.description}
                </p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>
    </>
  )
}

/**
 * "View", revealed a letter at a time. The mask is padded and pulled back by
 * the same amount so the italic overhang is not shaved while the word rests.
 */
function ViewLabel({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <span aria-hidden className="-my-[0.15em] flex overflow-hidden py-[0.15em] text-[1.0625em] font-medium leading-none">
      {LABEL.split("").map((character, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={false}
          animate={{ y: active ? "0%" : "120%", opacity: active ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE_OUT_QUART, delay: active ? index * 0.03 : 0 }
          }
        >
          {character}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * The thumbnail the cursor carries. It trails the pointer rather than tracking
 * it exactly - the lag is what makes it read as a held object. Only mounted
 * where a real pointer exists; touch gets the card list instead.
 */
function Follower({ project }: { project: CaseStudy | null }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const reduceMotion = useReducedMotion()
  const [canHover, setCanHover] = useState(false)
  // Rows also activate on keyboard focus; without a known pointer position the
  // follower would appear in the corner, so it waits for a real mouse move.
  const [hasPointer, setHasPointer] = useState(false)
  const isVisible = Boolean(project) && hasPointer

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 992px)")
    const sync = () => setCanHover(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  // The pointer is tracked whenever the follower could be shown; the frame is
  // only animated while a row is hovered, so idle scrolling costs nothing.
  useEffect(() => {
    if (!canHover) return

    const track = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      setHasPointer(true)
    }

    window.addEventListener("mousemove", track, { passive: true })
    return () => window.removeEventListener("mousemove", track)
  }, [canHover])

  useEffect(() => {
    const frame = frameRef.current
    if (!canHover || !frame || !isVisible) return

    let { x, y } = pointerRef.current
    let animationFrameId = 0

    const place = () => {
      frame.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    // Snap to the pointer before the frame scales up, then trail it from there
    place()

    if (reduceMotion) return

    const tick = () => {
      x += (pointerRef.current.x - x) * 0.14
      y += (pointerRef.current.y - y) * 0.14
      place()
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [canHover, isVisible, reduceMotion])

  if (!canHover) return null

  return (
    <div
      ref={frameRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex aspect-[4/5] w-[16em] items-center justify-center overflow-hidden rounded-[0.5em]"
      style={{ fontSize: FLUID, opacity: isVisible ? 1 : 0, transition: "opacity 0.1s ease" }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{
          transform: isVisible ? "scale(1)" : "scale(0)",
          transition: reduceMotion ? "none" : `transform 0.6s ${SWEEP}`,
        }}
      >
        {project ? <Image key={project.slug} src={project.image} alt="" fill sizes="20vw" className="object-cover" /> : null}

        <span
          className="relative z-10 rounded-[0.25em] bg-black/40 px-[1em] py-[0.5em] text-[0.875em] font-medium italic leading-none text-white backdrop-blur-[4px]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0%)" : "translateY(100%)",
            transition: reduceMotion ? "none" : `opacity 0.1s ease, transform 0.6s ${SWEEP}`,
          }}
        >
          {LABEL}
        </span>
      </div>
    </div>
  )
}
