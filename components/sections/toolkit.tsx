/**
 * The stack, as a continuous band. Named tools only - skills like "Responsive
 * Design" belong with the services on the About page, not in a row of logos.
 */
const toolkit = [
  "React",
  "Next.js",
  "JavaScript",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Bootstrap",
  "Node.js",
  "Express",
  "MongoDB",
  "Strapi",
  "Moodle",
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "InDesign",
  "Canva",
  "Git",
  "GitHub",
  "GitLab",
  "VS Code",
  "Notion",
]

/**
 * The track holds two copies so translating it -50% loops seamlessly. Duration
 * scales with the list so the band keeps a steady pace as entries are added or
 * removed - a fixed duration would speed up every time the strip grew.
 */
const SECONDS_PER_ITEM = 3

export function Toolkit() {
  return (
    <section aria-label="Tools and technologies" className="py-16 border-border overflow-hidden md:py-10 border-t-[0]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 mb-8">
        <p className="text-sm text-muted-foreground text-center">What I work with</p>
      </div>

      <div className="relative">
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDuration: `${toolkit.length * SECONDS_PER_ITEM}s` }}
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
              {toolkit.map((tool) => (
                <li key={tool} className="flex items-center justify-center min-w-[200px] px-8">
                  <span className="text-2xl md:text-3xl font-semibold text-muted-foreground/50 whitespace-nowrap">
                    {tool}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
