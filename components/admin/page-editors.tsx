"use client"

import type { ReactNode } from "react"
import Link from "next/link"

import { savePage } from "@/app/admin/settings-actions"
import { MessageBanner, SaveBar, Section, pathDescriber, useSaveFlow } from "@/components/admin/editor-shell"
import { LinesField, ParagraphsField, RowList, TextArea, TextInput } from "@/components/admin/fields"
import { BUTTON } from "@/components/admin/styles"
import type { FieldErrors } from "@/lib/admin/results"
import {
  ACCENT_HINT,
  MAX_HERO_LINE,
  PAGES,
  numbered,
  type AboutPage,
  type FooterContent,
  type HomePage,
  type PageKey,
  type WorkPage,
} from "@/lib/page-content"

/*
 * One editor per page under Pages. Each lays out its page's words in the
 * order they appear on the site, and saves them as one setting.
 */

type Flow<S> = ReturnType<typeof useSaveFlow<S>>

/** A list's own error ("Up to 3"), or else the first one inside it. */
function listError(errors: FieldErrors, path: string) {
  return errors[path] ?? Object.entries(errors).find(([key]) => key.startsWith(`${path}.`))?.[1]
}

/** Replaces part of one section, leaving the rest of the page as it is. */
function sectionSetter<S extends object>(change: Flow<S>["change"]) {
  return <K extends keyof S>(section: K, patch: Partial<S[K]>) =>
    change((current) => ({ ...current, [section]: { ...current[section], ...patch } }) as S)
}

function PageFrame<S>({
  pageKey,
  flow,
  describePath,
  children,
}: {
  pageKey: PageKey
  flow: Flow<S>
  describePath: (path: string) => string
  children: ReactNode
}) {
  const page = PAGES.find((entry) => entry.key === pageKey)!

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/pages" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Pages
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{page.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{page.summary} Saved changes go live within a few seconds.</p>
        </div>
        <a href={page.path} target="_blank" rel="noreferrer" className={BUTTON}>
          View live ↗
        </a>
      </div>

      <MessageBanner message={flow.message} errors={flow.errors} describePath={describePath} />

      {children}

      <SaveBar saving={flow.saving} onSave={flow.saveNow} note={flow.dirty ? "Unsaved changes" : "Saved · live"} label="Save and publish" />
    </div>
  )
}

/* ---------------------------------------------------------------- Home */

const saveHome = (state: HomePage) => savePage("page-home", state)

const describeHome = pathDescriber(
  {
    "hero.lines.0": "Headline, first line",
    "hero.lines.1": "Headline, second line",
    "hero.tagline": "Tagline",
    "hero.intro": "Introduction",
    "intro.lede": "Opening line",
    "intro.supporting": "Supporting line",
    "intro.currently": "Currently",
    "intro.focus": "Focus",
    "about.title": "About title",
    "about.paragraphs": "About paragraphs",
    "about.skills": "Expertise",
    "about.stats": "Numbers",
    "toolkit.label": "Toolkit label",
    "toolkit.tools": "Tools",
  },
  { "about.paragraphs": "Paragraph", "about.skills": "Expertise", "about.stats": "Number", "toolkit.tools": "Tool" },
)

