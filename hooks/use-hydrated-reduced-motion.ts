"use client"

import { useSyncExternalStore } from "react"
import { useReducedMotion } from "framer-motion"

/** Hydration is the only change this waits on, so there is nothing to listen to. */
const subscribe = () => () => {}

/**
 * The reduced-motion preference, held at false until the page has hydrated.
 *
 * framer's own hook answers on the very first client render, so anything it
 * decides there - an initial state, a bound style - differs from the server's
 * HTML, and React reports a mismatch it will not patch. Reporting false to the
 * server and to the render that hydrates its HTML keeps the two identical; a
 * visitor who asks for less motion has the entrances finish at once instead.
 */
export function useHydratedReducedMotion() {
  const reduceMotion = useReducedMotion()
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false)

  return hydrated && Boolean(reduceMotion)
}
