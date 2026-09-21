/**
 * Everything the contact page and the footer read from. Fill in the blanks and
 * the whole site follows - nothing here is duplicated anywhere else.
 */

/** TODO: replace with your real address before this goes live. */
export const CONTACT_EMAIL = "hello@example.com"

/**
 * A form endpoint - Formspree, Web3Forms, or your own API route. Left empty,
 * the form composes the message in the visitor's mail client instead, so the
 * page works either way rather than shipping a button that does nothing.
 */
export const CONTACT_ENDPOINT: string = ""

export const LOCATION = "Kerala, India"
export const TIME_ZONE = "Asia/Kolkata"
export const RESPONSE_TIME = "Usually within a day"
export const RESUME_PATH = "/muhammed-saheer-resume.pdf"

export type Social = { label: string; href: string }

/** Only entries with a href render, so no dead links ship. */
export const socials: Social[] = [
  { label: "LinkedIn", href: "" },
  { label: "GitHub", href: "" },
  { label: "Instagram", href: "" },
]
