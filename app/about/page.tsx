import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutHero } from "@/components/about/about-hero"
import { WhatIDo } from "@/components/about/what-i-do"
import { Services } from "@/components/about/services"
import { Approach } from "@/components/about/approach"
import { PhotoStrip } from "@/components/about/photo-strip"

export const metadata: Metadata = {
  title: "About | Muhammed Saheer — Frontend Developer",
  description:
    "Frontend developer with a designer's eye, based in Kerala. I design and build interfaces that stand out and hold up in production — React, Next.js, design systems and motion.",
  openGraph: {
    title: "About | Muhammed Saheer — Frontend Developer",
    description:
      "Frontend developer with a designer's eye, based in Kerala. I design and build interfaces that stand out and hold up in production.",
    type: "profile",
    images: [{ url: "/images/saheer_portrait.png" }],
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* No z-index, overriding the global `main` rule: it would make main a
          stacking context, and the services panel's blend could then only
          reach main's own empty ground, not the background behind the page.
          Inline, because that rule is unlayered and outranks a utility. */}
      <main style={{ zIndex: "auto" }}>
        <AboutHero />
        <WhatIDo />
        <Services />
        <Approach />
        <PhotoStrip />
      </main>

      <Footer />
    </>
  )
}