export function HomePageEditor({ initial }: { initial: HomePage }) {
  const flow = useSaveFlow({ initial, save: saveHome })
  const { state, errors, errorAt } = flow
  const set = sectionSetter(flow.change)

  return (
    <PageFrame pageKey="page-home" flow={flow} describePath={describeHome}>
      <Section title="Headline" description="The first thing on the site. As the page scrolls, the two lines part ways: the first out to the left, the second to the right.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="First line"
            value={state.hero.lines[0]}
            onChange={(line) => set("hero", { lines: [line, state.hero.lines[1]] })}
            maxHint={MAX_HERO_LINE}
            error={errorAt("hero.lines.0")}
          />
          <TextInput
            label="Second line"
            value={state.hero.lines[1]}
            onChange={(line) => set("hero", { lines: [state.hero.lines[0], line] })}
            maxHint={MAX_HERO_LINE}
            error={errorAt("hero.lines.1")}
          />
        </div>
        <p className="text-xs text-neutral-500">The headline is sized to fill the screen with “Developer.”, so each line takes up to {MAX_HERO_LINE} characters.</p>
        <TextInput
          label="Tagline"
          value={state.hero.tagline}
          onChange={(tagline) => set("hero", { tagline })}
          hint="Set large in italic under the headline."
          maxHint={30}
          error={errorAt("hero.tagline")}
        />
        <TextArea
          label="Introduction"
          value={state.hero.intro}
          onChange={(intro) => set("hero", { intro })}
          hint="Beside the tagline, next to “View Works”."
          maxHint={200}
          error={errorAt("hero.intro")}
        />
      </Section>

      <Section
        title="About me"
        description="Over your photo as it pins to the screen, or below it on phones. The photo itself is under Photo & resume."
      >
        <TextArea
          label="Opening line"
          rows={2}
          value={state.intro.lede}
          onChange={(lede) => set("intro", { lede })}
          hint={ACCENT_HINT}
          error={errorAt("intro.lede")}
        />
        <TextArea
          label="Supporting line"
          rows={2}
          value={state.intro.supporting}
          onChange={(supporting) => set("intro", { supporting })}
          error={errorAt("intro.supporting")}
        />
        <TextInput
          label="Currently"
          value={state.intro.currently}
          onChange={(currently) => set("intro", { currently })}
          error={errorAt("intro.currently")}
        />
        <TextInput
          label="Focus"
          value={state.intro.focus}
          onChange={(focus) => set("intro", { focus })}
          hint="“Based in”, between these two, shows your location and availability from the contact details."
          error={errorAt("intro.focus")}
        />
      </Section>

      <Section title="About" description="The section after Selected work: the title and paragraphs on the left, your expertise and three numbers on the right.">
        <TextInput label="Title" value={state.about.title} onChange={(title) => set("about", { title })} error={errorAt("about.title")} />
        <ParagraphsField
          label="Paragraphs"
          value={state.about.paragraphs}
          onChange={(paragraphs) => set("about", { paragraphs })}
          hint="Leave a blank line between paragraphs. Up to 3."
          error={listError(errors, "about.paragraphs")}
        />
        <LinesField
          label="Expertise"
          rows={8}
          value={state.about.skills}
          onChange={(skills) => set("about", { skills })}
          hint="One per line, shown as tags. Up to 20."
          error={listError(errors, "about.skills")}
        />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-neutral-800">Numbers</legend>
          <p className="text-xs text-neutral-500">Three tiles side by side. Only figures you can stand behind.</p>
          {state.about.stats.map((stat, index) => {
            const update = (patch: Partial<typeof stat>) =>
              set("about", { stats: state.about.stats.map((other, at) => (at === index ? { ...other, ...patch } : other)) })
            return (
              <div key={index} className="grid gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 sm:grid-cols-[8rem_1fr]">
                <TextInput label="Figure" value={stat.value} onChange={(value) => update({ value })} error={errorAt(`about.stats.${index}.value`)} />
                <TextInput label="Label" value={stat.label} onChange={(label) => update({ label })} error={errorAt(`about.stats.${index}.label`)} />
              </div>
            )
          })}
          {errorAt("about.stats") && <p className="text-xs text-red-600">{errorAt("about.stats")}</p>}
        </fieldset>
      </Section>

      <Section title="Toolkit" description="The band of tool names that scrolls across the page, after the About section.">
        <TextInput label="Label" value={state.toolkit.label} onChange={(label) => set("toolkit", { label })} error={errorAt("toolkit.label")} />
        <LinesField
          label="Tools"
          rows={10}
          value={state.toolkit.tools}
          onChange={(tools) => set("toolkit", { tools })}
          hint="One per line, at least 10. The band keeps the same pace however many there are."
          error={listError(errors, "toolkit.tools")}
        />
      </Section>
    </PageFrame>
  )
}

/* --------------------------------------------------------------- About */

const saveAbout = (state: AboutPage) => savePage("page-about", state)

const describeAbout = pathDescriber(
  {
    "whatIDo.heading": "What I do heading",
    "whatIDo.paragraphs": "What I do paragraphs",
    "approach.heading": "Approach heading",
    "approach.intro": "Approach introduction",
    "approach.steps": "Approach steps",
  },
  { "whatIDo.heading": "Heading line", "whatIDo.paragraphs": "Paragraph", "approach.steps": "Step" },
)

