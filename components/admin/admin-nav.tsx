"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const SECTIONS = [
  { href: "/admin", label: "Insights", matches: (path: string) => path === "/admin" || path.startsWith("/admin/insights") },
  { href: "/admin/case-studies", label: "Case studies", matches: (path: string) => path.startsWith("/admin/case-studies") },
  { href: "/admin/work-files", label: "Work files", matches: (path: string) => path.startsWith("/admin/work-files") },
  { href: "/admin/services", label: "Services", matches: (path: string) => path.startsWith("/admin/services") },
]

export function AdminNav() {
  const pathname = usePathname() ?? ""
  return (
    <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto">
      {SECTIONS.map((section) => {
        const current = section.matches(pathname)
        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={current ? "page" : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${
              current ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            {section.label}
          </Link>
        )
      })}
    </nav>
  )
}
