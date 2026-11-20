"use client"

import { CARD_STYLES, DESIGN_KINDS } from "@/lib/insight-content"
import { RowList, SelectField, TextArea, TextInput } from "@/components/admin/fields"
import { INLINE_SYNTAX_HINT } from "@/components/admin/styles"
import type { BlockFormProps } from "@/components/admin/blocks/text-blocks"

/* Guide blocks made of repeating rows. */

export function CardsForm({ block, onChange, errorAt }: BlockFormProps<"cards">) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Style"
        value={block.style}
        options={CARD_STYLES}
        onChange={(style) => onChange({ ...block, style })}
        hint="Steps are numbered in order; trends and mistakes are a set of equals."
      />
      <RowList
        label="Cards"
        addLabel="Add card"
        rows={block.items}
        onChange={(items) => onChange({ ...block, items })}
        newRow={() => ({ title: "", text: "" })}
        error={errorAt("items")}
        render={(item, update, index) => (
          <>
            <TextInput label="Title" value={item.title} onChange={(title) => update({ ...item, title })} error={errorAt(`items.${index}.title`)} />
            <TextArea
              label="Text"
              value={item.text}
              onChange={(text) => update({ ...item, text })}
              hint={INLINE_SYNTAX_HINT}
              error={errorAt(`items.${index}.text`)}
            />
          </>
        )}
      />
    </div>
  )
}

export function KindMapForm({ block, onChange, errorAt }: BlockFormProps<"kindMap">) {
  return (
    <RowList
      label="Kinds"
      addLabel="Add kind"
      rows={block.kinds}
      onChange={(kinds) => onChange({ ...block, kinds })}
      newRow={() => ({ kind: DESIGN_KINDS[0], question: "" })}
      error={errorAt("kinds")}
      render={(row, update, index) => (
        <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
          <SelectField label="Kind" value={row.kind} options={DESIGN_KINDS} onChange={(kind) => update({ ...row, kind })} />
          <TextInput
            label="The question it answers"
            value={row.question}
            onChange={(question) => update({ ...row, question })}
            error={errorAt(`kinds.${index}.question`)}
          />
        </div>
      )}
    />
  )
}

export function ComparisonForm({
  block,
  onChange,
  errorAt,
  designTypes,
}: BlockFormProps<"comparison"> & { designTypes: { id: string; name: string }[] }) {
  const options = designTypes.filter((type) => type.id).map((type) => ({ value: type.id, label: type.name || type.id }))

  return (
    <div className="space-y-3">
      <TextInput
        label="Caption"
        value={block.caption}
        onChange={(caption) => onChange({ ...block, caption })}
        hint="Read out by screen readers in place of a visible title."
        error={errorAt("caption")}
      />
      <p className="text-xs text-neutral-500">Each row’s name and kind come from its design type section.</p>
      <RowList
        label="Rows"
        addLabel="Add row"
        rows={block.rows}
        onChange={(rows) => onChange({ ...block, rows })}
        newRow={() => ({ id: options[0]?.value ?? "", bestFor: "", strength: "", watchOut: "" })}
        error={errorAt("rows")}
        render={(row, update, index) => (
          <>
            <SelectField
              label="Design type"
              value={row.id}
              options={options.some((option) => option.value === row.id) ? options : [{ value: row.id, label: `${row.id || "(none)"} - not in this article` }, ...options]}
              onChange={(id) => update({ ...row, id })}
              error={errorAt(`rows.${index}.id`)}
            />
            <TextInput label="Best for" value={row.bestFor} onChange={(bestFor) => update({ ...row, bestFor })} error={errorAt(`rows.${index}.bestFor`)} />
            <TextInput label="Strength" value={row.strength} onChange={(strength) => update({ ...row, strength })} error={errorAt(`rows.${index}.strength`)} />
            <TextInput label="Watch out for" value={row.watchOut} onChange={(watchOut) => update({ ...row, watchOut })} error={errorAt(`rows.${index}.watchOut`)} />
          </>
        )}
      />
    </div>
  )
}
