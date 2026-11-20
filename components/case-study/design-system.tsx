import type { CSSProperties, ReactNode } from "react"
import { Plus_Jakarta_Sans } from "next/font/google"

import { Reveal } from "@/components/case-study/reveal"
import { SectionTitle } from "@/components/ui/section-title"
import { ACCENT } from "@/components/about/tokens"
import type { CaseStudy, Swatch } from "@/lib/case-studies"

/**
 * Typefaces a study's design system can be set in, so its specimen and its
 * swatch samples show the product's own type rather than the site's. Not
 * preloaded: the files only download on a page that actually uses them.
 */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
})

const typefaces: Record<string, string> = {
  "Plus Jakarta Sans": plusJakarta.style.fontFamily,
}

/** The white of the product's own cards, which its status badges sit on. */
const PRODUCT_CARD = "#ffffff"

type DesignSystemProps = {
  system: NonNullable<CaseStudy["designSystem"]>
  /** The section's running number, e.g. "03". */
  number: string
}

export function DesignSystem({ system, number }: DesignSystemProps) {
  const fontFamily = system.typeface ? (typefaces[system.typeface.family] ?? system.typeface.family) : undefined

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <span className="text-[11px] font-mono tracking-tight" style={{ color: ACCENT }}>
          <span className="font-sans">{number}</span> {system.label ?? "The design system"}
        </span>
        <SectionTitle className="mt-4 max-w-4xl text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
          {system.title}
        </SectionTitle>
        <Reveal>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed text-pretty">{system.intro}</p>
        </Reveal>

        <div className="mt-12 md:mt-16 space-y-14 md:space-y-20">
          {system.palettes.map((palette) => (
            <div key={palette.name} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20">
              <Reveal className="lg:col-span-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{palette.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed text-pretty">{palette.note}</p>
              </Reveal>

              <ul className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {palette.swatches.map((swatch, i) => (
                  <Reveal as="li" key={swatch.name} delay={(i % 4) * 60}>
                    <SwatchCard swatch={swatch} fontFamily={fontFamily} />
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}

          {system.typeface && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20">
              <Reveal className="lg:col-span-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">Typeface</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed text-pretty">{system.typeface.note}</p>
              </Reveal>

              <Reveal className="lg:col-span-8 rounded-2xl md:rounded-3xl border border-border bg-card backdrop-blur-xl p-6 md:p-10">
                <div style={{ fontFamily }}>
                  <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
                    <span className="text-7xl md:text-8xl font-semibold leading-none tracking-[-0.02em]">Aa</span>
                    <div>
                      <div className="text-xl md:text-2xl font-semibold tracking-[-0.02em]">{system.typeface.family}</div>
                      <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                        {system.typeface.weights.map((w) => w.weight).join(" / ")}
                      </div>
                    </div>
                  </div>

                  <p className="mt-8 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-balance">
                    {system.typeface.sample}
                  </p>

                  <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-xl border border-border bg-border/60">
                    {system.typeface.weights.map((w) => (
                      <li key={w.weight} className="bg-card p-4">
                        <div className="text-lg" style={{ fontWeight: w.weight }}>
                          {w.label}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-muted-foreground">{w.weight}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * One colour, shown the way the product uses it: with a lip and a tint it is a
 * button pressed into its own lip on its own tint; with a tint alone it is a
 * badge on the product's white card; otherwise it is the colour on its own.
 */
function SwatchCard({ swatch, fontFamily }: { swatch: Swatch; fontFamily?: string }) {
  const label = swatch.sample ?? swatch.name
  const sampleType: CSSProperties = { fontFamily }

  let preview: ReactNode
  if (swatch.soft && swatch.lip) {
    preview = (
      <div className="flex h-24 items-center justify-center px-3" style={{ background: swatch.soft }}>
        <span
          className="inline-flex h-9 items-center rounded-xl px-4 text-sm font-semibold text-white"
          style={{ ...sampleType, background: swatch.hex, boxShadow: `0 3px 0 0 ${swatch.lip}` }}
        >
          {label}
        </span>
      </div>
    )
  } else if (swatch.soft) {
    preview = (
      <div className="flex h-24 items-center justify-center px-3" style={{ background: PRODUCT_CARD }}>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{ ...sampleType, background: swatch.soft, color: swatch.hex }}
        >
          {label}
        </span>
      </div>
    )
  } else {
    preview = (
      <div
        className="h-24"
        style={{ background: swatch.hex, boxShadow: swatch.lip ? `inset 0 -6px 0 0 ${swatch.lip}` : undefined }}
      />
    )
  }

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-card backdrop-blur-xl">
      {preview}
      <div className="p-4">
        <div className="flex items-center gap-2">
          {(swatch.soft || swatch.lip) && (
            <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: swatch.hex }} />
          )}
          <span className="text-sm font-semibold">{swatch.name}</span>
        </div>
        <div className="mt-1 font-mono text-xs uppercase tracking-wide" style={{ color: ACCENT }}>
          {swatch.hex}
        </div>
        {swatch.role && <p className="mt-2 text-xs text-muted-foreground leading-relaxed text-pretty">{swatch.role}</p>}

        {(swatch.lip || swatch.soft) && (
          <dl className="mt-3 space-y-1 font-mono text-[11px] text-muted-foreground">
            {swatch.lip && <Tone name="Lip" hex={swatch.lip} />}
            {swatch.soft && <Tone name="Soft" hex={swatch.soft} />}
          </dl>
        )}
      </div>
    </div>
  )
}

function Tone({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: hex }} />
      <dt>{name}</dt>
      <dd className="ml-auto uppercase">{hex}</dd>
    </div>
  )
}
