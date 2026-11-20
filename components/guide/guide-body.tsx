import { CircleAlert, Info } from "lucide-react"

import { DesignTypeSection } from "@/components/guide/design-type-section"
import { ACCENT_CYCLE, ANCHOR, BODY, FOCUS, INK, KIND_STYLES, MEASURE, MUTED, pad } from "@/components/guide/tokens"
import { CodeBlock } from "@/components/insights/code-block"
import { InlineText } from "@/components/insights/inline-text"
import type { Block, DesignKind, DesignTypeBlock } from "@/lib/insight-content"
import { cn } from "@/lib/utils"

/** The guide's reading measure and rhythm; margins collapse between neighbours, as in the standard layout. */
export const GUIDE_PROSE = cn("my-5 break-words text-pretty text-[1.0625rem] leading-[1.8] md:text-lg md:leading-[1.8]", BODY, MEASURE)

export const GUIDE_H2 = cn(
  ANCHOR,
  "mb-6 mt-20 text-balance text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.03em] md:mt-28 md:text-[2.5rem]",
  INK,
)

const GUIDE_H3 = cn(ANCHOR, "mb-4 mt-12 text-balance text-xl font-semibold leading-snug tracking-[-0.015em] md:text-2xl", INK)

/**
 * A guide's body, block by block, on the light layout. The design types are
 * numbered in the order they appear, which is also the order the viewer and
 * the comparison table use.
 */
export function GuideBody({ blocks }: { blocks: Block[] }) {
  const types = blocks.filter((block): block is DesignTypeBlock => block.type === "designType")
  const names = new Map(types.map((type) => [type.id, type.name]))

  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} types={types} names={names} />
      ))}
    </>
  )
}

function BlockView({
  block,
  types,
  names,
}: {
  block: Block
  types: DesignTypeBlock[]
  names: Map<string, string>
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={GUIDE_PROSE}>
          <InlineText text={block.text} tone="light" />
        </p>
      )

    case "heading": {
      const Heading = block.level === 2 ? "h2" : "h3"
      return (
        <Heading id={block.id} tabIndex={-1} className={block.level === 2 ? GUIDE_H2 : GUIDE_H3}>
          <InlineText text={block.text} tone="light" />
        </Heading>
      )
    }

    case "list": {
      const List = block.ordered ? "ol" : "ul"
      return (
        <List
          className={cn(
            GUIDE_PROSE,
            "space-y-3 pl-6",
            block.ordered ? "list-decimal marker:text-[0.85em] marker:text-[#3451D1]" : "list-disc marker:text-[#8B5CF6]",
          )}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1.5">
              <InlineText text={item} tone="light" />
            </li>
          ))}
        </List>
      )
    }

    case "quote":
      return (
        <figure className={cn("my-12", MEASURE)}>
          <blockquote className={cn("border-l-4 border-[#8B5CF6] pl-6 text-xl font-medium leading-[1.45] text-balance md:text-2xl", INK)}>
            <p>
              <InlineText text={block.text} tone="light" />
            </p>
          </blockquote>
        </figure>
      )

    case "code":
      // The site's code block is dark on any page; it reads as a terminal set into the paper
      return <CodeBlock code={block.code} language={block.language} caption={block.caption} />

    case "callout":
      return (
        <aside
          aria-label={block.title}
          className={cn("my-10 flex gap-4 rounded-2xl border border-[#FB923C]/30 bg-[#FFF7E6] p-5 md:p-6", MEASURE)}
        >
          <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-[#C2410C]" />
          <div>
            <p className={cn("font-semibold", INK)}>{block.title}</p>
            <p className={cn("mt-1.5 text-pretty text-[15px] leading-relaxed", BODY)}>
              <InlineText text={block.text} tone="light" />
            </p>
          </div>
        </aside>
      )

    case "kindMap":
      return <KindMap kinds={block.kinds} types={types} />

    case "comparison":
      return <ComparisonTable caption={block.caption} rows={block.rows} types={types} />

    case "cards":
      return <Cards style={block.style} items={block.items} />

    case "designType":
      return (
        <DesignTypeSection block={block} index={types.indexOf(block)} total={types.length} names={names} />
      )
  }
}

