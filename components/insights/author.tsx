import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { AccentStar } from "@/components/about/accent-star"
import { TEXT_LINK } from "@/components/insights/inline-text"
import { AUTHOR } from "@/lib/insights"

/** The portrait is square, the face in its upper half. */
const PORTRAIT = "shrink-0 rounded-full border border-white/20 object-cover object-[50%_28%]"

/** Who wrote it, at the head of the article: the name links to the About page. */
export function AuthorByline() {
  return (
    <div className="flex items-center gap-4">
      <Image src={AUTHOR.image} alt="" width={48} height={48} sizes="48px" className={`size-12 ${PORTRAIT}`} />
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

/**
 * The author, after the article: who wrote it and why it is worth trusting,
 * then where to see more. The footer below makes the invitation to get in touch.
 */
export function AuthorCard() {
  return (
    <section
      aria-labelledby="author-heading"
      className="mt-14 rounded-3xl border border-white/15 bg-[#07111c]/30 p-6 backdrop-blur-md md:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Image src={AUTHOR.image} alt={`Portrait of ${AUTHOR.name}`} width={80} height={80} sizes="80px" className={`size-20 ${PORTRAIT}`} />

        <div className="min-w-0">
          <h2
            id="author-heading"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent"
          >
            <AccentStar className="size-3" />
            About the author
          </h2>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white">{AUTHOR.name}</p>
          <p className="mt-3 text-pretty text-base leading-relaxed text-white/85">{AUTHOR.bio}</p>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]">
            <li>
              <Link href="/work" className="text-white/75 transition-colors hover:text-white">
                Selected work
              </Link>
            </li>
            {AUTHOR.profiles.map((profile) => (
              <li key={profile.label}>
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-1 text-white/75 transition-colors hover:text-white"
                >
                  {profile.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
