import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { BackToTopButton } from "@/components/guide/back-to-top-button"
import { ExampleLightbox, type Example } from "@/components/guide/example-lightbox"
import { GuideBody } from "@/components/guide/guide-body"
import { GuideAuthorCard, GuideFaq } from "@/components/guide/guide-end"
import { GUIDE_TITLE_ID, GuideHero } from "@/components/guide/guide-hero"
import { GuideToc, GuideTocDisclosure } from "@/components/guide/guide-toc"
import { BODY, FOCUS, INK, MEASURE, MUTED } from "@/components/guide/tokens"
import { InlineText } from "@/components/insights/inline-text"
import { InsightCard } from "@/components/insights/insight-card"
import { ShareLinks } from "@/components/insights/share-links"
import type { Insight } from "@/lib/insights"
import { cn } from "@/lib/utils"

/**
 * An article on the guide layout: a light sheet laid over the site's mesh,
 * with the header above it and the footer below still on the mesh, so the
 * page stays part of the site while the guide itself reads in full colour.
 *
 * The sheet opens with the title and cover, then runs the contents in a
 * sticky column beside the body on wide screens. Related reading closes it
 * on a grey band.
 */
export function GuideArticle({ insight, url, related }: { insight: Insight; url: string; related: Insight[] }) {
  const examples: Example[] = insight.body.flatMap((block) =>
    block.type === "designType" ? [{ ...block.image, title: block.name }] : [],
  )
  // "Types of Website Design: 15 Popular..." -> "Types of website design", for the breadcrumb
  const shortTitle = insight.title.split(":")[0]

  return (
    <main className="px-2 pb-16 pt-[4.5rem] sm:px-3 md:pb-24 md:pt-[5.75rem] lg:px-4">
      <ExampleLightbox examples={examples}>
        <article className="mx-auto max-w-[1480px] overflow-clip rounded-[1.75rem] bg-white text-[#20212A] shadow-[0_40px_120px_-40px_rgba(4,10,18,0.55)] md:rounded-[2.5rem]">
          <GuideHero insight={insight} url={url} shortTitle={shortTitle} />

          <div className="px-5 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-16 lg:px-12 xl:px-16">
            <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-16">
              {/* A plain column, not an aside: the nav inside is already the landmark */}
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <GuideToc items={insight.toc} />
                </div>
              </div>

              <div className="min-w-0">
                <div className={MEASURE}>
                  {insight.intro.map((paragraph) => (
                    <p
                      key={paragraph}
                      className={cn("mb-6 text-pretty text-xl leading-[1.6] last:mb-0 md:text-[1.375rem]", INK)}
                    >
                      <InlineText text={paragraph} tone="light" />
                    </p>
                  ))}
                </div>

                <div className="lg:hidden">
                  <GuideTocDisclosure items={insight.toc} />
                </div>

                <GuideBody blocks={insight.body} />

                {insight.outro && (
                  <div className={cn("mt-14 border-t border-[#20212A]/10 pt-10", MEASURE)}>
                    {insight.outro.map((paragraph) => (
                      <p key={paragraph} className={cn("mb-6 text-pretty text-lg leading-[1.7] last:mb-0 md:text-xl", BODY)}>
                        <InlineText text={paragraph} tone="light" />
                      </p>
                    ))}
                  </div>
                )}

                {insight.faq && insight.faq.length > 0 && <GuideFaq items={insight.faq} />}

                <div className="mt-14 flex flex-col gap-8 border-t border-[#20212A]/10 pt-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("mr-2 font-mono text-xs uppercase tracking-[0.18em]", MUTED)}>Filed under</span>
                    {insight.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn("rounded-full border border-[#20212A]/10 bg-[#F7F8FC] px-3.5 py-1.5 text-xs font-medium", INK)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ShareLinks id="share-end" url={url} title={insight.title} tone="light" />
                </div>

                <GuideAuthorCard />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="bg-[#F7F8FC] px-5 py-16 sm:px-8 md:py-20 lg:px-12 xl:px-16">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10">
                <h2 id="related-heading" className={cn("text-3xl font-semibold tracking-[-0.04em] md:text-5xl", INK)}>
                  Keep reading
                </h2>
                <Link
                  href="/insights"
                  className={cn("inline-flex items-center gap-2 rounded text-sm underline-offset-4 hover:underline", BODY, FOCUS)}
                >
                  All insights
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </div>
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
                {related.map((item) => (
                  <li key={item.slug}>
                    <InsightCard insight={item} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </ExampleLightbox>

      <BackToTopButton targetId={GUIDE_TITLE_ID} />
    </main>
  )
}
