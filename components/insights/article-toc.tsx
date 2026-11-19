"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { ChevronDown } from "lucide-react"

import type { TocItem } from "@/lib/insights"
import { cn } from "@/lib/utils"

/**
 * Jumps to a heading the way the rest of the site scrolls: through Lenis when
 * it is running and motion is welcome, natively otherwise. Either way the
 * heading's own scroll-margin keeps it clear of the fixed header - Lenis reads
 * it too, so no offset is passed. The address takes the anchor, so the
 * position can be shared, and focus moves to the heading, so a keyboard user
 * carries on reading from there rather than from the top.
 *
 * "instant" is spelled out for reduced motion: the site sets smooth scrolling
 * on the page, which "auto" would inherit.
 *
 * Without JavaScript the links are plain anchors and still work.
 */
function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (window.__lenis && !still) {
    window.__lenis.scrollTo(target)
  } else {
    target.scrollIntoView({ behavior: still ? "instant" : "smooth", block: "start" })
  }

  window.history.replaceState(window.history.state, "", `#${id}`)
  target.focus({ preventScroll: true })
}

/**
 * The heading most recently scrolled past a line a third of the way down the
 * screen - the section being read. Before the first heading, none is.
 */
function useActiveHeading(items: TocItem[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null)

    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight / 3
      let current: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > line) break
        current = heading.id
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [items])

  return active
}

/** The contents beside the article on wide screens, marking the section being read. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items)

  return (
    <nav aria-labelledby="toc-heading">
      <h2 id="toc-heading" className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
        On this page
      </h2>
      <ol className="mt-5 border-l border-white/15">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => goTo(event, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-2 pl-4 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isActive
                    ? "border-accent text-white"
                    : "border-transparent text-white/70 hover:border-white/40 hover:text-white",
                )}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * The contents above the article on narrow screens: closed until asked for,
 * and closed again once a section is chosen. A native disclosure, so it opens
 * with Enter or Space before any JavaScript has loaded.
 */
export function ArticleTocDisclosure({ items }: { items: TocItem[] }) {
  const details = useRef<HTMLDetailsElement>(null)

  return (
    <details
      ref={details}
      className="group my-10 rounded-2xl border border-white/15 bg-[#07111c]/30 backdrop-blur-md"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
        On this page
        <ChevronDown aria-hidden className="size-4 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <nav aria-label="On this page" className="border-t border-white/15 px-5 pb-4 pt-2">
        <ol>
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  details.current?.removeAttribute("open")
                  goTo(event, item.id)
                }}
                className="flex gap-3 py-2 text-[15px] leading-snug text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span aria-hidden className="w-5 shrink-0 font-mono text-xs leading-[1.6] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}
