"use client"

import { GUIDE_ONLY_BLOCKS, LAYOUTS, isGuideOnly, type Faq } from "@/lib/insight-content"
import { deleteInsight, saveInsight } from "@/app/admin/actions"
import { BlockList } from "@/components/admin/block-list"
import { EditorFrame, Section, SlugAndStatus, pathDescriber, useEditor, useSlugFromTitle } from "@/components/admin/editor-shell"
import { today, toPayload, type ArticleOption, type DocumentDraft, type EditorState } from "@/components/admin/editor-state"
import {
  Field,
  ImageField,
  LinesField,
  ParagraphsField,
  PickList,
  RowList,
  SelectField,
  TextArea,
  TextInput,
} from "@/components/admin/fields"
import { BUTTON, INLINE_SYNTAX_HINT, INPUT } from "@/components/admin/styles"

const describePath = pathDescriber(
  {
    slug: "Slug",
    status: "Status",
    publishedOn: "Published",
    updatedOn: "Updated",
    "document.title": "Title",
    "document.excerpt": "Excerpt",
    "document.image": "Cover image",
    "document.imageAlt": "Cover alt text",
    "document.category": "Category",
    "document.tags": "Tags",
    "document.intro": "Introduction",
    "document.related": "Related articles",
  },
  { "document.body": "Block", "document.faq": "Question" },
)

const save = (state: EditorState) => saveInsight(toPayload(state))

