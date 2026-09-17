"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "framer-motion"

import { INTRO_DONE_EVENT } from "@/hooks/use-intro-done"

const SESSION_KEY = "intro-seen"
/** Flip to false to replay the reveal on every load while tuning it. */
const PLAY_ONCE_PER_SESSION = true

/** Longest the curtain may hold even if assets are still in flight. */
const MAX_HOLD = 2400
/** Shortest the curtain stays, so a warm cache still reads as deliberate. */
const MIN_HOLD = 900

type Phase = "loading" | "plate" | "full" | "out"

const EASE = [0.76, 0, 0.24, 1] as const

/**
 * A rectangle with a rectangular hole cut out of the middle, as a clip path.
 * The ground keeps its grain and paper colour; the hole is a window onto the
 * live hero underneath, so the page reveals itself rather than a stand-in image.
 */
function keyhole(width: number, height: number) {
  const round = (value: number) => Number(value.toFixed(3))
  const left = round((100 - width) / 2)
  const right = round((100 + width) / 2)
  const top = round((100 - height) / 2)
  const bottom = round((100 + height) / 2)

  return `polygon(0% 0%, 0% 100%, ${left}% 100%, ${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%, ${left}% 100%, 100% 100%, 100% 0%)`
}

/** Window sizes, as a percentage of the viewport, for each stage of the open. */
const WINDOW = {
  closed: keyhole(0, 0),
  sliver: keyhole(2.4, 17),
  plate: keyhole(48, 56),
  full: keyhole(102, 102),
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

function markDone() {
  document.documentElement.dataset.introDone = "true"
  window.dispatchEvent(new Event(INTRO_DONE_EVENT))
}

export function IntroLoader() {
  const [isOpen, setIsOpen] = useState(true)
  const [phase, setPhase] = useState<Phase>("loading")
  const [count, setCount] = useState(0)
  const progress = useMotionValue(0)
  const barWidth = useMotionTemplate`${progress}%`
  const skipped = useRef(false)

  // Repeat visits in the same tab skip the curtain entirely, before first paint
  useIsomorphicLayoutEffect(() => {
    let seen = false
    try {
      seen = PLAY_ONCE_PER_SESSION && window.sessionStorage.getItem(SESSION_KEY) === "true"
    } catch {
      seen = false
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (seen || reduceMotion) {
      skipped.current = true
      setIsOpen(false)
      markDone()
    }
  }, [])

  // Hold the page still while the curtain is up
  useEffect(() => {
    if (!isOpen) return
    const root = document.documentElement
    root.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    window.scrollTo(0, 0)

    return () => {
      root.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Drive the hairline from real loading progress, capped by time either way
  useEffect(() => {
    if (!isOpen || skipped.current || phase !== "loading") return

    const startedAt = performance.now()
    let assetsReady = false
    let frame = 0

    const assets = document.fonts ? document.fonts.ready : Promise.resolve()
    const cap = new Promise((resolve) => setTimeout(resolve, MAX_HOLD))
    Promise.race([assets, cap]).then(() => {
      assetsReady = true
    })

    const tick = () => {
      const elapsed = performance.now() - startedAt
      // Creeps toward 92% on time alone, then completes once assets land
      const byTime = Math.min(elapsed / MIN_HOLD, 1) * 92
      const target = assetsReady ? 100 : byTime

      const next = progress.get() + (target - progress.get()) * 0.14
      progress.set(next)

      const rounded = Math.round(next)
      setCount((current) => (current === rounded ? current : rounded))

      if (next >= 99.4 && elapsed >= MIN_HOLD) {
        progress.set(100)
        setCount(100)
        setPhase("plate")
        return
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isOpen, phase, progress])

  // The window opens in two moves, then the ground is gone
  useEffect(() => {
    if (phase === "loading" || phase === "out") return

    const timers: ReturnType<typeof setTimeout>[] = []

    if (phase === "plate") {
      timers.push(setTimeout(() => setPhase("full"), 820))
    }

    if (phase === "full") {
      // Hand over as the window opens, so the hero writes itself in on cue
      markDone()
      try {
        window.sessionStorage.setItem(SESSION_KEY, "true")
      } catch {
        // private mode - the curtain simply plays again next time
      }
      timers.push(setTimeout(() => setPhase("out"), 1000))
    }

    return () => timers.forEach(clearTimeout)
  }, [phase])

  // Unmount once the ground has finished clearing
  useEffect(() => {
    if (phase !== "out") return
    const timer = setTimeout(() => setIsOpen(false), 200)
    return () => clearTimeout(timer)
  }, [phase])

  const windowShape =
    phase === "loading" ? WINDOW.sliver : phase === "plate" ? WINDOW.plate : WINDOW.full

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div key="intro" aria-hidden className="fixed inset-0 z-[200] overflow-hidden pointer-events-none">
          {/* Paper ground with a window cut through it onto the live page */}
          <motion.div
            className="absolute inset-0 bg-[#f4f3f1]"
            initial={{ clipPath: WINDOW.closed }}
            animate={{ clipPath: windowShape }}
            transition={{ duration: phase === "loading" ? 0.7 : 0.95, ease: EASE }}
          >
            <div className="intro-grain absolute inset-0" />
          </motion.div>

          {/* Hairline and counter, drawn the way the reference draws its rules */}
          <motion.div
            className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-8 md:pb-10"
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="max-w-[1280px] mx-auto">
              <div className="flex items-end justify-between gap-6 mb-4">
                <motion.span
                  className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  Muhammed Saheer — Frontend Developer
                </motion.span>
                <span className="text-[10px] md:text-[11px] font-mono tabular-nums text-neutral-500">
                  {String(count).padStart(3, "0")}
                </span>
              </div>

              <div className="h-px w-full bg-neutral-900/15">
                <motion.div className="h-full bg-neutral-900/70" style={{ width: barWidth }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
