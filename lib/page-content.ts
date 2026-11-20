import { z } from "zod"

import { text } from "@/lib/schema-fields"

/*
 * The words on the site's own pages - headings, introductions, lists - edited
 * in the admin under Pages. Each page is one row in the `settings` table,
 * checked by its schema here when it is saved and when it is read.
 *
 * Until a page is saved for the first time, the site shows its defaults below:
 * the copy it shipped with. After that the saved row is all that counts.
 */

/** Words between asterisks are set in the accent italic: "a front-end developer with *a designer's eye.*" */
export const ACCENT_HINT = "Wrap words in asterisks to set them in the accent italic, *like this*."

const accentText = text.refine(
  (value) => (value.match(/\*/g)?.length ?? 0) % 2 === 0,
  "An asterisk is missing its pair - wrap accent words like *this*",
)

/** Each entry once: the site keys its lists by their text. */
function uniqueList(item: z.ZodType<string>, what: string) {
  return z
    .array(item)
    .refine((items) => new Set(items.map((entry) => entry.toLowerCase())).size === items.length, `A ${what} is listed twice`)
}

/** "Developer." sets the home headline's size, so neither line may run wider. */
export const MAX_HERO_LINE = 10

const heroLine = text.max(MAX_HERO_LINE, `Up to ${MAX_HERO_LINE} characters - the headline is sized to fit “Developer.”`)

export const homePageSchema = z.object({
  hero: z.object({
    /** The first slides out left as the page scrolls, the second right. */
    lines: z.tuple([heroLine, heroLine]),
    tagline: text,
    intro: text,
  }),
  /** Over the pinned photograph, or stacked below it on phones. */
  intro: z.object({
    lede: accentText,
    supporting: text,
    currently: text,
    focus: text,
  }),
  /** "Where Thoughtful Design Meets Working Code". */
  about: z.object({
    title: text,
    paragraphs: z.array(text).min(1, "Add a paragraph").max(3, "Up to 3 paragraphs"),
    skills: uniqueList(text, "skill").min(1, "Add at least one skill").max(20, "Up to 20 skills"),
    /** Three tiles side by side. Real numbers only. */
    stats: z.array(z.object({ value: text, label: text })).length(3, "Exactly three numbers - they sit as three tiles"),
  }),
  /** The scrolling band of tool names. */
  toolkit: z.object({
    label: text,
    tools: uniqueList(text, "tool").min(10, "At least 10, so the band fills a wide screen"),
  }),
})

export const aboutPageSchema = z.object({
  whatIDo: z.object({
    /** Each line rises from its own mask, so lines are written out, not wrapped. */
    heading: z.array(accentText).min(1, "Add a line").max(5, "Up to 5 lines"),
    paragraphs: z.array(text).min(1, "Add a paragraph").max(4, "Up to 4 paragraphs"),
  }),
  approach: z.object({
    heading: accentText,
    intro: text,
    /** Numbered 01, 02… in order. */
    steps: z.array(z.object({ title: text, body: text })).min(1, "Add a step").max(5, "Up to 5 steps"),
  }),
})

export const workPageSchema = z.object({
  /** Beside the headline, which is set to its exact width and stays in code. */
  intro: text,
})

export const footerSchema = z.object({
  /** "Have something in mind? / Write me a letter." - one line each. */
  heading: z.array(accentText).min(1, "Add a line").max(3, "Up to 3 lines"),
})

export type HomePage = z.infer<typeof homePageSchema>
export type AboutPage = z.infer<typeof aboutPageSchema>
export type WorkPage = z.infer<typeof workPageSchema>
export type FooterContent = z.infer<typeof footerSchema>

/** The `settings` keys, each with its schema. */
export const PAGE_SCHEMAS = {
  "page-home": homePageSchema,
  "page-about": aboutPageSchema,
  "page-work": workPageSchema,
  "page-footer": footerSchema,
}

export type PageKey = keyof typeof PAGE_SCHEMAS
export type PageContent<K extends PageKey> = z.infer<(typeof PAGE_SCHEMAS)[K]>

