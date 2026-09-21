import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FinalCTA } from "@/components/sections/final-cta"
import { SectionTitle } from "@/components/ui/section-title"
import { Reveal } from "@/components/case-study/reveal"
import { caseStudies, getCaseStudy, getNextCaseStudy } from "@/lib/case-studies"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    return { title: "Case study not found | Portfolio" }
  }

  return {
    title: `${study.title} | Case Study`,
    description: study.description,
    openGraph: {
      title: `${study.title} | Case Study`,
      description: study.description,
      type: "article",
      images: [{ url: study.image }],
    },
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    notFound()
  }

  const next = getNextCaseStudy(study.slug)

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-10 md:pb-14">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <Link
              href="/#works"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to selected work
            </Link>

            <Reveal className="mt-8 md:mt-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance max-w-4xl">
                {study.title}
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                {study.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-8">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Hero image */}
        <section className="pb-12 md:pb-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <Reveal className="relative aspect-[1.2/1] md:aspect-[2/1] overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-secondary">
              <Image
                src={study.image || "/placeholder.svg"}
                alt={study.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover"
              />
            </Reveal>

            {/* Project meta */}
            <Reveal
              delay={100}
              className="grid grid-cols-2 md:grid-cols-4 gap-px mt-8 md:mt-12 rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-border/60"
            >
              {[
                { label: "Role", value: study.role },
                { label: "Timeline", value: study.timeline },
                { label: "Client", value: study.client },
                { label: "Platform", value: study.platform },
              ].map((item) => (
                <div key={item.label} className="bg-card backdrop-blur-xl p-6 md:p-8">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-3 text-sm md:text-base leading-relaxed">{item.value}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
              <div className="lg:col-span-4">
                <SectionTitle className="text-3xl md:text-4xl font-semibold tracking-tight">Overview</SectionTitle>
              </div>
              <div className="lg:col-span-8">
                {study.overview.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <p
                      className={`text-lg md:text-xl leading-relaxed text-pretty ${
                        i === 0 ? "text-foreground" : "mt-6 text-muted-foreground"
                      }`}
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Challenge */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
              <div className="lg:col-span-4">
                <span className="text-[11px] font-mono tracking-tight" style={{ color: "#c8e0f5" }}>
                  01 // The problem
                </span>
                <SectionTitle className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
                  {study.challenge.title}
                </SectionTitle>
              </div>

              <div className="lg:col-span-8">
                {study.challenge.body.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <p className={`text-muted-foreground leading-relaxed text-pretty ${i === 0 ? "" : "mt-5"}`}>
                      {paragraph}
                    </p>
                  </Reveal>
                ))}

                <Reveal delay={160} className="mt-10 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card backdrop-blur-xl border border-border">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Where it was hurting
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {study.challenge.pains.map((pain) => (
                      <li key={pain} className="flex gap-3 text-sm md:text-base leading-relaxed">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8e0f5]" />
                        {pain}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <span className="text-[11px] font-mono tracking-tight" style={{ color: "#c8e0f5" }}>
              02 // The approach
            </span>
            <SectionTitle className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              How it came together
            </SectionTitle>

            <ol className="mt-12 md:mt-16 border-t border-border">
              {study.approach.map((item, i) => (
                <Reveal as="li" key={item.step} delay={i * 60} className="border-b border-border">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 py-8 md:py-10 group">
                    <div className="md:col-span-2">
                      <span className="text-sm font-mono text-muted-foreground transition-colors group-hover:text-[#c8e0f5]">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="md:col-span-4 text-xl md:text-2xl font-semibold tracking-tight text-balance">
                      {item.title}
                    </h3>
                    <p className="md:col-span-6 text-muted-foreground leading-relaxed text-pretty">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 space-y-12 md:space-y-20">
            {study.gallery.map((shot, i) => (
              <Reveal as="figure" key={shot.src + i}>
                <div className="relative aspect-[1.2/1] md:aspect-[16/9] overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-secondary">
                  <Image
                    src={shot.src || "/placeholder.svg"}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1280px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {shot.caption}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <span className="text-[11px] font-mono tracking-tight" style={{ color: "#c8e0f5" }}>
              03 // The outcome
            </span>
            <SectionTitle className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              What changed
            </SectionTitle>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12">
              {study.results.map((result, i) => (
                <Reveal
                  key={result.label}
                  delay={i * 80}
                  className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card backdrop-blur-xl border border-border"
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: "#c8e0f5" }}>
                    {result.value}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground leading-snug">{result.label}</div>
                </Reveal>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 mt-12 md:mt-16">
              <div className="lg:col-span-4" />
              <div className="lg:col-span-8">
                {study.outcome.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <p className={`text-muted-foreground leading-relaxed text-pretty ${i === 0 ? "" : "mt-5"}`}>
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <Reveal className="max-w-4xl mx-auto text-center p-8 md:p-16 rounded-2xl md:rounded-3xl bg-card backdrop-blur-xl border border-border">
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-snug text-balance">
                “{study.testimonial.quote}”
              </blockquote>
              <div className="mt-8">
                <div className="font-semibold">{study.testimonial.author}</div>
                <div className="text-sm text-muted-foreground mt-1">{study.testimonial.role}</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stack */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
              <div className="lg:col-span-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Built with</h2>
              </div>
              <Reveal className="lg:col-span-8 flex flex-wrap gap-2">
                {study.stack.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-secondary transition-colors cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Next case study */}
        {next && next.slug !== study.slug && (
          <section className="py-12 md:py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
              <Link href={`/work/${next.slug}`} className="group block">
                <Reveal className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-[1.4/1] md:aspect-[3/1] overflow-hidden bg-secondary">
                    <Image
                      src={next.image || "/placeholder.svg"}
                      alt={next.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 1280px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                    <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10 flex items-end justify-between gap-6">
                      <div>
                        <span className="text-[11px] font-mono tracking-tight" style={{ color: "#c8e0f5" }}>
                          Next case study
                        </span>
                        <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">{next.title}</h2>
                        <p className="hidden md:block mt-3 text-muted-foreground max-w-xl leading-relaxed">
                          {next.description}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-secondary/80 border border-border transition-colors group-hover:bg-secondary shrink-0">
                        <ArrowUpRight
                          className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: "#c8e0f5" }}
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </Link>
            </div>
          </section>
        )}

        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
