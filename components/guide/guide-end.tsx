import { Plus } from "lucide-react"

import { GUIDE_H2 } from "@/components/guide/guide-body"
import { BODY, INK, MEASURE } from "@/components/guide/tokens"
import { InlineText } from "@/components/insights/inline-text"
import type { Faq } from "@/lib/insight-content"
import { FAQ_ID } from "@/lib/insights"
import { cn } from "@/lib/utils"

/**
 * The questions people search for, each a native disclosure, as on the site's
 * other articles: the first starts open, every answer stays in the HTML for
 * search engines, and find-in-page opens a closed one when it matches. The
 * `faq-item` rule in globals.css animates the height where browsers allow it.
 */
export function GuideFaq({ items }: { items: Faq[] }) {
  return (
    <section aria-labelledby={FAQ_ID}>
      <h2 id={FAQ_ID} tabIndex={-1} className={GUIDE_H2}>
        Frequently asked questions
      </h2>
      <div className="overflow-hidden rounded-3xl border border-[#20212A]/10 bg-white">
        {items.map((item, index) => (
          <details
            key={item.question}
            open={index === 0}
            className="faq-item group border-b border-[#20212A]/10 last:border-b-0 open:bg-[#F7F8FC]"
          >
            <summary
              className={cn(
                "flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 md:px-7 md:py-6 [&::-webkit-details-marker]:hidden",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4263EB]",
              )}
            >
              <h3 className={cn("text-pretty text-lg font-semibold leading-snug tracking-[-0.01em]", INK)}>
                <InlineText text={item.question} tone="light" />
              </h3>
              <span
                aria-hidden
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#EAF2FF] text-[#3451D1] transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              >
                <Plus className="size-4" />
              </span>
            </summary>
            <p className={cn("px-5 pb-6 text-pretty text-[15px] leading-[1.75] md:px-7 md:text-base", BODY, MEASURE)}>
              <InlineText text={item.answer} tone="light" />
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
