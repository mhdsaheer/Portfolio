"use client"

import type React from "react"

import { Download } from "lucide-react"

import { cn } from "@/lib/utils"

const facts = [
  { label: "Currently", value: "Frontend Developer at Febno Technologies" },
  { label: "Based in", value: "Kerala, India" },
  { label: "Focus", value: "Fintech, Design Systems, Product UI" },
]

/** Beat one: who I am. */
export function AboutIntro() {
  return (
    <div className="w-full">
      {/* Display lede - the hero's sans/serif-italic pairing, one statement only */}
      <p className="font-sans font-semibold tracking-tight text-[1.75rem] lg:text-[2rem] xl:text-[2.5rem] leading-[1.12] text-white text-balance">
        I'm Muhammed Saheer, a frontend developer with{" "}
        <em
          className="font-serif italic font-normal text-[1.06em]"
          style={{ color: "#c8e0f5", textShadow: "0 0 40px rgba(200, 224, 245, 0.18)" }}
        >
          a designer's eye.
        </em>
      </p>

      {/* Supporting line, set the way the hero sets its sub-paragraph */}
      <p className="mt-5 max-w-[32rem] text-base xl:text-lg leading-relaxed text-white/65 text-pretty">
        I bridge the gap between how things look and how they work — turning Figma frames into fast, responsive web
        experiences.
      </p>
    </div>
  )
}

/**
 * Beat two: the facts and the resume.
 *
 * The rules are real elements rather than borders so they can draw themselves
 * in from the right, one after the next, when `active` turns true.
 */
export function AboutFacts({ active = true }: { active?: boolean }) {
  return (
    // The shadow carries legibility where the photograph is bright, so the
    // frame needs no heavy scrim behind it
    <div className="w-full" style={{ textShadow: "0 2px 18px rgba(8, 14, 22, 0.75)" }}>
      <dl>
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className="relative grid grid-cols-[minmax(88px,7rem)_1fr] gap-4 py-3 xl:py-4"
          >
            <Rule active={active} delay={index * 130} />

            <dt className="text-[10px] xl:text-[11px] font-mono uppercase tracking-[0.18em] text-white/75 pt-0.5">
              <Rise active={active} delay={index * 130 + 90}>
                {fact.label}
              </Rise>
            </dt>
            <dd className="text-sm md:text-base font-medium text-white leading-snug">
              <Rise active={active} delay={index * 130 + 150}>
                {fact.value}
              </Rise>
            </dd>

            {index === facts.length - 1 && <Rule active={active} delay={facts.length * 130} atBottom />}
          </div>
        ))}
      </dl>

      <a
        href="/muhammed-saheer-resume.pdf"
        download="Muhammed-Saheer-Frontend-Developer-Resume.pdf"
        className={cn(
          "group inline-flex items-center gap-2.5 mt-8 xl:mt-10 px-6 py-3 text-sm font-medium rounded-full border border-white/35 bg-[#0a121c]/55 backdrop-blur-md",
          "transition-[background-color,border-color,opacity,transform] duration-[800ms] ease-out hover:bg-[#0a121c]/75 hover:border-white/55",
          "motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100",
          active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        style={{ color: "#c8e0f5", transitionDelay: `${facts.length * 130 + 180}ms` }}
      >
        Download Resume
        <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
      </a>
    </div>
  )
}

/**
 * Text rising into place behind a mask. The inner padding plus the matching
 * negative margin on the mask keep descenders from being clipped at rest
 * without changing the line's layout.
 */
function Rise({ active, delay, children }: { active: boolean; delay: number; children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden -mb-[0.18em]">
      <span
        className={cn(
          "block pb-[0.18em] transition-transform duration-[800ms] ease-out",
          "motion-reduce:transition-none motion-reduce:translate-y-0",
          active ? "translate-y-0" : "translate-y-[110%]",
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  )
}

/** A hairline that draws itself from the right edge toward the left. */
function Rule({ active, delay, atBottom = false }: { active: boolean; delay: number; atBottom?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-0 h-px bg-white/25 origin-right transition-transform duration-[900ms] ease-out",
        "motion-reduce:transition-none motion-reduce:scale-x-100",
        atBottom ? "bottom-0" : "top-0",
        active ? "scale-x-100" : "scale-x-0",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    />
  )
}

/** Both beats stacked, for viewports too narrow to pin the photograph. */
export function AboutMe() {
  return (
    <section id="about-me" className="lg:hidden py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="max-w-[42rem]">
          <AboutIntro />
          <div className="mt-8">
            <AboutFacts />
          </div>
        </div>
      </div>
    </section>
  )
}
