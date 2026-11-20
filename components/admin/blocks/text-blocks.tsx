"use client"

import { CODE_LANGUAGES, slugify, type Block } from "@/lib/insight-content"
import { LinesField, SelectField, TextArea, TextInput } from "@/components/admin/fields"
import { INLINE_SYNTAX_HINT } from "@/components/admin/styles"

/* Forms for the blocks both designs show: plain text in a few shapes. */

export type BlockFormProps<T extends Block["type"]> = {
  block: Extract<Block, { type: T }>
  onChange: (block: Extract<Block, { type: T }>) => void
  /** The error for a field inside this block, by its path within the block, e.g. "image.alt". */
  errorAt: (path: string) => string | undefined
}

export function ParagraphForm({ block, onChange, errorAt }: BlockFormProps<"paragraph">) {
  return (
    <TextArea
      label="Text"
      rows={4}
      value={block.text}
      onChange={(text) => onChange({ ...block, text })}
      hint={INLINE_SYNTAX_HINT}
      error={errorAt("text")}
    />
  )
}

export function HeadingForm({ block, onChange, errorAt }: BlockFormProps<"heading">) {
  return (
    <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
      <SelectField
        label="Level"
        value={String(block.level) as "2" | "3"}
        options={[
          { value: "2", label: "H2 (in contents)" },
          { value: "3", label: "H3" },
        ]}
        onChange={(level) => onChange({ ...block, level: level === "2" ? 2 : 3 })}
      />
      <TextInput label="Text" value={block.text} onChange={(text) => onChange({ ...block, text })} error={errorAt("text")} />
      <div className="sm:col-span-2">
        <TextInput
          label="Anchor"
          value={block.id}
          placeholder={slugify(block.text) || "made-from-the-heading"}
          onChange={(id) => onChange({ ...block, id })}
          hint="The #link to this heading. Leave blank to make it from the heading. Changing it breaks links people already have."
          error={errorAt("id")}
        />
      </div>
    </div>
  )
}

export function ListForm({ block, onChange, errorAt }: BlockFormProps<"list">) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-neutral-800">
        <input type="checkbox" checked={block.ordered} onChange={(event) => onChange({ ...block, ordered: event.target.checked })} />
        Numbered list
      </label>
      <LinesField
        label="Items"
        rows={5}
        value={block.items}
        onChange={(items) => onChange({ ...block, items })}
        hint={<>One item per line. {INLINE_SYNTAX_HINT}</>}
        error={errorAt("items")}
      />
    </div>
  )
}

export function CodeForm({ block, onChange, errorAt }: BlockFormProps<"code">) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
        <SelectField label="Language" value={block.language} options={CODE_LANGUAGES} onChange={(language) => onChange({ ...block, language })} />
        <TextInput
          label="Caption"
          value={block.caption ?? ""}
          placeholder="e.g. components/button.tsx"
          onChange={(caption) => onChange({ ...block, caption })}
          hint="Usually the file the code would live in. Optional."
        />
      </div>
      <TextArea label="Code" rows={10} mono value={block.code} onChange={(code) => onChange({ ...block, code })} error={errorAt("code")} />
    </div>
  )
}

export function QuoteForm({ block, onChange, errorAt }: BlockFormProps<"quote">) {
  return (
    <TextArea
      label="Quote"
      value={block.text}
      onChange={(text) => onChange({ ...block, text })}
      hint={INLINE_SYNTAX_HINT}
      error={errorAt("text")}
    />
  )
}

export function CalloutForm({ block, onChange, errorAt }: BlockFormProps<"callout">) {
  return (
    <div className="space-y-3">
      <TextInput label="Title" value={block.title} onChange={(title) => onChange({ ...block, title })} error={errorAt("title")} />
      <TextArea
        label="Text"
        value={block.text}
        onChange={(text) => onChange({ ...block, text })}
        hint={INLINE_SYNTAX_HINT}
        error={errorAt("text")}
      />
    </div>
  )
}
