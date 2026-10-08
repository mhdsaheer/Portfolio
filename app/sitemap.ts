import type { MetadataRoute } from "next"

import { caseStudies } from "@/lib/case-studies"
import { insights, publishedAt } from "@/lib/insights"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/insights`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ]

  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${SITE_URL}/work/${study.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }))

  const articles: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${SITE_URL}/insights/${insight.slug}`,
    lastModified: publishedAt(insight),
    changeFrequency: "yearly",
    priority: 0.5,
  }))

  return [...pages, ...studies, ...articles]
}