/** The five kinds of decision, each with its question and the design types that answer it. */
function KindMap({ kinds, types }: { kinds: { kind: DesignKind; question: string }[]; types: DesignTypeBlock[] }) {
  return (
    <ul className="my-10 overflow-hidden rounded-3xl border border-[#20212A]/10">
      {kinds.map(({ kind, question }) => {
        const style = KIND_STYLES[kind]
        const members = types.filter((type) => type.kind === kind)
        return (
          <li
            key={kind}
            className="grid gap-4 border-b border-[#20212A]/10 p-5 last:border-b-0 md:grid-cols-[15rem_minmax(0,1fr)] md:items-center md:gap-8 md:p-6"
          >
            <div className="flex gap-3">
              <span aria-hidden className={cn("mt-1.5 h-8 w-1.5 shrink-0 rounded-full", style.fill)} />
              <div>
                <p className={cn("font-semibold", INK)}>{kind}</p>
                <p className={cn("mt-0.5 text-sm", MUTED)}>{question}</p>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label={`${kind}: design types in this guide`}>
              {members.map((type) => (
                <li key={type.id}>
                  <a
                    href={`#${type.id}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-[filter] hover:brightness-95",
                      style.tint,
                      style.text,
                      FOCUS,
                    )}
                  >
                    <span aria-hidden className="text-[11px] tabular-nums opacity-80">
                      {pad(type.number)}
                    </span>
                    {type.name.replace(/ website design$| design$/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * All the design types side by side. On a narrow screen the table keeps its
 * columns and scrolls sideways, with the names pinned on the left; the scroll
 * area takes keyboard focus so it can be scrolled without a pointer.
 */
function ComparisonTable({
  caption,
  rows,
  types,
}: {
  caption: string
  rows: { id: string; bestFor: string; strength: string; watchOut: string }[]
  types: DesignTypeBlock[]
}) {
  const byId = new Map(types.map((type) => [type.id, type]))

  return (
    <div className="my-10">
      <p className={cn("mb-3 flex items-center gap-2 text-sm md:hidden", MUTED)}>
        <span aria-hidden>↔</span> Scroll sideways to see every column
      </p>
      <div
        role="region"
        aria-labelledby="comparison-caption"
        tabIndex={0}
        className={cn("overflow-x-auto rounded-3xl border border-[#20212A]/10 bg-white", FOCUS)}
      >
        <table className="w-full min-w-[46rem] border-collapse text-left text-[14.5px]">
          <caption id="comparison-caption" className="sr-only">
            {caption}
          </caption>
          <thead>
            <tr className="bg-[#F7F8FC]">
              {["Design type", "Kind", "Best for", "Main strength", "Watch out for"].map((label, i) => (
                <th
                  key={label}
                  scope="col"
                  className={cn(
                    "border-b border-[#20212A]/10 px-4 py-3.5 font-mono text-[11px] font-normal uppercase tracking-[0.14em]",
                    MUTED,
                    i === 0 && "sticky left-0 z-10 bg-[#F7F8FC]",
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const type = byId.get(row.id)
              if (!type) return null
              const style = KIND_STYLES[type.kind]
              return (
                <tr key={row.id} className="group/row border-b border-[#20212A]/[0.07] last:border-b-0">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white px-4 py-3.5 align-top font-medium transition-colors group-hover/row:bg-[#F7F8FC]"
                  >
                    <a
                      href={`#${type.id}`}
                      className={cn("flex gap-2.5 rounded underline-offset-4 hover:underline", INK, FOCUS)}
                    >
                      <span aria-hidden className={cn("text-xs leading-[1.6] tabular-nums", style.text)}>
                        {pad(type.number)}
                      </span>
                      <span className="w-40">{type.name.replace(/ website design$| design$/, "")}</span>
                    </a>
                  </th>
                  <td className="px-4 py-3.5 align-top transition-colors group-hover/row:bg-[#F7F8FC]">
                    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium", style.text)}>
                      <span aria-hidden className={cn("size-1.5 rounded-full", style.fill)} />
                      {type.kind}
                    </span>
                  </td>
                  <td className={cn("px-4 py-3.5 align-top transition-colors group-hover/row:bg-[#F7F8FC]", BODY)}>{row.bestFor}</td>
                  <td className={cn("px-4 py-3.5 align-top transition-colors group-hover/row:bg-[#F7F8FC]", BODY)}>{row.strength}</td>
                  <td className={cn("px-4 py-3.5 align-top transition-colors group-hover/row:bg-[#F7F8FC]", BODY)}>{row.watchOut}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Short titled points as cards. Steps are numbered and keep their order;
 * trends cycle through the accents; mistakes carry a warning mark.
 */
function Cards({ style, items }: { style: "steps" | "trends" | "mistakes"; items: { title: string; text: string }[] }) {
  const List = style === "steps" ? "ol" : "ul"

  return (
    <List className="my-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => {
        const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length]
        return (
          <li
            key={item.title}
            className={cn(
              "relative flex flex-col rounded-2xl p-6",
              style === "steps" && accent.tint,
              style === "trends" && "border border-[#20212A]/10 bg-white",
              style === "mistakes" && "border border-[#F472B6]/30 bg-[#FFF0F6]",
            )}
          >
            {style === "steps" && (
              <span aria-hidden className={cn("text-sm tabular-nums", accent.text)}>
                Step {pad(i + 1)}
              </span>
            )}
            {style === "trends" && <span aria-hidden className={cn("h-1.5 w-10 rounded-full", accent.fill)} />}
            {style === "mistakes" && <CircleAlert aria-hidden className="size-5 text-[#BE185D]" />}
            <h3 className={cn("mt-4 text-lg font-semibold leading-snug tracking-[-0.01em]", INK)}>{item.title}</h3>
            <p className={cn("mt-2 text-pretty text-[15px] leading-relaxed", BODY)}>
              <InlineText text={item.text} tone="light" />
            </p>
          </li>
        )
      })}
    </List>
  )
}
