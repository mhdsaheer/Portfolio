"use client"

import { motion } from "framer-motion"
import { CodeXml, LayoutGrid, PenTool, SwatchBook, type LucideIcon } from "lucide-react"

import { EASE, pad } from "@/components/work/motion"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import type { ServiceFilter } from "@/lib/case-studies"
import { cn } from "@/lib/utils"

export type FilterOption = { value: ServiceFilter | null; label: string; count: number }

/** A mark for each way into the work; "all" is the whole grid. */
const ICONS = {
  all: LayoutGrid,
  Development: CodeXml,
  "UI/UX": PenTool,
  Branding: SwatchBook,
} satisfies Record<ServiceFilter | "all", LucideIcon>

/**
 * The discipline filter: a pill in the smoked glass the header turns into once
 * the page scrolls, with a white thumb that slides to the discipline in view.
 * It stays in the page, at the head of the grid - the header is the one thing
 * that floats. Phones get it as a segmented bar, each mark over its name.
 */
export function DisciplineFilter({
  options,
  value,
  onChange,
  ready,
}: {
  options: FilterOption[]
  value: ServiceFilter | null
  onChange: (value: ServiceFilter | null) => void
  ready: boolean
}) {
  const still = useHydratedReducedMotion()

  return (
    <motion.div
      role="group"
      aria-label="Filter by discipline"
      initial={{ opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={still ? { duration: 0 } : { duration: 0.9, delay: 0.1, ease: EASE }}
      className="grid w-full max-w-[26rem] grid-cols-4 gap-1 rounded-full border border-white/12 bg-[#0d1b2c]/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(4,10,18,0.25)] backdrop-blur-xl sm:flex sm:w-fit sm:max-w-none"
    >
      {options.map((option) => {
        const active = option.value === value
        const Icon = ICONS[option.value ?? "all"]

        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative min-w-0 rounded-full px-1 py-2 text-[11px] font-medium leading-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4 sm:py-2.5 sm:text-sm",
              active ? "text-[#0a121c]" : "text-white/70 hover:bg-white/[0.07] hover:text-white",
            )}
          >
            {/* One thumb, handed from button to button rather than swapped. The
                radius is set inline so the slide can keep it round as it stretches */}
            {active && (
              <motion.span
                layoutId="work-filter"
                aria-hidden
                className="absolute inset-0 bg-white shadow-[0_4px_16px_rgba(4,10,18,0.3)]"
                style={{ borderRadius: 999 }}
                transition={still ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.55 }}
              />
            )}

            {/* Above every thumb, so no name goes under one sliding past it */}
            <span className="relative z-10 flex flex-col items-center gap-1.5 whitespace-nowrap sm:flex-row sm:gap-2">
              <Icon aria-hidden className="size-[18px] shrink-0 sm:size-4" />
              {option.label}
              <span
                aria-hidden
                className={cn(
                  "hidden min-w-6 rounded-full px-1.5 py-[3px] text-center text-[10px] font-semibold tabular-nums transition-colors duration-300 md:block",
                  active ? "bg-[#0a121c]/10 text-[#0a121c]/70" : "bg-white/10 text-white/60",
                )}
              >
                {pad(option.count)}
              </span>
              <span className="sr-only">, {option.count} projects</span>
            </span>
          </button>
        )
      })}
    </motion.div>
  )
}
