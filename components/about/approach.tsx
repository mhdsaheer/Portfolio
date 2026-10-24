import { Reveal } from "@/components/case-study/reveal"
import { AccentStar } from "@/components/about/accent-star"
import { ACCENT, ACCENT_GLOW } from "@/components/about/tokens"

const steps = [
  {
    number: "01",
    title: "Plan the sprint",
    body: "Every project starts as a backlog of user stories, prioritised with the team. Sprint planning turns the top of that list into a clear, achievable goal, so everyone knows what “done” looks like before a single frame is drawn.",
  },
  {
    number: "02",
    title: "Design and build in short cycles",
    body: "Design and development happen in the same sprint, not in separate phases. Daily stand-ups keep blockers small, and each sprint ends with a working, responsive increment rather than a mockup waiting on a handoff.",
  },
  {
    number: "03",
    title: "Review, then refine",
    body: "Sprint reviews put real, clickable work in front of stakeholders early, and retrospectives sharpen how we work next time. Feedback lands while it is still cheap to act on, so the final product reflects what people actually need.",
  },
]

export function Approach() {
  return (
    <section id="approach" className="py-16 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
          {/* The heading holds its place while the three steps scroll past it. */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <span
                className="inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                <AccentStar className="w-3 h-3" />
                Approach
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
                From idea to a{" "}
                <em
                  className="font-serif italic font-normal text-[1.06em]"
                  style={{ color: ACCENT, textShadow: ACCENT_GLOW }}
                >
                  live experience
                </em>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">
                I work in Agile sprints using Scrum: short cycles, visible progress, and room to change course without starting over.
              </p>
            </Reveal>
          </div>

          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <Reveal key={step.number} as="li" delay={index * 80} className="border-t border-border py-9 md:py-12 last:border-b">
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span
                    className="text-sm md:text-base font-mono tracking-tight shrink-0"
                    style={{ color: ACCENT }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-balance">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
