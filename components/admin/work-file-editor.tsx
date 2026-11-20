"use client"

import { SERVICES } from "@/lib/project-content"
import { deleteProject, saveWorkFile } from "@/app/admin/project-actions"
import { EditorFrame, Section, SlugAndStatus, pathDescriber, useEditor, useSlugFromTitle } from "@/components/admin/editor-shell"
import { ImageField, PickList, RowList, SelectField, TextArea, TextInput } from "@/components/admin/fields"
import { workFilePayload, type WorkFileDraft, type WorkFileState } from "@/components/admin/project-state"

const describePath = pathDescriber(
  {
    slug: "Slug",
    "document.title": "Title",
    "document.kind": "Kind",
    "document.services": "Services",
    "document.year": "Year",
    "document.src": "Image or address",
    "document.alt": "Alt text",
    "document.cover": "Cover",
    "document.more": "Extra views",
  },
  { "document.more": "Extra view" },
)

const save = (state: WorkFileState) => saveWorkFile(workFilePayload(state))
const remove = (slug: string) => deleteProject("work-files", slug)

export function WorkFileEditor({ initial }: { initial: WorkFileState }) {
  const editor = useEditor({ initial, save, basePath: "/admin/work-files" })
  const { state, change, errorAt, isNew } = editor
  const slug = useSlugFromTitle(isNew)
  const doc = state.doc
  const isImage = doc.format === "image"

  const updateDoc = (patch: Partial<WorkFileDraft>) => change((current) => ({ ...current, doc: { ...current.doc, ...patch } }))
  const at = (path: string) => errorAt(`document.${path}`)

  return (
    <EditorFrame
      editor={editor}
      title={isNew ? "New work file" : doc.title || state.slug}
      back={{ href: "/admin/work-files", label: "All work files" }}
      liveHref="/work"
      describePath={describePath}
      onDelete={remove}
      noun="work file"
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
          <SlugAndStatus editor={editor} onSlugTyped={slug.typed} canLock={false} lockedHint="" />
          <TextInput label="Kind" value={doc.kind} onChange={(kind) => updateDoc({ kind })} hint="What the piece is, in a word or two - “Brand identity”, “Pitch deck”." error={at("kind")} />
          <TextInput label="Year" value={doc.year} onChange={(year) => updateDoc({ year })} error={at("year")} />
        </div>
        <PickList
          label="Services"
          options={SERVICES.map((service) => ({ value: service, label: service }))}
          value={doc.services}
          onChange={(services) => updateDoc({ services: services as WorkFileDraft["services"] })}
          hint="The filters it appears under on /work."
          error={at("services")}
        />
      </Section>

      <Section title="The piece">
        <SelectField
          label="Opens as"
          value={doc.format}
          options={[
            { value: "image", label: "Images, in the site’s viewer" },
            { value: "link", label: "A link, in a new tab" },
          ]}
          onChange={(format) => updateDoc({ format })}
        />

        {isImage ? (
          <>
            <ImageField label="Main image" folder="work-files" src={doc.src} onChange={({ src }) => updateDoc({ src })} hint="The first view in the viewer. Up to 10 MB." error={at("src")} />
            <TextArea label="Alt text" rows={2} value={doc.alt} onChange={(alt) => updateDoc({ alt })} hint="What the image shows, for anyone who can’t see it." error={at("alt")} />
          </>
        ) : (
          <TextInput label="Address" value={doc.src} placeholder="https://…" onChange={(src) => updateDoc({ src })} hint="Where the card leads." error={at("src")} />
        )}

        <ImageField
          label="Card cover"
          folder="work-files"
          src={doc.cover}
          onChange={({ src }) => updateDoc({ cover: src })}
          hint={isImage ? "Optional. The card uses the main image when this is empty." : "Optional. A link without one gets a lettered cover."}
          error={at("cover")}
        />
      </Section>

      {isImage && (
        <Section title="Extra views" description="The other side, another angle. The index still shows one card; the viewer lists these after the main image.">
          <RowList
            label="Views"
            addLabel="Add view"
            rows={doc.more}
            onChange={(more) => updateDoc({ more })}
            newRow={() => ({ src: "", alt: "" })}
            error={at("more")}
            render={(shot, set, index) => (
              <>
                <ImageField label="Image" folder="work-files" src={shot.src} onChange={({ src }) => set({ ...shot, src })} error={at(`more.${index}.src`)} />
                <TextArea label="Alt text" rows={2} value={shot.alt} onChange={(alt) => set({ ...shot, alt })} error={at(`more.${index}.alt`)} />
              </>
            )}
          />
        </Section>
      )}
    </EditorFrame>
  )
}
