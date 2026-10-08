"use client"

import { useRef, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Maximize2 } from "lucide-react"
import { motion, useInView } from "framer-motion"

import { AccentStar } from "@/components/about/accent-star"
import { ACCENT, ACCENT_GLOW } from "@/components/about/tokens"
import { entrances } from "@/components/work/motion"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import type { CaseStudy } from "@/lib/case-studies"
import type { WorkFile } from "@/lib/work-files"
import { cn } from "@/lib/utils"

export type Tile =
  | { kind: "study"; study: CaseStudy; full: boolean; delay: number }
  | { kind: "file"; file: WorkFile; wideBelowLg: boolean; delay: number }
  | { kind: "archive"; span: 1 | 2 | 3; delay: number }

/** Seconds between tiles of one row arriving, left to right. */
const STAGGER = 0.08

/**
 * Lays the index out in rows of three from 1024px up: each case study, two
 * columns wide, paired with a file - swapping sides row by row. Case studies
 * without a partner take the full row, spare files fill rows of three, and the
 * archive takes whatever the last row leaves open.
 *
 * The same order holds on two columns, where every case study runs full width
 * between pairs of files. A file that would sit alone there - before a case
 * study, or last of all - widens to fill the row instead of leaving a hole.
 */
export function planTiles(studies: CaseStudy[], files: WorkFile[]): Tile[] {
  const tiles: Tile[] = []
  const pairs = Math.min(studies.length, files.length)

  for (let i = 0; i < pairs; i++) {
    const study: Tile = { kind: "study", study: studies[i], full: false, delay: 0 }
    const file: Tile = { kind: "file", file: files[i], wideBelowLg: false, delay: 0 }
    const row = i % 2 === 0 ? [study, file] : [file, study]
    row[1].delay = STAGGER
    tiles.push(...row)
  }

  for (const study of studies.slice(pairs)) tiles.push({ kind: "study", study, full: true, delay: 0 })

  const spare = files.slice(pairs)
  spare.forEach((file, i) => tiles.push({ kind: "file", file, wideBelowLg: false, delay: (i % 3) * STAGGER }))

  const leftOpen = spare.length % 3 === 0 ? 3 : 3 - (spare.length % 3)
  tiles.push({ kind: "archive", span: leftOpen as 1 | 2 | 3, delay: leftOpen === 3 ? 0 : (spare.length % 3) * STAGGER })

  // Two columns: find the files that would be left alone on their row
  let alone: Extract<Tile, { kind: "file" }> | null = null
  for (const tile of tiles) {
    if (tile.kind === "file") {
      alone = alone ? null : tile
    } else if (alone) {
      alone.wideBelowLg = true
      alone = null
    }
  }

  return tiles
}

/**
 * A tile's one control, its title, stretched over the whole tile. The outline
 * is drawn inside, where the tile's own clipping cannot shave it off.
 */
const STRETCH =
  "text-left focus-visible:outline-hidden after:absolute after:inset-0 after:z-10 after:rounded-[1.5rem] focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-[#c8e0f5]"

/** Darkens the foot of a cover so the words set over it stay readable. */
const SCRIM =
  "bg-[linear-gradient(to_top,rgba(7,17,28,0.92)_0%,rgba(7,17,28,0.55)_38%,rgba(7,17,28,0)_70%)]"

/** The label pill a case study names its kind of work with - "AI Product". */
const CHIP =
  "w-fit rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase italic leading-none text-white backdrop-blur-md md:text-[11px]"

const CORNER =
  "grid size-8 shrink-0 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0d1b2c] md:size-11"

/**
 * Covers rest a touch enlarged and settle back to size on hover - a zoom out
 * that never shrinks below the frame, so no edge of the tile shows through.
 */
const ZOOM =
  "scale-[1.08] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"

/**
 * The tile itself: rises into place once in view, after the opening reveal.
 *
 * Its words sit in normal flow, top and foot, while the cover and the scrim sit
 * behind them at -z-10 inside the tile's own stacking context (isolate). That
 * keeps the tile the nearest positioned ancestor of the title's control, so the
 * control's stretched ::after covers all of it - an absolutely positioned text
 * block would become the ::after's containing block and shrink it to the words.
 */
function TileFrame({
  className,
  delay,
  ready,
  children,
}: {
  className: string
  delay: number
  ready: boolean
  children: ReactNode
}) {
  const tileRef = useRef<HTMLLIElement>(null)
  const still = useHydratedReducedMotion()
  const inView = useInView(tileRef, { once: true, amount: 0.2 })
  const { card } = entrances(still)

  return (
    <motion.li
      ref={tileRef}
      custom={delay}
      initial="hidden"
      animate={still || (inView && ready) ? "shown" : "hidden"}
      variants={card}
      className={cn(
        "group relative isolate flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5",
        className,
      )}
    >
      {children}
    </motion.li>
  )
}

