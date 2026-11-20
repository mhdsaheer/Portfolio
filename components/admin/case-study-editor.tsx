"use client"

import type { ReactNode } from "react"

import { DISCIPLINES } from "@/lib/case-studies"
import { deleteProject, saveCaseStudy } from "@/app/admin/project-actions"
import { EditorFrame, Section, SlugAndStatus, pathDescriber, useEditor, useSlugFromTitle } from "@/components/admin/editor-shell"
import {
  ColorField,
  ImageField,
  LinesField,
  NumberInput,
  ParagraphsField,
  RowList,
  SelectField,
  TextArea,
  TextInput,
} from "@/components/admin/fields"
import {
  caseStudyPayload,
  newDesignSystem,
  newPalette,
  newSwatch,
  newTypeface,
  stepNumber,
  type CaseStudyDraft,
  type CaseStudyState,
  type DesignSystemDraft,
} from "@/components/admin/project-state"
import { BUTTON } from "@/components/admin/styles"

const describePath = pathDescriber(
  {
    slug: "Slug",
    "document.title": "Title",
    "document.category": "Category",
    "document.description": "Description",
    "document.summary": "Summary",
    "document.image": "Cover image",
    "document.tags": "Tags",
    "document.year": "Year",
    "document.timeline": "Timeline",
    "document.client": "Client",
    "document.platform": "Platform",
    "document.liveUrl": "Live site",
    "document.overview": "Overview",
    "document.challenge.title": "Challenge title",
    "document.challenge.body": "Challenge",
    "document.approach": "Approach",
    "document.gallery": "Gallery",
    "document.outcome": "Outcome",
  },
  {
    "document.approach": "Approach step",
    "document.gallery": "Gallery image",
    "document.results": "Result",
    "document.designSystem.palettes": "Palette",
    "document.designSystem.typeface.weights": "Typeface weight",
  },
)

const save = (state: CaseStudyState) => saveCaseStudy(caseStudyPayload(state))
const remove = (slug: string) => deleteProject("case-studies", slug)

/** Switches an optional section on or off. */
function Toggle({ label, checked, onChange, children }: { label: string; checked: boolean; onChange: (on: boolean) => void; children?: ReactNode }) {
  return (
    <label className="flex items-start gap-2 text-sm text-neutral-800">
      <input type="checkbox" className="mt-1" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>
        <span className="font-medium">{label}</span>
        {children && <span className="block text-xs text-neutral-500">{children}</span>}
      </span>
    </label>
  )
}

