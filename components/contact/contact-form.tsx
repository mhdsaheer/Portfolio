"use client"

import { useState, type FormEvent } from "react"
import { ArrowUpRight, Loader2 } from "lucide-react"

import { CONTACT_EMAIL, CONTACT_ENDPOINT } from "@/lib/contact"

type Status = "idle" | "sending" | "sent" | "error"

const fieldClass =
  "w-full px-4 py-3 text-sm bg-secondary rounded-xl border border-border outline-none transition-colors " +
  "placeholder:text-muted-foreground/70 focus:border-[#c8e0f5] focus:ring-2 focus:ring-[#203eec]/40"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "")
    const email = String(data.get("email") ?? "")
    const message = String(data.get("message") ?? "")

    // No endpoint yet - hand the composed message to the visitor's mail client
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
      const body = encodeURIComponent(`${message}\n\n--\n${name}\n${email}`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
      return
    }

    setStatus("sending")
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const sending = status === "sending"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Name
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          What are you building?
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="A sentence or two about the project, the timeline, and what you need from me."
          className={`${fieldClass} resize-y min-h-[9rem]`}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium text-white rounded-full relative overflow-hidden transition-all hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #203eec 0%, #00d4ff 100%)",
            boxShadow: "0 8px 32px rgba(32, 62, 236, 0.35)",
          }}
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {sending ? "Sending…" : "Send message"}
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </span>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl bg-gradient-to-r from-[#203eec] to-[#00d4ff]" />
        </button>

        {/* Announced to screen readers the moment it changes */}
        <p aria-live="polite" className="text-sm">
          {status === "sent" && <span style={{ color: "#c8e0f5" }}>Thanks — I&apos;ll get back to you shortly.</span>}
          {status === "error" && (
            <span className="text-red-300">
              That didn&apos;t send. Email me directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  )
}