/**
 * A case study: the cover run edge to edge, the story set over the foot of it.
 * Two columns wide beside a file; the full row alone.
 */
export function StudyTile({ tile, ready }: { tile: Extract<Tile, { kind: "study" }>; ready: boolean }) {
  const { study, full } = tile
  const cover = study.gallery.find((shot) => shot.src === study.image)

  return (
    <TileFrame
      delay={tile.delay}
      ready={ready}
      className={cn(
        "col-span-2 aspect-[4/5] sm:aspect-[16/10]",
        full ? "lg:col-span-3 lg:aspect-[21/9]" : "lg:aspect-auto lg:min-h-[26rem]",
      )}
    >
      <Image
        src={study.image}
        alt={cover?.alt ?? ""}
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        className={cn("-z-10 object-cover", ZOOM)}
      />
      <div aria-hidden className={cn("absolute inset-0 -z-10", SCRIM)} />

      <div className="p-4 md:p-6">
        <p className={CHIP}>{study.category}</p>
      </div>

      <div className="flex items-end justify-between gap-4 p-5 md:gap-8 md:p-7">
        <div className="min-w-0 max-w-[36rem]">
          <h3 className="text-balance text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-3xl xl:text-4xl">
            <Link href={`/work/${study.slug}`} className={STRETCH}>
              <AccentedTitle title={study.title} />
            </Link>
          </h3>
          {/* Opens on hover or keyboard focus, lifting the title as it grows. Screens
              that cannot hover keep it on show, or touch would never reach it */}
          <div className="hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:grid [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="min-h-0 overflow-hidden">
              <p className="mt-3 line-clamp-2 text-pretty text-sm leading-relaxed text-white/75 xl:text-[15px]">
                {study.summary}
              </p>
            </div>
          </div>
        </div>

        <span aria-hidden className={CORNER}>
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </TileFrame>
  )
}

/** Each format's corner mark, and what a screen reader is told opening it does. */
const FORMATS = {
  image: { hint: "view full size", Icon: Maximize2 },
  link: { hint: "opens in a new tab", Icon: ArrowUpRight },
} as const

/**
 * A piece that opens rather than being read about. Images go to the viewer;
 * links leave for a new tab, and the corner mark says which it is.
 */
