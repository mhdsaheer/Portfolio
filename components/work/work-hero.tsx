import { Lines } from "@/components/about/lines"
import { AccentStar } from "@/components/about/accent-star"
import { ACCENT, DIM, FLUID, INK, SURFACE } from "@/components/about/tokens"

/**
 * Opening block of the Work page: the eyebrow and title on the left six
 * columns, the project count sitting on the baseline at the far right. Both
 * halves share the twelve-column grid the About page uses, so the measure
 * lines up between pages.
 */
export function WorkHero({ count }: { count: number }) {
  return (
    <section
      className="px-[2.5em] pb-[3em] pt-[9em] min-[992px]:pb-[4em] min-[992px]:pt-[11em]"
      style={{ backgroundColor: SURFACE, fontSize: FLUID }}
    >
      <div className="grid grid-cols-4 items-end gap-[1.5em] md:grid-cols-6 min-[992px]:grid-cols-12">
        <div className="col-span-4 flex flex-col gap-[1em] md:col-span-5 min-[992px]:col-span-6">
          <div className="flex items-center gap-[0.25em]" style={{ color: ACCENT }}>
            <AccentStar className="h-[0.625em] w-[0.625em] shrink-0" />
            <span className="text-[0.875em] font-medium italic uppercase leading-none">Projects</span>
          </div>

          <h1
            className="text-[2.25em] font-medium leading-none tracking-[-0.03em] md:text-[3em] min-[992px]:text-[4em]"
            style={{ color: INK }}
          >
            <Lines mode="load" lines={["Interfaces built", "with care"]} />
          </h1>
        </div>

        {/* The count is a quiet marker, not a heading - it never outweighs the title */}
        <div
          className="hidden items-start justify-end gap-[0.25em] self-end min-[992px]:col-start-9 min-[992px]:col-end-13 min-[992px]:flex"
          style={{ color: DIM }}
        >
          <span className="text-[2em] font-medium italic leading-none">{String(count).padStart(2, "0")}</span>
          <AccentStar className="mt-[0.25em] h-[0.625em] w-[0.625em] shrink-0" />
        </div>
      </div>
    </section>
  )
}