export function CaseStudyEditor({ initial }: { initial: CaseStudyState }) {
  const editor = useEditor({ initial, save, basePath: "/admin/case-studies" })
  const { state, change, errorAt, isNew } = editor
  const slug = useSlugFromTitle(isNew)
  const doc = state.doc

  const updateDoc = (patch: Partial<CaseStudyDraft>) => change((current) => ({ ...current, doc: { ...current.doc, ...patch } }))
  const system = doc.designSystem
  const updateSystem = (patch: Partial<DesignSystemDraft>) => system && updateDoc({ designSystem: { ...system, ...patch } })
  const at = (path: string) => errorAt(`document.${path}`)

  return (
    <EditorFrame
      editor={editor}
      title={isNew ? "New case study" : doc.title || state.slug}
      back={{ href: "/admin/case-studies", label: "All case studies" }}
      liveHref={`/work/${state.originalSlug ?? state.slug}`}
      describePath={describePath}
      onDelete={remove}
      noun="case study"
    >
      <Section title="Basics">
        <TextInput
          label="Title"
          value={doc.title}
          error={at("title")}
          onChange={(title) =>
            change((current) => ({ ...current, slug: slug.slugFor(title, current.slug), doc: { ...current.doc, title } }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SlugAndStatus
            editor={editor}
            onSlugTyped={slug.typed}
            addressPrefix="/work/"
            lockedHint="Published case studies keep their address. Switch to draft and save to change it."
          />
          <SelectField
            label="Discipline"
            value={doc.discipline}
            options={DISCIPLINES}
            onChange={(discipline) => updateDoc({ discipline })}
            hint="Decides which filters it appears under on /work."
          />
          <TextInput label="Category" value={doc.category} onChange={(category) => updateDoc({ category })} hint="The label on its card, e.g. “Web Design & Development”." error={at("category")} />
          <TextInput label="Year" value={doc.year} onChange={(year) => updateDoc({ year })} error={at("year")} />
        </div>
        <TextArea label="Description" rows={2} value={doc.description} onChange={(description) => updateDoc({ description })} hint="The line under the title, and the search snippet." error={at("description")} />
        <TextArea label="Summary" rows={2} value={doc.summary} onChange={(summary) => updateDoc({ summary })} hint="The work index’s one line: where the project started, and what it became." error={at("summary")} />
        <LinesField label="Tags" rows={3} value={doc.tags} onChange={(tags) => updateDoc({ tags })} error={at("tags")} />
      </Section>

      <Section title="Project facts">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Client" value={doc.client} onChange={(client) => updateDoc({ client })} error={at("client")} />
          <TextInput label="Timeline" value={doc.timeline} onChange={(timeline) => updateDoc({ timeline })} error={at("timeline")} />
          <TextInput label="Platform" value={doc.platform} onChange={(platform) => updateDoc({ platform })} error={at("platform")} />
          <TextInput label="Live site" value={doc.liveUrl} placeholder="https://…" onChange={(liveUrl) => updateDoc({ liveUrl })} hint="Optional. Shows as “Visit the live site”." error={at("liveUrl")} />
        </div>
        <TextInput label="Role" value={doc.role} onChange={(role) => updateDoc({ role })} hint="Optional. What you did, comma-separated." />
      </Section>

      <Section title="Cover image" description="The hero image, the home page card and the share image.">
        <ImageField label="Image" folder="case-studies" src={doc.image} onChange={({ src }) => updateDoc({ image: src })} hint="Up to 10 MB." error={at("image")} />
      </Section>

      <Section title="Overview" description="The opening paragraphs, beside the project facts.">
        <ParagraphsField label="Paragraphs" value={doc.overview} onChange={(overview) => updateDoc({ overview })} error={at("overview")} />
      </Section>

      <Section title="01 · The problem">
        <TextInput label="Title" value={doc.challenge.title} onChange={(title) => updateDoc({ challenge: { ...doc.challenge, title } })} error={at("challenge.title")} />
        <ParagraphsField label="Paragraphs" value={doc.challenge.body} onChange={(body) => updateDoc({ challenge: { ...doc.challenge, body } })} error={at("challenge.body")} />
        <LinesField label="Pain points" value={doc.challenge.pains} onChange={(pains) => updateDoc({ challenge: { ...doc.challenge, pains } })} />
      </Section>

      <Section
        title="02 · The approach"
        action={
          <button
            type="button"
            className={BUTTON}
            onClick={() => updateDoc({ approach: doc.approach.map((step, index) => ({ ...step, step: stepNumber(index) })) })}
          >
            Renumber
          </button>
        }
      >
        <RowList
          label="Steps"
          addLabel="Add step"
          rows={doc.approach}
          onChange={(approach) => updateDoc({ approach })}
          newRow={() => ({ step: stepNumber(doc.approach.length), title: "", body: "" })}
          error={at("approach")}
          render={(step, set, index) => (
            <>
              <div className="grid gap-3 sm:grid-cols-[5rem_1fr]">
                <TextInput label="Number" value={step.step} onChange={(value) => set({ ...step, step: value })} error={at(`approach.${index}.step`)} />
                <TextInput label="Title" value={step.title} onChange={(title) => set({ ...step, title })} error={at(`approach.${index}.title`)} />
              </div>
              <TextArea label="Text" rows={4} value={step.body} onChange={(body) => set({ ...step, body })} error={at(`approach.${index}.body`)} />
            </>
          )}
        />
      </Section>

      <Section title="03 · Design system" description="Optional. When it’s on, the outcome becomes section 04.">
        <Toggle
          label="Show a design system section"
          checked={system !== null}
          onChange={(on) => {
            if (!on && system && !confirm("Remove the design system section and everything in it?")) return
            updateDoc({ designSystem: on ? newDesignSystem() : null })
          }}
        />
        {system && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Section label" value={system.label} placeholder="The design system" onChange={(label) => updateSystem({ label })} hint="Optional. What the section is called beside its number." />
              <TextInput label="Title" value={system.title} onChange={(title) => updateSystem({ title })} error={at("designSystem.title")} />
            </div>
            <TextArea label="Introduction" value={system.intro} onChange={(intro) => updateSystem({ intro })} error={at("designSystem.intro")} />
            <RowList
              label="Palettes"
              addLabel="Add palette"
              rows={system.palettes}
              onChange={(palettes) => updateSystem({ palettes })}
              newRow={newPalette}
              error={at("designSystem.palettes")}
              render={(palette, setPalette, p) => (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextInput label="Palette name" value={palette.name} onChange={(name) => setPalette({ ...palette, name })} error={at(`designSystem.palettes.${p}.name`)} />
                    <TextInput label="Note" value={palette.note} onChange={(note) => setPalette({ ...palette, note })} error={at(`designSystem.palettes.${p}.note`)} />
                  </div>
                  <RowList
                    label="Colours"
                    addLabel="Add colour"
                    rows={palette.swatches}
                    onChange={(swatches) => setPalette({ ...palette, swatches })}
                    newRow={newSwatch}
                    error={at(`designSystem.palettes.${p}.swatches`)}
                    render={(swatch, setSwatch, s) => {
                      const path = `designSystem.palettes.${p}.swatches.${s}`
                      return (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <TextInput label="Name" value={swatch.name} onChange={(name) => setSwatch({ ...swatch, name })} error={at(`${path}.name`)} />
                          <ColorField label="Colour" value={swatch.hex} onChange={(hex) => setSwatch({ ...swatch, hex })} error={at(`${path}.hex`)} />
                          <TextInput label="Role" value={swatch.role} onChange={(role) => setSwatch({ ...swatch, role })} hint="Optional. What the colour is for." />
                          <TextInput label="Sample text" value={swatch.sample} onChange={(sample) => setSwatch({ ...swatch, sample })} hint="Optional. Words on the sample button; defaults to the name." />
                          <ColorField label="Lip (pressed shade)" optional value={swatch.lip} onChange={(lip) => setSwatch({ ...swatch, lip })} error={at(`${path}.lip`)} />
                          <ColorField label="Soft (pale tint)" optional value={swatch.soft} onChange={(soft) => setSwatch({ ...swatch, soft })} error={at(`${path}.soft`)} />
                        </div>
                      )
                    }}
                  />
                </>
              )}
            />

            <Toggle
              label="Show the typeface"
              checked={system.typeface !== null}
              onChange={(on) => updateSystem({ typeface: on ? newTypeface() : null })}
            />
            {system.typeface && (
              <div className="space-y-3 rounded-md border border-neutral-200 p-3">
                <TextInput label="Family" value={system.typeface.family} onChange={(family) => updateSystem({ typeface: { ...system.typeface!, family } })} error={at("designSystem.typeface.family")} />
                <RowList
                  label="Weights"
                  addLabel="Add weight"
                  rows={system.typeface.weights}
                  onChange={(weights) => updateSystem({ typeface: { ...system.typeface!, weights } })}
                  newRow={() => ({ label: "", weight: 400 })}
                  error={at("designSystem.typeface.weights")}
                  render={(weight, set, w) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextInput label="Label" value={weight.label} onChange={(label) => set({ ...weight, label })} error={at(`designSystem.typeface.weights.${w}.label`)} />
                      <NumberInput label="Weight (100-900)" value={weight.weight} onChange={(value) => set({ ...weight, weight: value })} error={at(`designSystem.typeface.weights.${w}.weight`)} />
                    </div>
                  )}
                />
                <TextInput label="Sample line" value={system.typeface.sample} onChange={(sample) => updateSystem({ typeface: { ...system.typeface!, sample } })} hint="A line from the product, set in the typeface." error={at("designSystem.typeface.sample")} />
                <TextInput label="Note" value={system.typeface.note} onChange={(note) => updateSystem({ typeface: { ...system.typeface!, note } })} error={at("designSystem.typeface.note")} />
              </div>
            )}
          </div>
        )}
      </Section>

      <Section title="Gallery" description="The first image shows largest.">
        <RowList
          label="Images"
          addLabel="Add image"
          rows={doc.gallery}
          onChange={(gallery) => updateDoc({ gallery })}
          newRow={() => ({ src: "", alt: "", caption: "" })}
          error={at("gallery")}
          render={(shot, set, index) => (
            <>
              <ImageField label="Image" folder="case-studies" src={shot.src} onChange={({ src }) => set({ ...shot, src })} error={at(`gallery.${index}.src`)} />
              <TextArea label="Alt text" rows={2} value={shot.alt} onChange={(alt) => set({ ...shot, alt })} hint="What the image shows, for anyone who can’t see it." error={at(`gallery.${index}.alt`)} />
              <TextInput label="Caption" value={shot.caption} onChange={(caption) => set({ ...shot, caption })} hint="Optional." />
            </>
          )}
        />
      </Section>

      <Section title={`${system ? "04" : "03"} · The outcome`} description="The results, then what changed.">
        <RowList
          label="Results"
          addLabel="Add result"
          rows={doc.results}
          onChange={(results) => updateDoc({ results })}
          newRow={() => ({ value: "", label: "" })}
          render={(result, set, index) => (
            <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
              <TextInput label="Value" value={result.value} onChange={(value) => set({ ...result, value })} error={at(`results.${index}.value`)} />
              <TextInput label="Label" value={result.label} onChange={(label) => set({ ...result, label })} error={at(`results.${index}.label`)} />
            </div>
          )}
        />
        <TextInput label="Heading" value={doc.outcomeHeading} placeholder="What changed" onChange={(outcomeHeading) => updateDoc({ outcomeHeading })} hint="Optional, for work with no before and after to report." />
        <ParagraphsField label="Paragraphs" value={doc.outcome} onChange={(outcome) => updateDoc({ outcome })} error={at("outcome")} />
      </Section>

      <Section title="Testimonial" description="Optional. Only a real quote; the section goes when it’s off.">
        <Toggle
          label="Show a testimonial"
          checked={doc.testimonial !== null}
          onChange={(on) => updateDoc({ testimonial: on ? { quote: "", author: "", role: "" } : null })}
        />
        {doc.testimonial && (
          <div className="space-y-3">
            <TextArea label="Quote" value={doc.testimonial.quote} onChange={(quote) => updateDoc({ testimonial: { ...doc.testimonial!, quote } })} error={at("testimonial.quote")} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Name" value={doc.testimonial.author} onChange={(author) => updateDoc({ testimonial: { ...doc.testimonial!, author } })} error={at("testimonial.author")} />
              <TextInput label="Role" value={doc.testimonial.role} onChange={(role) => updateDoc({ testimonial: { ...doc.testimonial!, role } })} error={at("testimonial.role")} />
            </div>
          </div>
        )}
      </Section>

      <Section title="Stack">
        <LinesField label="Tools and technologies" value={doc.stack} onChange={(stack) => updateDoc({ stack })} />
      </Section>
    </EditorFrame>
  )
}
