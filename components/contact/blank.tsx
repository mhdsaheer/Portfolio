"use client"

import { useState } from "react"

/**
 * The colours a blank takes from whichever letter it sits in - ink on paper in
 * one design, accent on the dark mesh in the other.
 */
export type BlankTone = {
  /** Typed answers. */
  text: string
  /** The prompt standing in for an answer not yet given. */
  placeholder: string
  /** The underline at rest, and once the field holds focus. */
  rule: string
  ruleFocus: string
  /** Laid behind the field while it has focus, like a highlighter pass. */
  wash: string
  /** The underline when an answer is present but malformed. */
  invalid?: string
}

/** Readable on both the cream stock and the page's blue ground. */
const INVALID_FALLBACK = "#b3261e"

/**
 * A blank in a sentence: a real input whose label is the prose around it.
 *
 * The field widens with what is typed - a hidden twin holds the same text and
 * sets the width, and the input is laid over it. `maxCh` caps how far a long
 * answer may push the sentence apart; past that the field scrolls instead.
 *
 * The placeholder colour travels as a custom property because `::placeholder`
 * cannot be reached from an inline style.
 */
export function Blank({
  name,
  label,
  placeholder,
  value,
  onChange,
  tone,
  type = "text",
  required = false,
  autoComplete,
  maxCh = 20,
  face = "",
  italicPlaceholder = true,
  underlineWidth = 1,
  invalid = false,
  onFocusChange,
}: {
  name: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  tone: BlankTone
  type?: "text" | "email" | "tel"
  required?: boolean
  autoComplete?: string
  maxCh?: number
  /** Extra type classes, e.g. the serif italic a signature is signed in. */
  face?: string
  italicPlaceholder?: boolean
  underlineWidth?: number
  /** The answer is there but cannot be used - shown, not just blocked. */
  invalid?: boolean
  onFocusChange?: (focused: boolean) => void
}) {
  const id = `letter-${name}`
  const [focused, setFocused] = useState(false)
  const isEmpty = value.length === 0
  const rule = invalid ? tone.invalid ?? INVALID_FALLBACK : focused ? tone.ruleFocus : tone.rule

  const setFocus = (next: boolean) => {
    setFocused(next)
    onFocusChange?.(next)
  }

  return (
    <span
      className={`relative inline-flex min-w-0 items-baseline pb-1 transition-colors ${face}`}
      style={{
        // Solid means the letter needs it; dashed means it can be left blank.
        borderBottomStyle: required ? "solid" : "dashed",
        borderBottomWidth: `${underlineWidth}px`,
        borderBottomColor: rule,
        backgroundColor: focused ? tone.wash : "transparent",
        // The cap is there to stop a long ANSWER pushing the sentence apart. A
        // placeholder is authored text and must never be clipped, so it only
        // applies once something has been typed.
        maxWidth: isEmpty ? undefined : `${maxCh}ch`,
        ["--blank-placeholder" as string]: tone.placeholder,
      }}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      {/* Sets the width. Italic while it stands in for the placeholder, which
          is the wider of the two faces, so the input is never cramped. */}
      <span
        aria-hidden
        className={`invisible whitespace-pre px-1 ${isEmpty && italicPlaceholder ? "italic" : ""}`}
      >
        {isEmpty ? placeholder : value}
      </span>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        autoComplete={autoComplete}
        className={`absolute bottom-1 left-0 right-0 top-0 w-full bg-transparent px-1 outline-none placeholder:text-[color:var(--blank-placeholder)] ${face} ${
          italicPlaceholder ? "placeholder:italic" : ""
        }`}
        style={{ color: tone.text }}
      />
    </span>
  )
}
