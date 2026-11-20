import type { DesignKind } from "@/lib/insight-content"

/**
 * The guide layout's palette: a light page in the site's ink, with five
 * accents. The bright accents (#4263EB, #8B5CF6, #F472B6, #FB923C, #34B779)
 * are for fills, dots and borders; text in an accent uses the deeper shade
 * beside it, which clears 4.5:1 on white and on every tint below.
 *
 * Class strings are written out in full so Tailwind can find them.
 */

/** Headings and strong text: 16:1 on white. */
export const INK = "text-[#20212A]"
/** Body copy: at least 8.7:1 on every tint. */
export const BODY = "text-[#3F4150]"
/** Captions and meta: at least 5.1:1 on every tint. */
export const MUTED = "text-[#5F6373]"

/** The guide's focus ring, in its blue. */
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4263EB]"

/** Long text keeps to about 70 characters a line, whatever the column around it. */
export const MEASURE = "max-w-[68ch]"

/** Clears the fixed header when a heading is jumped to. Focus lands on it, without a ring. */
export const ANCHOR = "scroll-mt-28 focus:outline-none"

export type KindStyle = {
  /** A solid swatch: dots, bars and borders. */
  fill: string
  /** A pale ground for panels and chips. */
  tint: string
  /** Text in the accent, on white or on the tint. */
  text: string
  /** A hairline in the accent. */
  border: string
}

/** Each kind of design decision keeps one colour through the article. */
export const KIND_STYLES: Record<DesignKind, KindStyle> = {
  "Visual style": {
    fill: "bg-[#8B5CF6]",
    tint: "bg-[#F1ECFF]",
    text: "text-[#6D28D9]",
    border: "border-[#8B5CF6]/30",
  },
  "Website type": {
    fill: "bg-[#4263EB]",
    tint: "bg-[#EAF2FF]",
    text: "text-[#3451D1]",
    border: "border-[#4263EB]/30",
  },
  "Site structure": {
    fill: "bg-[#F472B6]",
    tint: "bg-[#FFF0F6]",
    text: "text-[#BE185D]",
    border: "border-[#F472B6]/40",
  },
  "Layout approach": {
    fill: "bg-[#FB923C]",
    tint: "bg-[#FFF7E6]",
    text: "text-[#C2410C]",
    border: "border-[#FB923C]/40",
  },
  Technique: {
    fill: "bg-[#34B779]",
    tint: "bg-[#E8F7EF]",
    text: "text-[#1F7A4D]",
    border: "border-[#34B779]/40",
  },
}

/** The order the kinds are introduced in, and the order of the five-colour cycles elsewhere. */
export const ACCENT_CYCLE = [
  { fill: "bg-[#4263EB]", tint: "bg-[#EAF2FF]", text: "text-[#3451D1]" },
  { fill: "bg-[#8B5CF6]", tint: "bg-[#F1ECFF]", text: "text-[#6D28D9]" },
  { fill: "bg-[#F472B6]", tint: "bg-[#FFF0F6]", text: "text-[#BE185D]" },
  { fill: "bg-[#FB923C]", tint: "bg-[#FFF7E6]", text: "text-[#C2410C]" },
  { fill: "bg-[#34B779]", tint: "bg-[#E8F7EF]", text: "text-[#1F7A4D]" },
]

/** Two-digit numbering, as the contents and the sections show it. */
export const pad = (n: number) => String(n).padStart(2, "0")
