"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { useIntroDone } from "@/hooks/use-intro-done"
import { EASE_OUT_QUART } from "@/components/about/tokens"
import { GRAIN, PAPER, SHADOW_LIFTED, SHADOW_SETTLED } from "@/components/contact/paper"

/**
 * The sheet the letter is written on.
 *
 * It arrives the way paper is put down on a desk: carried in from above with a
 * slight tilt, landing square as its contact shadow spreads out underneath.
 *
 * It waits for the opening curtain to lift first - the whole point of the move
 * is that it is watched, and on a cold load it would otherwise play out behind
 * the loader and be over before the page was visible.
 */
export function LetterSheet({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const introDone = useIntroDone()

  const lifted = { opacity: 0, y: -34, rotate: -1.4, scale: 1.02, boxShadow: SHADOW_LIFTED }
  const settled = { opacity: 1, y: 0, rotate: 0, scale: 1, boxShadow: SHADOW_SETTLED }
  const hasLanded = reduceMotion || introDone

  return (
    <motion.div
      initial={reduceMotion ? settled : lifted}
      animate={hasLanded ? settled : lifted}
      transition={
        reduceMotion
          ? { duration: 0 }
          : // Measured: the curtain hands over ~1.9s in, and its window is fully
            // open by then. The short delay lets the page settle before the
            // sheet comes down; the longer duration gives the move some weight.
            { duration: 1.15, delay: 0.12, ease: EASE_OUT_QUART }
      }
      className="relative mx-auto w-full max-w-[46rem] overflow-hidden rounded-[3px]"
      style={{ backgroundColor: PAPER, transformOrigin: "50% 0%" }}
    >
      {/* Light falling across the stock, brightest at the top left corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 38%), " +
            "linear-gradient(200deg, rgba(22,32,44,0) 62%, rgba(22,32,44,0.05) 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="relative px-7 py-9 sm:px-10 sm:py-12 md:px-16 md:py-14 lg:px-20">{children}</div>
    </motion.div>
  )
}
