"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react"

import { pad } from "@/components/work/motion"
import type { WorkFile } from "@/lib/work-files"
import { cn } from "@/lib/utils"

/**
 * The viewer is a light sheet over the page, so its controls are set in the
 * site's dark ink (PANEL) and fill with it on hover - the inverse of the page.
 */
const INK_FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a121c]"

const INK_CONTROL = `border border-[#0a121c]/15 text-[#0a121c] transition-colors duration-300 hover:border-[#0a121c] hover:bg-[#0a121c] hover:text-white ${INK_FOCUS}`

const ROUND_BUTTON = `grid size-11 shrink-0 place-items-center rounded-full ${INK_CONTROL}`

/** The way from a piece to a conversation about one like it, outlined like the controls beside it. */
const CTA = `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${INK_CONTROL}`

/**
 * Full-screen viewer for the image files. The arrow keys and buttons step
 * through whatever the current filter shows; Escape, the close button or a
 * click on the margin around the image puts it away.
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

  // The last image shown, so closing can hand focus to its card - which, after
  // stepping through, is not always the card the viewer was opened from
  const lastShown = useRef<string | null>(null)
  if (file) lastShown.current = file.slug

  // Lenis scrolls the page from its own wheel handler, which the dialog's
  // scroll lock never sees - so the page is held still while this is open
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    return () => window.__lenis?.start()
  }, [open])

  const step = (by: number) => {
    if (index === null || files.length < 2) return
    onChange((index + by + files.length) % files.length)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onChange(null)}>
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
          {file && (
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
                className="relative min-h-0 flex-1 px-5 py-5 md:px-24 md:py-8"
                onClick={(event) => event.target === event.currentTarget && onChange(null)}
              >
                <div className="relative h-full w-full">
                  <Image
                    key={file.src}
                    src={file.src}
                    alt={file.alt ?? ""}
                    fill
                    sizes="100vw"
                    // The shadow follows the picture's own edges, not the letterboxed box
                    className="object-contain drop-shadow-[0_24px_48px_rgba(10,18,28,0.22)] animation-duration-500 animate-in fade-in"
                  />
                </div>
              </div>

              {/* Phones need the top bar's width for the title, so the way to get
                  in touch comes down here, beside the steppers, as a shorter ask */}
              <div
                className={cn(
                  "flex items-center justify-between gap-3 px-5 pb-5 sm:justify-center md:px-8 md:pb-8",
                  files.length < 2 && "sm:hidden",
                )}
              >
                {files.length > 1 && (
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button type="button" onClick={() => step(-1)} className={ROUND_BUTTON} aria-label="Previous image">
                      <ArrowLeft aria-hidden className="size-5" />
                    </button>
                    <span className="min-w-[3.5rem] text-center text-sm tabular-nums text-[#0a121c]/60 sm:min-w-[4.5rem]">
                      {pad((index ?? 0) + 1)} / {pad(files.length)}
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
