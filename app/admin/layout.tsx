import type { Metadata } from "next"
import Link from "next/link"

import { signOut } from "@/app/admin/actions"
import { getAdmin } from "@/lib/admin/auth"
import { AdminNav } from "@/components/admin/admin-nav"

/** Every admin page depends on who is logged in, so none is built ahead of time. */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin | Muhammed Saheer",
  robots: { index: false, follow: false },
}

/** A plain working surface: light, quiet, none of the site's atmosphere (see SiteChrome). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin()

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 [color-scheme:light]">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="text-sm font-semibold text-neutral-900">
            Saheer · Admin
          </Link>
          {admin && (
            <div className="flex items-center gap-4 text-sm">
              <a href="/" target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-neutral-900">
                View site ↗
              </a>
              {admin.email && <span className="hidden text-neutral-500 sm:inline">{admin.email}</span>}
              <form action={signOut}>
                <button className="text-neutral-600 hover:text-neutral-900">Sign out</button>
              </form>
            </div>
          )}
        </div>
        {admin && (
          <div className="mx-auto max-w-5xl px-4 pb-2">
            <AdminNav />
          </div>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
