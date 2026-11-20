"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { FOCUS } from "@/components/guide/tokens"
import { cn } from "@/lib/utils"

/** Shows once the reader is well past the opening screen. */
const SHOW_AFTER = 1.5 // viewports

/**
 * A floating way back to the top for a long guide. It goes through Lenis when
 * smooth scrolling is running and motion is welcome, natively otherwise, and
 * then moves focus to the page's heading, so a keyboard user starts again
 * from the top rather than from the button.
 */
export function BackToTopButton({ targetId }: { targetId: string }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setShown(window.scrollY > window.innerHeight * SHOW_AFTER)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
    }
  }, [])

  const toTop = () => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (window.__lenis && !still) {
      window.__lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: still ? "instant" : "smooth" })
    }
    document.getElementById(targetId)?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      // Out of the tab order and hidden from assistive technology until it appears
      inert={!shown}
      className={cn(
        "fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full border border-[#20212A]/10 bg-white text-[#20212A] shadow-[0_14px_34px_-14px_rgba(32,33,42,0.45)] transition-[opacity,transform,background-color,color] duration-300 hover:bg-[#20212A] hover:text-white motion-reduce:transition-none md:bottom-8 md:right-8",
        FOCUS,
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  )
}
