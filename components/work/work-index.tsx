"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { GUTTER } from "@/components/about/tokens"
import { DisciplineFilter, type FilterOption } from "@/components/work/discipline-filter"
import { FileViewer } from "@/components/work/file-viewer"
import { EASE } from "@/components/work/motion"
import { ArchiveTile, FileTile, StudyTile, planTiles } from "@/components/work/tiles"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { useIntroDone } from "@/hooks/use-intro-done"
import { services, servicesOf, type CaseStudy, type ServiceFilter } from "@/lib/case-studies"
import type { WorkFile } from "@/lib/work-files"

/**
 * The work index: one grid where case studies and files sit side by side,
 * under a filter by discipline. Case studies lead to their write-up; files
 * open where they are.
 */
export function WorkIndex({
  studies,
  files,
  archive,
}: {
  studies: CaseStudy[]
  files: WorkFile[]
  archive: string
}) {
  const [service, setService] = useState<ServiceFilter | null>(null)
  const [viewing, setViewing] = useState<number | null>(null)
  const introDone = useIntroDone()
  const still = useHydratedReducedMotion()

  const within = (tags: ServiceFilter[]) => service === null || tags.includes(service)
  const tiles = planTiles(
    studies.filter((study) => within(servicesOf(study))),
    files.filter((file) => within(file.services)),
  )

  // The viewer steps through the images on show, in the order the grid sets them
  const viewable = tiles.flatMap((tile) => (tile.kind === "file" && tile.file.format === "image" ? [tile.file] : []))

  const total = studies.length + files.length
  const shown = tiles.filter((tile) => tile.kind !== "archive").length
  const countFor = (name: ServiceFilter) =>
    studies.filter((study) => servicesOf(study).includes(name)).length +
    files.filter((file) => file.services.includes(name)).length

  // A discipline with nothing filed under it would only lead to an empty grid
  const options: FilterOption[] = [
    { value: null, label: "All work", count: total },
    ...services.map((name) => ({ value: name, label: name, count: countFor(name) })),
  ].filter((option) => option.count > 0)

  return (
    <section id="projects" aria-label="Projects" className="pb-24 md:pb-32" style={{ paddingInline: GUTTER }}>
      <div className="mx-auto w-full max-w-[1280px]">
        <DisciplineFilter
          options={options}
          value={service}
          onChange={(next) => {
            setService(next)
            setViewing(null)
          }}
          ready={introDone}
        />

        <p aria-live="polite" className="sr-only">
          Showing {shown} of {total} projects
        </p>

        {/* The outgoing selection clears before the next one draws itself in */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={service ?? "all"}
            className="mt-5 grid grid-cols-2 gap-3 md:mt-7 md:gap-4 lg:grid-cols-3 lg:gap-5"
            exit={still ? undefined : { opacity: 0, y: 16, transition: { duration: 0.25, ease: EASE } }}
          >
            {tiles.map((tile) => {
              if (tile.kind === "study") return <StudyTile key={tile.study.slug} tile={tile} ready={introDone} />
              if (tile.kind === "file")
                return (
                  <FileTile
                    key={tile.file.slug}
                    tile={tile}
                    ready={introDone}
                    onView={() => setViewing(viewable.indexOf(tile.file))}
                  />
                )
              return <ArchiveTile key="archive" tile={tile} href={archive} ready={introDone} />
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      <FileViewer files={viewable} index={viewing} onChange={setViewing} />
    </section>
  )
}
