"use client"

import type { ReactNode } from "react"
import { ArrowUpRight, FileText } from "lucide-react"
import { motion } from "framer-motion"

import { ACCENT, ACCENT_GLOW, GUTTER } from "@/components/about/tokens"
import { EASE } from "@/components/work/motion"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { useIntroDone } from "@/hooks/use-intro-done"

/**
 * The Work page's opening: the three disciplines said as one sentence - built,
 * designed, branded - with the way out to the old PDF portfolio beside it.
 *
 * The headline is sized off its own column. "Built, designed" sets 6.17em wide
 * at weight 800 and -0.055em, so 16cqi holds it on one line from tablets up.
 * Phones take it in three lines, the widest "& branded." at 4.34em - 22.5cqi.
 */
export function WorkHero({ archive }: { archive: string }) {
  const introDone = useIntroDone()
  const still = useHydratedReducedMotion()

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: still ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  })

  const word = { ready: introDone, still }

  return (
    <section className="relative pb-10 pt-28 md:pb-14 md:pt-36 lg:pt-40" style={{ paddingInline: GUTTER }}>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <div className="@container">
            <h1 className="text-[length:22.5cqi] font-semibold leading-none tracking-[-0.055em] text-white md:text-[length:12cqi]">
              {/* One line from tablets up, so the first two words need the space
                  between them; on phones they are blocks and it collapses away */}
              <span className="block md:inline">
                <Word {...word} delay={0.1}>
                  Built,
                </Word>
              </span>{" "}
              <span className="block md:inline">
                <Word {...word} delay={0.18}>
                  designed
                </Word>
              </span>
              <span className="block">
                <Word {...word} delay={0.26}>
                  &amp;
                </Word>{" "}
                <Word {...word} delay={0.32}>
                  <em
                    className="font-serif font-normal tracking-[-0.02em]"
                    style={{ color: ACCENT, textShadow: ACCENT_GLOW }}
                  >
                    branded.
                  </em>
                </Word>
              </span>
            </h1>
          </div>
        </div>

        <motion.div className="flex flex-col items-start gap-6 lg:col-span-4 lg:pb-4" {...rise(0.5)}>
          <p className="max-w-sm text-pretty text-[15px] leading-relaxed text-white/75">
            Development, UI/UX and branding in one place. The bigger projects are written up as case studies; everything
            else opens right here.
          </p>

          <a
            href={archive}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.06] py-2 pl-2 pr-5 text-sm font-medium text-white backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0d1b2c]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-white text-[#0d1b2c] transition-colors duration-300 group-hover:bg-[#0d1b2c] group-hover:text-white">
              <FileText aria-hidden className="size-4" />
            </span>
            Old portfolio
            <span className="rounded-full border border-current/40 px-2 py-0.5 text-[10px] uppercase italic leading-none opacity-80">
              PDF
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * A word rising into place from behind its own mask. The padding lets the
 * italic overhang and the descenders show; the negative margins give it back.
 */
function Word({ children, delay, ready, still }: { children: ReactNode; delay: number; ready: boolean; still: boolean }) {
  return (
    <span className="-mb-[0.12em] -mr-[0.08em] inline-block overflow-hidden pb-[0.12em] pr-[0.08em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: ready ? "0%" : "110%" }}
        transition={still ? { duration: 0 } : { duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}
