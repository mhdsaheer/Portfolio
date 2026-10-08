import type { Variants } from "framer-motion"

export const EASE = [0.16, 1, 0.3, 1] as const

/** Counts and indexes are set two digits wide, as everywhere else on the site. */
export const pad = (value: number) => String(value).padStart(2, "0")

/**
 * The index's entrances. The resting states never change, so the server's HTML
 * and the first client render agree; with reduced motion only the timing does,
 * and everything lands at once.
 */
export function entrances(still: boolean) {
  const timed = (duration: number, delay = 0) => (still ? { duration: 0 } : { duration, delay, ease: EASE })

  return {
    // Tiles rise one after the next along a row; `custom` is the delay
    card: {
      hidden: { opacity: 0, y: 32 },
      shown: (delay: number) => ({ opacity: 1, y: 0, transition: timed(0.9, delay) }),
    },
  } satisfies Record<string, Variants>
}
