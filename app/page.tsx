import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { AboutPhotoPin } from "@/components/sections/about-photo-pin"
import { AboutMe } from "@/components/sections/about-me"
import { SelectedWorks } from "@/components/sections/selected-works"
import { About } from "@/components/sections/about"
import { ClientLogos } from "@/components/sections/client-logos"
import { Testimonials } from "@/components/sections/testimonials"
import { Awards } from "@/components/sections/awards"
import { Insights } from "@/components/sections/insights"
import { FinalCTA } from "@/components/sections/final-cta"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutPhotoPin />
        <AboutMe />
        <SelectedWorks />
        <About />
        <ClientLogos />
        <Testimonials />
        <Awards />
        <Insights />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
