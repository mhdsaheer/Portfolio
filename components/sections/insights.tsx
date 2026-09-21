import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { SectionTitle } from "@/components/ui/section-title"
import { InsightCard } from "@/components/insights/insight-card"
import { insights } from "@/lib/insights"

/** The teaser: the three newest, with the rest a click away at /insights. */
export function Insights() {
  const latest = insights.slice(0, 3)

  return (
    <section id="insights" className="py-20 md:py-32 border-border border-t-0">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Insights
          </SectionTitle>
          <Link
            href="/insights"
            className="hidden md:inline-flex items-center gap-2 text-sm transition-colors hover:underline"
            style={{ color: "#c8e0f5" }}
          >
            View all insights
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {latest.map((insight) => (
            <li key={insight.slug}>
              <InsightCard insight={insight} />
            </li>
          ))}
        </ul>

        <div className="md:hidden mt-8 text-center">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full hover:bg-secondary transition-colors"
            style={{ color: "#c8e0f5", borderColor: "#c8e0f5" }}
          >
            View all insights
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
