"use client"

import { useId, useState, type ReactNode } from "react"

import { signCloudinaryUpload, type UploadFolder } from "@/app/admin/actions"
import { BUTTON, BUTTON_DANGER, INLINE_SYNTAX_HINT, INPUT } from "@/components/admin/styles"

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string
  hint?: ReactNode
  error?: string
  children: ReactNode
  htmlFor?: string
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

type TextProps = {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: ReactNode
  error?: string
  placeholder?: string
  disabled?: boolean
  /** Shows a character count against a recommended maximum. */
  maxHint?: number
}

function Count({ value, max }: { value: string; max: number }) {
  return (
    <span className={value.length > max ? "text-amber-700" : undefined}>
      {value.length}/{max} characters
    </span>
  )
}

export function TextInput({ label, value, onChange, hint, error, placeholder, disabled, maxHint }: TextProps) {
  const id = useId()
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      hint={maxHint ? <>{hint} <Count value={value} max={maxHint} /></> : hint}
    >
      <input
        id={id}
        className={INPUT}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  rows = 3,
  mono,
  maxHint,
}: TextProps & { rows?: number; mono?: boolean }) {
  const id = useId()
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      hint={maxHint ? <>{hint} <Count value={value} max={maxHint} /></> : hint}
    >
      <textarea
        id={id}
        rows={rows}
        className={`${INPUT} ${mono ? "font-mono text-[13px] leading-relaxed" : ""}`}
        value={value}
        placeholder={placeholder}
        spellCheck={!mono}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((item, index) => item === b[index])

/**
 * A list edited as text. The text being typed is kept as typed - a new empty
 * line, a trailing space - and only replaced when the list changes from
 * outside, such as a block being moved.
 */
function ListText({
  label,
  value,
  onChange,
  hint,
  error,
  rows,
  split,
  join,
  placeholder,
}: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  hint?: ReactNode
  error?: string
  rows: number
  split: (text: string) => string[]
  join: (items: string[]) => string
  placeholder?: string
}) {
  const id = useId()
  const [text, setText] = useState(() => join(value))
  const shown = sameList(split(text), value) ? text : join(value)

  return (
    <Field label={label} htmlFor={id} hint={hint} error={error}>
      <textarea
        id={id}
        rows={rows}
        className={INPUT}
        value={shown}
        placeholder={placeholder}
        onChange={(event) => {
          setText(event.target.value)
          onChange(split(event.target.value))
        }}
      />
    </Field>
  )
}

/** One item per line. */
export function LinesField(props: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  hint?: ReactNode
  error?: string
  rows?: number
  placeholder?: string
}) {
  return (
    <ListText
      {...props}
      rows={props.rows ?? 4}
      hint={props.hint ?? "One per line."}
      split={(text) =>
        text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      }
      join={(items) => items.join("\n")}
    />
  )
}

/** Paragraphs separated by a blank line. */
export function ParagraphsField(props: {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  hint?: ReactNode
  error?: string
  rows?: number
}) {
  return (
    <ListText
      {...props}
      rows={props.rows ?? 6}
      hint={props.hint ?? <>Leave a blank line between paragraphs. {INLINE_SYNTAX_HINT}</>}
      split={(text) =>
        text
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
      }
      join={(items) => items.join("\n\n")}
    />
  )
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
  error,
}: {
  label: string
  value: T
  options: readonly T[] | { value: T; label: string }[]
  onChange: (value: T) => void
  hint?: ReactNode
  error?: string
}) {
  const id = useId()
  const items = options.map((option) => (typeof option === "string" ? { value: option, label: option } : option))
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error}>
      <select id={id} className={INPUT} value={value} onChange={(event) => onChange(event.target.value as T)}>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function NumberInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  error?: string
}) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} error={error}>
      <input
        id={id}
        type="number"
        min={1}
        className={INPUT}
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(event.target.valueAsNumber)}
      />
    </Field>
  )
}

/**
 * Repeating rows - cards, FAQ entries, references. Each row is rendered by
 * the caller; this adds the move and remove buttons and the add button.
 */
