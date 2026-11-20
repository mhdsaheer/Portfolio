"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { FOCUS, pad } from "@/components/guide/tokens"
import { cn } from "@/lib/utils"

export type Example = {
  src: string
  alt: string
  caption: string
  /** The design type it illustrates, for the viewer's heading. */
  title: string
  width: number
  height: number
}

const OpenExample = createContext<(index: number) => void>(() => {})

const ROUND = `grid size-11 shrink-0 place-items-center rounded-full border border-[#20212A]/15 bg-white text-[#20212A] transition-colors duration-300 hover:border-[#20212A] hover:bg-[#20212A] hover:text-white ${FOCUS}`

/**
 * One full-screen viewer for every example image in a guide. Any image opens
 * it at its own place; the arrow keys and buttons then step through the rest
 * in article order, and Escape, the close button or a click on the margin put
 * it away. Focus goes back to the image last shown, so a keyboard user carries
 * on reading from there.
 */
export function ExampleLightbox({ examples, children }: { examples: Example[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null)
  const example = index === null ? undefined : examples[index]
  const open = example !== undefined

  const lastShown = useRef<number | null>(null)
  useEffect(() => {
    if (index !== null) lastShown.current = index
  }, [index])

  // Lenis scrolls the page from its own wheel handler, which the dialog's
  // scroll lock never sees - so the page is held still while this is open
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    return () => window.__lenis?.start()
  }, [open])

  const step = (by: number) => {
    if (index === null) return
    setIndex((index + by + examples.length) % examples.length)
  }

  return (
    <OpenExample.Provider value={setIndex}>
      {children}

      <Dialog.Root open={open} onOpenChange={(next) => !next && setIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#F7F8FC]/95 backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in motion-reduce:animate-none" />
          <Dialog.Content
            // Opened from state rather than a trigger, so the way back is set by hand
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              document.querySelector<HTMLElement>(`[data-example="${lastShown.current}"]`)?.focus()
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") step(1)
              if (event.key === "ArrowLeft") step(-1)
            }}
            className="fixed inset-0 z-[61] flex flex-col outline-none animation-duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in motion-reduce:animate-none"
          >
            {example && index !== null && (
              <>
                <div className="flex items-center justify-between gap-4 px-4 pt-4 md:px-8 md:pt-6">
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#5F6373]">
                      Example <span className="font-sans">{pad(index + 1)}</span> of <span className="font-sans">{pad(examples.length)}</span>
                    </p>
                    <Dialog.Title className="mt-1 truncate text-lg font-semibold tracking-[-0.01em] text-[#20212A] md:text-xl">
                      {example.title}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close className={ROUND} aria-label="Close">
                    <X aria-hidden className="size-5" />
                  </Dialog.Close>
                </div>

                {/* The margin around the image closes the viewer, as a backdrop would */}
                <div
                  className="relative min-h-0 flex-1 px-4 py-4 md:px-24 md:py-6"
                  onClick={(event) => event.target === event.currentTarget && setIndex(null)}
                >
                  <div className="relative h-full w-full">
                    <Image
                      key={example.src}
                      src={example.src}
                      alt={example.alt}
                      fill
                      sizes="100vw"
                      className="object-contain drop-shadow-[0_24px_48px_rgba(32,33,42,0.18)] animation-duration-500 animate-in fade-in motion-reduce:animate-none"
                    />
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 px-4 pb-4 md:px-8 md:pb-6">
                  <Dialog.Description className="max-w-3xl text-pretty text-sm leading-relaxed text-[#3F4150] md:text-[15px]">
                    {example.caption}
                  </Dialog.Description>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => step(-1)} className={ROUND} aria-label="Previous example">
                      <ArrowLeft aria-hidden className="size-5" />
                    </button>
                    <button type="button" onClick={() => step(1)} className={ROUND} aria-label="Next example">
                      <ArrowRight aria-hidden className="size-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </OpenExample.Provider>
  )
}

/**
 * Wraps an example image so a click or Enter opens it in the viewer. The
 * image's own alt text names the button, with a note of what it does.
 */
export function ExampleTrigger({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: ReactNode
}) {
  const open = useContext(OpenExample)

  return (
    <button
      type="button"
      data-example={index}
      onClick={() => open(index)}
      className={cn("group/trigger cursor-zoom-in text-left", FOCUS, className)}
    >
      {children}
      <span className="sr-only">, view full size</span>
    </button>
  )
}
