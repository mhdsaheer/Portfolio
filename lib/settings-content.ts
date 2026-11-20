import { z } from "zod"

import { RESUME_PATH_PATTERN } from "@/lib/documents"
import { PAGE_SCHEMAS } from "@/lib/page-content"
import { imageSrc, text } from "@/lib/schema-fields"

/**
 * Site-wide content that isn't an article or a project - one value per key in
 * the `settings` table, each checked by its schema here whenever it is saved
 * or read. Everything in that table is public, so nothing secret goes in it.
 */

/**
 * The About page's services panel is drawn for these limits: its band is
 * sized for six skill rows, and its pinned scroll gives each service a screen.
 */
export const MAX_SERVICES = 6
export const MAX_SKILLS = 6

export const servicesSchema = z
  .array(
    z.object({
      /** Named for what someone would actually hire you for. */
      title: text,
      /** Every skill listed is one you claim - nothing inferred. */
      skills: z
        .array(text)
        .min(1, "Add at least one skill")
        .max(MAX_SKILLS, `Up to ${MAX_SKILLS} skills - the panel has room for six rows`)
        .refine((skills) => new Set(skills.map((skill) => skill.toLowerCase())).size === skills.length, "A skill is listed twice"),
    }),
  )
  .min(1, "Add at least one service")
  .max(MAX_SERVICES, `Up to ${MAX_SERVICES} services`)

export type ServiceEntry = z.infer<typeof servicesSchema>[number]

/** A service as the About page shows it, numbered "01", "02"… in order. */
export type Service = ServiceEntry & { number: string }

export function numberServices(entries: ServiceEntry[]): Service[] {
  return entries.map((entry, index) => ({ ...entry, number: String(index + 1).padStart(2, "0") }))
}

/** The portrait the site shipped with, shown until one is saved in the admin. */
export const DEFAULT_PORTRAIT = "/images/saheer_portrait.png"

/**
 * The personal pieces: the photograph on the About page (and in the home
 * page's About section), the round portrait beside the byline on every
 * article, and which uploaded PDF is the current resume.
 */
export const profileSchema = z.object({
  photo: z.object({
    /** Cropped to fill the screen, centred, so a wide landscape shot works best. */
    src: imageSrc,
    /** What the photo shows, for anyone who can't see it. */
    alt: text,
  }),
  /**
   * Cropped to a circle, the face in the upper half, so a square
   * head-and-shoulders shot works best. Its description is always the name.
   */
  portrait: z.object({ src: imageSrc }).default({ src: DEFAULT_PORTRAIT }),
  resume: z.object(
    {
      /** Where it sits in the documents bucket - named by the server on upload. */
      path: z.string().regex(RESUME_PATH_PATTERN, "Upload the PDF again"),
      /** In bytes, shown in the admin. */
      size: z.number().int().positive(),
      uploadedAt: z.iso.datetime(),
    },
    { error: "Upload your resume as a PDF" },
  ),
})

export type Profile = z.infer<typeof profileSchema>
export type Resume = Profile["resume"]

/** The profile as the admin edits it: no resume until the first upload. */
export type ProfileDraft = Omit<Profile, "resume"> & { resume: Resume | null }

/** The keys in the `settings` table, each with its schema. The pages' own words are in lib/page-content.ts. */
export const SETTINGS = { services: servicesSchema, profile: profileSchema, ...PAGE_SCHEMAS } as const
export type SettingKey = keyof typeof SETTINGS

/** The file in content/settings, kept only to seed Supabase. */
export type ServicesSource = z.input<typeof servicesSchema>
