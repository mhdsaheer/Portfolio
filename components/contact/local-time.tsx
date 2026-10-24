"use client"

import { useSyncExternalStore } from "react"

import { TIME_ZONE } from "@/lib/contact"

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
})

const today = () => format.format(new Date())

/** The date is read, not watched, so there is nothing to listen to. */
const subscribe = () => () => {}

/**
 * The date the letter is being written, in the site's own timezone. Empty on
 * the server and while hydrating, so the markup matches, then filled in.
 */
export function LocalDate() {
  const date = useSyncExternalStore(subscribe, today, () => "")

  return <span>{date}</span>
}
