export type CaseStudy = {
  slug: string
  index: number
  title: string
  category: string
  description: string
  image: string
  tags: string[]
  year: string
  role: string
  timeline: string
  client: string
  platform: string
  overview: string[]
  challenge: {
    title: string
    body: string[]
    pains: string[]
  }
  approach: {
    step: string
    title: string
    body: string
  }[]
  gallery: {
    src: string
    alt: string
    caption: string
  }[]
  results: {
    value: string
    label: string
  }[]
  outcome: string[]
  testimonial: {
    quote: string
    author: string
    role: string
  }
  stack: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-onboarding-assistant",
    index: 1,
    title: "AI Onboarding Assistant",
    category: "AI Product",
    description: "Building an intelligent onboarding flow powered by GPT-4 and natural conversations",
    image: "/images/work-onboarding.png",
    tags: ["AI", "v0", "Next.js", "OpenAI"],
    year: "2025",
    role: "Product Design, Prompt Engineering, Front-end",
    timeline: "10 weeks",
    client: "Series B SaaS platform",
    platform: "Web & iOS",
    overview: [
      "A B2B analytics platform was losing most of its trial users before they ever connected a data source. The setup wizard asked twelve questions in a row, each one a chance to abandon the product.",
      "We replaced the wizard with a conversational assistant that asks for one thing at a time, infers the rest from context, and configures the workspace while the user is still talking to it.",
    ],
    challenge: {
      title: "A setup flow that asked for everything and explained nothing",
      body: [
        "Support transcripts told the same story again and again: people understood what the product did, but not what the form wanted from them. Field labels like “Primary attribution window” meant nothing on day one.",
        "The team had already tried tooltips, a progress bar, and a shorter form. None of it moved activation, because the problem was never length — it was that the burden of translation sat entirely with the user.",
      ],
      pains: [
        "68% of trials never reached a connected data source",
        "12-step wizard with no way to skip or come back",
        "Four support tickets on average per successful activation",
        "Config errors surfaced only after the first sync failed",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Mapped the questions behind the questions",
        body: "Every field in the old wizard was traced back to the decision it actually supported. Seven of the twelve could be inferred from the user's email domain, their chosen integration, or a sensible default — leaving five that genuinely needed a human answer.",
      },
      {
        step: "02",
        title: "Wrote the conversation before the interface",
        body: "The flow was scripted as dialogue first, in a plain document, and read aloud with five customers. Anywhere the script felt like an interrogation, we cut a turn or moved it to a smart default the user could correct later.",
      },
      {
        step: "03",
        title: "Designed for the model's failure modes",
        body: "Every assistant turn has a structured fallback: a suggested chip set, an editable summary card, and a visible manual escape hatch. The interface never depends on the model getting it right on the first attempt.",
      },
      {
        step: "04",
        title: "Prototyped in code, not in Figma",
        body: "Screens were built directly in v0 and wired to a live GPT-4 endpoint within the first week. Testing against real model latency and real wrong answers changed the design more than any static mockup would have.",
      },
      {
        step: "05",
        title: "Shipped behind a measured rollout",
        body: "The assistant launched to 20% of new trials alongside the legacy wizard. Activation, time-to-first-sync, and manual-override rate were tracked per cohort for six weeks before the old flow was retired.",
      },
    ],
    gallery: [
      {
        src: "/images/work-onboarding.png",
        alt: "Conversational onboarding screen on mobile",
        caption: "The first turn asks one question and shows what happens next — nothing else competes for attention.",
      },
      {
        src: "/images/bg-2.png",
        alt: "Editable summary card produced by the assistant",
        caption: "Every inferred setting lands in an editable summary, so the user reviews decisions instead of making them.",
      },
    ],
    results: [
      { value: "3.1x", label: "Trial activation rate" },
      { value: "-74%", label: "Time to first sync" },
      { value: "-61%", label: "Setup support tickets" },
      { value: "92%", label: "Kept the inferred defaults" },
    ],
    outcome: [
      "Activation climbed from 32% to just under 80% of trials reaching a live data source in the first session, and the support queue lost its single largest ticket category.",
      "The conversation patterns became a shared component library, and the same assistant shell now powers the platform's data-import and team-invite flows.",
    ],
    testimonial: {
      quote:
        "We had rewritten the setup form three times before this. The difference was starting from what we were actually asking people to decide.",
      author: "Priya Raman",
      role: "VP Product, client team",
    },
    stack: ["Next.js", "OpenAI GPT-4", "v0 by Vercel", "Vercel AI SDK", "PostHog"],
  },
  {
    slug: "ai-fashion-curator",
    index: 2,
    title: "AI Fashion Curator",
    category: "E-commerce AI",
    description: "Personalized style recommendations using computer vision and preference learning",
    image: "/images/work-fashion.png",
    tags: ["AI", "Machine Learning", "Midjourney"],
    year: "2025",
    role: "Product Design, Design System, Visual Direction",
    timeline: "14 weeks",
    client: "Independent fashion marketplace",
    platform: "iOS & Web",
    overview: [
      "A marketplace with 40,000 items had a search box and nothing else. Shoppers who knew exactly what they wanted did fine; everyone else bounced from the homepage.",
      "The curator learns taste from what a shopper saves, skips, and returns to, then builds a daily edit that reads like a stylist's pick rather than an algorithmic grid.",
    ],
    challenge: {
      title: "Recommendations that were accurate and still felt wrong",
      body: [
        "The existing model surfaced items in the right category and price band, but the results felt generic — five versions of the same black jacket, no sense of occasion, no point of view.",
        "Taste is not a category filter. The design problem was giving shoppers a way to express preference that was faster than typing and richer than a thumbs-up.",
      ],
      pains: [
        "71% of sessions ended on the homepage",
        "Recommendation click-through under 3%",
        "No signal captured between viewing and purchasing",
        "Returns driven by fit and styling mismatch",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Built a preference vocabulary from real wardrobes",
        body: "Twelve shoppers walked us through their closets and explained why they kept things. Their language — structured, too shiny, works with everything — became the attribute set the model was tuned against.",
      },
      {
        step: "02",
        title: "Made taste input feel like browsing",
        body: "Preference capture was folded into the act of looking: save, skip, and a long-press that dims the grid and surfaces near neighbours. No quiz, no onboarding survey.",
      },
      {
        step: "03",
        title: "Designed the edit, not the grid",
        body: "Results are composed the way a stylist would compose them — a hero look, three supporting pieces, and a stated reason. Each edit carries one line explaining the through-line, drawn from the attributes that drove the match.",
      },
      {
        step: "04",
        title: "Generated the visual language with Midjourney",
        body: "Editorial backdrops, seasonal moods, and empty-state imagery were produced as a consistent generated set, giving a small catalogue the visual confidence of a much larger house.",
      },
      {
        step: "05",
        title: "Tuned against cold start",
        body: "A new shopper sees a curated set drawn from editorial picks rather than an empty state, and each interaction visibly narrows the edit — so early sessions feel responsive rather than random.",
      },
    ],
    gallery: [
      {
        src: "/images/work-fashion.png",
        alt: "Daily edit screen with hero look and supporting pieces",
        caption: "The daily edit leads with one look and says why it was chosen.",
      },
      {
        src: "/images/bg-3.png",
        alt: "Preference learning interaction on a product grid",
        caption: "Long-press dims the grid and pulls in near neighbours — preference capture without a form.",
      },
    ],
    results: [
      { value: "+240%", label: "Recommendation CTR" },
      { value: "+38%", label: "Session length" },
      { value: "-22%", label: "Style-related returns" },
      { value: "4.7", label: "App Store rating" },
    ],
    outcome: [
      "The daily edit became the app's most-visited surface within two months of launch, overtaking search for the first time in the product's history.",
      "Capturing skip and save signals gave the merchandising team a weekly read on emerging taste that previously took a full season to see in sales data.",
    ],
    testimonial: {
      quote:
        "It stopped looking like a search engine and started looking like a shop with an opinion. That was the whole brief, and we had not managed it in two years.",
      author: "Lina Okafor",
      role: "Head of Digital, client team",
    },
    stack: ["React Native", "CLIP embeddings", "Midjourney", "Algolia", "Supabase"],
  },
  {
    slug: "smart-task-manager",
    index: 3,
    title: "Smart Task Manager",
    category: "Productivity AI",
    description: "AI-powered task prioritization and scheduling with natural language processing",
    image: "/images/work-tasks.png",
    tags: ["AI", "Claude", "Vibe Coding"],
    year: "2024",
    role: "Product Design, Interaction Design, Prototyping",
    timeline: "8 weeks",
    client: "Internal product team, 400-person agency",
    platform: "Desktop & Web",
    overview: [
      "The agency ran on three task tools and a lot of Slack. Nobody could answer the only question that mattered on a Monday morning: what should I work on right now?",
      "The manager reads tasks written the way people actually write them, schedules them against real calendar availability, and defends a single ordered list that anyone can override.",
    ],
    challenge: {
      title: "Every tool tracked work; none of them protected attention",
      body: [
        "The existing tools were faithful records of everything owed. That was precisely the problem — a list of 140 open items is a source of anxiety, not a plan.",
        "Automated prioritisation had been tried and abandoned, because people did not trust an order they could not interrogate. Any ranking we produced had to explain itself and yield instantly to a human decision.",
      ],
      pains: [
        "Work tracked across three separate tools",
        "Priority set by whoever asked most recently",
        "No link between task estimates and calendar reality",
        "Previous auto-prioritisation was switched off within a week",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Parsed tasks as people write them",
        body: "A line like “draft the Q3 deck before Thursday's review, needs Sam” resolves to a task, a deadline, a dependency, and a collaborator. Everything parsed is shown as removable chips, so the interpretation stays visible and correctable.",
      },
      {
        step: "02",
        title: "Made the ranking explain itself",
        body: "Each item in the day's list carries one line of reasoning — the deadline, the blocked colleague, the meeting it feeds. Trust came from legibility, not from accuracy alone.",
      },
      {
        step: "03",
        title: "Scheduled against real availability",
        body: "The plan is built from actual free blocks in the calendar, not an idealised eight-hour day. A day with five hours of meetings produces a three-item plan, and says so.",
      },
      {
        step: "04",
        title: "Let overrides teach the system",
        body: "Dragging an item up is treated as signal, not correction. Repeated overrides adjust the weighting for that person, and the change is surfaced explicitly rather than applied silently.",
      },
      {
        step: "05",
        title: "Built it live with Claude",
        body: "The prototype was vibe-coded over two weeks with Claude as pair, which let us test seven ranking heuristics against real team data before committing to one.",
      },
    ],
    gallery: [
      {
        src: "/images/work-tasks.png",
        alt: "Daily plan view with reasoning lines",
        caption: "The day opens as a short ordered list, each item carrying the reason it sits where it does.",
      },
      {
        src: "/images/bg-1.png",
        alt: "Natural language task capture with parsed chips",
        caption: "Capture stays a single text field; the parse is shown as chips you can pull off.",
      },
    ],
    results: [
      { value: "89%", label: "Weekly active adoption" },
      { value: "-45%", label: "Time spent planning" },
      { value: "+27%", label: "On-time delivery" },
      { value: "1", label: "Tool, down from three" },
    ],
    outcome: [
      "Adoption held above 85% six months after launch — the first internal tool at the agency to survive its own novelty period.",
      "Override data turned out to be the most valuable output: it showed leadership which teams were routinely overcommitted, backed by evidence rather than anecdote.",
    ],
    testimonial: {
      quote:
        "The reasoning line under each task is the whole product. Once people could argue with it, they stopped ignoring it.",
      author: "Marcus Bell",
      role: "Operations Director, client team",
    },
    stack: ["Next.js", "Anthropic Claude", "Google Calendar API", "Prisma", "Tailwind CSS"],
  },
  {
    slug: "crypto-ai-analytics",
    index: 4,
    title: "Crypto AI Analytics",
    category: "FinTech AI",
    description: "Real-time market insights and predictions powered by advanced AI models",
    image: "/images/work-crypto.png",
    tags: ["AI", "Data Viz", "GPT-4"],
    year: "2024",
    role: "Product Design, Data Visualisation, Front-end",
    timeline: "16 weeks",
    client: "Digital asset research firm",
    platform: "Web dashboard",
    overview: [
      "Analysts were reading eleven data sources to write one morning note. The research was excellent, and it arrived four hours after it was useful.",
      "The dashboard pulls signal from on-chain data, order books, and sentiment into a single readable brief — with every claim traceable back to the series that produced it.",
    ],
    challenge: {
      title: "Enough data to be certain of nothing",
      body: [
        "The firm did not lack information. It lacked a way to move from eleven dashboards to one defensible sentence, fast enough for the sentence to matter.",
        "Regulatory context ruled out a black box. Any AI-generated claim had to show its inputs, its confidence, and its assumptions, or compliance would not let it ship.",
      ],
      pains: [
        "Four-hour lag between market event and published note",
        "Eleven sources reconciled by hand every morning",
        "No consistent way to express model confidence",
        "Claims could not be audited back to source data",
      ],
    },
    approach: [
      {
        step: "01",
        title: "Started from the morning note",
        body: "The existing output was the spec. We took six months of published notes and worked backwards to the minimum set of series that supported each recurring claim.",
      },
      {
        step: "02",
        title: "Gave confidence a visual grammar",
        body: "Certainty is encoded consistently across the product — band width for ranges, opacity for model confidence, a dotted rule wherever a projection leaves observed data. One vocabulary, used everywhere.",
      },
      {
        step: "03",
        title: "Made every claim clickable",
        body: "Each sentence in the generated brief links to the chart and the timestamped rows behind it. Nothing is asserted that cannot be opened, and the audit trail is the interface.",
      },
      {
        step: "04",
        title: "Designed the dense view first",
        body: "Layout was built against the analyst's real screen — three monitors, twenty series, all day. Type scale, tick density, and contrast were tuned for eight-hour reading rather than for a screenshot.",
      },
      {
        step: "05",
        title: "Held the model to the house style",
        body: "GPT-4 writes the brief inside strict constraints: no directional advice, explicit hedging language, and a compliance-reviewed refusal path for claims the data will not carry.",
      },
    ],
    gallery: [
      {
        src: "/images/work-crypto.png",
        alt: "Analytics dashboard with market brief and charts",
        caption: "The brief sits beside the evidence, and every sentence opens the series behind it.",
      },
      {
        src: "/images/bg-2.png",
        alt: "Confidence band visualisation on a projection chart",
        caption: "Projections change texture where observed data ends — confidence is legible at a glance.",
      },
    ],
    results: [
      { value: "-83%", label: "Time to publish" },
      { value: "11 → 1", label: "Sources to reconcile" },
      { value: "100%", label: "Claims traceable to source" },
      { value: "+56%", label: "Notes published per week" },
    ],
    outcome: [
      "The morning note now ships before the open rather than after lunch, and the research team publishes more than twice as often with the same headcount.",
      "The confidence grammar was adopted across the firm's other products, giving compliance a single standard to review against instead of one per surface.",
    ],
    testimonial: {
      quote: "Compliance signed off in one pass. In this industry that is the strongest review a design can get.",
      author: "Daniel Vecchio",
      role: "Head of Research, client team",
    },
    stack: ["Next.js", "D3.js", "OpenAI GPT-4", "TimescaleDB", "WebSockets"],
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug)
}

export function getNextCaseStudy(slug: string) {
  const current = caseStudies.findIndex((study) => study.slug === slug)
  if (current === -1) return undefined
  return caseStudies[(current + 1) % caseStudies.length]
}
