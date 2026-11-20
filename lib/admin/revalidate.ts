import "server-only"

import { revalidatePath } from "next/cache"

/**
 * Rebuilds every page after a save: content shows up in more than one place
 * (the home page has both insights and projects), and the site is small
 * enough that refreshing all of it is simpler than tracking which pages a
 * change touches.
 */
export function revalidateSite() {
  revalidatePath("/", "layout")
  revalidatePath("/sitemap.xml")
}
