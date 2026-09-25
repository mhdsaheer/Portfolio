"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { ArrowUpRight, Loader2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { useIntroDone } from "@/hooks/use-intro-done"
import { AccentStar } from "@/components/about/accent-star"
import {
  ACCENT,
  ACCENT_GLOW,
  CTA_GRADIENT,
  CTA_SHADOW,
  EASE_OUT_QUART,
  FLUID,
  HAIRLINE,
  INK,
  MUTED,
} from "@/components/about/tokens"
import { Blank, type BlankTone } from "@/components/contact/blank"
import { CONTACT_EMAIL, CONTACT_ENDPOINT } from "@/lib/contact"

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

/**
 * Answers are written in accent, the sentence around them in plain white, so
 * what the visitor has said is legible apart from what the page said for them.
 */
const TONE: BlankTone = {
  text: ACCENT,
  placeholder: MUTED,
  rule: "rgba(255, 255, 255, 0.55)",
  ruleFocus: ACCENT,
  wash: "rgba(200, 224, 245, 0.07)",
}

/**
 * The letter set as a stack of ruled rows, on the same grid and rhythm as the
 * work index - the page reads as a continuation of the site rather than a
 * detour. The row being written in holds the accent and the others step back,
 * the way a hovered project row does.
 */
export function LetterRows() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<Status>("idle")
  const [activeRow, setActiveRow] = useState<number | null>(null)
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
   * Rows arrive once the opening curtain has handed over, one after the next.
   *
   * `animate` always targets the settled state: `useReducedMotion` reports
   * false on the first render and corrects itself after, and a row that lost
   * its target mid-flight would be stranded at opacity zero.
   */
  const arrive = (index: number) => {
    const shown = { opacity: 1, y: "0em" }
    const waiting = { opacity: 0, y: "1.2em" }

    return {
      initial: reduceMotion ? shown : waiting,
      animate: reduceMotion || introDone ? shown : waiting,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.75, ease: EASE_OUT_QUART, delay: 0.1 + index * 0.1 },
    }
  }

  /** A row dims only while some other row is being written in. */
  const dimmed = (index: number) => activeRow !== null && activeRow !== index

  const blankProps = (index: number) => ({
    tone: TONE,
    onFocusChange: (focused: boolean) =>
      setActiveRow((current) => (focused ? index : current === index ? null : current)),
  })

  return (
    <form onSubmit={handleSubmit} style={{ fontSize: FLUID }}>
      <Row {...arrive(0)} dimmed={dimmed(0)}>
        <span>Hi Saheer, I,</span>
        <Blank
          {...blankProps(0)}
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
        <Tail>
          <Blank
            {...blankProps(0)}
            name="intent"
            label="What you want to do"
            placeholder="build a portfolio / redesign my site"
            value={fields.intent}
            onChange={set("intent")}
            maxCh={22}
            required
          />
          <Stop />
        </Tail>
      </Row>

      <Row {...arrive(1)} dimmed={dimmed(1)}>
        <span>You can reach me via</span>
        <Blank
          {...blankProps(1)}
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
        <Tail>
          <Blank
            {...blankProps(1)}
            name="phone"
            label="Your phone number (optional)"
            placeholder="+91 000 000 0000"
            value={fields.phone}
            onChange={set("phone")}
            type="tel"
            autoComplete="tel"
            maxCh={20}
          />
          <Stop />
        </Tail>
      </Row>

      <Row {...arrive(2)} dimmed={dimmed(2)}>
        <span>My project is called</span>
        <Blank
          {...blankProps(2)}
          name="project"
          label="Project name"
          placeholder="Project name"
          value={fields.project}
          onChange={set("project")}
          maxCh={16}
        />
        <span>and I&apos;m aiming to launch by</span>
        <Tail>
          <Blank
            {...blankProps(2)}
            name="timeline"
            label="Target launch"
            placeholder="Q3 2025"
            value={fields.timeline}
            onChange={set("timeline")}
            maxCh={12}
          />
          <Stop />
        </Tail>
      </Row>

      <Row {...arrive(3)} dimmed={dimmed(3)}>
        <span>Cheers,</span>
        {/* The signature is the same answer as the opening row - filling in
            either one signs the letter, so nobody types their name twice. It
            is set in the serif italic, the way a name is signed. */}
        <Blank
          {...blankProps(3)}
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
      </Row>

      <motion.div
        {...arrive(4)}
        className="px-[2.5em] pt-[2.5em]"
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col-reverse items-start gap-[1.5em] sm:flex-row sm:items-center sm:justify-between">
          {/* Announced to screen readers the moment it changes */}
          <p aria-live="polite" className="text-[0.9375em] leading-[1.45]" style={{ color: MUTED }}>
            {status === "sent" && <span style={{ color: ACCENT }}>Thanks — I&apos;ll get back to you shortly.</span>}
            {status === "error" && (
              <span>
                That didn&apos;t send. Email me directly at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2" style={{ color: ACCENT }}>
                  {CONTACT_EMAIL}
                </a>
                .
              </span>
            )}
          </p>

          <button
            type="submit"
            disabled={sending}
            className="group relative inline-flex shrink-0 items-center gap-[0.5em] overflow-hidden rounded-full px-[2em] py-[1em] text-[0.9375em] font-medium text-white transition-all hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: CTA_GRADIENT, boxShadow: CTA_SHADOW }}
          >
            <span className="relative z-10 inline-flex items-center gap-[0.5em]">
              {sending ? "Sending…" : "Send it"}
              {sending ? (
                <Loader2 className="h-[1em] w-[1em] animate-spin" />
              ) : (
                <ArrowUpRight className="h-[1em] w-[1em] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </span>
          </button>
        </div>
      </motion.div>
    </form>
  )
}

/**
 * One sentence of the letter, ruled off like a project row. It wraps like
 * prose when the measure runs out.
 */
function Row({
  children,
  dimmed,
  ...motionProps
}: {
  children: ReactNode
  dimmed: boolean
} & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div {...motionProps} className="border-b" style={{ borderColor: HAIRLINE }}>
      {/* Dimmed more softly than the work index dims its rows: focus persists
          while you type, so answers already written must stay readable. */}
      <div
        className="px-[2.5em] pb-[1.6em] pt-[2em] transition-opacity duration-500"
        style={{ opacity: dimmed ? 0.55 : 1 }}
      >
        <p
          className="mx-auto flex w-full max-w-[1280px] flex-wrap items-baseline gap-x-[0.4em] gap-y-[0.75em] text-[1.5em] font-normal leading-[1.35] tracking-[-0.01em] md:text-[2em]"
          style={{ color: INK }}
        >
          {children}
        </p>
      </div>
    </motion.div>
  )
}

