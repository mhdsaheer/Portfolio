import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Reveal } from "@/components/case-study/reveal"
import { AccentStar } from "@/components/about/accent-star"
import { insights, getInsight, getNextInsight, publishedAt } from "@/lib/insights"

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
    image: insight.image,
    datePublished: publishedAt(insight),
    keywords: insight.tags.join(", "),
    author: { "@type": "Person", name: "Muhammed Saheer" },
  }

  return (
    <>
      <Header />

      <main>
        <article>
          <section className="pt-28 md:pt-36 pb-10 md:pb-14">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to insights
              </Link>

              <Reveal className="mt-8 md:mt-12 max-w-3xl">
                <div className="flex items-center gap-2" style={{ color: "#c8e0f5" }}>
                  <AccentStar className="h-2.5 w-2.5 shrink-0" />
                  <span className="text-xs font-medium uppercase italic tracking-[0.16em] leading-none">
                    {insight.date}
                  </span>
                  <span aria-hidden className="opacity-50">
                    ·
                  </span>
                  <span className="text-xs font-medium uppercase italic tracking-[0.16em] leading-none">
                    {insight.readTime}
                  </span>
                </div>

                <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
                  {insight.title}
                </h1>

                <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                  {insight.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mt-8">
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

          <section className="pb-12 md:pb-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <Reveal className="relative aspect-[16/9] overflow-hidden rounded-2xl md:rounded-3xl bg-secondary">
                <Image
                  src={insight.image || "/placeholder.svg"}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1280px"
                  className="object-cover"
                />
              </Reveal>
            </div>
          </section>

          {/* The measure is the point of this page: roughly 70 characters, which
              is where long-form reading stops being work. */}
          <section className="pb-20 md:pb-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <div className="mx-auto max-w-[42rem]">
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
                          style={{ borderColor: "#c8e0f5" }}
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
                </Reveal>
              </div>
            </div>
          </section>
        </article>

        {next && next.slug !== insight.slug && (
          <section className="pb-12 md:pb-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <Link href={`/insights/${next.slug}`} className="group block">
                <Reveal className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-[1.4/1] md:aspect-[3/1] overflow-hidden bg-secondary">
                    <Image
                      src={next.image || "/placeholder.svg"}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 1280px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                    <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10 flex items-end justify-between gap-6">
                      <div>
                        <span className="text-[11px] font-mono tracking-tight" style={{ color: "#c8e0f5" }}>
                          Next article
                        </span>
                        <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">{next.title}</h2>
                        <p className="hidden md:block mt-3 text-muted-foreground max-w-xl leading-relaxed">
                          {next.excerpt}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-secondary/80 border border-border transition-colors group-hover:bg-secondary shrink-0">
                        <ArrowUpRight
                          className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: "#c8e0f5" }}
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  )
}
