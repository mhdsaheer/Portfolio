"use client"

import { useState, type FormEvent } from "react"
import { ArrowUpRight, Loader2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { useIntroDone } from "@/hooks/use-intro-done"
import { EASE_OUT_QUART } from "@/components/about/tokens"
import { CONTACT_EMAIL, CONTACT_ENDPOINT } from "@/lib/contact"
import { Blank, type BlankTone } from "@/components/contact/blank"
import { FOCUS_WASH, INK, INK_FAINT, INK_MUTED, PAPER, RULE_STRONG } from "@/components/contact/paper"

type Status = "idle" | "sending" | "sent" | "error"

type Fields = {
  name: string
  intent: string
  email: string
  phone: string
  project: string
  timeline: string
}

const EMPTY: Fields = { name: "", intent: "", email: "", phone: "", project: "", timeline: "" }

/** Ink on stock. The alphas are set for contrast in `paper.ts`. */
const TONE: BlankTone = {
  text: INK,
  placeholder: INK_FAINT,
  rule: RULE_STRONG,
  ruleFocus: INK,
  wash: FOCUS_WASH,
}

/**
 * The contact form written as a letter the visitor fills in rather than a stack
 * of labelled boxes. Every blank is a real input - the sentence around it is
 * the label, so nothing needs a caption above it.
 */
export function LetterForm() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<Status>("idle")
  const reduceMotion = useReducedMotion()
  const introDone = useIntroDone()

  const set = (key: keyof Fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const reach = [fields.email, fields.phone].filter(Boolean).join(" or at ")
    const message = [
      `I, ${fields.name}, want to ${fields.intent}.`,
      `You can reach me via ${reach}.`,
      fields.project || fields.timeline
        ? `My project is called ${fields.project || "—"} and I'm aiming to launch by ${fields.timeline || "—"}.`
        : null,
      "",
      "Cheers,",
      fields.name,
    ]
      .filter((line) => line !== null)
      .join("\n")

    // No endpoint configured yet - hand the finished letter to the visitor's
    // own mail client so the page still works rather than failing silently
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name}`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`
      return
    }

    setStatus("sending")
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, message }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setFields(EMPTY)
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const sending = status === "sending"

  /**
   * Each stanza follows the sheet down, a beat behind the one above it.
   *
   * `animate` always targets the settled state, never dropped: `useReducedMotion`
   * reports false on the first render and corrects itself after, and a stanza
   * that loses its target mid-flight would be stranded at opacity zero.
   */
  const stanza = (index: number) => {
    const shown = { opacity: 1, y: 0 }
    const waiting = { opacity: 0, y: 14 }

    return {
      initial: reduceMotion ? shown : waiting,
      animate: reduceMotion || introDone ? shown : waiting,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: EASE_OUT_QUART, delay: 0.5 + index * 0.09 },
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-12 text-base font-normal leading-none md:gap-y-16 md:text-xl"
      style={{ color: INK }}
    >
      <motion.h1 {...stanza(0)} className="text-base font-normal leading-none md:text-xl">
        Hi Saheer,
      </motion.h1>

      <motion.div {...stanza(1)} className="flex flex-col gap-y-6 md:gap-y-8">
        <Line>
          <span>I,</span>
          <Blank
            tone={TONE}
            name="name"
            label="Your name"
            placeholder="your name"
            value={fields.name}
            onChange={set("name")}
            autoComplete="name"
            maxCh={16}
            required
          />
          <span>want to</span>
          <Blank
            tone={TONE}
            name="intent"
            label="What you want to do"
            placeholder="build a portfolio / redesign my site"
            value={fields.intent}
            onChange={set("intent")}
            maxCh={20}
            required
          />
          <Punctuation />
        </Line>

        <Line>
          <span>You can reach me via</span>
          <Blank
            tone={TONE}
            name="email"
            label="Your email"
            placeholder="email@company.com"
            value={fields.email}
            onChange={set("email")}
            type="email"
            autoComplete="email"
            maxCh={24}
            required
          />
          <span>or at</span>
          <Blank
            tone={TONE}
            name="phone"
            label="Your phone number (optional)"
            placeholder="+91 000 000 0000"
            value={fields.phone}
            onChange={set("phone")}
            type="tel"
            autoComplete="tel"
            maxCh={20}
          />
          <Punctuation />
        </Line>
      </motion.div>

      <motion.div {...stanza(2)}>
        <Line>
          <span>My project is called</span>
          <Blank
            tone={TONE}
            name="project"
            label="Project name"
            placeholder="Project name"
            value={fields.project}
            onChange={set("project")}
            maxCh={16}
          />
          <span>and I&apos;m aiming to launch by</span>
          <Blank
            tone={TONE}
            name="timeline"
            label="Target launch"
            placeholder="Q3 2025"
            value={fields.timeline}
            onChange={set("timeline")}
            maxCh={12}
          />
          <Punctuation />
        </Line>
      </motion.div>

      <motion.div {...stanza(3)} className="flex flex-col gap-y-6 md:gap-y-8">
        <Line>
          <span>Cheers,</span>
        </Line>

        <Line>
          {/* The signature is the same answer as the opening line - filling in
              either one signs the letter, so nobody types their name twice.
              It is set in the serif italic, the way a name is signed. */}
          <Blank
            tone={TONE}
            name="signature"
            label="Sign off"
            placeholder="your name"
            value={fields.name}
            onChange={set("name")}
            autoComplete="name"
            maxCh={18}
            face="font-serif italic"
            italicPlaceholder={false}
          />
        </Line>
      </motion.div>

      <motion.div
        {...stanza(4)}
        className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Announced to screen readers the moment it changes */}
        <p aria-live="polite" className="text-sm leading-relaxed" style={{ color: INK_MUTED }}>
          {status === "sent" && <span style={{ color: INK }}>Thanks — I&apos;ll get back to you shortly.</span>}
          {status === "error" && (
            <span>
              That didn&apos;t send. Email me directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          )}
        </p>

        <button
          type="submit"
          disabled={sending}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: INK, color: PAPER }}
        >
          {sending ? "Sending…" : "Send it"}
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
        </button>
      </motion.div>
    </form>
  )
}

/** One sentence of the letter. It wraps like prose when the line runs out. */
function Line({ children }: { children: React.ReactNode }) {
  return <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-6 md:gap-y-8">{children}</p>
}

function Punctuation() {
  return <span aria-hidden>.</span>
}
