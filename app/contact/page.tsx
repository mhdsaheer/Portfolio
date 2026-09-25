import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LetterShowpiece } from "@/components/contact/letter-showpiece"
import { ACCENT, HAIRLINE, INK, MUTED } from "@/components/about/tokens"
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  LOCATION,
  RESPONSE_TIME,
  RESUME_PATH,
  socials,
} from "@/lib/contact"

export const metadata: Metadata = {
  title: "Contact | Muhammed Saheer",
  description: "Get in touch about frontend development, interface design or a project you are planning.",
  openGraph: {
    title: "Contact | Muhammed Saheer",
    description: "Get in touch about frontend development, interface design or a project you are planning.",
    type: "website",
  },
}

/** Only socials that have been filled in - no placeholder links ship. */
const activeSocials = socials.filter((social) => social.href)

export default function ContactPage() {
  return (
    <>
      <Header />

      <main>
        <section id="contact" className="px-5 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-36">
          {/* The letterhead carries the page's title visually; this is for
              anything reading the document rather than looking at it. */}
          <h1 className="sr-only">Contact Muhammed Saheer</h1>

          <LetterShowpiece />

          <div className="mx-auto mt-16 w-full max-w-[46rem] md:mt-20">
            <dl
              className="grid grid-cols-2 gap-x-8 gap-y-7 border-t pt-8 lg:grid-cols-4"
              style={{ borderColor: HAIRLINE }}
            >
              <Particular label="Reach me">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="block underline-offset-4 hover:underline"
                  style={{ color: ACCENT }}
                >
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="mt-1 block underline-offset-4 hover:underline"
                  style={{ color: ACCENT }}
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </Particular>

              <Particular label="Based in">
                <span style={{ color: INK }}>{LOCATION}</span>
              </Particular>

              <Particular label="Response">
                <span style={{ color: INK }}>{RESPONSE_TIME}</span>
              </Particular>

              <Particular label="Elsewhere">
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {activeSocials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline-offset-4 hover:underline"
                        style={{ color: ACCENT }}
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}

                  <li>
                    <a
                      href={RESUME_PATH}
                      download
                      className="underline-offset-4 hover:underline"
                      style={{ color: ACCENT }}
                    >
                      Resume
                    </a>
                  </li>
                </ul>
              </Particular>
            </dl>
          </div>
        </section>
      </main>

      <Footer invite={false} />
    </>
  )
}

function Particular({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.16em]" style={{ color: MUTED }}>
        {label}
      </dt>
      <dd className="text-[0.9375rem]">{children}</dd>
    </div>
  )
}
