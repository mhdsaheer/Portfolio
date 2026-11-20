import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Reveal } from "@/components/case-study/reveal"
import { AccentStar } from "@/components/about/accent-star"
import { InsightCover } from "@/components/insights/insight-cover"
import { COVER_ACTION, COVER_ACTION_ROUND, COVER_LABEL } from "@/components/insights/cover-styles"
import { NoteTile } from "@/components/insights/note-tile"
import { AUTHOR, insightUrl, modifiedAt, publishedAt, type Insight } from "@/lib/insights"
import { getInsights } from "@/lib/insights-data"
import { SITE_URL, absoluteUrl } from "@/lib/site"

const TITLE = "Insights: UI/UX Design & Front-End Development Articles"
const DESCRIPTION =
  "Articles on UI/UX design, React, Figma-to-code workflows and the future of front-end development, by Muhammed Saheer, a front-end developer in Kerala, India."

export async function generateMetadata(): Promise<Metadata> {
  const [latest] = await getInsights()

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/insights" },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      type: "website",
      url: "/insights",
      siteName: AUTHOR.name,
      images: latest ? [{ url: latest.image, alt: latest.imageAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  }
}

/** Structured data mirrors the visible list, as the Work page does for its projects. */
function blogSchema(insights: Insight[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/insights#blog`,
    name: "Insights",
    description: DESCRIPTION,
    url: `${SITE_URL}/insights`,
    inLanguage: "en",
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` },
    blogPost: insights.map((insight) => ({
      "@type": "BlogPosting",
      headline: insight.title,
      description: insight.description,
      url: insightUrl(insight.slug),
      image: absoluteUrl(insight.image),
      datePublished: publishedAt(insight),
      dateModified: modifiedAt(insight),
      author: { "@id": `${SITE_URL}/#person` },
    })),
  }
}

/**
 * The insights index as a magazine: the newest article is the cover - its art
 * full-bleed, its title set large over it - and the rest follow as tiles in
 * the Work page's manner. Each article opens on the same cover.
 */
export default async function InsightsPage() {
  const insights = await getInsights()
  const [latest, ...rest] = insights

  return (
    <>
      <Header />

      <main>
        {latest ? (
          <InsightCover
            insight={latest}
            label={
              <h1 className={COVER_LABEL}>
                <AccentStar className="size-3 text-accent" />
                {/* The spaces are for anything reading the text: the flex gap sets them apart visually */}
                Insights{" "}
                <span aria-hidden className="text-white/45">
                  /
                </span>{" "}
                <span className="text-white/70">The latest</span>
              </h1>
            }
            action={
              <Link href={`/insights/${latest.slug}`} className={COVER_ACTION}>
                <span className={COVER_ACTION_ROUND}>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
                Read the article
              </Link>
            }
          />
        ) : (
          <section className="px-6 pb-24 pt-36 md:px-12 md:pt-44">
            <div className="mx-auto max-w-[1280px]">
              <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">Insights</h1>
              <p className="mt-6 text-lg leading-relaxed text-white/70">Nothing published yet. Check back soon.</p>
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-[1280px]">
              <Reveal className="mb-10 md:mb-14">
                <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">More notes</h2>
              </Reveal>

              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                {rest.map((insight, index) => (
                  <NoteTile
                    key={insight.slug}
                    insight={insight}
                    delay={(index % 2) * 90}
                    // An odd one out takes the whole row rather than leaving a hole beside it
                    wide={rest.length % 2 === 1 && index === rest.length - 1}
                  />
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema(insights)).replace(/</g, "\\u003c") }}
      />
    </>
  )
}
