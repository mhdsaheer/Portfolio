/** Articles that have been taken down; their old links go to the insights index. */
const removedInsights = [
  "mastering-vibe-coding-with-v0-and-ai",
  "prompt-engineering-for-designers",
  "designing-human-ai-interactions",
]

/** Images uploaded in the admin are served from this Cloudinary account only. */
const cloudinaryCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: cloudinaryCloud ? [new URL(`https://res.cloudinary.com/${cloudinaryCloud}/image/upload/**`)] : [],
  },
  redirects() {
    return removedInsights.map((slug) => ({
      source: `/insights/${slug}`,
      destination: "/insights",
      permanent: true,
    }))
  },
}

export default nextConfig
