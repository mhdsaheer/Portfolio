"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

/** A mouse or trackpad on a wide screen - the only place the custom cursor means anything. */
const FINE_POINTER = "(pointer: fine) and (min-width: 768px)"

// Split into its own chunk, so touch devices never download the cursor at all
const MagneticCursor = dynamic(() => import("./magnetic-cursor").then((mod) => mod.MagneticCursor), {
  ssr: false,
})

export function DesktopCursor() {
  const [hasMouse, setHasMouse] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER)
    const update = () => setHasMouse(query.matches)

    update()
    // A resized window or a docked tablet can cross the line either way
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return hasMouse ? <MagneticCursor /> : null
}
