import { DISCIPLINES, type Discipline, type ServiceFilter } from "@/lib/case-studies"
import { FORMATS, SERVICES } from "@/lib/project-content"
import type { Status } from "@/lib/schema-fields"
import type { EditorBase } from "@/components/admin/editor-shell"

/*
 * Case studies and work files as their editors hold them: every field
 * present, blanks as empty strings, optional sections as null. The schemas in
 * lib/project-content.ts turn blanks back into "not set" when they are saved.
 */

type Row = { slug: string; status: Status; document: unknown }

const str = (value: unknown) => (typeof value === "string" ? value : "")
const strs = (value: unknown) => (Array.isArray(value) ? value.filter((item) => typeof item === "string") : [])
const list = (value: unknown) => (Array.isArray(value) ? value : []) as Record<string, unknown>[]
const obj = (value: unknown) => (value && typeof value === "object" ? value : {}) as Record<string, unknown>

/* ------------------------------------------------------------------ */
/* Case studies                                                        */
/* ------------------------------------------------------------------ */

export type SwatchDraft = { name: string; hex: string; role: string; lip: string; soft: string; sample: string }
export type PaletteDraft = { name: string; note: string; swatches: SwatchDraft[] }
export type TypefaceDraft = { family: string; weights: { label: string; weight: number }[]; sample: string; note: string }
export type DesignSystemDraft = {
  label: string
  title: string
  intro: string
  palettes: PaletteDraft[]
  typeface: TypefaceDraft | null
}

export type CaseStudyDraft = {
  title: string
  category: string
  discipline: Discipline
  description: string
  summary: string
  image: string
  tags: string[]
  year: string
  role: string
  timeline: string
  client: string
  platform: string
  liveUrl: string
  overview: string[]
  challenge: { title: string; body: string[]; pains: string[] }
  approach: { step: string; title: string; body: string }[]
  designSystem: DesignSystemDraft | null
  gallery: { src: string; alt: string; caption: string }[]
  results: { value: string; label: string }[]
  outcomeHeading: string
  outcome: string[]
  testimonial: { quote: string; author: string; role: string } | null
  stack: string[]
}

export type CaseStudyState = EditorBase & { doc: CaseStudyDraft }

export const newSwatch = (): SwatchDraft => ({ name: "", hex: "#000000", role: "", lip: "", soft: "", sample: "" })
export const newPalette = (): PaletteDraft => ({ name: "", note: "", swatches: [newSwatch()] })
export const newTypeface = (): TypefaceDraft => ({ family: "", weights: [{ label: "Regular", weight: 400 }], sample: "", note: "" })
export const newDesignSystem = (): DesignSystemDraft => ({ label: "", title: "", intro: "", palettes: [newPalette()], typeface: null })

/** "01", "02"… - how approach steps are numbered. */
export const stepNumber = (index: number) => String(index + 1).padStart(2, "0")

function designSystemFrom(value: unknown): DesignSystemDraft | null {
  if (!value || typeof value !== "object") return null
  const system = obj(value)
  const typeface = system.typeface ? obj(system.typeface) : null
  return {
    label: str(system.label),
    title: str(system.title),
    intro: str(system.intro),
    palettes: list(system.palettes).map((palette) => ({
      name: str(palette.name),
      note: str(palette.note),
      swatches: list(palette.swatches).map((swatch) => ({
        name: str(swatch.name),
        hex: str(swatch.hex),
        role: str(swatch.role),
        lip: str(swatch.lip),
        soft: str(swatch.soft),
        sample: str(swatch.sample),
      })),
    })),
    typeface: typeface && {
      family: str(typeface.family),
      weights: list(typeface.weights).map((weight) => ({ label: str(weight.label), weight: Number(weight.weight) || 400 })),
      sample: str(typeface.sample),
      note: str(typeface.note),
    },
  }
}

