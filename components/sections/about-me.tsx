"use client"

import { Download } from "lucide-react"

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

/** Beat two: the facts and the resume. */
export function AboutFacts() {
  return (
    // The shadow carries legibility where the photograph is bright, so the
    // frame needs no heavy scrim behind it
    <div className="w-full" style={{ textShadow: "0 2px 18px rgba(8, 14, 22, 0.75)" }}>
      <dl>
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="grid grid-cols-[minmax(88px,7rem)_1fr] gap-4 py-3 xl:py-4 border-t border-white/25 last:border-b"
          >
            <dt className="text-[10px] xl:text-[11px] font-mono uppercase tracking-[0.18em] text-white/75 pt-0.5">
              {fact.label}
            </dt>
            <dd className="text-sm md:text-base font-medium text-white leading-snug">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <a
        href="/muhammed-saheer-resume.pdf"
        download="Muhammed-Saheer-Frontend-Developer-Resume.pdf"
        className="group inline-flex items-center gap-2.5 mt-8 xl:mt-10 px-6 py-3 text-sm font-medium rounded-full border border-white/35 bg-[#0a121c]/55 backdrop-blur-md transition-colors hover:bg-[#0a121c]/75 hover:border-white/55"
        style={{ color: "#c8e0f5" }}
      >
        Download Resume
        <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
      </a>
    </div>
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
