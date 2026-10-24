import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Reveal } from "@/components/case-study/reveal"
import { ACCENT } from "@/components/about/tokens"
import { InsightCover } from "@/components/insights/insight-cover"
import { COVER_ACTION, COVER_ACTION_ROUND } from "@/components/insights/cover-styles"
import { NoteTile } from "@/components/insights/note-tile"
import { insights, getInsight, getNextInsight, publishedAt } from "@/lib/insights"
import { SITE_URL } from "@/lib/site"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const insight = getInsight(slug)

  if (!insight) {
    return { title: "Article not found | Muhammed Saheer" }
  }

  return {
    title: `${insight.title} | Insights`,
    description: insight.excerpt,
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      type: "article",
      publishedTime: publishedAt(insight),
      tags: insight.tags,
      images: [{ url: insight.image }],
    },
  }
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params
  const insight = getInsight(slug)

  if (!insight) {
    notFound()
  }

  const next = getNextInsight(insight.slug)

  /* Mirrors what is on the page, so search results carry the byline and date. */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: insight.title,
    description: insight.excerpt,
    image: `${SITE_URL}${insight.image}`,
    datePublished: publishedAt(insight),
    keywords: insight.tags.join(", "),
    author: { "@type": "Person", name: "Muhammed Saheer" },
  }

  return (
    <>
      <Header />

      <main>
        <article>
          {/* Opens the way the index does: the art full-bleed, the title set large over it,
              and beside the excerpt the way back to every other article */}
          <InsightCover
            insight={insight}
            titleAs="h1"
            action={
              <Link href="/insights" className={COVER_ACTION}>
                <span className={COVER_ACTION_ROUND}>
                  <ArrowLeft
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                  />
                </span>
                All insights
              </Link>
            }
          />

          {/* The text runs the full width of the content column, the cover's own grid, so the
              title above and every line below share both edges. */}
          <section className="pb-20 pt-16 md:pb-28 md:pt-24">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <Reveal>
                {insight.intro.map((paragraph) => (
                  <p key={paragraph} className="text-lg md:text-xl leading-[1.7] text-pretty mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              {insight.sections.map((section, index) => (
                <div key={section.heading}>
                  <Reveal as="section" className="mt-14 md:mt-16">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">
                      {section.heading}
                    </h2>

                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-5 text-base md:text-lg leading-[1.75] text-muted-foreground text-pretty"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </Reveal>

                  {insight.pullQuote?.afterSection === index && (
                    <Reveal as="figure" className="mt-14 md:mt-16">
                      <blockquote
                        className="border-l-2 pl-6 md:pl-8 text-xl md:text-2xl leading-[1.45] text-balance"
                        style={{ borderColor: ACCENT }}
                      >
                        {insight.pullQuote.text}
                      </blockquote>
                    </Reveal>
                  )}
                </div>
              ))}

              <Reveal className="mt-14 md:mt-16 pt-10 border-t border-border">
                {insight.outro.map((paragraph) => (
                  <p key={paragraph} className="text-lg md:text-xl leading-[1.7] text-pretty mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}

                {/* The tags close the article, now the cover carries the category up top */}
                <div className="mt-10 flex flex-wrap items-center gap-2">
                  <span className="mr-2 font-mono text-xs uppercase tracking-[0.18em] text-white/55">Filed under</span>
                  {insight.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </article>

        {next && next.slug !== insight.slug && (
          <section className="pb-20 md:pb-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Up next</h2>
                <Link
                  href="/insights"
                  className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  All insights
                </Link>
              </Reveal>

              <NoteTile as="div" insight={next} wide />
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  )
}
