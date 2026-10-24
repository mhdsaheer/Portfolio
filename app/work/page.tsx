import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WorkHero } from "@/components/work/work-hero"
import { WorkIndex } from "@/components/work/work-index"
import { caseStudies } from "@/lib/case-studies"
import { ARCHIVE_PDF, workFiles } from "@/lib/work-files"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Work | Muhammed Saheer - Interfaces built with care",
  description:
    "Selected projects in frontend development, interface design and product UI — each written up end to end, from the problem to what changed once it shipped.",
  openGraph: {
    title: "Work | Muhammed Saheer - Interfaces built with care",
    description:
      "Selected projects in frontend development, interface design and product UI, written up end to end.",
    type: "website",
  },
}

/** Structured data mirrors the visible list, so the index is legible to crawlers too. */
const collectionSchema = {
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
        image: `${SITE_URL}${study.image}`,
        genre: study.category,
      },
    })),
  },
}

export default function WorkPage() {
  return (
    <>
      <Header />

      <main>
        <WorkHero archive={ARCHIVE_PDF} />
        <WorkIndex studies={caseStudies} files={workFiles} archive={ARCHIVE_PDF} />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </>
  )
}
