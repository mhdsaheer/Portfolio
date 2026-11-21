"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react"

import type { FieldErrors, SaveResult } from "@/lib/admin/results"
import { slugify } from "@/lib/insight-content"
import { STATUSES, type Status } from "@/lib/schema-fields"
import { SelectField, TextInput } from "@/components/admin/fields"
import { BUTTON, BUTTON_DANGER, BUTTON_PRIMARY, CARD } from "@/components/admin/styles"

/*
 * What every editor shares - insights, case studies, work files and the
 * site settings: the save flow and its messages, Ctrl+S, the unsaved-changes
 * warning and the save bar; for items with a slug, also the slug and status
 * fields and the delete section. Each editor brings its own fields.
 */

/** The part of an item editor's state the shell relies on. */
export type EditorBase = {
  /** The slug the item was loaded with; null until a new one is first saved. */
  originalSlug: string | null
  slug: string
  status: Status
}

export type Message = { tone: "error" | "success"; text: string }
type Saved = Extract<SaveResult, { ok: true }>

/**
 * Holds what is being edited and saves it: errors back from the server, the
 * confirmation, Ctrl+S and the warning before leaving with unsaved changes.
 */
export function useSaveFlow<S>({
  initial,
  save,
  onSaved,
}: {
  initial: S
  save: (state: S) => Promise<SaveResult>
  /** After a successful save, with the state that was saved. */
  onSaved?: (result: Saved, saved: S, setState: (update: (current: S) => S) => void) => void
}) {
  const router = useRouter()
  const [state, setState] = useState(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState<Message>()
  const [dirty, setDirty] = useState(false)
  const [saving, startSaving] = useTransition()

  /** Every edit goes through here, so the unsaved-changes warning knows about it. */
  const change = useCallback((update: (current: S) => S) => {
    setState(update)
    setDirty(true)
  }, [])

  const saveNow = useCallback(() => {
    startSaving(async () => {
      setMessage(undefined)
      const result = await save(state)

      if (!result.ok) {
        setErrors(result.fieldErrors)
        setMessage({ tone: "error", text: result.message })
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }

      setErrors({})
      setDirty(false)
      setMessage({ tone: "success", text: `Saved at ${new Date(result.savedAt).toLocaleTimeString()}.` })
      onSaved?.(result, state, setState)
      router.refresh()
    })
  }, [state, save, onSaved, router])

  // Ctrl/Cmd + S saves, as in any editor
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault()
        if (!saving) saveNow()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [saveNow, saving])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return
    const onLeave = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", onLeave)
    return () => window.removeEventListener("beforeunload", onLeave)
  }, [dirty])

  return {
    state,
    change,
    errors,
    errorAt: (path: string) => errors[path],
    message,
    saving,
    dirty,
    setDirty,
    saveNow,
  }
}

/** The save flow for an item with a slug and a status: an insight, a case study, a work file. */
export function useEditor<S extends EditorBase>({
  initial,
  save,
  basePath,
}: {
  initial: S
  save: (state: S) => Promise<SaveResult>
  /** Where this kind of item is edited, e.g. "/admin/insights". */
  basePath: string
}) {
  const router = useRouter()
  // The status as last saved: whether there is a live page, and whether its address is fixed
  const [savedStatus, setSavedStatus] = useState(initial.status)

  const onSaved = useCallback(
    (result: Saved, saved: S, setState: (update: (current: S) => S) => void) => {
      setSavedStatus(saved.status)
      // A new item, or a renamed draft, now lives at its own address
      if (saved.originalSlug !== result.slug) {
        setState((current) => ({ ...current, originalSlug: result.slug }))
        router.replace(`${basePath}/${result.slug}`)
      }
    },
    [basePath, router],
  )

  const flow = useSaveFlow({ initial, save, onSaved })

  return {
    ...flow,
    savedStatus,
    isNew: flow.state.originalSlug === null,
    /** A published item's address is already shared and indexed, so its slug stays put. */
    slugLocked: flow.state.originalSlug !== null && savedStatus === "published",
  }
}

export type Editor<S extends EditorBase> = ReturnType<typeof useEditor<S>>

