/**
 * Class strings for the insight cover's label and way on. The cover takes both
 * from the page that uses it - the index's heading and "Read the article", an
 * article's "All insights" - and these keep the two pages' versions matched.
 */

/** The small label at the head of a cover, on smoked glass so it reads on light art as well as dark. */
export const COVER_LABEL =
  "inline-flex w-fit items-center gap-2.5 rounded-full bg-[#07111c]/55 px-3.5 py-2 font-mono text-xs uppercase leading-none tracking-[0.18em] text-white/90 backdrop-blur-md"

/** The cover's way on: a round arrow and its words, the way the home hero ends. */
export const COVER_ACTION = "group inline-flex items-center gap-4 whitespace-nowrap text-base font-medium text-white"

export const COVER_ACTION_ROUND =
  "grid size-12 place-items-center rounded-full border border-white/40 bg-[#07111c]/25 backdrop-blur-md transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0d1b2c]"
