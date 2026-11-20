"use client"

import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

import { goTo, useActiveHeading } from "@/components/insights/article-toc"
import { FOCUS } from "@/components/guide/tokens"
import type { TocItem } from "@/lib/insights"
import { cn } from "@/lib/utils"

/** The contents in three runs: the opening sections, the numbered design types, then the rest. */
function split(items: TocItem[]) {
  const first = items.findIndex((item) => item.number)
  if (first === -1) return { before: items, numbered: [], after: [] }
  const last = items.findLastIndex((item) => item.number)
  return { before: items.slice(0, first), numbered: items.slice(first, last + 1), after: items.slice(last + 1) }
}

/**
 * The contents beside the article on wide screens, marking the section being
 * read. The numbered design types are grouped under their own label, and the
 * list scrolls itself to keep the current entry in view.
 */
export function GuideToc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items)
  const list = useRef<HTMLDivElement>(null)
  const { before, numbered, after } = split(items)

  // Scrolls only the list, never the page, so the reader's place is left alone
  useEffect(() => {
    const box = list.current
    const link = box?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!box || !link) return
    const top = link.offsetTop - box.offsetTop
    if (top < box.scrollTop + 40 || top > box.scrollTop + box.clientHeight - 80) {
      box.scrollTo({ top: top - box.clientHeight / 3 })
    }
  }, [active])

  const entry = (item: TocItem) => {
    const isActive = item.id === active
    return (
      <li key={item.id}>
        <a
          href={`#${item.id}`}
          onClick={(event) => goTo(event, item.id)}
          aria-current={isActive ? "location" : undefined}
          className={cn(
            "flex gap-2.5 rounded-lg px-3 py-1.5 text-[13.5px] leading-snug transition-colors",
            FOCUS,
            isActive ? "bg-[#EAF2FF] font-medium text-[#20212A]" : "text-[#5F6373] hover:bg-[#F7F8FC] hover:text-[#20212A]",
          )}
        >
          {item.number && (
            <span
              aria-hidden
              className={cn("w-5 shrink-0 font-mono text-[11px] leading-[1.75]", isActive ? "text-[#3451D1]" : "text-[#5F6373]")}
            >
              {item.number}
            </span>
          )}
          {item.text}
        </a>
      </li>
    )
  }

  return (
    <nav aria-labelledby="guide-toc-heading" className="flex max-h-[calc(100svh-8rem)] flex-col">
      <h2 id="guide-toc-heading" className="px-3 font-mono text-xs uppercase tracking-[0.18em] text-[#5F6373]">
        On this page
      </h2>
      {/* Lenis would turn a wheel over the list into page scroll; this list keeps its own */}
      <div ref={list} data-lenis-prevent className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 pr-1">
        <ol className="space-y-0.5">
          {before.map(entry)}
          {numbered.length > 0 && (
            <li className="pt-3">
              <p className="px-3 pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#5F6373]">
                The {numbered.length} types
              </p>
              <ol className="space-y-0.5 border-l border-[#20212A]/10 pl-1">{numbered.map(entry)}</ol>
            </li>
          )}
          {after.length > 0 && <li className="pt-3" aria-hidden />}
          {after.map(entry)}
        </ol>
      </div>
    </nav>
  )
}

/**
 * The contents above the article on narrow screens: closed until asked for,
 * and closed again once a section is chosen. A native disclosure, so it opens
 * with Enter or Space before any JavaScript has loaded.
 */
export function GuideTocDisclosure({ items }: { items: TocItem[] }) {
  const details = useRef<HTMLDetailsElement>(null)

  return (
    <details ref={details} className="group my-10 rounded-2xl border border-[#20212A]/10 bg-[#F7F8FC]">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#20212A] [&::-webkit-details-marker]:hidden",
          FOCUS,
        )}
      >
        On this page
        <ChevronDown
          aria-hidden
          className="size-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <nav aria-label="On this page" className="border-t border-[#20212A]/10 px-3 pb-3 pt-2">
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  details.current?.removeAttribute("open")
                  goTo(event, item.id)
                }}
                className={cn(
                  "flex gap-3 rounded-lg px-2 py-2 text-[15px] leading-snug text-[#3F4150] transition-colors hover:bg-white hover:text-[#20212A]",
                  FOCUS,
                )}
              >
                <span aria-hidden className="w-5 shrink-0 font-mono text-xs leading-[1.6] text-[#3451D1]">
                  {item.number ?? "·"}
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
