"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion"

import { AboutFacts, AboutIntro } from "@/components/sections/about-me"

/**
 * The photograph pins to the viewport while two beats arrive in sequence:
 * the intro on the dark left edge, then the facts over the lower right.
 */
export function AboutPhotoPin() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Beat one - intro. Arrives, holds, then clears out as beat two takes over.
  // [in-start, in-end, out-start, out-end]
  const INTRO = [0.04, 0.16, 0.42, 0.58]
  const introOpacity = useTransform(scrollYProgress, INTRO, [0, 1, 1, 0])
  const introY = useTransform(scrollYProgress, INTRO, [32, 0, 0, -28])
  const introBlurValue = useTransform(scrollYProgress, INTRO, [10, 0, 0, 8])
  const introBlur = useMotionTemplate`blur(${introBlurValue}px)`

  // Beat two - facts and resume. Arrives as the intro leaves and holds to the end.
  const FACTS = [0.52, 0.66]
  const factsOpacity = useTransform(scrollYProgress, FACTS, [0, 1])
  const factsY = useTransform(scrollYProgress, FACTS, [32, 0])
  const factsBlurValue = useTransform(scrollYProgress, FACTS, [10, 0])
  const factsBlur = useMotionTemplate`blur(${factsBlurValue}px)`

  // The rules draw themselves in just as the block starts to arrive
  const [factsIn, setFactsIn] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value > FACTS[0] + 0.015
    setFactsIn((current) => (current === next ? current : next))
  })

  // Nothing is clickable until it has actually arrived
  const factsPointer = useTransform(factsOpacity, (value) => (value > 0.6 ? "auto" : "none"))

  // Scrim only darkens the right of the frame once the facts need it
  const rightScrimOpacity = useTransform(scrollYProgress, [0.48, 0.66], [0, 1])

  // Slow settle on the photograph across the whole pin
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1])

  // Entry and exit - while either edge of the section crosses the screen, the frame glides at
  // three-quarter speed. On the way in it starts a quarter of its height behind and catches up
  // by the time the pin takes over; on the way out it falls a quarter behind again, so the
  // section edges sweep across the photo instead of it scrolling 1:1
  const { scrollYProgress: entryProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  })
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  })
  const frameY = useTransform([entryProgress, exitProgress], ([entry, exit]: number[]) => `${(entry - 1 + exit) * 25}%`)

  const introStyle = reduceMotion ? undefined : { opacity: introOpacity, y: introY, filter: introBlur }
  const factsStyle = reduceMotion
    ? undefined
    : { opacity: factsOpacity, y: factsY, filter: factsBlur, pointerEvents: factsPointer }

  // overflow-clip, not hidden - it trims the lagging frame at both section edges without breaking sticky
  return (
    <section ref={sectionRef} className="hidden lg:block relative h-[360vh] mt-20 xl:mt-28 overflow-clip" aria-label="About Muhammed Saheer">
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={reduceMotion ? undefined : { y: frameY }}
      >
        {/* Photograph */}
        <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { scale: imageScale }}>
            <Image
              src="/images/designer.png"
              alt="Designer workspace"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
        </motion.div>

        {/* Left scrim - always there, the photograph is already dark on that side */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[62%]"
          style={{
            background: "linear-gradient(90deg, rgba(10,18,28,0.9) 0%, rgba(10,18,28,0.74) 45%, rgba(10,18,28,0) 100%)",
          }}
        />

        {/* Right scrim - arrives with the facts */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: reduceMotion ? 1 : rightScrimOpacity,
            background:
              "radial-gradient(70% 60% at 82% 76%, rgba(10,18,28,0.88) 0%, rgba(10,18,28,0.15) 45%, rgba(10,18,28,0) 100%)",
          }}
        />

        {/* Content plane, aligned to the same grid as the rest of the page */}
        <div className="relative h-full max-w-[1280px] mx-auto px-6 md:px-12">
          {/* Beat one, top left */}
          <motion.div
            className="absolute left-6 md:left-12 top-[14vh] w-full max-w-[32rem] xl:max-w-[38rem] pointer-events-none"
            style={introStyle}
          >
            <AboutIntro />
          </motion.div>

          {/* Beat two, lower right */}
          <motion.div
            className="absolute right-6 md:right-12 bottom-[12vh] w-full max-w-[26rem] xl:max-w-[30rem]"
            style={factsStyle}
          >
            <AboutFacts active={reduceMotion ? true : factsIn} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
