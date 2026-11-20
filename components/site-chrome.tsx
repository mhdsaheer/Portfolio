"use client"

import { usePathname } from "next/navigation"

import { SmoothScroll } from "@/components/smooth-scroll"
import { DesktopCursor } from "@/components/ui/desktop-cursor"
import { IntroLoader } from "@/components/ui/intro-loader"
import { UnicornBackground } from "@/components/ui/unicorn-background"

/**
 * The site's atmosphere - the intro, the animated background, the cursor and
 * smooth scrolling. The admin is a working tool, so it gets none of it.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) return <>{children}</>

  return (
    <SmoothScroll>
      <IntroLoader />
      <UnicornBackground />
      <DesktopCursor />
      {children}
    </SmoothScroll>
  )
}
