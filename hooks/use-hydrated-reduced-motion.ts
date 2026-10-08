"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

/**
 * The reduced-motion preference, held at false until the page has hydrated.
 *
 * framer's own hook answers on the very first client render, so anything it
 * decides there - an initial state, a bound style - differs from the server's
 * HTML, and React reports a mismatch it will not patch. Reading it one effect
 * later keeps that first render identical to the server's; a visitor who asks
 * for less motion has the entrances finish at once instead.
 */
export function useHydratedReducedMotion() {
  const reduceMotion = useReducedMotion()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  return hydrated && Boolean(reduceMotion)
}
