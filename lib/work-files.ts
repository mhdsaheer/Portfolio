/*
 * Work that is shown rather than written up - a logo sheet, a screen set, a
 * poster. Each opens straight from the index: images in the page's own viewer,
 * links in a new tab. Anything that needs the story told is a case study
 * instead; the one PDF is the old portfolio, ARCHIVE_PDF.
 *
 * Work files are stored in Supabase and loaded by lib/projects-data.ts; their
 * shape is checked by the schema in lib/project-content.ts. What is here is
 * imported by the browser too, so it stays free of the schema library.
 */
export type { Shot, WorkFile } from "@/lib/project-content"
import type { Shot, WorkFile } from "@/lib/project-content"

/** Every picture of a piece, the card's own first. */
export function shotsOf(file: WorkFile): Shot[] {
  return [{ src: file.src, alt: file.alt ?? "" }, ...(file.more ?? [])]
}

/** The old portfolio, kept whole as one PDF. The filename has a space, hence %20. */
export const ARCHIVE_PDF = "/project/saheer-old%20portfolio.pdf"
