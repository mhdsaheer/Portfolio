import { SectionTitle } from "@/components/ui/section-title"
import type { HomePage } from "@/lib/page-content"

/** `content` is edited in the admin, under Pages → Home. */
export function About({ content }: { content: HomePage["about"] }) {
  return (
    <section id="about" className="py-20 border-border border-t-0 md:py-10 md:pb-32 md:pt-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div>
            <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
              {content.title}
            </SectionTitle>
            {content.paragraphs.map((paragraph, index) => (
              <p key={index} className={`${index === 0 ? "mt-6" : "mt-4"} text-muted-foreground leading-relaxed`}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right Content */}
          <div>
            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-secondary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-secondary rounded-2xl">
                  <div className="text-2xl md:text-3xl font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