export function FileTile({
  tile,
  ready,
  onView,
}: {
  tile: Extract<Tile, { kind: "file" }>
  ready: boolean
  onView: () => void
}) {
  const { file, wideBelowLg } = tile
  const { hint, Icon } = FORMATS[file.format]
  const cover = file.cover ?? (file.format === "image" ? file.src : undefined)

  return (
    <TileFrame
      delay={tile.delay}
      ready={ready}
      className={
        wideBelowLg ? "col-span-2 aspect-[16/10] lg:col-span-1 lg:aspect-[4/5]" : "col-span-1 aspect-[4/5]"
      }
    >
      {cover ? (
        // The title over it names the piece; the viewer carries the description
        <Image
          src={cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, 50vw"
          className={cn("-z-10 object-cover", ZOOM)}
        />
      ) : (
        <LetteredCover file={file} />
      )}
      <div aria-hidden className={cn("absolute inset-0 -z-10", SCRIM)} />

      <div className="flex items-start justify-end p-3 md:p-5">
        <span aria-hidden className={CORNER}>
          <Icon className="size-3.5 md:size-4" />
        </span>
      </div>

      <div className="p-3.5 md:p-5">
        <h3 className="text-sm font-semibold leading-snug tracking-[-0.01em] text-white md:text-lg">
          {file.format === "image" ? (
            <button type="button" onClick={onView} data-file={file.slug} className={STRETCH}>
              {file.title}
              <span className="sr-only">, {hint}</span>
            </button>
          ) : (
            <a href={file.src} target="_blank" rel="noopener noreferrer" className={STRETCH}>
              {file.title}
              <span className="sr-only"> ({hint})</span>
            </a>
          )}
        </h3>
        <p className="mt-1 text-[11px] leading-snug text-white/70 md:text-[13px]">{file.kind}</p>
      </div>
    </TileFrame>
  )
}

/** The archive's width, on two columns and from 1024px up. */
const ARCHIVE_SPAN = {
  1: "lg:col-span-1 lg:aspect-[4/5] lg:min-h-0",
  2: "lg:col-span-2 lg:min-h-0",
  3: "lg:col-span-3 lg:min-h-[17rem]",
} as const

/**
 * The old portfolio, as the index's last tile: a stack of pages that fans out
 * on hover, over an invitation to open the PDF. It sits outside the filter -
 * the PDF spans every discipline.
 */
export function ArchiveTile({
  tile,
  href,
  ready,
}: {
  tile: Extract<Tile, { kind: "archive" }>
  href: string
  ready: boolean
}) {
  return (
    <TileFrame
      delay={tile.delay}
      ready={ready}
      className={cn(
        "col-span-2 min-h-[21rem] justify-end border-white/15 bg-[linear-gradient(140deg,#132a45_0%,#2d4f72_60%,#4a74a0_100%)] md:min-h-[18rem]",
        ARCHIVE_SPAN[tile.span],
      )}
    >
      <PageStack large={tile.span > 1} />

      <div className="flex flex-col p-5 md:p-7">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase italic text-[#c8e0f5]">
          <AccentStar className="size-2.5 text-white" />
          Archive
        </p>
        <h3 className="mt-3 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-3xl">
          <a href={href} target="_blank" rel="noopener noreferrer" className={STRETCH}>
            Old{" "}
            <em className="font-serif font-normal" style={{ color: ACCENT, textShadow: ACCENT_GLOW }}>
              portfolio
            </em>
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </h3>
        <p className="mt-2 max-w-[16rem] text-pretty text-sm leading-relaxed text-white/70">
          Everything from before this site, kept whole in one PDF.
        </p>
        <span aria-hidden className="mt-5 inline-flex items-center gap-3 text-sm font-medium text-white">
          Open the PDF
          <span className="grid size-10 place-items-center rounded-full bg-white text-[#0d1b2c] transition-transform duration-300 group-hover:scale-110">
            <ArrowUpRight className="size-4" />
          </span>
        </span>
      </div>
    </TileFrame>
  )
}

/**
 * Three sheets of the portfolio, stacked at the tile's corner - or, when the
 * tile runs wide on a large screen, set larger in the space right of centre.
 */
function PageStack({ large }: { large: boolean }) {
  const sheet = "absolute inset-0 origin-bottom rounded-lg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"

  return (
    <div
      aria-hidden
      className={cn(
        "absolute right-6 top-6 -z-10 h-32 w-24 md:right-8 md:top-8 md:h-40 md:w-[7.5rem]",
        large && "lg:right-[18%] lg:top-1/2 lg:h-56 lg:w-44 lg:-translate-y-1/2",
      )}
    >
      <div className={cn(sheet, "-rotate-12 border border-white/20 bg-white/10 group-hover:-rotate-[20deg]")} />
      <div className={cn(sheet, "rotate-6 border border-white/25 bg-white/15 group-hover:rotate-[14deg]")} />
      <div className={cn(sheet, "-rotate-2 flex flex-col gap-1.5 bg-[#eef4fa] p-3 shadow-2xl group-hover:-translate-y-2 group-hover:rotate-0")}>
        <span className="h-1.5 w-3/5 rounded-full bg-[#2d4f72]" />
        <span className="h-1 w-full rounded-full bg-[#2d4f72]/25" />
        <span className="h-1 w-4/5 rounded-full bg-[#2d4f72]/25" />
        <span className="mt-1 aspect-[4/3] w-full rounded-md bg-[linear-gradient(140deg,#2d4f72,#8fb3d6)]" />
        <span className="mt-auto self-start rounded-full bg-[#2d4f72] px-1.5 py-0.5 text-[8px] font-semibold uppercase italic leading-none text-white">
          PDF
        </span>
      </div>
    </div>
  )
}

/** Stands in for the cover a link does not have: the site it leads to, set large in the serif italic. */
function LetteredCover({ file }: { file: WorkFile }) {
  const mark = hostOf(file.src)

  return (
    <div
      aria-hidden
      className={cn(
        "@container absolute inset-0 -z-10 flex items-center justify-center bg-[linear-gradient(140deg,#16304d_0%,#2d4f72_55%,#4a74a0_100%)] pb-[18%]",
        ZOOM,
      )}
    >
      <span
        className="font-serif text-[length:15cqi] italic leading-none text-[#c8e0f5]"
        style={{ textShadow: ACCENT_GLOW }}
      >
        {mark}
      </span>
    </div>
  )
}

function hostOf(src: string) {
  try {
    return new URL(src).hostname.replace(/^www\./, "")
  } catch {
    return "link"
  }
}

/**
 * A title with its last word in the serif italic - the way the site's headings
 * mark the word that matters ("Write me a letter").
 */
function AccentedTitle({ title }: { title: string }) {
  const split = title.lastIndexOf(" ")
  if (split === -1) return <>{title}</>

  // The italic capital leans back into the space before it; the margin gives it back
  return (
    <>
      {title.slice(0, split)}{" "}
      <em
        className="ml-[0.06em] font-serif text-[1.06em] font-normal italic"
        style={{ color: ACCENT, textShadow: ACCENT_GLOW }}
      >
        {title.slice(split + 1)}
      </em>
    </>
  )
}
