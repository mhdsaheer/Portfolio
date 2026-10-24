/**
 * Shared values for the About page sections.
 *
 * `FLUID` is the base font size those sections run at - one em to one vw - so
 * every em-based size below scales with the viewport rather than stepping at
 * breakpoints. The variable itself lives in globals.css.
 */
export const FLUID = "var(--about-fluid)"

/**
 * The footer's side gutter, 2.5em of the fluid base. Sections that set their
 * type in rem use it to share the footer's edge without taking on its scale.
 */
export const GUTTER = "calc(var(--about-fluid) * 2.5)"

/** Sections sit on the site's mesh background rather than their own ground. */
export const SURFACE = "transparent"

/**
 * The services panel is a white sheet screen-blended onto the page: white stays
 * white and black turns see-through. So its text is set in black to be cut out
 * of the sheet, and the lighter the black, the less of the background shows.
 */
export const SHEET = "#ffffff"
export const CUT = "#000000"
/** The counter and the faded lines - cut only partway through. */
export const CUT_DIM = "rgba(0, 0, 0, 0.55)"
export const CUT_HAIRLINE = "rgba(0, 0, 0, 0.18)"

export const INK = "#ffffff"
export const MUTED = "#a8c4dc"
/**
 * Read from `--accent` in globals.css, where the colour is set once, so inline
 * styles and Tailwind's `text-accent` can never drift apart.
 */
export const ACCENT = "var(--accent)"

export const HAIRLINE = "rgba(255, 255, 255, 0.15)"

export const CTA_GRADIENT = "linear-gradient(135deg, #203eec 0%, #00d4ff 100%)"
export const CTA_SHADOW = "0 8px 32px rgba(32, 62, 236, 0.35)"
/** The glow behind accent words - the accent itself at 18%, so a new accent brings its own glow. */
export const ACCENT_GLOW = "0 0 40px color-mix(in srgb, var(--accent) 18%, transparent)"

export type Cubic = [number, number, number, number]
export const EASE_OUT_QUART: Cubic = [0.165, 0.84, 0.44, 1]
export const EASE_OUT_QUAD: Cubic = [0.215, 0.61, 0.355, 1]
export const EASE_IN_QUAD: Cubic = [0.55, 0.055, 0.675, 0.19]