export function InsightEditor({ initial, others }: { initial: EditorState; others: ArticleOption[] }) {
  const editor = useEditor({ initial, save, basePath: "/admin/insights" })
  const { state, change, errors, errorAt, isNew } = editor
  const slug = useSlugFromTitle(isNew)
  const doc = state.doc

  const update = (patch: Partial<EditorState>) => change((current) => ({ ...current, ...patch }))
  const updateDoc = (patch: Partial<DocumentDraft>) => change((current) => ({ ...current, doc: { ...current.doc, ...patch } }))

  const misplacedBlocks = doc.layout === "guide" ? 0 : doc.body.filter(({ block }) => isGuideOnly(block.type)).length

  return (
    <EditorFrame
      editor={editor}
      title={isNew ? "New insight" : doc.title || state.slug}
      back={{ href: "/admin", label: "All insights" }}
      liveHref={`/insights/${state.originalSlug ?? state.slug}`}
      describePath={describePath}
      onDelete={deleteInsight}
      noun="article"
    >
      <Section title="Basics">
        <TextInput
          label="Title"
          value={doc.title}
          error={errorAt("document.title")}
          onChange={(title) =>
            change((current) => ({ ...current, slug: slug.slugFor(title, current.slug), doc: { ...current.doc, title } }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SlugAndStatus
            editor={editor}
            onSlugTyped={slug.typed}
            addressPrefix="/insights/"
            lockedHint="Published articles keep their address. Switch to draft and save to change it."
          />
          <SelectField
            label="Design"
            value={doc.layout}
            options={LAYOUTS.map((layout) => ({ value: layout, label: layout === "guide" ? "Guide (light, visual)" : "Standard (dark)" }))}
            onChange={(layout) => updateDoc({ layout })}
            hint={
              misplacedBlocks > 0
                ? `${misplacedBlocks} block${misplacedBlocks === 1 ? "" : "s"} below only show in the Guide design.`
                : "Guide adds design-type sections, comparison tables, cards and callouts."
            }
          />
          <TextInput label="Category" value={doc.category} onChange={(category) => updateDoc({ category })} hint="The one label on cards and the cover." error={errorAt("document.category")} />
          <Field label="Published" error={errorAt("publishedOn")}>
            <input type="date" className={INPUT} value={state.publishedOn} onChange={(event) => update({ publishedOn: event.target.value })} />
          </Field>
          <Field label="Updated" hint="Set when you revise a published article. Shown on the page." error={errorAt("updatedOn")}>
            <div className="flex gap-2">
              <input type="date" className={INPUT} value={state.updatedOn} onChange={(event) => update({ updatedOn: event.target.value })} />
              <button type="button" className={BUTTON} onClick={() => update({ updatedOn: today() })}>
                Today
              </button>
              {state.updatedOn && (
                <button type="button" className={BUTTON} onClick={() => update({ updatedOn: "" })}>
                  Clear
                </button>
              )}
            </div>
          </Field>
        </div>
        <TextArea
          label="Excerpt"
          value={doc.excerpt}
          onChange={(excerpt) => updateDoc({ excerpt })}
          hint="The standfirst on the cover and the line under the title on cards."
          error={errorAt("document.excerpt")}
        />
        <LinesField label="Tags" rows={3} value={doc.tags} onChange={(tags) => updateDoc({ tags })} error={errorAt("document.tags")} />
      </Section>

      <Section title="Cover image" description="16:9. Also the image used when the article is shared.">
        <ImageField
          label="Image"
          folder="insights"
          src={doc.image}
          onChange={({ src }) => updateDoc({ image: src, imageCrops: [] })}
          hint="Uploaded covers get their 4:3 and 1:1 crops from Cloudinary automatically. Up to 10 MB."
          error={errorAt("document.image")}
        />
        <TextArea
          label="Alt text"
          rows={2}
          value={doc.imageAlt}
          onChange={(imageAlt) => updateDoc({ imageAlt })}
          hint="What the image shows, for anyone who can’t see it."
          error={errorAt("document.imageAlt")}
        />
        {doc.image.startsWith("/") && (
          <LinesField
            label="Crops (4:3, then 1:1)"
            rows={2}
            value={doc.imageCrops}
            onChange={(imageCrops) => updateDoc({ imageCrops })}
            hint="Only for covers in /public. One path per line."
          />
        )}
      </Section>

      <Section title="Introduction" description="Set larger than the body, before the first heading.">
        <ParagraphsField label="Paragraphs" value={doc.intro} onChange={(intro) => updateDoc({ intro })} error={errorAt("document.intro")} />
      </Section>

      <Section
        title="Body"
        description={
          doc.layout === "guide"
            ? "Every block type is available in the Guide design."
            : `The Standard design shows paragraphs, headings, lists, code and quotes. ${GUIDE_ONLY_BLOCKS.length} more block types come with the Guide design.`
        }
      >
        <BlockList body={doc.body} layout={doc.layout} errors={errors} onChange={(body) => updateDoc({ body })} />
      </Section>

      <Section title="Closing" description="A note set apart after the body, then questions and answers.">
        <ParagraphsField label="Closing note" rows={4} value={doc.outro} onChange={(outro) => updateDoc({ outro })} hint={<>Optional. {INLINE_SYNTAX_HINT}</>} />
        <RowList<Faq>
          label="Frequently asked questions"
          addLabel="Add question"
          rows={doc.faq}
          onChange={(faq) => updateDoc({ faq })}
          newRow={() => ({ question: "", answer: "" })}
          render={(item, set, index) => (
            <>
              <TextInput label="Question" value={item.question} onChange={(question) => set({ ...item, question })} error={errorAt(`document.faq.${index}.question`)} />
              <TextArea label="Answer" value={item.answer} onChange={(answer) => set({ ...item, answer })} hint={INLINE_SYNTAX_HINT} error={errorAt(`document.faq.${index}.answer`)} />
            </>
          )}
        />
        <PickList
          label="Related articles"
          options={others.filter((other) => other.slug !== state.originalSlug).map((other) => ({ value: other.slug, label: other.title }))}
          value={doc.related}
          onChange={(related) => updateDoc({ related })}
          hint="Suggested after the article, in the order ticked. Topped up from shared tags."
          error={errorAt("document.related")}
        />
      </Section>

      <Section title="Search and sharing" description="Optional. Each falls back to the title and excerpt.">
        <TextInput label="SEO title" value={doc.seoTitle} onChange={(seoTitle) => updateDoc({ seoTitle })} placeholder={doc.title} maxHint={60} hint="The browser tab and search result title." />
        <TextArea label="Meta description" rows={2} value={doc.description} onChange={(description) => updateDoc({ description })} placeholder={doc.excerpt} maxHint={160} hint="The search result snippet." />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Social title" value={doc.social.title} onChange={(title) => updateDoc({ social: { ...doc.social, title } })} error={errorAt("document.social.title")} />
          <TextInput
            label="Social description"
            value={doc.social.description}
            onChange={(description) => updateDoc({ social: { ...doc.social, description } })}
            error={errorAt("document.social.description")}
          />
        </div>
        <p className="text-xs text-neutral-500">Fill in both social fields or neither.</p>
        <TextInput
          label="Focus keyword"
          value={doc.seo.focusKeyword}
          onChange={(focusKeyword) => updateDoc({ seo: { ...doc.seo, focusKeyword } })}
          hint="The keywords below are saved only when this is set."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <LinesField label="Secondary keywords" value={doc.seo.secondaryKeywords} onChange={(secondaryKeywords) => updateDoc({ seo: { ...doc.seo, secondaryKeywords } })} />
          <LinesField label="Semantic keywords" value={doc.seo.semanticKeywords} onChange={(semanticKeywords) => updateDoc({ seo: { ...doc.seo, semanticKeywords } })} />
        </div>
        <TextArea label="Search intent" rows={2} value={doc.seo.searchIntent} onChange={(searchIntent) => updateDoc({ seo: { ...doc.seo, searchIntent } })} hint="A note to yourself on who searches for this and why. Not shown on the page." />
      </Section>
    </EditorFrame>
  )
}
