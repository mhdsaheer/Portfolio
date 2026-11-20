import Image from "next/image"
import { ArrowUpRight, Check, Lightbulb, Maximize2, Minus, Plus } from "lucide-react"

import { ExampleTrigger } from "@/components/guide/example-lightbox"
import { ANCHOR, BODY, FOCUS, INK, KIND_STYLES, MEASURE, MUTED, pad } from "@/components/guide/tokens"
import { InlineText } from "@/components/insights/inline-text"
import type { DesignTypeBlock } from "@/lib/insight-content"
import { cn } from "@/lib/utils"

type Composition = { media: "wide" | "left" | "right"; tinted?: boolean }

/**
 * How each of the fifteen sections is laid out, in order, so neighbours never
 * look alike: a full-width showcase, the picture to one side of the key facts
 * or the other, some set on a panel in their kind's colour.
 */
const COMPOSITIONS: Composition[] = [
  { media: "wide" },
  { media: "left" },
  { media: "right", tinted: true },
  { media: "left" },
  { media: "wide", tinted: true },
  { media: "right" },
  { media: "wide" },
  { media: "left", tinted: true },
  { media: "right" },
  { media: "wide", tinted: true },
  { media: "left" },
  { media: "right", tinted: true },
  { media: "wide" },
  { media: "left", tinted: true },
  { media: "wide", tinted: true },
]

/** A card on the section: white on a tinted panel, faintly grey on a white one. */
function cardClass(tinted: boolean) {
  return cn("rounded-2xl p-5 md:p-6", tinted ? "bg-white/85" : "bg-[#F7F8FC]")
}

/** The small label over each card, carrying the section's name for anyone moving by headings. */
function CardHeading({ section, children }: { section: string; children: string }) {
  return (
    <h3 className={cn("font-mono text-xs uppercase tracking-[0.16em]", MUTED)}>
      <span className="sr-only">{section}: </span>
      {children}
    </h3>
  )
}

