"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SectionTitle } from "@/components/ui/section-title"
import { caseStudies } from "@/lib/case-studies"



export function SelectedWorks() {
  return (
    <section id="works" className="py-20 md:py-10 md:pt-32 pb-4">
      {/* SVG clipPath definition for the folder tabs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="tab-clip">
            <path d="M 0,32 L 0,12 A 12,12 0 0,1 12,0 L 120,0 A 12,12 0 0,1 130,5 L 146,27 A 12,12 0 0,0 156,32 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <SectionTitle className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Selected work
          </SectionTitle>
          <Link
            href="#"
            className="hidden md:inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#c8e0f5" }}
          >
            View all works
            <ArrowUpRight className="w-4 h-4" style={{ color: "#c8e0f5" }} />
          </Link>
        </div>

        <div className="relative">
          {caseStudies.map((work, index) => (
            <div
              key={work.slug}
              className="sticky top-0"
              style={{
                top: `${index * 32}px`,
                zIndex: index + 1,
              }}
            >
              <Link href={`/work/${work.slug}`} className="group block pt-12 relative">
                {/* Folder Tab */}
                <div 
                  className="absolute top-[16px] h-[32px] w-[156px] z-10 select-none pointer-events-none transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    left: `${48 + index * 48}px`,
                  }}
                >
                  {/* Clipped background with blur */}
                  <div 
                    className="absolute inset-0 bg-[#3a5f87]/80 backdrop-blur-xl"
                    style={{ clipPath: "url(#tab-clip)" }}
                  />
                  
                  {/* SVG Border overlay */}
                  <svg 
                    width="156" 
                    height="32" 
                    viewBox="0 0 156 32" 
                    fill="none" 
                    className="absolute inset-0"
                  >
                    <path 
                      d="M 0,32 L 0,12 A 12,12 0 0,1 12,0 L 120,0 A 12,12 0 0,1 130,5 L 146,27 A 12,12 0 0,0 156,32" 
                      stroke="rgba(255, 255, 255, 0.15)" 
                      strokeWidth="1.5"
                    />
                  </svg>
                  
                  {/* Tab Label */}
                  <div className="absolute inset-0 flex items-center px-4 pt-1 z-10">
                    <span className="text-[10px] font-mono text-[#c8e0f5] tracking-tight">
                      0{index + 1} // {work.category}
                    </span>
                  </div>
                </div>

                <article className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                  {/* Image container */}
                  <div className="relative aspect-[1.2/1] md:aspect-[2/1] overflow-hidden bg-secondary">
                    <Image
                      src={work.image || "/placeholder.svg"}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Content */}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-[460px] p-6 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-2xl transition-all duration-500 group-hover:bg-background/90">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">{work.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{work.description}</p>
                        </div>
                        <div className="p-2.5 rounded-full bg-secondary/80 border border-border transition-colors group-hover:bg-secondary shrink-0">
                          <ArrowUpRight
                            className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            style={{ color: "#c8e0f5" }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        {work.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3.5 py-1.5 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full border border-border/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full hover:bg-secondary transition-colors"
            style={{ color: "#c8e0f5", borderColor: "#c8e0f5" }}
          >
            View all works
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
