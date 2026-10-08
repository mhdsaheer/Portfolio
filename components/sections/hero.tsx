"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { useIntroDone } from "@/hooks/use-intro-done"

const EASE = [0.16, 1, 0.3, 1] as const

/** Height of the fixed bar, so the scrolled-to section is not tucked under it. */
const HEADER_OFFSET = 80

/** How far each line travels sideways by the time the hero has scrolled away. */
const DRIFT = "36vw"

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const introDone = useIntroDone()
  const reduceMotion = useReducedMotion()

  // The two lines part ways as the hero leaves: one out left, one out right
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const driftLeft = useTransform(scrollYProgress, [0, 1], ["0vw", `-${DRIFT}`])
  const driftRight = useTransform(scrollYProgress, [0, 1], ["0vw", DRIFT])

  const lines = [
    { text: "Designer.", x: driftLeft },
    { text: "Developer.", x: driftRight },
  ]

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  })

  /** Lenis owns the scroll position, so ask it first, like the nav does. */
  const toWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

    const works = document.getElementById("works")
    if (!works) return

    e.preventDefault()
    if (window.__lenis) {
      window.__lenis.scrollTo(works, { offset: -HEADER_OFFSET })
      return
    }
    window.scrollTo({
      top: works.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  // overflow-clip, not hidden - it trims the lines as they drift off the sides without
  // turning the section into a scroll container
  return (
    <section ref={sectionRef} className="relative flex min-h-svh flex-col overflow-clip pt-24 md:pt-28">
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 pb-10 md:px-12 md:pb-12">
        {/*
          The headline is sized by whichever runs out first, width or height. At weight 800
          and -0.06em, "Developer." sets 4.47em wide, so 22.4cqi fills the column. Two lines at
          leading 1 take 2em, so 46cqh keeps both, descenders included, inside the space left
          between the nav and the bottom row - that is what shrinks it on short laptops.
          The container is pinned inside the flex slot rather than being the slot itself:
          Chrome reads cqh as 0 on a container whose height comes from flex-grow.
        */}
        <div className="relative min-h-48 flex-1">
          <div className="absolute inset-0 flex flex-col justify-end [container-type:size]">
            <h1 className="font-sans text-[length:min(22.4cqi,46cqh)] font-extrabold leading-none tracking-[-0.06em] text-white">
              {lines.map((line, index) => (
                <motion.span
                  key={line.text}
                  // Each line is its own mask. The padding lets descenders show, the negative
                  // margin gives the space back; the nudge left sits the D's stem on the column edge.
                  className="-mb-[0.1em] -ml-[0.03em] block w-max overflow-hidden pb-[0.1em]"
                  style={reduceMotion ? undefined : { x: line.x }}
                >
                  <motion.span
                    className="block whitespace-nowrap"
                    initial={{ y: "115%" }}
                    animate={{ y: introDone ? "0%" : "115%" }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 1.1, delay: 0.1 + index * 0.12, ease: EASE }
                    }
                  >
                    {line.text}
                  </motion.span>
                </motion.span>
              ))}
            </h1>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-end gap-8 md:mt-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,23.5rem)_auto] lg:gap-x-10 xl:gap-x-16">
          {/* Tablets give the tagline a row of its own; half the width would break it in two.
              From lg the row is three columns sized by their contents, so the paragraph
              lands near the centre and "View Works" never wraps. */}
          <motion.div className="md:col-span-2 lg:col-span-1" {...rise(0.45)}>
            <p className="font-serif text-4xl italic leading-[1.1] text-white md:text-5xl lg:text-4xl xl:text-5xl">who removes friction</p>
          </motion.div>

          <motion.p className="max-w-[23.5rem] text-pretty text-[15px] leading-relaxed text-white/75" {...rise(0.55)}>
            I design in Figma and build fast, responsive websites in React and Next.js, with Strapi CMS so you can
            update content yourself, and branding to match. Let's build yours.
          </motion.p>

          <motion.div className="md:justify-self-end" {...rise(0.65)}>
            <Link
              href="#works"
              onClick={toWorks}
              className="group inline-flex items-center gap-4 whitespace-nowrap text-base font-medium text-white"
            >
              View Works
              <span className="grid size-12 place-items-center rounded-full border border-white/35 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0d1b2c]">
                <ArrowDown
                  className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
