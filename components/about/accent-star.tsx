import type { CSSProperties } from "react"

/**
 * The recurring accent mark of the About page - a four-point sparkle that sits
 * beside eyebrows, service titles and pull quotes. Drawn rather than imported
 * so it inherits `currentColor` and needs no icon-library weight.
 */
export function AccentStar({ className = "w-4 h-4", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} style={style}>
      <path d="M12 0c.62 6.2 5.8 11.38 12 12-6.2.62-11.38 5.8-12 12-.62-6.2-5.8-11.38-12-12C6.2 11.38 11.38 6.2 12 0Z" />
    </svg>
  )
}