export function AboutPageEditor({ initial }: { initial: AboutPage }) {
  const flow = useSaveFlow({ initial, save: saveAbout })
  const { state, errors, errorAt } = flow
  const set = sectionSetter(flow.change)

  return (
    <PageFrame pageKey="page-about" flow={flow} describePath={describeAbout}>
      <Section title="What I do" description="The statement under the photo, with the “Get in touch” button, then the copy under the “What I do” label.">
        <LinesField
          label="Heading"
          rows={4}
          value={state.whatIDo.heading}
          onChange={(heading) => set("whatIDo", { heading })}
          hint={<>One line each, up to 5: every line rises on its own, so break them where you want them. About 40 characters fits a line. {ACCENT_HINT}</>}
          error={listError(errors, "whatIDo.heading")}
        />
        <ParagraphsField
          label="Paragraphs"
          value={state.whatIDo.paragraphs}
          onChange={(paragraphs) => set("whatIDo", { paragraphs })}
          hint="Leave a blank line between paragraphs. Up to 4, set in two columns."
          error={listError(errors, "whatIDo.paragraphs")}
        />
      </Section>

      <Section title="Approach" description="How you work: a heading that stays put while the steps scroll past it.">
        <TextInput
          label="Heading"
          value={state.approach.heading}
          onChange={(heading) => set("approach", { heading })}
          hint={ACCENT_HINT}
          error={errorAt("approach.heading")}
        />
        <TextArea
          label="Introduction"
          value={state.approach.intro}
          onChange={(intro) => set("approach", { intro })}
          error={errorAt("approach.intro")}
        />
        <RowList
          label="Steps"
          addLabel="Add step"
          rows={state.approach.steps}
          max={5}
          onChange={(steps) => set("approach", { steps })}
          newRow={() => ({ title: "", body: "" })}
          error={errorAt("approach.steps")}
          render={(step, update, index) => (
            <>
              <TextInput
                label={`Step ${numbered(index)}`}
                value={step.title}
                onChange={(title) => update({ ...step, title })}
                error={errorAt(`approach.steps.${index}.title`)}
              />
              <TextArea
                label="Description"
                rows={4}
                value={step.body}
                onChange={(body) => update({ ...step, body })}
                error={errorAt(`approach.steps.${index}.body`)}
              />
            </>
          )}
        />
      </Section>
    </PageFrame>
  )
}

/* ---------------------------------------------------------------- Work */

const saveWork = (state: WorkPage) => savePage("page-work", state)
const describeWork = pathDescriber({ intro: "Introduction" })

export function WorkPageEditor({ initial }: { initial: WorkPage }) {
  const flow = useSaveFlow({ initial, save: saveWork })
  const { state, errorAt } = flow

  return (
    <PageFrame pageKey="page-work" flow={flow} describePath={describeWork}>
      <Section
        title="Introduction"
        description="Beside the headline “Built, designed & branded.”, above the button to the old portfolio. The headline is set to fit those exact words, so it stays as it is."
      >
        <TextArea
          label="Introduction"
          value={state.intro}
          onChange={(intro) => flow.change(() => ({ intro }))}
          maxHint={160}
          error={errorAt("intro")}
        />
      </Section>
    </PageFrame>
  )
}

/* -------------------------------------------------------------- Footer */

const saveFooter = (state: FooterContent) => savePage("page-footer", state)
const describeFooter = pathDescriber({ heading: "Heading" }, { heading: "Heading line" })

export function FooterEditor({ initial }: { initial: FooterContent }) {
  const flow = useSaveFlow({ initial, save: saveFooter })
  const { state, errors } = flow

  return (
    <PageFrame pageKey="page-footer" flow={flow} describePath={describeFooter}>
      <Section title="Invitation" description="Above the “Write a letter” and “Download resume” buttons, with your email and phone beside it.">
        <LinesField
          label="Heading"
          rows={3}
          value={state.heading}
          onChange={(heading) => flow.change(() => ({ heading }))}
          hint={<>One line each, up to 3. {ACCENT_HINT}</>}
          error={listError(errors, "heading")}
        />
      </Section>
    </PageFrame>
  )
}
