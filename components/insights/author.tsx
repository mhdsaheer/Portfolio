import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { TEXT_LINK, TEXT_LINK_LIGHT, type Tone } from "@/components/insights/inline-text"
import { AUTHOR } from "@/lib/insights"
import type { Profile } from "@/lib/settings-content"
import { cn } from "@/lib/utils"

/** The portrait is square, the face in its upper half. It is set in the admin, under Photo & resume. */
const PORTRAIT = "shrink-0 rounded-full border border-white/20 object-cover object-[50%_28%]"

/** Who wrote it, at the head of the article: the name links to the About page. */
export function AuthorByline({ portrait }: { portrait: Profile["portrait"] }) {
  return (
    <div className="flex items-center gap-4">
      <Image src={portrait.src} alt="" width={48} height={48} sizes="48px" className={`size-12 ${PORTRAIT}`} />
      <div className="text-sm leading-snug">
        <p className="text-white/75">
          Written by{" "}
          <Link href={AUTHOR.path} rel="author" className={TEXT_LINK}>
            {AUTHOR.name}
          </Link>
        </p>
        <p className="mt-1 text-white/75">
          {AUTHOR.role} · {AUTHOR.location}
        </p>
      </div>
    </div>
  )
}

/** What he works with, shown as plain labels rather than claims about projects. */
const SKILLS = ["Figma", "HTML, CSS & JavaScript", "React & Next.js", "TypeScript", "Responsive design", "Prototyping"]

/** One card, two papers: the dark article pages and the guide layout's light one. */
const CARD_TONES: Record<Tone, Record<"card" | "portrait" | "name" | "meta" | "link" | "chip" | "rule" | "body" | "textLink", string>> = {
  dark: {
    card: "border-white/15 bg-[#07111c]/30 backdrop-blur-md",
    portrait: "ring-white/15",
    name: "text-white",
    meta: "text-white/75",
    link: "text-accent focus-visible:outline-accent",
    chip: "border-white/15 bg-white/[0.06] text-white/85",
    rule: "border-white/15",
    body: "text-white/85",
    textLink: TEXT_LINK,
  },
  light: {
    card: "border-[#20212A]/10 bg-[#F7F8FC]",
    portrait: "ring-white",
    name: "text-[#20212A]",
    meta: "text-[#5F6373]",
    link: "text-[#3451D1] focus-visible:outline-[#4263EB]",
    chip: "border-[#20212A]/10 bg-white text-[#3F4150]",
    rule: "border-[#20212A]/10",
    body: "text-[#3F4150]",
    textLink: TEXT_LINK_LIGHT,
  },
}

/**
 * The author after the article: who he is, how he works, and one quiet line
 * inviting the reader further. The footer below makes the louder invitation.
 * The same card on every article, in the page's tone.
 */
export function AuthorCard({ portrait, tone = "dark" }: { portrait: Profile["portrait"]; tone?: Tone }) {
  const style = CARD_TONES[tone]
  const link = cn(
    "inline-flex items-center gap-1 rounded underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2",
    style.link,
  )

  return (
    <section aria-labelledby="author-heading" className={cn("mt-14 rounded-3xl border p-6 md:p-8", style.card)}>
      {/* Who: portrait, name and role, with the profile links set against them */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={portrait.src}
            alt={`Portrait of ${AUTHOR.name}`}
            width={64}
            height={64}
            sizes="64px"
            className={cn("size-16 shrink-0 rounded-full object-cover object-[50%_28%] ring-4", style.portrait)}
          />
          <div className="min-w-0">
            <h2 id="author-heading" className={cn("text-xl font-semibold tracking-[-0.02em] md:text-2xl", style.name)}>
              {AUTHOR.name}
            </h2>
            <p className={cn("mt-0.5 text-sm", style.meta)}>
              {AUTHOR.jobTitle} · {AUTHOR.location}
            </p>
          </div>
        </div>

        <ul aria-label="Profiles" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <li>
            <Link href={AUTHOR.path} className={link}>
              About me
            </Link>
          </li>
          {AUTHOR.profiles.map((profile) => (
            <li key={profile.label}>
              <a href={profile.href} target="_blank" rel="noopener noreferrer me" className={link}>
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
          <li key={skill} className={cn("rounded-full border px-3 py-1 text-[13px]", style.chip)}>
            {skill}
          </li>
        ))}
      </ul>

      <p className={cn("mt-6 border-t pt-6 text-pretty text-[15px] leading-relaxed", style.rule, style.body)}>
        Interested in creating a better digital experience?{" "}
        <Link href="/work" className={style.textLink}>
          Explore my portfolio
        </Link>{" "}
        and{" "}
        <Link href="/contact" className={style.textLink}>
          let’s connect
        </Link>
        .
      </p>
    </section>
  )
}
