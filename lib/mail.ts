import "server-only"

import nodemailer from "nodemailer"

import { CONTACT_EMAIL } from "@/lib/contact"

/**
 * Outgoing mail over SMTP. Any provider works - Gmail with an app password,
 * Brevo, Zoho, Resend's SMTP relay - because only the four SMTP_* values in
 * .env.example change between them.
 *
 * Returns null when SMTP is not set up, so the caller can answer "not
 * configured" instead of throwing on every request.
 */
function smtpEnv() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  const port = Number(process.env.SMTP_PORT || 465)

  return {
    host,
    port,
    // true only for 465 (TLS from the first byte). On 587 the connection starts
    // plain and is upgraded with STARTTLS, which requireTLS insists on.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    // Fail inside a serverless function's time limit rather than hanging on it
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    // Some providers log in with an ID that is not an address (Resend's is
    // "resend"), so the sender can be set separately.
    from: process.env.SMTP_FROM || user,
    to: process.env.CONTACT_TO || CONTACT_EMAIL,
  }
}

export function mailConfigured() {
  return smtpEnv() !== null
}

type Letter = {
  subject: string
  text: string
  /** The visitor's address, so pressing reply answers them, not the site. */
  replyTo: string
}

/** Sends one message to the site owner's inbox. */
export async function sendToOwner({ subject, text, replyTo }: Letter) {
  const env = smtpEnv()
  if (!env) throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS (see .env.example).")

  const { from, to, ...transport } = env
  const transporter = nodemailer.createTransport(transport)

  await transporter.sendMail({
    from: { name: "Portfolio contact form", address: from },
    to,
    replyTo,
    subject,
    text,
  })
}
