"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2 } from "lucide-react"

import { Reveal } from "@/components/case-study/reveal"
import { FileViewer } from "@/components/work/file-viewer"
import type { CaseStudy } from "@/lib/case-studies"
import type { WorkFile } from "@/lib/work-files"
import { cn } from "@/lib/utils"

/** The lead picture: full width on two columns, the left half and both rows from 768px up. */
const LEAD = "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto"

/**
 * How each count of pictures is laid on the grid, two columns wide and four
 * from 768px up. From three pictures on, the first leads and the rest sit
 * beside it, and their shapes set the height of the rows it spans.
 */
const LAYOUTS: Record<number, string[]> = {
  1: ["col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[21/9]"],
  2: ["col-span-2 aspect-[16/10] md:aspect-[3/2]", "col-span-2 aspect-[16/10] md:aspect-[3/2]"],
  3: [LEAD, "aspect-[4/3] md:col-span-2 md:aspect-[2/1]", "aspect-[4/3] md:col-span-2 md:aspect-[2/1]"],
  4: [LEAD, "col-span-2 aspect-[2/1]", "aspect-square", "aspect-square"],
  5: [LEAD, "aspect-[3/2]", "aspect-[3/2]", "aspect-[3/2]", "aspect-[3/2]"],
}

/** Six or more: even tiles, three to a row from 768px up. */
const EVEN = "aspect-[3/2]"

/** Darkens the foot of a picture so its caption stays readable. */
const SCRIM = "bg-[linear-gradient(to_top,rgba(7,17,28,0.85)_0%,rgba(7,17,28,0.4)_45%,rgba(7,17,28,0)_100%)]"

/**
 * A study's pictures as one collage. Each opens in the full-screen viewer the
 * work index uses, where the arrows step through the rest.
 */
export function Gallery({ study }: { study: Pick<CaseStudy, "slug" | "title" | "category" | "year" | "gallery"> }) {
  const [viewing, setViewing] = useState<number | null>(null)

  const shots = study.gallery
  if (shots.length === 0) return null

  // The viewer's own shape: the caption heads it where a picture has one
  const files: WorkFile[] = shots.map((shot, i) => ({
    slug: `${study.slug}-${i + 1}`,
    title: shot.caption ?? study.title,
    kind: shot.caption ? study.title : study.category,
    services: [],
    year: study.year,
    format: "image",
    src: shot.src,
    alt: shot.alt,
  }))

  const layout = LAYOUTS[shots.length]

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <ul className={cn("grid grid-cols-2 gap-3 md:gap-4", layout ? "md:grid-cols-4" : "md:grid-cols-3")}>
          {shots.map((shot, i) => {
            const shape = layout ? layout[i] : EVEN
            // A tile one column wide is too small on a phone to carry words over
            // the picture, so its caption waits for 768px; the viewer shows it either way
            const captionShown = shape.startsWith("col-span-2") ? "" : "max-md:hidden"

            return (
              <Reveal
                as="li"
                key={shot.src + i}
                delay={Math.min(i, 4) * 60}
                className={cn("relative overflow-hidden rounded-2xl border border-border bg-secondary", shape)}
              >
                <button
                  type="button"
                  onClick={() => setViewing(i)}
                  data-file={files[i].slug}
                  className="group absolute inset-0 block cursor-zoom-in text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 640px, 100vw" : "(min-width: 768px) 320px, 50vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {shot.caption && (
                    <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-1/2", SCRIM, captionShown)} />
                  )}

                  <span
                    aria-hidden
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-md transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0d1b2c] md:size-9"
                  >
                    <Maximize2 className="size-3.5" />
                  </span>

                  {shot.caption && (
                    <span
                      className={cn(
                        "absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-xs font-medium leading-snug text-white md:p-4 md:text-sm",
                        captionShown,
                      )}
                    >
                      {shot.caption}
                    </span>
                  )}
                  <span className="sr-only">, view full size</span>
                </button>
              </Reveal>
            )
          })}
        </ul>
      </div>

      <FileViewer files={files} index={viewing} onChange={setViewing} />
    </section>
  )
}
