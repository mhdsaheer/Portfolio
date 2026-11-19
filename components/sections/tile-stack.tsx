"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

/**
 * Publishes the tallest card's height as --card-height, which the cards' pin positions
 * are worked out from. Measured because the height comes from the card's words as well
 * as the screen: long copy on a narrow phone grows it past anything CSS can predict.
 */
export function TileStack({ style, children }: { style: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stack = ref.current
    if (!stack) return

    const cards = Array.from(stack.children) as HTMLElement[]
    const observer = new ResizeObserver(() => {
      stack.style.setProperty("--card-height", `${Math.max(...cards.map((card) => card.offsetHeight))}px`)
    })
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative" style={style}>
      {children}
    </div>
  )
}
