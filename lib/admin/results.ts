import type { z } from "zod"

/*
 * What a save action reports back to its editor. Plain types and a pure
 * helper, so both the server actions and the editors in the browser use them.
 */

/** Field errors keyed by path, e.g. "document.body.3.type" or "slug". */
export type FieldErrors = Record<string, string>

export type SaveResult =
  | { ok: true; slug: string; savedAt: string }
  | { ok: false; message: string; fieldErrors: FieldErrors }

export function errorsOf(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    errors[issue.path.join(".")] ??= issue.message
  }
  return errors
}

export const failed = (message: string, fieldErrors: FieldErrors = {}): SaveResult => ({ ok: false, message, fieldErrors })
