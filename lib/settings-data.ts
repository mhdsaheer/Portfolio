import "server-only"

import { cache } from "react"
import { z } from "zod"

import { SETTINGS, numberServices, type Service, type SettingKey } from "@/lib/settings-content"
import { createPublicClient } from "@/lib/supabase/public"

/**
 * One setting, checked against its schema. Unlike a list of articles there is
 * nothing to fall back on if it is missing or broken, so both throw: a build
 * fails rather than publishing an About page with no services.
 */
async function loadSetting<K extends SettingKey>(key: K): Promise<z.infer<(typeof SETTINGS)[K]>> {
  const { data, error } = await createPublicClient().from("settings").select("value").eq("key", key).maybeSingle()

  if (error) throw new Error(`Could not load the "${key}" setting from Supabase: ${error.message}`)
  if (!data) throw new Error(`The "${key}" setting is missing from Supabase. Run scripts/seed-settings.ts.`)

  const parsed = SETTINGS[key].safeParse(data.value)
  if (!parsed.success) throw new Error(`The "${key}" setting does not match its schema:\n${z.prettifyError(parsed.error)}`)
  return parsed.data
}

/** The About page's services, in order and numbered. */
export const getServices = cache(async (): Promise<Service[]> => numberServices(await loadSetting("services")))
