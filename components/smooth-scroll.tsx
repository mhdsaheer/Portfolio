"use client"

import { useEffect } from "react"
import Lenis from "lenis"

declare global {
  interface Window {
    /** The live instance. `window.lenis` is taken by the package itself. */
    __lenis?: Lenis
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Touch screens already scroll with native momentum, and Lenis leaves touch
    // alone anyway - so skip it there and spare the per-frame loop. Every caller
    // of window.__lenis falls back to native smooth scrolling without it.
    if (!window.matchMedia("(pointer: fine)").matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Lenis runs and cancels its own frame loop, so destroy() stops it too
      autoRaf: true,
    })

    window.__lenis = lenis

    return () => {
      delete window.__lenis
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