function Stop() {
  return <span aria-hidden>.</span>
}

/** Keeps a sentence's closing blank and its full stop on the same line. */
function Tail({ children }: { children: ReactNode }) {
  return <span className="inline-flex min-w-0 items-baseline gap-x-[0.4em]">{children}</span>
}

/** Eyebrow and title, on the same grid the work index opens with. */
export function LetterRowsHeading() {
  return (
    <div
      className="px-[2.5em] pb-[3em] pt-[9em] lg:pb-[4em] lg:pt-[11em]"
      style={{ fontSize: FLUID }}
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-end gap-[1.5em] lg:grid-cols-12">
        <div className="flex flex-col gap-[1em] lg:col-span-7">
          <div className="flex items-center gap-[0.25em]" style={{ color: ACCENT }}>
            <AccentStar className="h-[0.625em] w-[0.625em] shrink-0" />
            <span className="text-[0.875em] font-medium italic uppercase leading-none">Contact</span>
          </div>

          <h1
            className="text-[2.25em] font-medium leading-none tracking-[-0.03em] md:text-[3em] lg:text-[4em]"
            style={{ color: INK }}
          >
            Write me a{" "}
            <em
              className="font-serif text-[1.06em] font-normal italic"
              style={{ color: ACCENT, textShadow: ACCENT_GLOW }}
            >
              letter
            </em>
            .
          </h1>
        </div>

        <p
          className="text-[1.0625em] leading-[1.45] lg:col-span-4 lg:col-start-9"
          style={{ color: MUTED }}
        >
          Fill in the blanks. It reaches me as an email, and I answer every one.
        </p>
      </div>
    </div>
  )
}
