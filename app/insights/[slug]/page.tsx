import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Reveal } from "@/components/case-study/reveal"
import { GuideArticle } from "@/components/guide/guide-article"
import { ArticleBody } from "@/components/insights/article-body"
import { ArticleFaq } from "@/components/insights/article-faq"
import { ArticleToc, ArticleTocDisclosure } from "@/components/insights/article-toc"
import { AuthorByline, AuthorCard } from "@/components/insights/author"
import { Breadcrumbs } from "@/components/insights/breadcrumbs"
import { COVER_ACTION, COVER_ACTION_ROUND } from "@/components/insights/cover-styles"
import { InsightCard } from "@/components/insights/insight-card"
import { InsightCover } from "@/components/insights/insight-cover"
import { ShareLinks } from "@/components/insights/share-links"
import {
  AUTHOR,
  getRelatedInsights,
  insightPath,
  insightUrl,
  modifiedAt,
  publishedAt,
  type Insight,
} from "@/lib/insights"
import { getInsight, getInsights } from "@/lib/insights-data"
import { SITE_URL, absoluteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ slug: string }>
}

const BRAND = " | Muhammed Saheer"

/** The tab and search title: the name joins the article's own title wherever both fit in 60 characters. */
function documentTitle(insight: Insight) {
  return insight.seoTitle.length + BRAND.length <= 60 ? insight.seoTitle + BRAND : insight.seoTitle
}

/** Articles added later in the admin render on their first visit and are kept from then on. */
export async function generateStaticParams() {
  return (await getInsights()).map((insight) => ({ slug: insight.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const insight = await getInsight(slug)

  if (!insight) {
    return { title: "Article not found | Muhammed Saheer", robots: { index: false } }
  }

  const path = insightPath(insight.slug)
  const image = { url: insight.image, alt: insight.imageAlt }

  return {
    title: documentTitle(insight),
    description: insight.description,
    keywords: insight.seo ? [insight.seo.focusKeyword, ...insight.seo.secondaryKeywords] : insight.tags,
    authors: [{ name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` }],
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "article",
      url: path,
      siteName: AUTHOR.name,
      title: insight.social.title,
      description: insight.social.description,
      publishedTime: publishedAt(insight),
      modifiedTime: modifiedAt(insight),
      authors: [`${SITE_URL}${AUTHOR.path}`],
      section: insight.category,
      tags: insight.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: insight.social.title,
      description: insight.social.description,
      images: [image],
    },
  }
}

/**
 * Mirrors what is on the page: the article, its author and where it sits.
 * BlogPosting is one of the three types Google reads for article results,
 * and the images run 16:9, 4:3 and 1:1, the crops it asks for.
 *
 * The FAQ is deliberately left out of the markup. Google retired FAQ rich
 * results in May 2026, so the questions stay on the page for readers only.
 */
function structuredData(insight: Insight) {
  const url = insightUrl(insight.slug)
  const personId = `${SITE_URL}/#person`
  const authorUrl = `${SITE_URL}${AUTHOR.path}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: insight.title,
        description: insight.description,
        image: [insight.image, ...(insight.imageCrops ?? [])].map(absoluteUrl),
        datePublished: publishedAt(insight),
        dateModified: modifiedAt(insight),
        author: { "@type": "Person", "@id": personId, name: AUTHOR.name, url: authorUrl },
        publisher: { "@id": personId },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        isPartOf: {
          "@type": "Blog",
          "@id": `${SITE_URL}/insights#blog`,
          name: "Insights",
          url: `${SITE_URL}/insights`,
        },
        articleSection: insight.category,
        keywords: insight.seo ? [insight.seo.focusKeyword, ...insight.seo.secondaryKeywords] : insight.tags,
        wordCount: insight.wordCount,
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": personId,
        name: AUTHOR.name,
        url: authorUrl,
        image: `${SITE_URL}${AUTHOR.image}`,
        jobTitle: AUTHOR.jobTitle,
        sameAs: AUTHOR.profiles.map((profile) => profile.href),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
          { "@type": "ListItem", position: 3, name: insight.title, item: url },
        ],
      },
    ],
  }
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params
  const insight = await getInsight(slug)

  if (!insight) {
    notFound()
  }

  const url = insightUrl(insight.slug)
  const related = getRelatedInsights(insight, await getInsights())

  // `<` escaped so nothing in the data can close the script tag early
  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(insight)).replace(/</g, "\\u003c") }}
    />
  )

  // Visual guides read on their own light layout; the metadata and structured data are the same
  if (insight.layout === "guide") {
    return (
      <>
        <Header />
        <GuideArticle insight={insight} url={url} related={related} />
        <Footer />
        {jsonLd}
      </>
    )
  }

  return (
    <>
      <Header />

      <main>
        <article>
          {/* Opens the way the index does: the art full-bleed, the title set large over it, the
              trail back at the head and beside the excerpt the way back to every other article */}
          <InsightCover
            insight={insight}
            titleAs="h1"
            label={
              <Breadcrumbs
                items={[{ name: "Home", href: "/" }, { name: "Insights", href: "/insights" }, { name: insight.title }]}
              />
            }
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

          {/* The mesh behind the site moves and has bright patches, which is fine for a headline
              and hard on a paragraph. The text gets a dim layer of the page's own navy, faded in
              from the cover and out before the footer, so the mesh still shows through it. */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(7,17,28,0)_0,rgba(7,17,28,0.72)_14rem,rgba(7,17,28,0.72)_calc(100%-14rem),rgba(7,17,28,0)_100%)]"
            />
            <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-12 md:px-12 md:pb-32 md:pt-16">
              <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
                {/* The contents keep their place beside the text on wide screens. A plain
                    column, not an aside: the nav inside is already the landmark */}
                <div className="hidden lg:col-span-3 lg:block">
                  <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pb-6 pr-2">
                    <ArticleToc items={insight.toc} />
                  </div>
                </div>

                {/* About 70 characters a line: seven columns of twelve, eight below xl */}
                <div className="min-w-0 lg:col-span-8 lg:col-start-5 xl:col-span-7">
                  <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/15 pb-8">
                    <AuthorByline />
                    <ShareLinks
                      id="share-top"
                      url={url}
                      title={insight.title}
                      label="Share"
                      className="hidden md:flex md:items-end"
                    />
                  </div>

                  <div className="mt-10 md:mt-12">
                    {insight.intro.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mb-6 text-pretty text-xl leading-[1.6] text-white last:mb-0 md:text-[1.375rem]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="lg:hidden">
                    <ArticleTocDisclosure items={insight.toc} />
                  </div>

                  <ArticleBody blocks={insight.body} />

                  {insight.outro && (
                    <div className="mt-14 border-t border-white/15 pt-10 md:mt-16">
                      {insight.outro.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mb-6 text-pretty text-lg leading-[1.7] text-white last:mb-0 md:text-xl"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {insight.faq && insight.faq.length > 0 && <ArticleFaq items={insight.faq} />}

                  <div className="mt-12 flex flex-col gap-8 md:mt-14">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-2 font-mono text-xs uppercase tracking-[0.18em] text-white/75">
                        Filed under
                      </span>
                      {insight.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/50 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ShareLinks id="share-end" url={url} title={insight.title} />
                  </div>

                  <AuthorCard />
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mx-auto max-w-[1280px] px-6 pb-20 md:px-12 md:pb-28">
          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-16 md:mt-24">
              <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10">
                <h2 id="related-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  Keep reading
                </h2>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  All insights
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </Reveal>

              <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
                {related.map((item) => (
                  <li key={item.slug}>
                    <InsightCard insight={item} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {jsonLd}
    </>
  )
}