export function Section({ title, description, children, action }: { title: string; description?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <section className={`${CARD} space-y-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

/**
 * A new item's slug follows its title until the slug is typed by hand.
 * `titled(title)` gives the state change for a new title; `typed()` marks the
 * slug as the author's own.
 */
export function useSlugFromTitle(isNew: boolean) {
  const typedByHand = useRef(!isNew)
  return {
    typed: () => {
      typedByHand.current = true
    },
    slugFor: (title: string, current: string) => (typedByHand.current ? current : slugify(title)),
  }
}

/** The slug and status fields every editor has. */
export function SlugAndStatus<S extends EditorBase>({
  editor,
  onSlugTyped,
  lockedHint,
  addressPrefix,
  canLock = true,
}: {
  editor: Editor<S>
  onSlugTyped: () => void
  lockedHint: string
  /** Where the slug shows up, e.g. "/insights/". Leave out where it isn't an address. */
  addressPrefix?: string
  /** Whether publishing fixes the slug - only where it is a public address. */
  canLock?: boolean
}) {
  const { state, change, errorAt, slugLocked } = editor
  const locked = canLock && slugLocked
  return (
    <>
      <TextInput
        label="Slug"
        value={state.slug}
        disabled={locked}
        onChange={(slug) => {
          onSlugTyped()
          change((current) => ({ ...current, slug }))
        }}
        hint={locked ? lockedHint : addressPrefix ? `The address: ${addressPrefix}${state.slug || "…"}` : "A short id, lower-case with hyphens."}
        error={errorAt("slug")}
      />
      <SelectField
        label="Status"
        value={state.status}
        options={STATUSES.map((status) => ({ value: status, label: status === "published" ? "Published (live)" : "Draft (hidden)" }))}
        onChange={(status) => change((current) => ({ ...current, status }))}
      />
    </>
  )
}

export function EditorFrame<S extends EditorBase>({
  editor,
  title,
  back,
  liveHref,
  describePath,
  onDelete,
  noun,
  children,
}: {
  editor: Editor<S>
  title: string
  back: { href: string; label: string }
  /** The page on the site, shown once the item is published. */
  liveHref?: string
  /** Names an error's field for the summary at the top. */
  describePath: (path: string) => string
  onDelete?: (slug: string) => Promise<void>
  /** "article", "case study", "work file" - for the delete section. */
  noun: string
  children: ReactNode
}) {
  const { state, message, errors, saving, dirty, setDirty, saveNow, isNew, savedStatus } = editor
  const [deleting, startDeleting] = useTransition()

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={back.href} className="text-sm text-neutral-500 hover:text-neutral-900">
            ← {back.label}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{title}</h1>
        </div>
        {!isNew && liveHref && savedStatus === "published" && (
          <a href={liveHref} target="_blank" rel="noreferrer" className={BUTTON}>
            View live ↗
          </a>
        )}
      </div>

      <MessageBanner message={message} errors={errors} describePath={describePath} />

      {children}

      {!isNew && onDelete && (
        <Section title="Delete">
          <p className="text-sm text-neutral-600">Removes the {noun} from the site and the database. This can’t be undone.</p>
          <button
            type="button"
            className={BUTTON_DANGER}
            disabled={deleting}
            onClick={() => {
              if (!confirm(`Delete “${title}” for good?`)) return
              setDirty(false)
              startDeleting(() => onDelete(state.originalSlug!))
            }}
          >
            {deleting ? "Deleting…" : `Delete this ${noun}`}
          </button>
        </Section>
      )}

      <SaveBar
        saving={saving}
        onSave={saveNow}
        note={dirty ? "Unsaved changes" : state.status === "published" ? "Saved · live" : "Saved · draft"}
        label={state.status === "published" ? "Save and publish" : "Save draft"}
      />
    </div>
  )
}

/** The save result: a confirmation, or what went wrong and where. */
export function MessageBanner({
  message,
  errors,
  describePath,
}: {
  message?: Message
  errors: FieldErrors
  describePath: (path: string) => string
}) {
  if (!message) return null
  const listed = Object.entries(errors)
  return (
    <div
      role={message.tone === "error" ? "alert" : "status"}
      className={`rounded-md px-4 py-3 text-sm ${message.tone === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
    >
      <p className="font-medium">{message.text}</p>
      {message.tone === "error" && listed.length > 0 && (
        <ul className="mt-2 list-disc space-y-0.5 pl-5">
          {listed.slice(0, 12).map(([path, text]) => (
            <li key={path}>
              <span className="font-medium">{describePath(path)}:</span> {text}
            </li>
          ))}
          {listed.length > 12 && <li>…and {listed.length - 12} more, marked below.</li>}
        </ul>
      )}
    </div>
  )
}

/** Pinned to the foot of the window, so saving is always one click away. */
export function SaveBar({ saving, onSave, note, label }: { saving: boolean; onSave: () => void; note: string; label: string }) {
  return (
    <div className="safe-x safe-b fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <span className="text-sm text-neutral-500">{note}</span>
        <button type="button" className={BUTTON_PRIMARY} disabled={saving} onClick={onSave}>
          {saving ? "Saving…" : label}
        </button>
      </div>
    </div>
  )
}

/** Names the usual top-level fields; anything inside a list shows its position. */
export function pathDescriber(names: Record<string, string>, lists: Record<string, string> = {}) {
  return (path: string) => {
    if (names[path]) return names[path]
    for (const [prefix, label] of Object.entries(lists)) {
      const match = path.match(new RegExp(`^${prefix.replace(/\./g, "\\.")}\\.(\\d+)`))
      if (match) return `${label} ${Number(match[1]) + 1}`
    }
    return path.replace(/^document\./, "")
  }
}
