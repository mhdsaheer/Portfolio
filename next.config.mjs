/** Articles that have been taken down; their old links go to the insights index. */
const removedInsights = [
  "mastering-vibe-coding-with-v0-and-ai",
  "prompt-engineering-for-designers",
  "designing-human-ai-interactions",
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return removedInsights.map((slug) => ({
      source: `/insights/${slug}`,
      destination: "/insights",
      permanent: true,
    }))
  },
}

export default nextConfig
