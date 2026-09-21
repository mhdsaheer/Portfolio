/**
 * Shared values for the About page sections.
 *
 * `FLUID` is the base font size those sections run at - one em to one vw - so
 * every em-based size below scales with the viewport rather than stepping at
 * breakpoints. The variable itself lives in globals.css.
 */
export const FLUID = "var(--about-fluid)"

/** Sections sit on the site's mesh background rather than their own ground. */
export const SURFACE = "transparent"
/** The one opaque surface: the services panel. */
export const PANEL = "#0a121c"

export const INK = "#ffffff"
export const MUTED = "#a8c4dc"
export const ACCENT = "#c8e0f5"
/** The service counter - present, but never competing with the titles. */
export const DIM = "rgba(255, 255, 255, 0.45)"

export const HAIRLINE = "rgba(255, 255, 255, 0.15)"
export const TRACK = "rgba(255, 255, 255, 0.18)"

export const CTA_GRADIENT = "linear-gradient(135deg, #203eec 0%, #00d4ff 100%)"
export const CTA_SHADOW = "0 8px 32px rgba(32, 62, 236, 0.35)"
/** Matches the glow the hero and about sections put behind accent words. */
export const ACCENT_GLOW = "0 0 40px rgba(200, 224, 245, 0.18)"

export type Cubic = [number, number, number, number]
export const EASE_OUT_QUART: Cubic = [0.165, 0.84, 0.44, 1]
export const EASE_OUT_QUAD: Cubic = [0.215, 0.61, 0.355, 1]
export const EASE_IN_QUAD: Cubic = [0.55, 0.055, 0.675, 0.19]
