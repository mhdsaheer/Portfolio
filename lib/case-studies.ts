/*
 * Case studies are stored in Supabase and loaded by lib/projects-data.ts; their
 * shape is checked by the schema in lib/project-content.ts. What is here works
 * on studies already loaded, and is imported by the browser too (the work
 * index filters with it), so it stays free of the schema library.
 */
export type { CaseStudy, Swatch } from "@/lib/project-content"
import type { CaseStudy } from "@/lib/project-content"

/** The service a study is filed under, not its domain - this is what the index lists. */
export const DISCIPLINES = ["Branding", "Design", "Development", "Design & Development"] as const
export type Discipline = (typeof DISCIPLINES)[number]

/**
 * The work index filters by service rather than by discipline directly: each
 * pill is mapped onto the disciplines that belong to it, so a project that was
 * both designed and built sits under Development and UI/UX alike. Retag a
 * study's `discipline` and it moves between pills.
 */
export const serviceFilters = {
  Development: ["Development", "Design & Development"],
  "UI/UX": ["Design", "Design & Development"],
  Branding: ["Branding"],
} satisfies Record<string, Discipline[]>

export type ServiceFilter = keyof typeof serviceFilters

/** The pills, in the order the index lists them. */
export const services = Object.keys(serviceFilters) as ServiceFilter[]

/** The pills a study is filed under. */
export function servicesOf(study: Pick<CaseStudy, "discipline">) {
  return services.filter((service) => (serviceFilters[service] as readonly string[]).includes(study.discipline))
}

/** The study after this one in `list`, wrapping round to the first. */
export function nextCaseStudy(list: CaseStudy[], slug: string) {
  const current = list.findIndex((study) => study.slug === slug)
  if (current === -1 || list.length < 2) return undefined
  return list[(current + 1) % list.length]
}
