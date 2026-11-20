"use client"

import { DESIGN_KINDS, slugify } from "@/lib/insight-content"
import {
  ImageField,
  LinesField,
  NumberInput,
  ParagraphsField,
  PickList,
  RowList,
  SelectField,
  TextArea,
  TextInput,
} from "@/components/admin/fields"
import type { BlockFormProps } from "@/components/admin/blocks/text-blocks"

/**
 * One design type section: what it is, an example image, where it works and
 * where it doesn't, and real sites to study.
 */
export function DesignTypeForm({
  block,
  onChange,
  errorAt,
  designTypes,
}: BlockFormProps<"designType"> & { designTypes: { id: string; name: string }[] }) {
  const others = designTypes
    .filter((type) => type.id && type.id !== block.id)
    .map((type) => ({ value: type.id, label: type.name || type.id }))

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[6rem_1fr_12rem]">
        <NumberInput label="Number" value={block.number} onChange={(number) => onChange({ ...block, number })} error={errorAt("number")} />
        <TextInput
          label="Name"
          value={block.name}
          // The anchor follows the name until it is set by hand
          onChange={(name) =>
            onChange({ ...block, name, id: !block.id || block.id === slugify(block.name) ? slugify(name) : block.id })
          }
          error={errorAt("name")}
        />
        <SelectField label="Kind" value={block.kind} options={DESIGN_KINDS} onChange={(kind) => onChange({ ...block, kind })} />
      </div>
      <TextInput
        label="Anchor"
        value={block.id}
        onChange={(id) => onChange({ ...block, id })}
        hint="The #link to this section, and how comparison rows and pairings point at it. Made from the name until you change it."
        error={errorAt("id")}
      />
      <ParagraphsField label="Introduction" rows={5} value={block.intro} onChange={(intro) => onChange({ ...block, intro })} error={errorAt("intro")} />

      <fieldset className="space-y-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-sm font-medium text-neutral-800">Example image</legend>
        <ImageField
          label="Image"
          folder="insights"
          src={block.image.src}
          onChange={(image) => onChange({ ...block, image: { ...block.image, ...image } })}
          hint="Uploads fill in the size. Up to 10 MB on Cloudinary's free plan."
          error={errorAt("image.src")}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberInput
            label="Width (px)"
            value={block.image.width}
            onChange={(width) => onChange({ ...block, image: { ...block.image, width } })}
            error={errorAt("image.width")}
          />
          <NumberInput
            label="Height (px)"
            value={block.image.height}
            onChange={(height) => onChange({ ...block, image: { ...block.image, height } })}
            error={errorAt("image.height")}
          />
        </div>
        <TextArea
          label="Alt text"
          rows={2}
          value={block.image.alt}
          onChange={(alt) => onChange({ ...block, image: { ...block.image, alt } })}
          hint="What the image shows, for anyone who can't see it."
          error={errorAt("image.alt")}
        />
        <TextInput
          label="Caption"
          value={block.image.caption}
          onChange={(caption) => onChange({ ...block, image: { ...block.image, caption } })}
          error={errorAt("image.caption")}
        />
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <LinesField label="Characteristics" value={block.characteristics} onChange={(characteristics) => onChange({ ...block, characteristics })} error={errorAt("characteristics")} />
        <LinesField label="Best for" value={block.bestFor} onChange={(bestFor) => onChange({ ...block, bestFor })} error={errorAt("bestFor")} />
        <LinesField label="Advantages" value={block.advantages} onChange={(advantages) => onChange({ ...block, advantages })} error={errorAt("advantages")} />
        <LinesField label="Limitations" value={block.limitations} onChange={(limitations) => onChange({ ...block, limitations })} error={errorAt("limitations")} />
      </div>

      <RowList
        label="Real sites to study"
        addLabel="Add reference"
        rows={block.references}
        onChange={(references) => onChange({ ...block, references })}
        newRow={() => ({ name: "", href: "", note: "" })}
        render={(reference, update, index) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Name" value={reference.name} onChange={(name) => update({ ...reference, name })} error={errorAt(`references.${index}.name`)} />
              <TextInput
                label="Address"
                value={reference.href}
                placeholder="https://…"
                onChange={(href) => update({ ...reference, href })}
                error={errorAt(`references.${index}.href`)}
              />
            </div>
            <TextInput label="Why it's worth a look" value={reference.note} onChange={(note) => update({ ...reference, note })} error={errorAt(`references.${index}.note`)} />
          </>
        )}
      />

      <PickList
        label="Pairs well with"
        options={others}
        value={block.pairsWith}
        onChange={(pairsWith) => onChange({ ...block, pairsWith })}
        error={errorAt("pairsWith")}
      />

      <TextArea
        label="Tip"
        value={block.tip ?? ""}
        onChange={(tip) => onChange({ ...block, tip })}
        hint="A practical note set apart in the section, such as a pitfall or a technique. Optional."
        error={errorAt("tip")}
      />
    </div>
  )
}
