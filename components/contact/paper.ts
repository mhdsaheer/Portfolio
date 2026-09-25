/**
 * The contact letter is the one place on the site that is not dark. It is a
 * sheet of paper on the desk, so it carries its own palette rather than the
 * page's - ink on stock, not white on mesh.
 */

/** Warm off-white, a touch yellower than the blue it sits on. */
export const PAPER = "#f2efe8"
/** Near-black with a blue cast, so the ink still belongs to the site. */
export const INK = "#16202c"

/* The alphas below are set by contrast against PAPER, not by eye: 0.68 clears
   4.5:1 for small text, and 0.5 clears 3:1 for the underline, which is the
   affordance showing where to write. */
export const INK_MUTED = "rgba(22, 32, 44, 0.68)"
/** Placeholders and other text that is present but not yet answered. */
export const INK_FAINT = "rgba(22, 32, 44, 0.65)"
export const RULE = "rgba(22, 32, 44, 0.16)"
/** The blank's underline before it is written on. */
export const RULE_STRONG = "rgba(22, 32, 44, 0.5)"
/** Sits behind a field while it holds focus, like a highlighter pass. */
export const FOCUS_WASH = "rgba(22, 32, 44, 0.045)"

/** Where the sheet rests once it has been set down. */
export const SHADOW_SETTLED =
  "0 48px 90px -28px rgba(4, 10, 18, 0.62), 0 10px 28px rgba(4, 10, 18, 0.26)"
/** Held just above the desk - a tighter, darker contact shadow. */
export const SHADOW_LIFTED =
  "0 10px 22px -10px rgba(4, 10, 18, 0.34), 0 3px 8px rgba(4, 10, 18, 0.16)"

/**
 * Paper grain. An inline turbulence filter rather than an image, so it costs a
 * few hundred bytes and stays sharp at any density.
 */
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** An answer that is present but cannot be used. Readable on the cream stock. */
export const INVALID = "#a3261f"
