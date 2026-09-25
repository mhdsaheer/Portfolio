"use client"

import { useRef, type ReactNode } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"

import { GRAIN, PAPER } from "@/components/contact/paper"

/** How far the sheet may tip, in degrees, at the far corners. */
const TILT = 5.5

/**
 * The desk the letter lies on.
 *
 * The sheet is a real object under a light: it tips towards the cursor, a
 * specular sheen travels across the stock as it turns, and the shadow slides
 * the opposite way so the paper reads as lifted rather than painted on.
 *
 * All of it is motion values driving transforms - nothing here re-renders on
 * pointer move. On touch, and under reduced motion, the sheet simply lies flat.
 */
export function LetterDesk({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // -1 to 1 across the sheet, from its centre
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const spring = { stiffness: 140, damping: 18, mass: 0.6 }
  const tiltY = useSpring(useTransform(pointerX, [-1, 1], [-TILT, TILT]), spring)
  const tiltX = useSpring(useTransform(pointerY, [-1, 1], [TILT, -TILT]), spring)

  // The sheen crosses the sheet a little faster than the sheet turns
  const sheenX = useSpring(useTransform(pointerX, [-1, 1], [140, -40]), spring)
  const sheenY = useSpring(useTransform(pointerY, [-1, 1], [130, -30]), spring)
  const sheen = useMotionTemplate`radial-gradient(60% 55% at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.18) 38%, rgba(255,255,255,0) 72%)`

  // Shadow leans away from the light, so it tracks the tilt inverted
  const shadowX = useSpring(useTransform(pointerX, [-1, 1], [26, -26]), spring)
  const shadowY = useSpring(useTransform(pointerY, [-1, 1], [30, -10]), spring)
  const shadowShift = useMotionTemplate`translate3d(${shadowX}px, ${shadowY}px, 0)`

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const frame = frameRef.current
    if (!frame) return

    const box = frame.getBoundingClientRect()
    pointerX.set(((event.clientX - box.left) / box.width) * 2 - 1)
    pointerY.set(((event.clientY - box.top) / box.height) * 2 - 1)
  }

  const release = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div className="mx-auto w-full max-w-[46rem]" style={{ perspective: "1600px" }}>
      <motion.div
        ref={frameRef}
        onPointerMove={track}
        onPointerLeave={release}
        className="relative"
        style={reduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        {/* Cast shadow, kept as its own layer so it can lean independently */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-6 -z-10 rounded-[3px] blur-[38px]"
          style={{
            backgroundColor: "rgba(4, 10, 18, 0.72)",
            transform: reduceMotion ? undefined : shadowShift,
          }}
        />

        <div className="relative overflow-hidden rounded-[3px]" style={{ backgroundColor: PAPER }}>
          {/* Ambient light on the stock, under the moving specular pass */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 42%), " +
                "linear-gradient(200deg, rgba(22,32,44,0) 60%, rgba(22,32,44,0.06) 100%)",
            }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={reduceMotion ? { opacity: 0 } : { backgroundImage: sheen }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />

          <div className="relative px-7 py-9 sm:px-10 sm:py-12 md:px-16 md:py-14 lg:px-20">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
