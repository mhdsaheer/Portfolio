import { z } from "zod"

/*
 * Field shapes every content schema shares: insights, case studies and work
 * files. Each accepts what a form sends - blanks for "not set" - and checks
 * what is stored.
 */

/** Treats a blank string or an empty list as "not set", the way a form sends it. */
export const blankToUndefined = (value: unknown) =>
  (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)
    ? undefined
    : value

export const text = z.string().trim().min(1, "Required")
export const optionalText = z.preprocess(blankToUndefined, text.optional())
export const textList = z.array(text)
export const optionalTextList = z.preprocess(blankToUndefined, textList.optional())

/** A lower-case, hyphenated id: a slug or an anchor. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const slug = z.string().trim().regex(SLUG_PATTERN, "Use lower-case letters, numbers and hyphens only")

/** A slug as typed in the admin, where /new is already the address of the blank form. */
export const editableSlug = slug.refine((value) => value !== "new", "“new” is reserved by the admin")

/** A file in /public ("/images/...") or an uploaded image ("https://res.cloudinary.com/..."). */
export const imageSrc = z.string().trim().regex(/^(\/|https:\/\/)/, "Must start with / or https://")

/** A web address a visitor can open: http or https only. */
export const optionalWebUrl = z.preprocess(blankToUndefined, z.httpUrl("Use a full address starting with https://").optional())

export const STATUSES = ["draft", "published"] as const
export type Status = (typeof STATUSES)[number]