export function DesignTypeSection({
  block,
  index,
  total,
  names,
}: {
  block: DesignTypeBlock
  /** Its place among the guide's examples, from 0 - the viewer's order. */
  index: number
  total: number
  /** Every design type's name by id, for the "pairs well with" links. */
  names: Map<string, string>
}) {
  const kind = KIND_STYLES[block.kind]
  const { media, tinted = false } = COMPOSITIONS[index % COMPOSITIONS.length]
  const split = media !== "wide"

  const figure = (
    <figure className="min-w-0">
      <ExampleTrigger
        index={index}
        className="relative block w-full overflow-hidden rounded-2xl bg-[#F7F8FC] shadow-[0_0_0_1px_rgba(32,33,42,0.06),0_24px_50px_-30px_rgba(32,33,42,0.45)] md:rounded-3xl"
      >
        <Image
          src={block.image.src}
          alt={block.image.alt}
          width={block.image.width}
          height={block.image.height}
          sizes={split ? "(min-width: 1280px) 620px, (min-width: 1024px) 760px, 100vw" : "(min-width: 1280px) 1080px, (min-width: 1024px) 760px, 100vw"}
          className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/trigger:scale-[1.015] motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-[#20212A] shadow-sm backdrop-blur transition-colors duration-300 group-hover/trigger:bg-[#20212A] group-hover/trigger:text-white"
        >
          <Maximize2 className="size-4" />
        </span>
      </ExampleTrigger>
      <figcaption className={cn("mt-4 flex gap-3 text-pretty text-sm leading-relaxed", MUTED)}>
        <span className={cn("shrink-0 pt-px font-mono text-[11px] uppercase tracking-[0.14em]", kind.text)}>
          Fig. {pad(block.number)}
        </span>
        <span>{block.image.caption}</span>
      </figcaption>
    </figure>
  )

  const characteristics = (
    <div className={cardClass(tinted)}>
      <CardHeading section={block.name}>Key characteristics</CardHeading>
      <ul className="mt-4 space-y-3">
        {block.characteristics.map((item) => (
          <li key={item} className={cn("flex gap-3 text-[15px] leading-snug", BODY)}>
            <span aria-hidden className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white", kind.fill)}>
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span>
              <InlineText text={item} tone="light" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  const bestFor = (
    <div className={cardClass(tinted)}>
      <CardHeading section={block.name}>Best for</CardHeading>
      <ul className="mt-4 flex flex-wrap gap-2">
        {block.bestFor.map((item) => (
          <li key={item} className={cn("rounded-full border bg-white px-3 py-1.5 text-sm font-medium", kind.border, INK)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )

  const prosAndCons = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={cardClass(tinted)}>
        <CardHeading section={block.name}>Advantages</CardHeading>
        <ul className="mt-4 space-y-3">
          {block.advantages.map((item) => (
            <li key={item} className={cn("flex gap-3 text-[15px] leading-snug", BODY)}>
              <Plus aria-hidden className="mt-0.5 size-4 shrink-0 text-[#1F7A4D]" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={cardClass(tinted)}>
        <CardHeading section={block.name}>Limitations</CardHeading>
        <ul className="mt-4 space-y-3">
          {block.limitations.map((item) => (
            <li key={item} className={cn("flex gap-3 text-[15px] leading-snug", BODY)}>
              <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-[#C2410C]" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <section
      className={cn(
        "mt-20 md:mt-28",
        tinted && cn("-mx-5 rounded-[1.75rem] px-5 py-10 sm:-mx-0 sm:px-8 md:rounded-[2rem] md:px-10 md:py-12", kind.tint),
      )}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className={cn("rounded-full bg-[#20212A] px-3 py-1 font-mono text-xs text-white")}>
          {pad(block.number)}
          <span className="text-white/60"> / {pad(total)}</span>
        </span>
        <span className={cn("inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium", kind.border, kind.text)}>
          <span aria-hidden className={cn("size-1.5 rounded-full", kind.fill)} />
          {block.kind}
        </span>
      </div>

      <h2
        id={block.id}
        tabIndex={-1}
        className={cn(
          ANCHOR,
          "mt-4 text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[2.75rem]",
          INK,
        )}
      >
        {block.name}
      </h2>

      <div className={cn("mt-5", MEASURE)}>
        {block.intro.map((paragraph) => (
          <p key={paragraph} className={cn("mb-4 text-pretty text-[1.0625rem] leading-[1.75] last:mb-0 md:text-lg", BODY)}>
            <InlineText text={paragraph} tone="light" />
          </p>
        ))}
      </div>

      {split ? (
        <div
          className={cn(
            "mt-9 grid gap-6 xl:items-start xl:gap-8",
            media === "left"
              ? "xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
              : "xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]",
          )}
        >
          <div className={cn(media === "right" && "xl:order-2")}>{figure}</div>
          <div className="grid gap-4">
            {characteristics}
            {bestFor}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-9">{figure}</div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            {characteristics}
            {bestFor}
          </div>
        </>
      )}

      <div className="mt-4">{prosAndCons}</div>

      {block.tip && (
        <aside
          aria-label={`Tip: ${block.name}`}
          className={cn(
            "mt-4 flex gap-4 rounded-2xl border border-dashed p-5 md:p-6",
            kind.border,
            tinted ? "bg-white/60" : "bg-white",
          )}
        >
          <Lightbulb aria-hidden className={cn("mt-0.5 size-5 shrink-0", kind.text)} />
          <p className={cn("text-pretty text-[15px] leading-relaxed", BODY)}>
            <InlineText text={block.tip} tone="light" />
          </p>
        </aside>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <CardHeading section={block.name}>Real-world examples</CardHeading>
          <ul className={cn("mt-4 grid gap-3", block.references.length > 1 && "md:grid-cols-2")}>
            {block.references.map((reference) => (
              <li
                key={reference.href}
                className={cn(
                  "rounded-2xl border bg-white p-5 transition-shadow duration-300 hover:shadow-[0_16px_36px_-24px_rgba(32,33,42,0.45)]",
                  "border-[#20212A]/10",
                )}
              >
                <a
                  href={reference.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("group/link inline-flex items-center gap-1.5 rounded text-base font-semibold", INK, FOCUS)}
                >
                  <span className="underline decoration-[#4263EB]/30 decoration-1 underline-offset-4 transition-colors group-hover/link:decoration-[#3451D1]">
                    {reference.name}
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-[#3451D1] transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                  />
                </a>
                <p className={cn("mt-1 font-mono text-xs", MUTED)}>{new URL(reference.href).hostname.replace(/^www\./, "")}</p>
                <p className={cn("mt-3 text-pretty text-sm leading-relaxed", BODY)}>
                  <InlineText text={reference.note} tone="light" />
                </p>
              </li>
            ))}
          </ul>
        </div>

        {block.pairsWith.length > 0 && (
          <div className="lg:w-60">
            <CardHeading section={block.name}>Pairs well with</CardHeading>
            <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {block.pairsWith.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-[#20212A]/10 bg-white px-3 py-1.5 text-sm transition-colors hover:border-[#4263EB] hover:bg-[#EAF2FF]",
                      INK,
                      FOCUS,
                    )}
                  >
                    {names.get(id) ?? id}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
