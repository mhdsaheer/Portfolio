"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { Lines } from "@/components/about/lines"
import { ACCENT, FLUID, INK, SURFACE } from "@/components/about/tokens"

const PLACE = "Kerala, India"
const TIME_ZONE = "Asia/Kolkata"

export function AboutHero() {
  const frameRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // The photograph drifts a quarter of the frame's height over the hero's own
  // scroll - it is 120% tall and bottom-aligned, so the overshoot covers the move
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])

  return (
    <section className="relative" style={{ backgroundColor: SURFACE, fontSize: FLUID }}>
      <div
        ref={frameRef}
        className="relative flex h-[100svh] max-h-[100dvh] items-end justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end"
          style={reduceMotion ? undefined : { y }}
        >
          <div className="relative h-[120%] w-full">
            <Image
              src="/images/designer.png"
              alt="Muhammed Saheer at work"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Carries the title and the clock wherever the photograph runs bright */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(10,18,28,0.75) 0%, rgba(10,18,28,0.25) 28%, rgba(10,18,28,0) 55%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-start justify-end gap-[3em] px-[2.5em]">
          <h1
            className="text-[4em] font-medium italic leading-none tracking-[-0.03em]"
            style={{ color: INK }}
          >
            <Lines mode="load" lines={["About"]} />
          </h1>

          <div className="relative flex w-full flex-col items-end gap-[0.15em] pb-[2em]">
            <Clock />
            <div
              className="text-[0.875em] font-medium italic uppercase leading-[135%]"
              style={{ color: ACCENT }}
            >
              {PLACE}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Local time where the work happens. Server-rendered as zeroes and started on
 * mount, so the markup the server sends and the first client render agree.
 */
function Clock() {
  const [time, setTime] = useState("00:00:00")

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    const tick = () => setTime(format.format(new Date()))
    tick()

    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className="text-[0.875em] font-medium italic uppercase leading-[135%] tabular-nums"
      style={{ color: ACCENT }}
    >
      {time}
    </div>
  )
}
