"use client"

import { useSyncExternalStore } from "react"

/** Fired on window once the opening reveal has handed the page over. */
export const INTRO_DONE_EVENT = "intro:done"

export function isIntroDone() {
  if (typeof document === "undefined") return false
  return document.documentElement.dataset.introDone === "true"
}

function subscribe(onDone: () => void) {
  window.addEventListener(INTRO_DONE_EVENT, onDone)
  return () => window.removeEventListener(INTRO_DONE_EVENT, onDone)
}

/**
 * True once the opening reveal is finished, so hero content can start its own
 * entrance instead of playing behind the curtain.
 */
export function useIntroDone() {
  // Always false for the server render and the render that hydrates it, so
  // hydration matches; React reads the real answer straight after.
  return useSyncExternalStore(subscribe, isIntroDone, () => false)
}
