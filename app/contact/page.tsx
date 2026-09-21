import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Reveal } from "@/components/case-study/reveal"
import { ContactForm } from "@/components/contact/contact-form"
import { LocalTime } from "@/components/contact/local-time"
import { CONTACT_EMAIL, LOCATION, RESPONSE_TIME, RESUME_PATH, socials } from "@/lib/contact"

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
        <section id="contact" className="pt-28 md:pt-36 pb-20 md:pb-32">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back home
            </Link>

            <Reveal className="mt-8 md:mt-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance">
                Let&apos;s talk
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                Whether it is a site that needs building, an interface that needs fixing, or something you are still
                sketching out — tell me about it and I&apos;ll tell you honestly whether I&apos;m the right person for
                it.
              </p>
            </Reveal>

            <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20">
              <Reveal delay={80}>
                <ContactForm />
              </Reveal>

              <Reveal delay={160}>
                <div className="flex flex-col gap-8">
                  <Detail label="Email">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-base md:text-lg font-medium hover:underline"
                      style={{ color: "#c8e0f5" }}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </Detail>

                  <Detail label="Based in">
                    <p className="text-base md:text-lg font-medium">{LOCATION}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Local time <LocalTime />
                    </p>
                  </Detail>

                  <Detail label="Response">
                    <p className="text-base md:text-lg font-medium">{RESPONSE_TIME}</p>
                  </Detail>

                  {activeSocials.length > 0 && (
                    <Detail label="Elsewhere">
                      <ul className="flex flex-wrap gap-x-5 gap-y-2">
                        {activeSocials.map((social) => (
                          <li key={social.label}>
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-base font-medium hover:underline"
                              style={{ color: "#c8e0f5" }}
                            >
                              {social.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </Detail>
                  )}

                  <Detail label="Resume">
                    <a
                      href={RESUME_PATH}
                      download
                      className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium rounded-full border border-border hover:bg-secondary transition-colors"
                      style={{ color: "#c8e0f5" }}
                    >
                      Download PDF
                      <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    </a>
                  </Detail>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pt-5 border-t border-border first:pt-0 first:border-t-0">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{label}</h2>
      {children}
    </div>
  )
}
