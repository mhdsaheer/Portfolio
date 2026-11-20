/**
 * Everything the contact page and the footer read from. Fill in the blanks and
 * the whole site follows - nothing here is duplicated anywhere else.
 */

export const CONTACT_EMAIL = "muhammedsaheerk6@gmail.com"

/**
 * Kept in two forms: the dialable one for `tel:`, which needs the country code
 * and no spaces, and the readable one for the page.
 */
export const CONTACT_PHONE = "+919747343117"
export const CONTACT_PHONE_DISPLAY = "+91 97473 43117"

/** wa.me wants digits only - no plus, no spaces. Derived so it cannot drift. */
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE.replace(/\D/g, "")}`

/**
 * Where the contact form posts. app/api/contact sends it over SMTP (the
 * SMTP_* values in .env.example). Set this to "" and the form composes the
 * message in the visitor's own mail client instead.
 */
export const CONTACT_ENDPOINT: string = "/api/contact"

export const LOCATION = "Kerala, India"
export const AVAILABILITY = "Open to remote & relocation"
export const TIME_ZONE = "Asia/Kolkata"
export const RESPONSE_TIME = "Usually within a day"

/**
 * The address stays fixed so links already sent out keep working - replace the
 * file behind it rather than renaming it. The name is what downloads save as.
 */
export const RESUME_PATH = "/muhammed-saheer-resume.pdf"
export const RESUME_FILENAME = "Muhammed Saheer Resume Front-End Developer.pdf"

export type Social = { label: string; href: string }

/** Only entries with a href render, so no dead links ship. */
export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/mhdsaheer" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammed-saheer-bbb6132ab/" },
  { label: "WhatsApp", href: WHATSAPP_URL },
]
