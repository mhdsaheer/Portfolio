"use client"

import { motion, useReducedMotion } from "framer-motion"

import { AccentStar } from "@/components/about/accent-star"
import { INK_MUTED } from "@/components/contact/paper"

/**
 * Oxblood: the one colour on the site that is neither the blue ground nor the
 * paper. A wax seal in the site's pale accent would read as a generic button,
 * which is the opposite of the point.
 */
const WAX = "radial-gradient(circle at 34% 28%, #a8414c 0%, #8c2f39 46%, #661f27 100%)"
const WAX_COLD = "radial-gradient(circle at 34% 28%, #6c6560 0%, #57514d 46%, #423d3a 100%)"

/** Wax never sets perfectly round. */
const BLOB = "47% 53% 50% 50% / 52% 48% 53% 47%"

/**
 * The letter's send control, as the seal you press to close it.
 *
 * It stays cold and unpressable until the letter says enough to be worth
 * sending, warms when it does, and presses into the paper on submit. It is an
 * ordinary submit button underneath, with a written label beside it, so the
 * metaphor never costs anyone the ability to use the form.
 */
export function WaxSeal({
  ready,
  pressing,
  sending,
  caption,
}: {
  ready: boolean
  pressing: boolean
  sending: boolean
  caption: string
}) {
  const reduceMotion = useReducedMotion()
  const live = ready || sending

  return (
    <div className="flex items-center gap-[1.25em]">
      {/* Tied to the button so the reason it is cold is announced, not only seen */}
      <p id="seal-caption" className="max-w-[12em] text-right text-[0.8125rem] leading-[1.4]" style={{ color: INK_MUTED }}>
        {caption}
      </p>

      <motion.button
        type="submit"
        disabled={!ready || sending}
        aria-label={sending ? "Sending your letter" : "Seal and send the letter"}
        aria-describedby="seal-caption"
        className="relative h-[4.75rem] w-[4.75rem] shrink-0 cursor-pointer outline-none transition-opacity disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-4"
        style={{
          borderRadius: BLOB,
          background: live ? WAX : WAX_COLD,
          opacity: live ? 1 : 0.55,
          boxShadow: live
            ? "inset 0 3px 7px rgba(255,255,255,0.3), inset 0 -5px 10px rgba(0,0,0,0.42), 0 10px 22px rgba(90,20,28,0.42)"
            : "inset 0 2px 5px rgba(255,255,255,0.14), inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 10px rgba(4,10,18,0.22)",
          // The ring colour has to survive on both the wax and the paper
          ["--tw-ring-color" as string]: "#16202c",
        }}
        animate={
          reduceMotion
            ? undefined
            : pressing
              ? { scale: [1, 0.86, 1.04, 1], rotate: [0, -4, 2, 0] }
              : { scale: 1, rotate: 0 }
        }
        whileHover={reduceMotion || !live ? undefined : { scale: 1.05 }}
        transition={pressing ? { duration: 0.5, ease: "easeOut" } : { duration: 0.25 }}
      >
        {/* The mark struck into the wax: raised on its lit edge, cut on the other */}
        <AccentStar
          className="absolute left-1/2 top-1/2 h-[1.9rem] w-[1.9rem] -translate-x-1/2 -translate-y-1/2"
          style={{
            color: live ? "rgba(255, 228, 232, 0.42)" : "rgba(255, 255, 255, 0.22)",
            filter: "drop-shadow(0 1.5px 0 rgba(0,0,0,0.45)) drop-shadow(0 -1px 0 rgba(255,255,255,0.18))",
          }}
        />
      </motion.button>
    </div>
  )
}
