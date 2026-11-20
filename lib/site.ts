/**
 * The live origin, with no trailing slash. The sitemap and robots.txt build
 * absolute URLs from it, so changing domains is a one-line edit.
 */
export const SITE_URL = "https://www.saheer.online"

/**
 * A full URL for a path on this site ("/images/a.jpg"). Addresses that are
 * already absolute, such as uploaded images on Cloudinary, pass through.
 */
export function absoluteUrl(pathOrUrl: string) {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl}`
}
