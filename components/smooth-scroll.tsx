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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    window.__lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      delete window.__lenis
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
