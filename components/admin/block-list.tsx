"use client"

import { useState } from "react"

import { BLOCK_LABELS, isGuideOnly, type Block, type BlockType, type Layout } from "@/lib/insight-content"
import type { FieldErrors } from "@/lib/admin/results"
import { BUTTON, BUTTON_DANGER, INPUT } from "@/components/admin/styles"
import { designTypesIn, newBlock, newKey, type KeyedBlock } from "@/components/admin/editor-state"
import { CalloutForm, CodeForm, HeadingForm, ListForm, ParagraphForm, QuoteForm } from "@/components/admin/blocks/text-blocks"
import { CardsForm, ComparisonForm, KindMapForm } from "@/components/admin/blocks/row-blocks"
import { DesignTypeForm } from "@/components/admin/blocks/design-type-form"

const ALL_TYPES = Object.keys(BLOCK_LABELS) as BlockType[]

/** A line of the block's own words, so a closed block can still be recognised. */
function summaryOf(block: Block) {
  const text = (() => {
    switch (block.type) {
      case "paragraph":
      case "quote":
        return block.text
      case "heading":
        return block.text
      case "list":
        return block.items[0] ?? ""
      case "code":
        return block.caption ?? block.code.split("\n")[0]
      case "callout":
        return block.title
      case "cards":
        return block.items.map((item) => item.title).join(" · ")
      case "kindMap":
        return block.kinds.map((kind) => kind.kind).join(" · ")
      case "comparison":
        return block.caption
      case "designType":
        return `${String(block.number).padStart(2, "0")} ${block.name}`
    }
  })()
  return text.length > 90 ? `${text.slice(0, 90)}…` : text
}

/** "Add a block here", offering only what the article's design can show. */
function AddBlock({ layout, onAdd, label }: { layout: Layout; onAdd: (type: BlockType) => void; label: string }) {
  const types = ALL_TYPES.filter((type) => layout === "guide" || !isGuideOnly(type))
  return (
    <select
      aria-label={label}
      className={`${INPUT} w-auto py-1.5`}
      value=""
      onChange={(event) => event.target.value && onAdd(event.target.value as BlockType)}
    >
      <option value="">{label}</option>
      {types.map((type) => (
        <option key={type} value={type}>
          {BLOCK_LABELS[type]}
        </option>
      ))}
    </select>
  )
}

export function BlockList({
  body,
  layout,
  onChange,
  errors,
}: {
  body: KeyedBlock[]
  layout: Layout
  onChange: (body: KeyedBlock[]) => void
  errors: FieldErrors
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const designTypes = designTypesIn(body)

  // A failed save opens every block with something to fix - once, when the errors arrive
  const [errorsSeen, setErrorsSeen] = useState(errors)
  if (errors !== errorsSeen) {
    setErrorsSeen(errors)
    const paths = Object.keys(errors)
    const failing = body.filter((_, index) =>
      paths.some((path) => path === `document.body.${index}` || path.startsWith(`document.body.${index}.`)),
    )
    if (failing.length) setOpen((current) => new Set([...current, ...failing.map(({ key }) => key)]))
  }

  const insert = (at: number, type: BlockType) => {
    const added = { key: newKey(), block: newBlock(type, body) }
    onChange([...body.slice(0, at), added, ...body.slice(at)])
    setOpen((current) => new Set(current).add(added.key))
  }

  const move = (from: number, to: number) => {
    const next = [...body]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const replace = (index: number, block: Block) => onChange(body.map((item, at) => (at === index ? { ...item, block } : item)))

  const toggle = (key: string, isOpen: boolean) =>
    setOpen((current) => {
      const next = new Set(current)
      if (isOpen) next.add(key)
      else next.delete(key)
      return next
    })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={BUTTON} onClick={() => setOpen(new Set(body.map(({ key }) => key)))}>
          Open all
        </button>
        <button type="button" className={BUTTON} onClick={() => setOpen(new Set())}>
          Close all
        </button>
      </div>

      {body.length === 0 && <p className="text-sm text-neutral-500">No blocks yet.</p>}

      {body.map(({ key, block }, index) => {
        const prefix = `document.body.${index}`
        const blockErrors = Object.entries(errors).filter(([path]) => path === prefix || path.startsWith(`${prefix}.`))
        const errorAt = (path: string) => errors[`${prefix}.${path}`]
        const misplaced = layout !== "guide" && isGuideOnly(block.type)

        const formProps = { errorAt }
        const form = (() => {
          switch (block.type) {
            case "paragraph":
              return <ParagraphForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "heading":
              return <HeadingForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "list":
              return <ListForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "code":
              return <CodeForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "quote":
              return <QuoteForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "callout":
              return <CalloutForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "cards":
              return <CardsForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "kindMap":
              return <KindMapForm block={block} onChange={(next) => replace(index, next)} {...formProps} />
            case "comparison":
              return <ComparisonForm block={block} onChange={(next) => replace(index, next)} designTypes={designTypes} {...formProps} />
            case "designType":
              return <DesignTypeForm block={block} onChange={(next) => replace(index, next)} designTypes={designTypes} {...formProps} />
          }
        })()

        return (
          <details
            key={key}
            open={open.has(key)}
            onToggle={(event) => toggle(key, event.currentTarget.open)}
            className={`rounded-lg border bg-white ${blockErrors.length || misplaced ? "border-red-300" : "border-neutral-200"}`}
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
              <span className="w-8 shrink-0 font-mono text-xs text-neutral-400">{index + 1}</span>
              <span className="shrink-0 rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                {BLOCK_LABELS[block.type]}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-600">{summaryOf(block)}</span>
              {(blockErrors.length > 0 || misplaced) && <span className="shrink-0 text-xs text-red-600">Needs attention</span>}
            </summary>

            <div className="space-y-4 border-t border-neutral-200 px-4 py-4">
              {misplaced && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {BLOCK_LABELS[block.type]} blocks only show in the Guide design. Switch the design to Guide, or remove
                  this block - otherwise the article can’t be saved.
                </p>
              )}
              {blockErrors.length > 0 && (
                <ul className="list-disc space-y-0.5 rounded-md bg-red-50 py-2 pl-8 pr-3 text-sm text-red-700">
                  {blockErrors.map(([path, message]) => (
                    <li key={path}>
                      {path !== prefix && <span className="font-mono text-xs">{path.slice(prefix.length + 1)}: </span>}
                      {message}
                    </li>
                  ))}
                </ul>
              )}

              {form}

              <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
                <button type="button" className={BUTTON} disabled={index === 0} onClick={() => move(index, index - 1)}>
                  ↑ Move up
                </button>
                <button type="button" className={BUTTON} disabled={index === body.length - 1} onClick={() => move(index, index + 1)}>
                  ↓ Move down
                </button>
                <AddBlock layout={layout} label="Insert below…" onAdd={(type) => insert(index + 1, type)} />
                <span className="flex-1" />
                <button
                  type="button"
                  className={BUTTON_DANGER}
                  onClick={() => {
                    if (confirm(`Remove this ${BLOCK_LABELS[block.type].toLowerCase()} block?`)) {
                      onChange(body.filter((_, at) => at !== index))
                    }
                  }}
                >
                  Remove block
                </button>
              </div>
            </div>
          </details>
        )
      })}

      <AddBlock layout={layout} label="+ Add a block at the end…" onAdd={(type) => insert(body.length, type)} />
    </div>
  )
}
