import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WorkHero } from "@/components/work/work-hero"
import { WorkIndex } from "@/components/work/work-index"
import type { CaseStudy } from "@/lib/case-studies"
import { getCaseStudies, getWorkFiles } from "@/lib/projects-data"
import { ARCHIVE_PDF } from "@/lib/work-files"
import { getWorkPage } from "@/lib/settings-data"
import { SITE_URL, absoluteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Work | Muhammed Saheer - Interfaces built with care",
  description:
    "Selected projects in front-end development, interface design and product UI — each written up end to end, from the problem to what changed once it shipped.",
  openGraph: {
    title: "Work | Muhammed Saheer - Interfaces built with care",
    description:
      "Selected projects in front-end development, interface design and product UI, written up end to end.",
    type: "website",
  },
}

/** Structured data mirrors the visible list, so the index is legible to crawlers too. */
function collectionSchema(caseStudies: CaseStudy[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work",
    description: "Portfolio of interfaces designed and built by Muhammed Saheer",
    mainEntity: {
      "@type": "ItemList",
      name: "Projects",
      numberOfItems: caseStudies.length,
      itemListElement: caseStudies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: study.title,
          url: `${SITE_URL}/work/${study.slug}`,
          image: absoluteUrl(study.image),
          genre: study.category,
        },
      })),
    },
  }
}

export default async function WorkPage() {
  const [caseStudies, workFiles, content] = await Promise.all([getCaseStudies(), getWorkFiles(), getWorkPage()])

  return (
    <>
      <Header />

      <main>
        <WorkHero archive={ARCHIVE_PDF} intro={content.intro} />
        <WorkIndex studies={caseStudies} files={workFiles} archive={ARCHIVE_PDF} />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema(caseStudies)) }}
      />
    </>
  )
}
