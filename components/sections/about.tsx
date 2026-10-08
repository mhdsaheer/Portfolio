"use client"

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Strapi CMS",
  "WordPress",
  "Figma",
  "Adobe Illustrator",
  "Design Systems",
  "Responsive Design",
]

const stats = [
  { value: "15+", label: "Projects Shipped" },
  { value: "2+", label: "Years in Development" },
  { value: "6+", label: "Years Designing" },
]

import { SectionTitle } from "@/components/ui/section-title"

export function About() {
  return (
    <section id="about" className="py-20 border-border border-t-0 md:py-10 md:pb-32 md:pt-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div>
            <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
              Where Thoughtful Design Meets Working Code
            </SectionTitle>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              I'm a frontend developer with a degree in multimedia from the University of Calicut.
              That background shapes how I build: I care about spacing, type, and motion as much as clean,
              maintainable React.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Day to day, I work across UI/UX and frontend, taking designs from Figma to responsive, production-ready
              interfaces. I'm also at home on the backend with Node.js and Strapi, so I can wire up the APIs and CMS
              behind what I build.
            </p>
          </div>

          {/* Right Content */}
          <div>
            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
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
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary rounded-2xl">
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
