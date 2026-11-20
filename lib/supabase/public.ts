import "server-only"

import { createClient } from "@supabase/supabase-js"

import { supabaseEnv } from "@/lib/supabase/env"

/**
 * For reads by the public site. It carries no login, so Row Level Security
 * shows it published articles only, and it touches no cookies, so the pages
 * that use it can stay static.
 */
export function createPublicClient() {
  const { url, key } = supabaseEnv()
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