/** The editor state for a stored row, read leniently so a broken one still opens to be fixed. */
export function caseStudyStateFromRow(row: Row): CaseStudyState {
  const doc = obj(row.document)
  const challenge = obj(doc.challenge)
  const testimonial = doc.testimonial ? obj(doc.testimonial) : null
  return {
    originalSlug: row.slug,
    slug: row.slug,
    status: row.status,
    doc: {
      title: str(doc.title),
      category: str(doc.category),
      discipline: (DISCIPLINES as readonly string[]).includes(str(doc.discipline)) ? (doc.discipline as Discipline) : "Design & Development",
      description: str(doc.description),
      summary: str(doc.summary),
      image: str(doc.image),
      tags: strs(doc.tags),
      year: str(doc.year),
      role: str(doc.role),
      timeline: str(doc.timeline),
      client: str(doc.client),
      platform: str(doc.platform),
      liveUrl: str(doc.liveUrl),
      overview: strs(doc.overview),
      challenge: { title: str(challenge.title), body: strs(challenge.body), pains: strs(challenge.pains) },
      approach: list(doc.approach).map((step) => ({ step: str(step.step), title: str(step.title), body: str(step.body) })),
      designSystem: designSystemFrom(doc.designSystem),
      gallery: list(doc.gallery).map((shot) => ({ src: str(shot.src), alt: str(shot.alt), caption: str(shot.caption) })),
      results: list(doc.results).map((result) => ({ value: str(result.value), label: str(result.label) })),
      outcomeHeading: str(doc.outcomeHeading),
      outcome: strs(doc.outcome),
      testimonial: testimonial && { quote: str(testimonial.quote), author: str(testimonial.author), role: str(testimonial.role) },
      stack: strs(doc.stack),
    },
  }
}

export function emptyCaseStudy(): CaseStudyState {
  return {
    originalSlug: null,
    slug: "",
    status: "draft",
    doc: {
      title: "",
      category: "",
      discipline: "Design & Development",
      description: "",
      summary: "",
      image: "",
      tags: [],
      year: String(new Date().getFullYear()),
      role: "",
      timeline: "",
      client: "",
      platform: "",
      liveUrl: "",
      overview: [],
      challenge: { title: "", body: [], pains: [] },
      approach: [{ step: stepNumber(0), title: "", body: "" }],
      designSystem: null,
      gallery: [],
      results: [],
      outcomeHeading: "",
      outcome: [],
      testimonial: null,
      stack: [],
    },
  }
}

/** What saveCaseStudy receives: switched-off sections left out. */
export function caseStudyPayload(state: CaseStudyState) {
  const { designSystem, testimonial, ...doc } = state.doc
  return {
    originalSlug: state.originalSlug,
    slug: state.slug,
    status: state.status,
    document: {
      ...doc,
      ...(designSystem && {
        designSystem: { ...designSystem, typeface: designSystem.typeface ?? undefined },
      }),
      ...(testimonial && { testimonial }),
    },
  }
}

/* ------------------------------------------------------------------ */
/* Work files                                                          */
/* ------------------------------------------------------------------ */

export type WorkFileDraft = {
  title: string
  kind: string
  services: ServiceFilter[]
  year: string
  format: (typeof FORMATS)[number]
  src: string
  cover: string
  alt: string
  more: { src: string; alt: string }[]
}

export type WorkFileState = EditorBase & { doc: WorkFileDraft }

export function workFileStateFromRow(row: Row): WorkFileState {
  const doc = obj(row.document)
  return {
    originalSlug: row.slug,
    slug: row.slug,
    status: row.status,
    doc: {
      title: str(doc.title),
      kind: str(doc.kind),
      services: strs(doc.services).filter((service): service is ServiceFilter => (SERVICES as string[]).includes(service)),
      year: str(doc.year),
      format: doc.format === "link" ? "link" : "image",
      src: str(doc.src),
      cover: str(doc.cover),
      alt: str(doc.alt),
      more: list(doc.more).map((shot) => ({ src: str(shot.src), alt: str(shot.alt) })),
    },
  }
}

export function emptyWorkFile(): WorkFileState {
  return {
    originalSlug: null,
    slug: "",
    status: "draft",
    doc: {
      title: "",
      kind: "",
      services: [],
      year: String(new Date().getFullYear()),
      format: "image",
      src: "",
      cover: "",
      alt: "",
      more: [],
    },
  }
}

/** What saveWorkFile receives. A link has no alt text or extra views, so those are dropped. */
export function workFilePayload(state: WorkFileState) {
  const { doc } = state
  return {
    originalSlug: state.originalSlug,
    slug: state.slug,
    status: state.status,
    document: doc.format === "link" ? { ...doc, alt: "", more: [] } : doc,
  }
}
