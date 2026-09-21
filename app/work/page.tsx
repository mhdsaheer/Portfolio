import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FinalCTA } from "@/components/sections/final-cta"
import { WorkHero } from "@/components/work/work-hero"
import { ProjectList } from "@/components/work/project-list"
import { caseStudies } from "@/lib/case-studies"

export const metadata: Metadata = {
  title: "Work | Muhammed Saheer — Interfaces built with care",
  description:
    "Selected projects in frontend development, interface design and product UI — each written up end to end, from the problem to what changed once it shipped.",
  openGraph: {
    title: "Work | Muhammed Saheer — Interfaces built with care",
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
        url: `/work/${study.slug}`,
        image: study.image,
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
        <WorkHero count={caseStudies.length} />
        <ProjectList projects={caseStudies} />
        <FinalCTA />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </>
  )
}
