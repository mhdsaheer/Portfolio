"use client"

import { useEffect, useState } from "react"

import { TIME_ZONE } from "@/lib/contact"

/**
 * Rendered as zeroes on the server and started on mount, so the markup the
 * server sends matches the first client render.
 */
export function LocalTime() {
  const [time, setTime] = useState("00:00")

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const tick = () => setTime(format.format(new Date()))
    tick()

    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return <span className="tabular-nums">{time}</span>
}

/**
 * The date the letter is being written, in the same timezone as the clock.
 * Empty until mount for the same reason `LocalTime` starts at zeroes.
 */
export function LocalDate() {
  const [date, setDate] = useState("")

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    )
  }, [])

  return <span>{date}</span>
}
