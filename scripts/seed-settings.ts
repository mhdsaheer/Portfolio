/**
 * Copies the settings in content/settings into Supabase - for now, the About
 * page's services.
 *
 *   npx tsx scripts/seed-settings.ts --dry-run   check, write nothing
 *   npx tsx scripts/seed-settings.ts             check, then write
 *
 * Writing needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in
 * .env.local. The secret key bypasses Row Level Security, so it belongs on
 * this machine only - never in Vercel, never in the browser.
 *
 * Running it again overwrites the services with the file version, undoing any
 * edits made in the admin. Once the live site reads from Supabase, delete
 * content/settings and this script.
 */
import { existsSync } from "node:fs"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

import { services } from "@/content/settings/services"
import { servicesSchema } from "@/lib/settings-content"

async function main() {
  const dryRun = process.argv.includes("--dry-run")

  const parsed = servicesSchema.safeParse(services)
  if (!parsed.success) {
    console.error(`✗ services\n${z.prettifyError(parsed.error)}\nNothing was written.`)
    process.exit(1)
  }
  // Validating must not change a word
  if (JSON.stringify(parsed.data) !== JSON.stringify(services)) {
    console.error("✗ services: validating would change them. Nothing was written.")
    process.exit(1)
  }
  console.log(`✓ services (${parsed.data.length}: ${parsed.data.map((service) => service.title).join(", ")})`)

  if (dryRun) {
    console.log("\nValid. Dry run: nothing was written.")
    return
  }

  if (existsSync(".env.local")) process.loadEnvFile(".env.local")
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.")
    process.exit(1)
  }

  const supabase = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await supabase.from("settings").upsert({ key: "services", value: parsed.data }, { onConflict: "key" })
  if (error) {
    console.error(`Supabase refused the write: ${error.message}`)
    process.exit(1)
  }

  console.log("\nServices written to Supabase.")
}

main()
