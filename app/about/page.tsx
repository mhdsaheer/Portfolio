import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutHero } from "@/components/about/about-hero"
import { WhatIDo } from "@/components/about/what-i-do"
import { Services } from "@/components/about/services"
import { Approach } from "@/components/about/approach"
import { getAboutPage, getProfile, getServices } from "@/lib/settings-data"

/** The shared link shows the portrait set in the admin, under Photo & resume. */
export async function generateMetadata(): Promise<Metadata> {
  const { portrait } = await getProfile()

  return {
    title: "About | Muhammed Saheer - Front-End Developer",
    description:
      "Front-end developer in Kerala with a designer's eye. I design and build interfaces that hold up in production — React, Next.js, design systems and motion.",
    openGraph: {
      title: "About | Muhammed Saheer - Front-End Developer",
      description:
        "Front-end developer with a designer's eye, based in Kerala. I design and build interfaces that stand out and hold up in production.",
      type: "profile",
      images: [{ url: portrait.src }],
    },
  }
}

export default async function AboutPage() {
  const [services, { photo }, content] = await Promise.all([getServices(), getProfile(), getAboutPage()])

  return (
    <>
      <Header />

      {/* No z-index, overriding the global `main` rule: it would make main a
          stacking context, and the services panel's blend could then only
          reach main's own empty ground, not the background behind the page.
          Inline, because that rule is unlayered and outranks a utility. */}
      <main style={{ zIndex: "auto" }}>
        <AboutHero photo={photo} />
        <WhatIDo content={content.whatIDo} />
        <Services services={services} />
        <Approach content={content.approach} />
      </main>

      <Footer />
    </>
  )
}
