import { z } from "zod"

import { text } from "@/lib/schema-fields"

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

/** The keys in the `settings` table, each with its schema. */
export const SETTINGS = { services: servicesSchema } as const
export type SettingKey = keyof typeof SETTINGS

/** The file in content/settings, kept only to seed Supabase. */
export type ServicesSource = z.input<typeof servicesSchema>
