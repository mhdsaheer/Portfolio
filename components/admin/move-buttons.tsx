"use client"

import { useTransition } from "react"

import { moveProject } from "@/app/admin/project-actions"
import type { ProjectKind } from "@/lib/project-content"
import { BUTTON } from "@/components/admin/styles"

/** ↑ and ↓ for one project. The list redraws with the new order once it is saved. */
export function MoveButtons({ kind, slug, first, last }: { kind: ProjectKind; slug: string; first: boolean; last: boolean }) {
  const [moving, startMoving] = useTransition()
  const move = (direction: "up" | "down") => startMoving(() => moveProject(kind, slug, direction))

  return (
    <span className="inline-flex gap-1">
      <button type="button" className={BUTTON} disabled={first || moving} onClick={() => move("up")} aria-label="Move up">
        ↑
      </button>
      <button type="button" className={BUTTON} disabled={last || moving} onClick={() => move("down")} aria-label="Move down">
        ↓
      </button>
    </span>
  )
}
