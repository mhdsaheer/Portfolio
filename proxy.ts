import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { supabaseEnv } from "@/lib/supabase/env"

/**
 * Runs for /admin only; the public site never passes through here.
 *
 * It keeps the Supabase login fresh - an expired access token is swapped for
 * a new one and written back as cookies, which Server Components can't do
 * themselves - and sends anyone not logged in to the login page.
 *
 * This is the quick check. The real one is requireAdmin() in
 * lib/admin/auth.ts, which every admin page and action runs on its own.
 */
export async function proxy(request: NextRequest) {
  const { url, key } = supabaseEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value))
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const onLoginPage = request.nextUrl.pathname === "/admin/login"

  if (!data?.claims && !onLoginPage) {
    const login = request.nextUrl.clone()
    login.pathname = "/admin/login"
    login.search = ""
    return NextResponse.redirect(login)
  }

  return response
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
