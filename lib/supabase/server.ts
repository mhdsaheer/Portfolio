import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { supabaseEnv } from "@/lib/supabase/env"

/**
 * For the admin: acts as whoever is logged in, through the session cookie, so
 * Row Level Security lets an admin write and nobody else. Make a new one for
 * each request; never share it.
 */
export async function createSessionClient() {
  const cookieStore = await cookies()
  const { url, key } = supabaseEnv()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        // Server Components can't set cookies; proxy.ts refreshes the session for them
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {}
      },
    },
  })
}
