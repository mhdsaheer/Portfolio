import { Reveal } from "@/components/case-study/reveal"
import { AccentStar } from "@/components/about/accent-star"

const steps = [
  {
    number: "01",
    title: "Concept to pixel-perfect design",
    body: "The design and the build are the same job done twice if they are handed between two people. Doing both means the translation never loses a corner radius, a spacing rhythm or an interaction state along the way.",
  },
  {
    number: "02",
    title: "Built to scale",
    body: "Everything gets assembled from modular, reusable pieces. Adding the next page, the next locale or the next data source is an afternoon rather than a rewrite — and maintenance stays something your team can do without me.",
  },
  {
    number: "03",
    title: "Motion with meaning",
    body: "Framer Motion carries the movement, but nothing animates for the sake of it. Scroll-triggers orient you, transitions explain what changed, and every one of them still respects prefers-reduced-motion.",
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
                style={{ color: "#c8e0f5" }}
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
                  style={{ color: "#c8e0f5", textShadow: "0 0 40px rgba(200, 224, 245, 0.18)" }}
                >
                  live experience
                </em>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">
                Three habits that decide whether a project ships on time and still feels good a year later.
              </p>
            </Reveal>
          </div>

          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <Reveal key={step.number} as="li" delay={index * 80} className="border-t border-border py-9 md:py-12 last:border-b">
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span
                    className="text-sm md:text-base font-mono tracking-tight shrink-0"
                    style={{ color: "#c8e0f5" }}
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
