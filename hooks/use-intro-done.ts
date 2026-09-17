"use client"

import { useEffect, useState } from "react"

/** Fired on window once the opening reveal has handed the page over. */
export const INTRO_DONE_EVENT = "intro:done"

export function isIntroDone() {
  if (typeof document === "undefined") return false
  return document.documentElement.dataset.introDone === "true"
}

/**
 * True once the opening reveal is finished, so hero content can start its own
 * entrance instead of playing behind the curtain.
 */
export function useIntroDone() {
  // Always false for the server render and the first client render, so
  // hydration matches; the effect below corrects it immediately after.
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (isIntroDone()) {
      setDone(true)
      return
    }

    const handleDone = () => setDone(true)
    window.addEventListener(INTRO_DONE_EVENT, handleDone)
    return () => window.removeEventListener(INTRO_DONE_EVENT, handleDone)
  }, [])

  return done
}
