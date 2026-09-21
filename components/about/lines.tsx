"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { EASE_OUT_QUART } from "@/components/about/tokens"

/**
 * Text rising into place from behind a mask, one line after the next.
 *
 * Lines are given rather than measured, so a line that wraps on a narrow window
 * simply rises together with its continuation. The mask is padded and pulled
 * back by the same amount so descenders and italic overhang are not clipped at
 * rest - a bare `overflow: hidden` shaves them.
 */
export function Lines({
  lines,
  mode = "scroll",
  className,
  style,
}: {
  lines: ReactNode[]
  /** `load` arrives on mount, `scroll` waits until the block is in view. */
  mode?: "load" | "scroll"
  className?: string
  style?: React.CSSProperties
}) {
  const reduceMotion = useReducedMotion()

  const duration = mode === "load" ? 0.6 : 1
  const restingOpacity = mode === "load" ? 0 : 0.6

  return (
    <span className={className} style={style}>
      {lines.map((line, index) => {
        const arrive = { y: "0%", opacity: 1 }
        const transition = reduceMotion
          ? { duration: 0 }
          : { duration, ease: EASE_OUT_QUART, delay: index * 0.1 }

        return (
          <span key={index} className="block overflow-hidden py-[0.1em] -my-[0.1em]">
            <motion.span
              className="block"
              initial={{ y: "100%", opacity: restingOpacity }}
              {...(mode === "load"
                ? { animate: arrive }
                : { whileInView: arrive, viewport: { once: true, margin: "0px 0px -20% 0px" } })}
              transition={transition}
            >
              {line}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
