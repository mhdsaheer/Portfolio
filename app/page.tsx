import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { AboutPhotoPin } from "@/components/sections/about-photo-pin"
import { AboutMe } from "@/components/sections/about-me"
import { SelectedWorks } from "@/components/sections/selected-works"
import { About } from "@/components/sections/about"
import { Toolkit } from "@/components/sections/toolkit"
import { Insights } from "@/components/sections/insights"
import { getHomePage, getProfile } from "@/lib/settings-data"

export default async function HomePage() {
  const [{ photo }, content] = await Promise.all([getProfile(), getHomePage()])

  return (
    <>
      <Header />
      <main>
        <Hero content={content.hero} />
        <AboutPhotoPin photo={photo} intro={content.intro} />
        <AboutMe intro={content.intro} />
        <SelectedWorks />
        <About content={content.about} />
        <Toolkit content={content.toolkit} />
        <Insights />
      </main>
      <Footer />
    </>
  )
}
