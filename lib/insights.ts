export type InsightSection = {
  heading: string
  body: string[]
}

export type Insight = {
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  /** Derived from the word count in `readingTime`, not written by hand. */
  readTime: string
  tags: string[]
  /** Stands above the first heading, set larger than the body. */
  intro: string[]
  sections: InsightSection[]
  /** Pulled out between sections; sits after the one at this index. */
  pullQuote?: { text: string; afterSection: number }
  outro: string[]
}

/**
 * The single source for the home page teaser, the index at /insights and the
 * article pages. Newest first - the home section takes the first three.
 */
export const insights: Insight[] = [
  {
    slug: "mastering-vibe-coding-with-v0-and-ai",
    title: "Mastering Vibe Coding with v0 and AI",
    excerpt: "How to rapidly prototype production-ready interfaces using conversational AI and generative tools.",
    image: "/images/bg-1.png",
    date: "Dec 15, 2025",
    readTime: "",
    tags: ["AI", "v0", "Workflow", "Frontend"],
    intro: [
      "Vibe coding — describing what you want in plain language and letting a model build it — picked up a reputation as a way to skip the work. After a year of building production interfaces this way, I don’t think that’s what it is. It moves where the effort goes. It doesn’t remove it.",
      "The generated code is the cheap part. What it costs you is review, and review is a skill most people haven’t built yet.",
    ],
    sections: [
      {
        heading: "What generation is genuinely good at",
        body: [
          "Scaffolding. A layout with the right grid, a component with the right props, a form wired to the right state — the parts where there is one obvious answer and typing it is just labour. A good model produces that faster than I can, and usually correctly.",
          "It is also good at breadth. Ask for six variations of a card and you get six, which is more than I would sketch by hand before settling on one. The value isn’t that any of them is right. It’s that seeing six wrong ones tells you quickly what right would look like.",
          "What it is not good at is judgment. It doesn’t know that this button is the only way out of a flow, or that an eight-pixel gap matters because everything else on the page sits on a four-pixel grid.",
        ],
      },
      {
        heading: "Give it constraints, not a blank page",
        body: [
          "The difference between a generic result and a usable one is almost always the constraints in the prompt. A blank request returns the average of everything the model has ever seen, which is by definition generic.",
          "So I paste the tokens. The actual hex values, the type scale, the easing curve, the name of the component it will sit next to. Not “make it match my site” — the real numbers.",
          "The same goes for data. Give it the shape of the object it will render rather than a description of it. A model handed a real payload writes code that survives a real payload.",
        ],
      },
      {
        heading: "The review is the job",
        body: [
          "Everything generated gets read. Not skimmed — read. The failures that matter are almost never visible in the preview.",
          "The ones I catch most often: contrast that fails at the size the text actually renders, an entrance animation that strands an element at zero opacity when reduced motion is on, placeholder text clipped by a width cap, a control that looks enabled but silently refuses to submit.",
          "None of those show up in a screenshot. All of them are things a real person hits on their first visit.",
        ],
      },
      {
        heading: "Where it stops paying",
        body: [
          "There’s a crossover point. When the change is smaller than the sentence describing it, typing is faster. Renaming a variable, nudging a value, fixing one class — just do it.",
          "I reach for generation at the start of a thing, and at the moment I’m stuck on breadth. In the middle, where the work is precision, it mostly gets in the way.",
        ],
      },
    ],
    pullQuote: {
      text: "Generation gets you to something on screen. It does not get you to something you would put your name on.",
      afterSection: 2,
    },
    outro: [
      "The honest pitch isn’t that this makes building free. It’s that it collapses the part of the job that was never interesting, and hands the time back to the part that was.",
    ],
  },
  {
    slug: "prompt-engineering-for-designers",
    title: "Prompt Engineering for Designers",
    excerpt: "A practical guide to crafting prompts that generate exactly what you envision with AI tools.",
    image: "/images/bg-2.png",
    date: "Nov 28, 2025",
    readTime: "",
    tags: ["AI", "Process", "Design Systems"],
    intro: [
      "Prompt engineering sounds like a discipline of secret phrases. It isn’t. It’s writing a brief, and designers have been writing briefs for a very long time.",
      "What changes is the recipient. A model will not ask you a clarifying question. It will guess, confidently, and hand you the guess.",
    ],
    sections: [
      {
        heading: "Specify the constraint, not the vibe",
        body: [
          "“Make it modern” is not a brief, because modern is a moving average of whatever is currently popular. “Set it at 16px with a 1.5 line height, two weights, and no more than three type sizes on the page” is a brief.",
          "Every adjective you can replace with a number, replace. The adjectives that survive the edit are the ones actually carrying meaning.",
        ],
      },
      {
        heading: "Hand over the vocabulary you already have",
        body: [
          "If you have a design system, paste it. Token names, the spacing scale, the words you use internally for components. A model given your vocabulary answers in it, which means the output slots into what exists instead of sitting awkwardly beside it.",
          "Without that you get something that looks fine in isolation and wrong in place — which is far more expensive to fix than something that was obviously wrong from the start.",
        ],
      },
      {
        heading: "One change per prompt",
        body: [
          "Ask for four changes at once and you tend to get four half-changes. The model averages the request.",
          "I keep each prompt to a single decision. It’s slower per prompt and faster overall, because I can tell which instruction produced which result — and undo exactly one of them when it turns out to be wrong.",
        ],
      },
      {
        heading: "Keep what worked",
        body: [
          "Prompts that produce good output are assets. I keep them the way I keep components: named, reused, edited rather than rewritten from scratch each time.",
          "The ones worth keeping are rarely clever. They’re just specific.",
        ],
      },
    ],
    pullQuote: {
      text: "A prompt is a brief, and the model is a very fast junior who never asks a clarifying question.",
      afterSection: 2,
    },
    outro: [
      "The skill here isn’t prompting. It’s knowing precisely what you want before you ask for it — which was always the job, and is now simply harder to fake.",
    ],
  },
  {
    slug: "designing-human-ai-interactions",
    title: "Designing Human-AI Interactions",
    excerpt: "Best practices for creating conversational interfaces that feel natural and trustworthy.",
    image: "/images/bg-3.png",
    date: "Nov 10, 2025",
    readTime: "",
    tags: ["AI", "UX", "Interaction Design", "Trust"],
    intro: [
      "The hard part of an AI feature is rarely the model. It’s what the interface promises on the model’s behalf.",
      "An interface that overclaims gets trusted once. After that, every correct answer is read with suspicion.",
    ],
    sections: [
      {
        heading: "Never let a control lie",
        body: [
          "A button that looks ready and does nothing when pressed is worse than one that is visibly disabled. The disabled one is honest. The other one makes the person doubt their own click.",
          "This comes up constantly around generation: a submit that fires while the input is still invalid, a send that resolves before anything has actually been sent. If a control is live, pressing it must do the thing. If it can’t, it should say why — in words, next to where the decision is being made.",
        ],
      },
      {
        heading: "Show the shape of the uncertainty",
        body: [
          "Models are confidently wrong in a way that ordinary software isn’t. An answer carrying no signal about its own reliability invites the reader to treat every answer the same way.",
          "That doesn’t mean printing a confidence percentage, which nobody can calibrate. It means citing the source, showing the input it worked from, or letting someone open the reasoning if they want it.",
        ],
      },
      {
        heading: "Make the way out obvious",
        body: [
          "Everything generated needs an undo, an edit and a discard that are as easy to find as the accept.",
          "When those are buried, people stop generating — not because the output is bad, but because the cost of a bad output becomes a page they now have to repair by hand.",
        ],
      },
      {
        heading: "Latency is a design material",
        body: [
          "A model takes time. Covering that with a spinner tells the person nothing except that they are waiting.",
          "Streaming is better, because it shows the work is happening and lets reading start early. Better still is naming the step: reading your file, drafting, checking. The wait is exactly as long and feels completely different.",
        ],
      },
    ],
    pullQuote: {
      text: "Trust is not built by the answer being right. It is built by the interface being honest about when it might not be.",
      afterSection: 1,
    },
    outro: [
      "None of this is really about the model. It’s about a much older rule — an interface should never claim more than it can deliver. AI just makes that gap much easier to fall into.",
    ],
  },
]

/**
 * Read times are computed rather than written down, so they cannot drift away
 * from the article as it is edited. 200 words a minute is the usual estimate
 * for screen reading; anything under a minute still reads as "1 min".
 */
function readingTime(insight: Insight) {
  const words = [...insight.intro, ...insight.sections.flatMap((s) => [s.heading, ...s.body]), ...insight.outro]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length

  return `${Math.max(1, Math.round(words / 200))} min read`
}

for (const insight of insights) {
  insight.readTime = readingTime(insight)
}

/**
 * The machine-readable publish date.
 *
 * `new Date("Dec 15, 2025")` is midnight *local*, which on any build machine
 * east of UTC serialises as the day before. Anchoring to midday UTC keeps the
 * date in the markup the same as the date on the page, wherever it is built.
 */
export function publishedAt(insight: Insight) {
  return new Date(`${insight.date} 12:00:00 UTC`).toISOString()
}

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug)
}

/** Wraps around, so the last article still offers somewhere to go next. */
export function getNextInsight(slug: string) {
  const current = insights.findIndex((insight) => insight.slug === slug)
  if (current === -1) return undefined
  return insights[(current + 1) % insights.length]
}
