import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FinalCTA } from "@/components/sections/final-cta"
import { Reveal } from "@/components/case-study/reveal"
import { InsightCard } from "@/components/insights/insight-card"
import { insights } from "@/lib/insights"

export const metadata: Metadata = {
  title: "Insights | Muhammed Saheer",
  description: "Notes on frontend development, interface design and the craft of shipping product UI.",
  openGraph: {
    title: "Insights | Muhammed Saheer",
    description: "Notes on frontend development, interface design and the craft of shipping product UI.",
    type: "website",
  },
}

export default function InsightsPage() {
  return (
    <>
      <Header />

      <main>
        <section className="pt-28 md:pt-36 pb-12 md:pb-16">
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
                Insights
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                Notes on frontend development, interface design and the parts of shipping product UI that only show up
                once real data hits the screen.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pb-20 md:pb-32">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            {insights.length === 0 ? (
              <p className="text-muted-foreground">Nothing published yet. Check back soon.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {insights.map((insight, index) => (
                  <Reveal as="li" key={insight.slug} delay={(index % 3) * 80}>
                    <InsightCard insight={insight} priority={index < 3} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
