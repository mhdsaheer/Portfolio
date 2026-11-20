"use client"

import { MAX_SERVICES, MAX_SKILLS, type ServiceEntry } from "@/lib/settings-content"
import { saveServices } from "@/app/admin/settings-actions"
import { MessageBanner, SaveBar, Section, useSaveFlow } from "@/components/admin/editor-shell"
import { LinesField, RowList, TextInput } from "@/components/admin/fields"
import { BUTTON } from "@/components/admin/styles"

/** "1.skills" -> "Service 2"; the list's own errors (too many, none) -> "Services". */
function describePath(path: string) {
  const match = path.match(/^(\d+)/)
  return match ? `Service ${Number(match[1]) + 1}` : "Services"
}

/**
 * The About page's "My services" panel: each service's title and the skills
 * listed beside it, in order. Numbers (01, 02…) come from the order.
 */
export function ServicesEditor({ initial }: { initial: ServiceEntry[] }) {
  const { state, change, errors, errorAt, message, saving, dirty, saveNow } = useSaveFlow({ initial, save: saveServices })

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">My services</h1>
          <p className="mt-1 text-sm text-neutral-500">The services panel on the About page. Saved changes go live within a few seconds.</p>
        </div>
        <a href="/about#services" target="_blank" rel="noreferrer" className={BUTTON}>
          View live ↗
        </a>
      </div>

      <MessageBanner message={message} errors={errors} describePath={describePath} />

      <Section
        title="Services"
        description={`In the order the panel shows them, numbered from 01. Up to ${MAX_SERVICES} services with up to ${MAX_SKILLS} skills each - the panel is drawn for that many.`}
      >
        <RowList
          label="Services"
          addLabel="Add service"
          rows={state}
          max={MAX_SERVICES}
          onChange={(rows) => change(() => rows)}
          newRow={() => ({ title: "", skills: [] })}
          error={errorAt("")}
          render={(service, set, index) => (
            <>
              <TextInput
                label="Title"
                value={service.title}
                onChange={(title) => set({ ...service, title })}
                hint="Named for what someone would actually hire you for."
                error={errorAt(`${index}.title`)}
              />
              <LinesField
                label="Skills"
                rows={6}
                value={service.skills}
                onChange={(skills) => set({ ...service, skills })}
                hint={`One per line, up to ${MAX_SKILLS}. Only skills you’d stand behind.`}
                error={errorAt(`${index}.skills`)}
              />
            </>
          )}
        />
      </Section>

      <SaveBar saving={saving} onSave={saveNow} note={dirty ? "Unsaved changes" : "Saved · live"} label="Save and publish" />
    </div>
  )
}
