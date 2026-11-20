import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"

import { GUIDE_H2 } from "@/components/guide/guide-body"
import { BODY, FOCUS, INK, MEASURE, MUTED } from "@/components/guide/tokens"
import { InlineText, TEXT_LINK_LIGHT } from "@/components/insights/inline-text"
import type { Faq } from "@/lib/insight-content"
import { AUTHOR, FAQ_ID } from "@/lib/insights"
import { cn } from "@/lib/utils"

/** What he works with, shown as plain labels rather than claims about projects. */
const SKILLS = ["Figma", "HTML, CSS & JavaScript", "React & Next.js", "TypeScript", "Responsive design", "Prototyping"]

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

/**
 * The author after the article: who he is, how he works, and one quiet line
 * inviting the reader further. The footer below makes the louder invitation.
 */
export function GuideAuthorCard() {
  return (
    <section aria-labelledby="author-heading" className="mt-14 rounded-3xl border border-[#20212A]/10 bg-[#F7F8FC] p-6 md:p-8">
      {/* Who: portrait, name and role, with the profile links set against them */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={AUTHOR.image}
            alt={`Portrait of ${AUTHOR.name}`}
            width={64}
            height={64}
            sizes="64px"
            className="size-16 shrink-0 rounded-full object-cover object-[50%_28%] ring-4 ring-white"
          />
          <div className="min-w-0">
            <h2 id="author-heading" className={cn("text-xl font-semibold tracking-[-0.02em] md:text-2xl", INK)}>
              {AUTHOR.name}
            </h2>
            <p className={cn("mt-0.5 text-sm", MUTED)}>
              {AUTHOR.jobTitle} · {AUTHOR.location}
            </p>
          </div>
        </div>

        <ul aria-label="Profiles" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <li>
            <Link href={AUTHOR.path} className={cn("rounded text-[#3451D1] underline-offset-4 hover:underline", FOCUS)}>
              About me
            </Link>
          </li>
          {AUTHOR.profiles.map((profile) => (
            <li key={profile.label}>
              <a
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer me"
                className={cn("inline-flex items-center gap-1 rounded text-[#3451D1] underline-offset-4 hover:underline", FOCUS)}
              >
                {profile.label}
                <span className="sr-only"> (opens in a new tab)</span>
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <ul aria-label="Skills" className="mt-6 flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <li key={skill} className={cn("rounded-full border border-[#20212A]/10 bg-white px-3 py-1 text-[13px]", BODY)}>
            {skill}
          </li>
        ))}
      </ul>

      <p className={cn("mt-6 border-t border-[#20212A]/10 pt-6 text-pretty text-[15px] leading-relaxed", BODY)}>
        Interested in creating a better digital experience?{" "}
        <Link href="/work" className={TEXT_LINK_LIGHT}>
          Explore my portfolio
        </Link>{" "}
        and{" "}
        <Link href="/contact" className={TEXT_LINK_LIGHT}>
          let’s connect
        </Link>
        .
      </p>
    </section>
  )
}
