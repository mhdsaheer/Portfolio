import { Plus } from "lucide-react"

import { HEADING_2 } from "@/components/insights/article-body"
import { InlineText } from "@/components/insights/inline-text"
import type { Faq } from "@/lib/insight-content"
import { FAQ_ID } from "@/lib/insights"

/**
 * The questions people search for, each one a native disclosure. The first
 * answer starts open so the section never reads as a wall of closed rows.
 * Every answer stays in the HTML for search engines, and find-in-page opens
 * a closed one when it matches.
 */
export function ArticleFaq({ items }: { items: Faq[] }) {
  return (
    <section aria-labelledby={FAQ_ID}>
      <h2 id={FAQ_ID} tabIndex={-1} className={`scroll-mt-28 focus:outline-none ${HEADING_2}`}>
        Frequently asked questions
      </h2>
      <div className="mt-8 border-t border-white/15">
        {items.map((item, index) => (
          <details key={item.question} open={index === 0} className="faq-item group border-b border-white/15">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 group-open:pb-3 md:py-7 md:group-open:pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 [&::-webkit-details-marker]:hidden">
              <h3 className="text-pretty text-lg font-semibold leading-snug tracking-[-0.01em] text-white md:text-xl">
                <InlineText text={item.question} />
              </h3>
              <Plus
                aria-hidden
                className="mt-1 size-5 shrink-0 text-white/70 transition-transform duration-300 group-open:rotate-45 md:size-6"
              />
            </summary>
            <p className="pb-6 text-pretty text-base leading-[1.75] text-white/85 md:pb-7 md:text-[1.0625rem]">
              <InlineText text={item.answer} />
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
