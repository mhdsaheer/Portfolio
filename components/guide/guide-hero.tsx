import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { BODY, FOCUS, INK, MUTED } from "@/components/guide/tokens"
import { ShareLinks } from "@/components/insights/share-links"
import { AUTHOR, publishedAt, type Insight } from "@/lib/insights"
import type { Profile } from "@/lib/settings-content"
import { cn } from "@/lib/utils"

export const GUIDE_TITLE_ID = "guide-title"

/** The portrait is square, the face in its upper half. It is set in the admin, under Photo & resume. */
const PORTRAIT = "shrink-0 rounded-full object-cover object-[50%_28%] ring-2 ring-white"

/**
 * A title with a colon is set on two lines, and a number leading the second
 * line is picked out in the guide's gradient - deep enough to clear 4.5:1.
 */
function Title({ text }: { text: string }) {
  const [lead, rest] = text.includes(": ") ? text.split(/: (.+)/) : [text, ""]
  const [, number, after] = rest.match(/^(\d+)(.*)$/) ?? [, "", rest]

  return (
    <>
      {lead}
      {rest && (
        <>
          :{" "}
          <span className="block">
            {number && (
              <span className="bg-[linear-gradient(100deg,#3451D1,#6D28D9_55%,#BE185D)] bg-clip-text text-transparent">
                {number}
              </span>
            )}
            {after}
          </span>
        </>
      )}
    </>
  )
}

function Breadcrumbs({ title }: { title: string }) {
  const items = [
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
  ]

  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", MUTED)}>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <Link href={item.href} className={cn("rounded underline-offset-4 hover:text-[#20212A] hover:underline", FOCUS)}>
              {item.name}
            </Link>
            <ChevronRight aria-hidden className="size-3.5" />
          </li>
        ))}
        <li>
          <span aria-current="page" className={cn("line-clamp-1", INK)}>
            {title}
          </span>
        </li>
      </ol>
    </nav>
  )
}

/**
 * The guide's opening on paper: the trail back, the title set large, who
 * wrote it and when, then the cover as the featured image. The cover is the
 * page's largest element, so it is preloaded.
 */
export function GuideHero({
  insight,
  url,
  shortTitle,
  portrait,
}: {
  insight: Insight
  url: string
  shortTitle: string
  portrait: Profile["portrait"]
}) {
  const published = publishedAt(insight)

  return (
    <header className="relative isolate px-5 pt-7 sm:px-8 md:pt-10 lg:px-12 xl:px-16">
      {/* A soft wash of the guide's tints behind the opening, fading to white */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(60rem_26rem_at_8%_-10%,#F1ECFF_0%,transparent_70%),radial-gradient(50rem_24rem_at_92%_0%,#FFF0F6_0%,transparent_70%),radial-gradient(40rem_22rem_at_60%_40%,#EAF2FF_0%,transparent_70%)]"
      />

      <Breadcrumbs title={shortTitle} />

      <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-[#20212A] px-3 py-1 font-medium text-white">{insight.category}</span>
            <span className={cn("rounded-full border border-[#20212A]/10 bg-white/70 px-3 py-1", BODY)}>Visual guide</span>
            <span className={cn("rounded-full border border-[#20212A]/10 bg-white/70 px-3 py-1", BODY)}>{insight.readTime}</span>
          </p>
          <h1
            id={GUIDE_TITLE_ID}
            tabIndex={-1}
            className={cn(
              "mt-6 text-balance text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.045em] focus:outline-none sm:text-5xl lg:text-[3.6rem] xl:text-[4.25rem]",
              INK,
            )}
          >
            <Title text={insight.title} />
          </h1>
        </div>
        <p className={cn("max-w-md text-pretty text-lg leading-relaxed lg:col-span-4 lg:pb-2", BODY)}>{insight.excerpt}</p>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-[#20212A]/10 pt-6">
        <div className="flex items-center gap-4">
          <Image src={portrait.src} alt="" width={52} height={52} sizes="52px" className={cn("size-[52px]", PORTRAIT)} />
          <div className="text-sm leading-snug">
            <p className={MUTED}>
              Written by{" "}
              <Link
                href={AUTHOR.path}
                rel="author"
                className={cn("rounded font-semibold underline decoration-[#4263EB]/35 underline-offset-4 hover:decoration-[#3451D1]", INK, FOCUS)}
              >
                {AUTHOR.name}
              </Link>
            </p>
            <p className={cn("mt-1", MUTED)}>{AUTHOR.role}</p>
          </div>
        </div>

        <dl className={cn("flex flex-wrap gap-x-8 gap-y-3 text-sm", MUTED)}>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.16em]">Published</dt>
            <dd className={cn("mt-1 font-medium", INK)}>
              <time dateTime={published}>{insight.date}</time>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.16em]">Reading time</dt>
            <dd className={cn("mt-1 font-medium", INK)}>{insight.readTime.replace(" read", "")}</dd>
          </div>
        </dl>

        <ShareLinks id="share-top" url={url} title={insight.title} label="Share" tone="light" className="hidden xl:flex" />
      </div>

      <figure className="mt-8 md:mt-10">
        <div className="overflow-hidden rounded-[1.5rem] bg-[#F7F8FC] shadow-[0_0_0_1px_rgba(32,33,42,0.06)] md:rounded-[2rem]">
          <Image
            src={insight.image}
            alt={insight.imageAlt}
            width={2400}
            height={1350}
            preload
            sizes="(min-width: 1480px) 1380px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </figure>
    </header>
  )
}
