/**
 * Everything the contact page and the footer read from. Fill in the blanks and
 * the whole site follows - nothing here is duplicated anywhere else.
 */

/** TODO: replace with your real address before this goes live. */
export const CONTACT_EMAIL = "hello@example.com"

/**
 * Kept in two forms: the dialable one for `tel:`, which needs the country code
 * and no spaces, and the readable one for the page.
 */
export const CONTACT_PHONE = "+919747343117"
export const CONTACT_PHONE_DISPLAY = "+91 97473 43117"

/** wa.me wants digits only - no plus, no spaces. Derived so it cannot drift. */
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE.replace(/\D/g, "")}`

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
  { label: "GitHub", href: "https://github.com/mhdsaheer" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammed-saheer-bbb6132ab/" },
  { label: "WhatsApp", href: `https://wa.me/${CONTACT_PHONE.replace(/\D/g, "")}` },
]
