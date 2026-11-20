/*
 * The admin's few styles, kept together so every form looks the same. A plain
 * module, not a client one, so server pages can read the strings too.
 */
export const INPUT =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
export const BUTTON =
  "inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
export const BUTTON_PRIMARY =
  "inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
export const BUTTON_DANGER =
  "inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
export const CARD = "rounded-lg border border-neutral-200 bg-white p-5"

export const INLINE_SYNTAX_HINT = "**bold**, *italic*, `code`, [link text](/path or https://…)"
