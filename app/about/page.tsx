import type { Metadata } from "next"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FinalCTA } from "@/components/sections/final-cta"
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

      <main>
        <AboutHero />
        <WhatIDo />
        <Services />
        <Approach />
        <PhotoStrip />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
