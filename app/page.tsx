import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { AboutPhotoPin } from "@/components/sections/about-photo-pin"
import { AboutMe } from "@/components/sections/about-me"
import { SelectedWorks } from "@/components/sections/selected-works"
import { About } from "@/components/sections/about"
import { Toolkit } from "@/components/sections/toolkit"
import { Insights } from "@/components/sections/insights"

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
        <Toolkit />
        <Insights />
      </main>
      <Footer />
    </>
  )
}
