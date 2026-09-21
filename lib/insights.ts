export type Insight = {
  /** Reserved for article pages; nothing links to it yet. */
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
}

/**
 * The single source for both the home page teaser and the index at /insights.
 * Newest first - the home section takes the first three off the top.
 */
export const insights: Insight[] = [
  {
    slug: "mastering-vibe-coding-with-v0-and-ai",
    title: "Mastering Vibe Coding with v0 and AI",
    excerpt: "How to rapidly prototype production-ready interfaces using conversational AI and generative tools.",
    image: "/images/bg-1.png",
    date: "Dec 15, 2025",
    readTime: "5 min read",
  },
  {
    slug: "prompt-engineering-for-designers",
    title: "Prompt Engineering for Designers",
    excerpt: "A practical guide to crafting prompts that generate exactly what you envision with AI tools.",
    image: "/images/bg-2.png",
    date: "Nov 28, 2025",
    readTime: "4 min read",
  },
  {
    slug: "designing-human-ai-interactions",
    title: "Designing Human-AI Interactions",
    excerpt: "Best practices for creating conversational interfaces that feel natural and trustworthy.",
    image: "/images/bg-3.png",
    date: "Nov 10, 2025",
    readTime: "6 min read",
  },
]
