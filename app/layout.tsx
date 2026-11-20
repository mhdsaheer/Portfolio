import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter_Tight, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SiteChrome } from "@/components/site-chrome"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

const interTight = Inter_Tight({
  subsets: ["latin"],
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
  // Resolves every page's relative share-image path against the live domain
  metadataBase: new URL(SITE_URL),
  title: "Muhammed Saheer - Front-End Developer & UI/UX Designer, India",
  description:
    "Front-end developer & UI/UX designer in Kerala, India. I design in Figma and build fast React & Next.js websites for businesses in India and the UAE.",
  keywords: [
    "Muhammed Saheer",
    "front-end developer",
    "UI/UX designer",
    "React developer",
    "Next.js developer",
    "Kerala",
    "India",
    "UAE",
  ],
  authors: [{ name: "Muhammed Saheer" }],
  openGraph: {
    title: "Muhammed Saheer - Front-End Developer & UI/UX Designer, India",
    description:
      "Front-end developer & UI/UX designer in Kerala, India. I design in Figma and build fast React & Next.js websites for businesses in India and the UAE.",
    type: "website",
  },
}

export const viewport: Viewport = {
  // The page's own ground (--background), so the mobile browser bar matches it
  themeColor: "#3a5f87",
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
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

