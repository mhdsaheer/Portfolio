import type { MetadataRoute } from "next"

import { caseStudies } from "@/lib/case-studies"
import { insightUrl, insights, modifiedAt } from "@/lib/insights"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  /** The index changes whenever an article does. */
  const latestArticle = insights.map(modifiedAt).sort().at(-1)

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/insights`, lastModified: latestArticle, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ]

  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${SITE_URL}/work/${study.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }))

  // Each article lists its cover too, so the art can be found through image search
  const articles: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: insightUrl(insight.slug),
    lastModified: modifiedAt(insight),
    changeFrequency: "yearly",
    priority: 0.5,
    images: [`${SITE_URL}${insight.image}`],
  }))

  return [...pages, ...studies, ...articles]
}
