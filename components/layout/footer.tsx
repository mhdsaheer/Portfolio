import Link from "next/link"
import { ArrowUpRight, Download } from "lucide-react"

import { Lines } from "@/components/about/lines"
import { AccentStar } from "@/components/about/accent-star"
import { BackToTop } from "@/components/layout/back-to-top"
import {
  ACCENT,
  ACCENT_GLOW,
  CTA_GRADIENT,
  CTA_SHADOW,
  FLUID,
  HAIRLINE,
  INK,
  MUTED,
} from "@/components/about/tokens"
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  RESPONSE_TIME,
  RESUME_PATH,
  socials,
} from "@/lib/contact"

/** Only socials that have been filled in - no placeholder links ship. */
const activeSocials = socials.filter((social) => social.href)

/**
 * Written as explicit lines so each rises from its own mask, the way the About
 * page sets its statements.
 */
const headingLines = [
  <>Have something in mind?</>,
  <>
    Write me a{" "}
    <em className="font-serif text-[1.06em] font-normal italic" style={{ color: ACCENT, textShadow: ACCENT_GLOW }}>
      letter
    </em>
    .
  </>,
]

/**
 * The page's close: one invitation, then the particulars.
 *
 * The site used to end twice - a call to action, and then a footer repeating
 * the same email under a sitemap and a newsletter box. The navigation already
 * lives in the header, so a second copy of it at the bottom is furniture, and a
 * subscribe field promises a mailing list that does not exist.
 *
 * `invite` is turned off on the contact page, where asking someone to get in
 * touch is asking them to do what they are already doing.
 */
export function Footer({ invite = true }: { invite?: boolean }) {
  return (
    <footer style={{ fontSize: FLUID }}>
      {invite && (
        <div className="border-t px-[2.5em] py-[4.5em] lg:py-[6em]" style={{ borderColor: HAIRLINE }}>
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-[3em] lg:grid-cols-12 lg:gap-[2em]">
            <div className="flex flex-col gap-[1.25em] lg:col-span-7">
              <div className="flex items-center gap-[0.25em]" style={{ color: ACCENT }}>
                <AccentStar className="h-[0.625em] w-[0.625em] shrink-0" />
                <span className="text-[0.875em] font-medium uppercase italic leading-none">Contact</span>
              </div>

              <h2
                className="text-[2em] font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.5em] lg:text-[3.25em]"
                style={{ color: INK }}
              >
                <Lines lines={headingLines} />
              </h2>

              <div className="mt-[0.75em] flex flex-wrap items-center gap-[1em]">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-[0.5em] overflow-hidden rounded-full px-[1.6em] py-[0.85em] text-[1.0625em] font-medium leading-none text-white transition-all hover:shadow-2xl"
                  style={{ background: CTA_GRADIENT, boxShadow: CTA_SHADOW }}
                >
                  <span className="relative z-10 inline-flex items-center gap-[0.5em]">
                    Write a letter
                    <ArrowUpRight className="h-[1em] w-[1em] transition-transform group-hover:-translate-y-[0.1em] group-hover:translate-x-[0.1em]" />
                  </span>
                </Link>

                {/* Outlined against the filled primary: the same weight of
                    control, clearly the second choice. */}
                <a
                  href={RESUME_PATH}
                  download
                  className="group inline-flex items-center gap-[0.5em] rounded-full border px-[1.6em] py-[0.85em] text-[1.0625em] font-medium leading-none transition-colors hover:bg-white/5"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  Download resume
                  <Download className="h-[1em] w-[1em] transition-transform group-hover:translate-y-[0.1em]" />
                </a>
              </div>
            </div>

            {/* The direct routes, for anyone who would rather not use the letter */}
            <dl className="grid grid-cols-1 gap-x-[2em] gap-y-[1.5em] sm:grid-cols-3 lg:col-span-4 lg:col-start-9 lg:grid-cols-1">
              <Particular label="Email">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline-offset-4 hover:underline"
                  style={{ color: INK }}
                >
                  {CONTACT_EMAIL}
                </a>
              </Particular>

              <Particular label="Phone">
                <a href={`tel:${CONTACT_PHONE}`} className="underline-offset-4 hover:underline" style={{ color: INK }}>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </Particular>

              <Particular label="Response">
                <span style={{ color: INK }}>{RESPONSE_TIME}</span>
              </Particular>
            </dl>
          </div>
        </div>
      )}

      {/* Set in the mono, uppercase and tracked: the one place on the page that
          reads as machine-stamped rather than written. */}
      <div className="border-t px-[2.5em] py-[2.25em]" style={{ borderColor: HAIRLINE }}>
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[1.5em] font-mono text-[0.875em] leading-none tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between">
          <p style={{ color: MUTED }}>© {new Date().getFullYear()} Muhammed Saheer</p>

          <div className="flex flex-wrap items-center gap-x-[3.5em] gap-y-[1em]">
            {/* The socials group tightly; the control keeps its distance so it
                does not read as a fourth profile link. */}
            <div className="flex flex-wrap items-center gap-x-[2em] gap-y-[1em]">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="uppercase text-[#a8c4dc] transition-colors hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>

            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}

function Particular({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-[0.5em] text-[0.875em] font-medium uppercase tracking-[0.16em]" style={{ color: MUTED }}>
        {label}
      </dt>
      <dd className="text-[1.1875em] leading-none">{children}</dd>
    </div>
  )
}
