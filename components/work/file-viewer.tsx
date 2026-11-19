"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react"

import { pad } from "@/components/work/motion"
import { shotsOf, type WorkFile } from "@/lib/work-files"
import { cn } from "@/lib/utils"

/**
 * The viewer is a light sheet over the page, so its controls are set in the
 * site's dark ink, #0a121c, and fill with it on hover - the inverse of the page.
 */
const INK_FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a121c]"

const INK_CONTROL = `border border-[#0a121c]/15 text-[#0a121c] transition-colors duration-300 hover:border-[#0a121c] hover:bg-[#0a121c] hover:text-white ${INK_FOCUS}`

const ROUND_BUTTON = `grid size-11 shrink-0 place-items-center rounded-full ${INK_CONTROL}`

/** The way from a piece to a conversation about one like it, outlined like the controls beside it. */
const CTA = `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${INK_CONTROL}`

/** Where the viewer starts: no piece yet, and so the first picture of whichever opens. */
const FIRST = { slug: "", shot: 0 }

/**
 * Full-screen viewer for the image files. The arrow keys and buttons step
 * through whatever the current filter shows; Escape, the close button or a
 * click on the margin around the image puts it away.
 *
 * A piece with several pictures lists them as thumbnails - down the left side,
 * or in a row under the one on view on phones - and the arrows walk through all of them before moving on.
 */
