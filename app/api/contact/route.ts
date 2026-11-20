import { z } from "zod"

import { mailConfigured, sendToOwner } from "@/lib/mail"

/**
 * Every field on the letter is a single line, so line breaks are refused
 * outright - they have no honest use here, and keeping them out of the subject
 * means nothing a visitor types can be read as a mail header.
 */
const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((value) => !/[\r\n]/.test(value), "Must be one line")

const Letter = z.object({
  name: line(100).pipe(z.string().min(1)),
  intent: line(500).pipe(z.string().min(1)),
  email: line(254).pipe(z.email()),
  phone: line(40).default(""),
  project: line(120).default(""),
  timeline: line(60).default(""),
  // Hidden from people, so only a bot fills it in
  website: z.string().default(""),
})

export async function POST(request: Request) {
  if (!mailConfigured()) {
    return Response.json({ ok: false, error: "Mail is not configured" }, { status: 503 })
  }

  const parsed = Letter.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Invalid letter" }, { status: 400 })
  }

  const letter = parsed.data

  // Answer a bot exactly as a person would be answered, so it learns nothing
  if (letter.website) return Response.json({ ok: true })

  const text = [
    `${letter.name} wants to ${letter.intent}.`,
    "",
    `Email:    ${letter.email}`,
    `Phone:    ${letter.phone || "—"}`,
    `Project:  ${letter.project || "—"}`,
    `Launch:   ${letter.timeline || "—"}`,
    "",
    "Reply to this email to answer them directly.",
  ].join("\n")

  try {
    await sendToOwner({
      subject: `Portfolio enquiry from ${letter.name}`,
      text,
      replyTo: letter.email,
    })
  } catch (error) {
    // The details stay in the server log; the visitor only needs to know it failed
    console.error("Contact form: sending failed", error)
    return Response.json({ ok: false, error: "Could not send" }, { status: 502 })
  }

  return Response.json({ ok: true })
}
