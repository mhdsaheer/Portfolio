import { HEADING_2 } from "@/components/insights/article-body"
import { InlineText } from "@/components/insights/inline-text"
import type { Faq } from "@/lib/insight-content"
import { FAQ_ID } from "@/lib/insights"

/**
 * The questions people search for, answered in full and in the open - every
 * answer visible, none behind a toggle, so a reader skimming for one finds it
 * without a click.
 */
export function ArticleFaq({ items }: { items: Faq[] }) {
  return (
    <section aria-labelledby={FAQ_ID}>
      <h2 id={FAQ_ID} tabIndex={-1} className={`scroll-mt-28 focus:outline-none ${HEADING_2}`}>
        Frequently asked questions
      </h2>
      <div className="mt-8 border-t border-white/15">
        {items.map((item) => (
          <div key={item.question} className="border-b border-white/15 py-6 md:py-7">
            <h3 className="text-pretty text-lg font-semibold leading-snug tracking-[-0.01em] text-white md:text-xl">
              <InlineText text={item.question} />
            </h3>
            <p className="mt-3 text-pretty text-base leading-[1.75] text-white/85 md:text-[1.0625rem]">
              <InlineText text={item.answer} />
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
