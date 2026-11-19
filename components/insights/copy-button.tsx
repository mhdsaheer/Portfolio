"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Copies a string and confirms it, for a code sample or an article's link.
 *
 * Both labels are stacked in one grid cell and only their visibility changes,
 * so the button keeps the width of the longer one and nothing beside it moves.
 * The confirmation is also spoken, through a status region next to the button.
 */
export function CopyButton({
  text,
  label,
  copiedLabel = "Copied",
  accessibleLabel,
  className,
}: {
  text: string
  /** What the button says. */
  label: string
  copiedLabel?: string
  /** A fuller name for assistive technology; it should start with the visible label. */
  accessibleLabel?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard access can be refused; the text is still there to select by hand
    }
  }

  const Icon = copied ? Check : Copy

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={accessibleLabel}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className,
        )}
      >
        <Icon aria-hidden className="size-3.5 shrink-0" />
        <span aria-hidden={accessibleLabel ? true : undefined} className="grid text-left">
          <span className={cn("col-start-1 row-start-1", copied && "invisible")}>{label}</span>
          <span className={cn("col-start-1 row-start-1", !copied && "invisible")}>{copiedLabel}</span>
        </span>
      </button>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  )
}