export function RowList<T>({
  label,
  rows,
  onChange,
  newRow,
  render,
  addLabel = "Add row",
  error,
  max,
}: {
  label: string
  rows: T[]
  onChange: (rows: T[]) => void
  newRow: () => T
  render: (row: T, update: (row: T) => void, index: number) => ReactNode
  addLabel?: string
  error?: string
  /** The most rows allowed; the add button turns off at it. */
  max?: number
}) {
  const full = max !== undefined && rows.length >= max
  const move = (from: number, to: number) => {
    const next = [...rows]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)
    onChange(next)
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-neutral-800">{label}</legend>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {rows.map((row, index) => (
        <div key={index} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-neutral-500">
            <span>#{index + 1}</span>
            <span className="flex gap-1">
              <button type="button" className={BUTTON} disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                className={BUTTON}
                disabled={index === rows.length - 1}
                onClick={() => move(index, index + 1)}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className={BUTTON_DANGER}
                onClick={() => onChange(rows.filter((_, other) => other !== index))}
                aria-label="Remove"
              >
                ✕
              </button>
            </span>
          </div>
          <div className="space-y-3">
            {render(row, (updated) => onChange(rows.map((other, at) => (at === index ? updated : other))), index)}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="button" className={BUTTON} disabled={full} onClick={() => onChange([...rows, newRow()])}>
          + {addLabel}
        </button>
        {full && <span className="text-xs text-neutral-500">That’s the most there’s room for ({max}).</span>}
      </div>
    </fieldset>
  )
}

/** Ticks against a fixed set, keeping the order in which they were ticked. */
export function PickList({
  label,
  options,
  value,
  onChange,
  hint,
  error,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  hint?: ReactNode
  error?: string
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-neutral-800">{label}</legend>
      {options.length === 0 && <p className="text-xs text-neutral-500">Nothing to pick from yet.</p>}
      <div className="grid gap-1 sm:grid-cols-2">
        {options.map((option) => {
          const position = value.indexOf(option.value)
          return (
            <label key={option.value} className="flex items-start gap-2 text-sm text-neutral-800">
              <input
                type="checkbox"
                className="mt-1"
                checked={position !== -1}
                onChange={(event) =>
                  onChange(
                    event.target.checked ? [...value, option.value] : value.filter((item) => item !== option.value),
                  )
                }
              />
              <span>
                {position !== -1 && <span className="mr-1 font-mono text-xs text-neutral-500">{position + 1}.</span>}
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </fieldset>
  )
}

const HEX = /^#[0-9a-f]{6}$/i

/** A hex colour, typed or picked, with a swatch of what it is. */
export function ColorField({
  label,
  value,
  onChange,
  error,
  optional,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  optional?: boolean
}) {
  const id = useId()
  const valid = HEX.test(value)
  return (
    <Field label={label} htmlFor={id} error={error} hint={optional ? "Optional." : undefined}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`Pick ${label.toLowerCase()}`}
          className="h-9 w-10 shrink-0 cursor-pointer rounded border border-neutral-300 bg-white p-0.5"
          value={valid ? value.toLowerCase() : "#000000"}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          id={id}
          className={`${INPUT} font-mono`}
          value={value}
          placeholder={optional ? "—" : "#000000"}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </Field>
  )
}

export type UploadedImage = { src: string; width: number; height: number }

/**
 * Sends an image straight from the browser to Cloudinary, with a signature
 * from the server that only a logged-in admin can get.
 */
async function uploadToCloudinary(file: File, folder: UploadFolder): Promise<UploadedImage> {
  const signed = await signCloudinaryUpload(folder)

  const form = new FormData()
  form.append("file", file)
  form.append("api_key", signed.apiKey)
  form.append("timestamp", String(signed.timestamp))
  form.append("folder", signed.folder)
  form.append("signature", signed.signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result?.error?.message ?? `Upload failed (${response.status})`)

  return { src: result.secure_url, width: result.width, height: result.height }
}

/**
 * An image's address, with an upload button that fills it in. A path to a
 * file in /public can still be typed by hand.
 */
export function ImageField({
  label,
  src,
  onChange,
  folder,
  error,
  hint,
}: {
  label: string
  src: string
  onChange: (image: UploadedImage | { src: string }) => void
  /** Which Cloudinary folder an upload lands in. */
  folder: UploadFolder
  error?: string
  hint?: ReactNode
}) {
  const id = useId()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>()

  async function upload(file: File) {
    setUploading(true)
    setUploadError(undefined)
    try {
      onChange(await uploadToCloudinary(file, folder))
    } catch (failure) {
      setUploadError(failure instanceof Error ? failure.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label={label} htmlFor={id} error={uploadError ?? error} hint={hint}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="h-24 w-40 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
          {src && (
            // A plain img: previews must work for any address, before next.config knows about it
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            id={id}
            className={INPUT}
            value={src}
            placeholder="Upload an image, or type /images/…"
            onChange={(event) => onChange({ src: event.target.value })}
          />
          <label className={`${BUTTON} cursor-pointer ${uploading ? "pointer-events-none opacity-50" : ""}`}>
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ""
                if (file) upload(file)
              }}
            />
          </label>
        </div>
      </div>
    </Field>
  )
}
