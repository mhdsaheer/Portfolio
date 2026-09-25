import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter_Tight, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { MagneticCursor } from "@/components/ui/magnetic-cursor"
import { IntroLoader } from "@/components/ui/intro-loader"
import { UnicornBackground } from "@/components/ui/unicorn-background"
import "./globals.css"

import { SmoothScroll } from "@/components/smooth-scroll"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Portfolio | Digital Product Designer",
  description: "Independent digital product designer crafting thoughtful, pixel-perfect experiences for the web.",
  keywords: ["design", "portfolio", "UI/UX", "product design", "digital design"],
  authors: [{ name: "Portfolio" }],
  openGraph: {
    title: "Portfolio | Digital Product Designer",
    description: "Independent digital product designer crafting thoughtful, pixel-perfect experiences for the web.",
    type: "website",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Start the background's bytes during HTML parse, not after hydration */}
        <link rel="preload" href="/unicorn/unicornStudio.umd.js" as="script" />
        <link rel="preload" href="/unicorn/scene.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${interTight.className} ${playfairDisplay.variable} ${geistMono.variable} font-sans antialiased`}>
        <SmoothScroll>
          <IntroLoader />
          <UnicornBackground />
          <MagneticCursor />
          {children}
          <Analytics />
          <SpeedInsights />
        </SmoothScroll>
      </body>
    </html>
  )
}