/** The copy the site shipped with, shown until each page is first saved. */
export const PAGE_DEFAULTS: { [K in PageKey]: PageContent<K> } = {
  "page-home": {
    hero: {
      lines: ["Designer.", "Developer."],
      tagline: "who removes friction",
      intro:
        "I design in Figma and build fast, responsive websites in React and Next.js, with Strapi CMS so you can update content yourself, and branding to match. Let's build yours.",
    },
    intro: {
      lede: "I'm Muhammed Saheer, a front-end developer with *a designer's eye.*",
      supporting:
        "I bridge the gap between how things look and how they work — turning Figma frames into fast, responsive web experiences.",
      currently: "Front-End Developer at Febno Technologies",
      focus: "Design systems, motion & interactive UI",
    },
    about: {
      title: "Where Thoughtful Design Meets Working Code",
      paragraphs: [
        "I'm a front-end developer with a degree in multimedia from the University of Calicut. That background shapes how I build: I care about spacing, type, and motion as much as clean, maintainable React.",
        "Day to day, I work across UI/UX and front-end development, taking designs from Figma to responsive, production-ready interfaces. I'm also at home on the backend with Node.js and Strapi, so I can wire up the APIs and CMS behind what I build.",
      ],
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Node.js",
        "PHP",
        "Strapi CMS",
        "WordPress",
        "Figma",
        "Adobe Illustrator",
        "Design Systems",
        "Responsive Design",
      ],
      stats: [
        { value: "15+", label: "Projects Shipped" },
        { value: "2+", label: "Years in Development" },
        { value: "6+", label: "Years Designing" },
      ],
    },
    toolkit: {
      label: "What I work with",
      tools: [
        "React",
        "Next.js",
        "JavaScript",
        "TypeScript",
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
      ],
    },
  },
  "page-about": {
    whatIDo: {
      heading: [
        "Hi, I'm Muhammed – also just *Saheer*.",
        "I design and build interfaces that",
        "stand out and perform in production.",
      ],
      paragraphs: [
        "With a background in design and real mileage in React and Next.js, I have the knowledge to both make a design that holds together and bring it to life with the right animations.",
        "I only ship work I would put my own name on, and I keep going until you are completely happy with it. Whatever your vision is, together we get it built and live.",
      ],
    },
    approach: {
      heading: "From idea to a *live experience*",
      intro:
        "I work in Agile sprints using Scrum: short cycles, visible progress, and room to change course without starting over.",
      steps: [
        {
          title: "Plan the sprint",
          body: "Every project starts as a backlog of user stories, prioritised with the team. Sprint planning turns the top of that list into a clear, achievable goal, so everyone knows what “done” looks like before a single frame is drawn.",
        },
        {
          title: "Design and build in short cycles",
          body: "Design and development happen in the same sprint, not in separate phases. Daily stand-ups keep blockers small, and each sprint ends with a working, responsive increment rather than a mockup waiting on a handoff.",
        },
        {
          title: "Review, then refine",
          body: "Sprint reviews put real, clickable work in front of stakeholders early, and retrospectives sharpen how we work next time. Feedback lands while it is still cheap to act on, so the final product reflects what people actually need.",
        },
      ],
    },
  },
  "page-work": {
    intro:
      "Development, UI/UX and branding in one place. The bigger projects are written up as case studies; everything else opens right here.",
  },
  "page-footer": {
    heading: ["Have something in mind?", "Write me a *letter*."],
  },
}

/** The admin's list of pages, in the order it shows them. */
export const PAGES: { id: string; key: PageKey; title: string; path: string; summary: string }[] = [
  {
    id: "home",
    key: "page-home",
    title: "Home",
    path: "/",
    summary: "The headline and introduction, the About section’s text, expertise and numbers, and the toolkit band.",
  },
  {
    id: "about",
    key: "page-about",
    title: "About",
    path: "/about",
    summary: "The “What I do” statement and the Approach steps. The photo is under Photo & resume, the services panel under Services.",
  },
  {
    id: "work",
    key: "page-work",
    title: "Work",
    path: "/work",
    summary: "The introduction beside the headline. The projects themselves are under Case studies and Work files.",
  },
  {
    id: "footer",
    key: "page-footer",
    title: "Footer",
    path: "/",
    summary: "The invitation at the foot of every page except Contact.",
  },
]

/** The Approach steps are numbered from their order: "01", "02"… */
export const numbered = (index: number) => String(index + 1).padStart(2, "0")
