import "server-only"

import { cache } from "react"
import { z } from "zod"

import { PAGE_DEFAULTS, type AboutPage, type FooterContent, type HomePage, type WorkPage } from "@/lib/page-content"
import { SETTINGS, numberServices, type Profile, type Service, type SettingKey } from "@/lib/settings-content"
import { createPublicClient } from "@/lib/supabase/public"

/**
 * One setting, checked against its schema. Unlike a list of articles there is
 * usually nothing to fall back on if it is missing or broken, so both throw:
 * a build fails rather than publishing an About page with no services. A page
 * that has never been saved has its shipped copy to fall back on, and passes it.
 */
async function loadSetting<K extends SettingKey>(
  key: K,
  fallback?: z.infer<(typeof SETTINGS)[K]>,
): Promise<z.infer<(typeof SETTINGS)[K]>> {
  const { data, error } = await createPublicClient().from("settings").select("value").eq("key", key).maybeSingle()

  if (error) throw new Error(`Could not load the "${key}" setting from Supabase: ${error.message}`)
  if (!data && fallback !== undefined) return fallback
  if (!data) throw new Error(`The "${key}" setting is missing from Supabase. Save it once in the admin.`)

  const parsed = SETTINGS[key].safeParse(data.value)
  if (!parsed.success) throw new Error(`The "${key}" setting does not match its schema:\n${z.prettifyError(parsed.error)}`)
  // TypeScript can't follow the key through a union of schemas; SETTINGS[key] parsed it, so this holds
  return parsed.data as z.infer<(typeof SETTINGS)[K]>
}

/** The About page's services, in order and numbered. */
export const getServices = cache(async (): Promise<Service[]> => numberServices(await loadSetting("services")))

/** The About photo, the article portrait and the current resume. */
export const getProfile = cache(async (): Promise<Profile> => loadSetting("profile"))

/* Each page's own words, as edited under Pages; the shipped copy until first saved. */
export const getHomePage = cache(async (): Promise<HomePage> => loadSetting("page-home", PAGE_DEFAULTS["page-home"]))
export const getAboutPage = cache(async (): Promise<AboutPage> => loadSetting("page-about", PAGE_DEFAULTS["page-about"]))
export const getWorkPage = cache(async (): Promise<WorkPage> => loadSetting("page-work", PAGE_DEFAULTS["page-work"]))
export const getFooter = cache(async (): Promise<FooterContent> => loadSetting("page-footer", PAGE_DEFAULTS["page-footer"]))
