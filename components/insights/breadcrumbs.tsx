import Link from "next/link"

import { COVER_LABEL } from "@/components/insights/cover-styles"
import { cn } from "@/lib/utils"

export type Crumb = { name: string; href?: string }

/**
 * Where the page sits, on the cover's smoked-glass label. The last crumb is
 * the page itself, so it isn't a link; on a phone it gives way to the title
 * set large just below it.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn(COVER_LABEL, "max-w-full gap-2 normal-case tracking-[0.06em]")}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.name} className={cn("flex min-w-0 items-center gap-2", isLast && "hidden sm:flex")}>
              {index > 0 && (
                <span aria-hidden className="text-white/45">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className="max-w-[18rem] truncate text-white/70 lg:max-w-[28rem]">
                  {item.name}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