export function FileViewer({
  files,
  index,
  onChange,
}: {
  files: WorkFile[]
  index: number | null
  onChange: (index: number | null) => void
}) {
  const file = index === null ? undefined : files[index]
  const open = file !== undefined

  // Which picture of the piece is on view. Held with the piece it belongs to,
  // so arriving at another piece starts from its first picture
  const [at, setAt] = useState(FIRST)
  const shots = file ? shotsOf(file) : []
  const shot = file && at.slug === file.slug ? Math.min(at.shot, shots.length - 1) : 0
  const picture = shots[shot]

  // The counter runs over every picture, not every piece
  const count = (pieces: WorkFile[]) => pieces.reduce((sum, piece) => sum + shotsOf(piece).length, 0)
  const total = count(files)
  const position = count(files.slice(0, index ?? 0)) + shot + 1

  const close = () => {
    setAt(FIRST)
    onChange(null)
  }

  // The last image shown, so closing can hand focus to its card - which, after
  // stepping through, is not always the card the viewer was opened from
  const lastShown = useRef<string | null>(null)
  useEffect(() => {
    if (file) lastShown.current = file.slug
  }, [file])

  // Lenis scrolls the page from its own wheel handler, which the dialog's
  // scroll lock never sees - so the page is held still while this is open
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    return () => window.__lenis?.start()
  }, [open])

  const step = (by: number) => {
    if (index === null || !file || total < 2) return

    const within = shot + by
    if (within >= 0 && within < shots.length) return setAt({ slug: file.slug, shot: within })

    // Off either end of the piece: on to the next one, entered from the near side
    const to = (index + by + files.length) % files.length
    setAt({ slug: files[to].slug, shot: by < 0 ? shotsOf(files[to]).length - 1 : 0 })
    onChange(to)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && close()}>
      <Dialog.Portal>
        {/* A white sheet: the page still shows through, softly, behind it */}
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#f6f8fb]/90 backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />

        <Dialog.Content
          aria-describedby={undefined}
          // Opened from state rather than a Dialog.Trigger, Radix has nowhere to
          // return focus to and drops it on the body
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            document.querySelector<HTMLElement>(`[data-file="${lastShown.current}"]`)?.focus()
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1)
            if (event.key === "ArrowLeft") step(-1)
          }}
          className="fixed inset-0 z-[61] flex flex-col outline-none animation-duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
        >
          {file && picture && (
            <>
              <div className="flex items-center justify-between gap-4 px-5 pt-5 md:px-8 md:pt-6">
                <div className="min-w-0">
                  <Dialog.Title className="truncate text-base font-semibold tracking-[-0.01em] text-[#0a121c] md:text-lg">
                    {file.title}
                  </Dialog.Title>
                  <p className="mt-0.5 truncate text-[13px] text-[#0a121c]/60">
                    {file.kind} <span aria-hidden>·</span> {file.year}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link href="/contact" className={cn(CTA, "hidden sm:inline-flex")}>
                    Start a project like this
                    <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                  <Dialog.Close className={ROUND_BUTTON} aria-label="Close">
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>
              </div>

              {/* The margin around the image closes the viewer, as a backdrop would */}
              <div
                // A piece with several pictures keeps its left margin clear for their thumbnails
                className={cn("relative min-h-0 flex-1 px-5 py-5 md:px-24 md:py-8", shots.length > 1 && "md:px-40")}
                onClick={(event) => event.target === event.currentTarget && close()}
              >
                <div className="relative h-full w-full">
                  <Image
                    key={picture.src}
                    src={picture.src}
                    alt={picture.alt}
                    fill
                    sizes="100vw"
                    // The shadow follows the picture's own edges, not the letterboxed box
                    className="object-contain drop-shadow-[0_24px_48px_rgba(10,18,28,0.22)] animation-duration-500 animate-in fade-in"
                  />
                </div>
              </div>

              {shots.length > 1 && (
                <ul
                  aria-label={`Images of ${file.title}`}
                  // A row under the picture on phones; a column down the left side from 768px up
                  className="flex shrink-0 justify-center gap-3 px-5 pb-4 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3 md:rounded-[1.25rem] md:border md:border-[#0a121c]/10 md:bg-white/70 md:p-3 md:shadow-[0_16px_40px_rgba(10,18,28,0.1)] md:backdrop-blur-md"
                >
                  {shots.map((each, i) => (
                    <li key={each.src}>
                      <button
                        type="button"
                        onClick={() => setAt({ slug: file.slug, shot: i })}
                        aria-label={`Image ${i + 1} of ${shots.length}`}
                        aria-current={i === shot ? "true" : undefined}
                        className={cn(
                          "group/thumb relative block h-12 w-16 overflow-hidden rounded-xl transition-[box-shadow,opacity] duration-300 md:h-[4.5rem] md:w-24",
                          INK_FOCUS,
                          // A see-through ring, so the sheet behind shows in it; the
                          // one on view is told apart by full strength and its zoom
                          i === shot
                            ? "ring-2 ring-[#0a121c]/15"
                            : "opacity-60 ring-1 ring-[#0a121c]/5 hover:opacity-100",
                        )}
                      >
                        <Image
                          src={each.src}
                          alt=""
                          fill
                          sizes="96px"
                          className={cn(
                            "object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            i === shot ? "scale-110" : "group-hover/thumb:scale-110",
                          )}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Phones need the top bar's width for the title, so the way to get
                  in touch comes down here, beside the steppers, as a shorter ask */}
              <div
                className={cn(
                  "flex items-center justify-between gap-3 px-5 pb-5 sm:justify-center md:px-8 md:pb-8",
                  total < 2 && "sm:hidden",
                )}
              >
                {total > 1 && (
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button type="button" onClick={() => step(-1)} className={ROUND_BUTTON} aria-label="Previous image">
                      <ArrowLeft aria-hidden className="size-5" />
                    </button>
                    <span className="min-w-[3.5rem] text-center text-sm tabular-nums text-[#0a121c]/60 sm:min-w-[4.5rem]">
                      {pad(position)} / {pad(total)}
                    </span>
                    <button type="button" onClick={() => step(1)} className={ROUND_BUTTON} aria-label="Next image">
                      <ArrowRight aria-hidden className="size-5" />
                    </button>
                  </div>
                )}
                <Link href="/contact" className={cn(CTA, "ml-auto sm:hidden")}>
                  Let&apos;s talk
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
