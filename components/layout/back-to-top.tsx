"use client"

import { ArrowUp } from "lucide-react"

/**
 * Lenis owns the scroll position, so a plain `#top` anchor or `window.scrollTo`
 * would fight it and land with a jolt. Ask Lenis when it is there, and fall
 * back to the native scroll when it is not - on a page where smooth scrolling
 * never started, the fallback is what runs.
 */
export function BackToTop() {
  const toTop = () => {
    if (typeof window === "undefined") return

    if (window.__lenis) {
      window.__lenis.scrollTo(0)
      return
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      className="group inline-flex items-center gap-[0.5em] uppercase text-[#a8c4dc] transition-colors hover:text-white"
    >
      Back to top
      <ArrowUp className="h-[1.25em] w-[1.25em] transition-transform group-hover:-translate-y-[0.15em]" aria-hidden />
    </button>
  )
}
