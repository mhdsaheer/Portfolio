"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { useIntroDone } from "@/hooks/use-intro-done"
import { EASE_OUT_QUART } from "@/components/about/tokens"
import { Blank, type BlankTone } from "@/components/contact/blank"
import { LetterDesk } from "@/components/contact/letter-desk"
import { WaxSeal } from "@/components/contact/wax-seal"
import { LocalDate } from "@/components/contact/local-time"
import { FOCUS_WASH, INK, INK_FAINT, INK_MUTED, INVALID, RULE, RULE_STRONG } from "@/components/contact/paper"
import { CONTACT_EMAIL, CONTACT_ENDPOINT, LOCATION } from "@/lib/contact"

type Status = "idle" | "pressing" | "sending" | "sent" | "error"

type Fields = {
  name: string
  intent: string
  email: string
  phone: string
  project: string
  timeline: string
}

const EMPTY: Fields = { name: "", intent: "", email: "", phone: "", project: "", timeline: "" }

/** Without these three there is nothing to reply to. */
const REQUIRED: (keyof Fields)[] = ["name", "intent", "email"]

const TONE: BlankTone = {
  text: INK,
  placeholder: INK_FAINT,
  rule: RULE_STRONG,
  ruleFocus: INK,
  wash: FOCUS_WASH,
  invalid: INVALID,
}

/**
 * Deliberately loose. The job here is to catch a typo before the seal warms,
 * not to adjudicate what is a legal address - the only real test is delivery.
 */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * The letter, written on a sheet that behaves like paper and closed with a wax
 * seal. The seal is the submit control: cold until the letter says enough to
 * be worth sending, then pressed into the page, after which the sheet is taken
 * away and the confirmation is left in its place.
 */
export function LetterShowpiece() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<Status>("idle")
  // Set once the address has been left alone, so nobody is told they are wrong mid-word
  const [emailTouched, setEmailTouched] = useState(false)
  const reduceMotion = useReducedMotion()
  const introDone = useIntroDone()

  const set = (key: keyof Fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }))

  const emailUsable = LOOKS_LIKE_EMAIL.test(fields.email.trim())
  // A warm seal that does nothing when pressed is worse than a cold one, so an
  // address that cannot be replied to keeps the wax cold.
  const ready = REQUIRED.every((key) => fields[key].trim().length > 0) && emailUsable
  const emailWrong = emailTouched && fields.email.trim().length > 0 && !emailUsable

  const caption =
    status === "sending"
      ? "Sending…"
      : emailWrong
        ? "That address doesn't look right."
        : ready
          ? "Press the seal to send."
          : "Your name, what you want, and an address."

  function compose() {
    const reach = [fields.email, fields.phone].filter(Boolean).join(" or at ")

    return [
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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ready || status === "sending") return

    // Let the seal finish pressing before anything else happens
    setStatus("pressing")
    if (!reduceMotion) await new Promise((resolve) => setTimeout(resolve, 420))

    const message = compose()

    // No endpoint configured yet - hand the finished letter to the visitor's
    // own mail client. A mailto does not navigate, so the page stays put and
    // the confirmation has to say plainly what just happened.
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name}`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`
      setStatus("sent")
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
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const sent = status === "sent"

  /**
   * `animate` always targets the settled state: `useReducedMotion` reports
   * false on the first render and corrects itself after, and a stanza that
   * lost its target mid-flight would be stranded at opacity zero.
   */
  const stanza = (index: number) => {
    const shown = { opacity: 1, y: 0 }
    const waiting = { opacity: 0, y: 14 }

    return {
      initial: reduceMotion ? shown : waiting,
      animate: reduceMotion || introDone ? shown : waiting,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: EASE_OUT_QUART, delay: 0.55 + index * 0.08 },
    }
  }

  const blank = { tone: TONE }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <Confirmation key="confirmation" name={fields.name} posted={!CONTACT_ENDPOINT} />
      ) : (
        <motion.div
          key="sheet"
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -70, scale: 0.92, rotate: -2.5 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.65, 0.1, 0, 1] }}
        >
          <LetterDesk>
        <form onSubmit={handleSubmit}>
          <Letterhead />

          <div
            className="flex flex-col gap-y-12 text-base font-normal leading-none md:gap-y-16 md:text-xl"
            style={{ color: INK }}
          >
            <motion.h2 {...stanza(0)} className="text-base font-normal leading-none md:text-xl">
              Hi Saheer,
            </motion.h2>

            <motion.div {...stanza(1)} className="flex flex-col gap-y-6 md:gap-y-8">
              <Line>
                <span>I,</span>
                <Blank
                  {...blank}
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
                    {...blank}
                    name="intent"
                    label="What you want to do"
                    placeholder="redesign my site"
                    value={fields.intent}
                    onChange={set("intent")}
                    maxCh={20}
                    required
                  />
                  <Stop />
                </Tail>
              </Line>

              <Line>
                <span>You can reach me via</span>
                <Blank
                  {...blank}
                  name="email"
                  label="Your email"
                  placeholder="email@company.com"
                  value={fields.email}
                  onChange={set("email")}
                  type="email"
                  autoComplete="email"
                  maxCh={24}
                  required
                  invalid={emailWrong}
                  onFocusChange={(focused) => !focused && setEmailTouched(true)}
                />
                <span>or at</span>
                <Tail>
                  <Blank
                    {...blank}
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
              </Line>

              {emailWrong && (
                <p id="letter-email-error" className="text-[0.8125rem] leading-[1.4]" style={{ color: INVALID }}>
                  That address doesn&apos;t look right — I won&apos;t be able to reply to it.
                </p>
              )}
            </motion.div>

            <motion.div {...stanza(2)}>
              <Line>
                {/* Named as optional in the prose, so the dashed rules below
                    have something to mean rather than being decoration. */}
                <span>If it helps: my project is called</span>
                <Blank
                  {...blank}
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
                    {...blank}
                    name="timeline"
                    label="Target launch"
                    placeholder="Q3 2025"
                    value={fields.timeline}
                    onChange={set("timeline")}
                    maxCh={12}
                  />
                  <Stop />
                </Tail>
              </Line>
            </motion.div>

            <motion.div {...stanza(3)} className="flex flex-col gap-y-6 md:gap-y-8">
              <Line>
                <span>Cheers,</span>
              </Line>

              <Line>
                {/* The signature is the same answer as the opening line - filling
                    in either one signs the letter, so nobody types their name
                    twice. Set in the serif italic, the way a name is signed. */}
                <Blank
                  {...blank}
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

            <motion.div {...stanza(4)} className="flex justify-end pt-2">
              <WaxSeal
                ready={ready}
                pressing={status === "pressing"}
                sending={status === "sending"}
                caption={caption}
              />
            </motion.div>

            {status === "error" && (
              <p role="alert" className="text-right text-[0.8125rem]" style={{ color: "#8c2f39" }}>
                That didn&apos;t send. Email me directly at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
          </div>
        </form>
          </LetterDesk>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Who the letter is to, when it is being written, and how far along it is. */
/**
 * Printed stationery: the name it belongs to, the particulars under it, and a
 * rule. Nothing here reports on the form - a letterhead that opens by telling
 * you it is empty reads as an error state, and the seal already says what is
 * still missing, in words, where the decision is actually made.
 */
function Letterhead() {
  return (
    <header className="mb-12 border-b pb-5 md:mb-16" style={{ borderColor: RULE }}>
      <p className="text-[1.25rem] font-medium leading-none tracking-[-0.02em]" style={{ color: INK }}>
        Muhammed Saheer
      </p>

      {/* One quiet row under the name: who and where on the left, when on the
          right. The date only - a clock ticking through a letter is unsettling. */}
      <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
          Frontend developer · {LOCATION}
        </p>

        <p className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
          <LocalDate />
        </p>
      </div>
    </header>
  )
}

/**
 * Takes the sheet's place once it has been sent, on the page's own ground
 * rather than over the paper.
 */
function Confirmation({ name, posted }: { name: string; posted: boolean }) {
  const reduceMotion = useReducedMotion()
  const firstName = name.trim().split(/\s+/)[0]

  return (
    <motion.div
      className="mx-auto flex min-h-[20rem] w-full max-w-[34rem] flex-col items-center justify-center gap-5 px-6 text-center"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT_QUART }}
    >
      <p role="status" className="text-2xl font-normal leading-tight text-white md:text-3xl">
        Sealed{firstName ? `, ${firstName}` : ""}.
      </p>

      <p className="text-[0.9375rem] leading-relaxed" style={{ color: "#a8c4dc" }}>
        {posted ? (
          <>
            Your mail client should be open with the letter in it — press send there and it reaches me. If nothing
            opened, write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </>
        ) : (
          <>It&apos;s with me. I answer every one, usually within a day.</>
        )}
      </p>

      <Link
        href="/"
        className="text-[0.8125rem] underline underline-offset-4 transition-colors hover:text-white"
        style={{ color: "#a8c4dc" }}
      >
        Back to home
      </Link>
    </motion.div>
  )
}

/** One sentence of the letter. It wraps like prose when the line runs out. */
function Line({ children }: { children: ReactNode }) {
  return <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-6 md:gap-y-8">{children}</p>
}

function Stop() {
  return <span aria-hidden>.</span>
}

/** Keeps a sentence's closing blank and its full stop on the same line. */
function Tail({ children }: { children: ReactNode }) {
  return <span className="inline-flex min-w-0 items-baseline gap-x-2.5">{children}</span>
}
