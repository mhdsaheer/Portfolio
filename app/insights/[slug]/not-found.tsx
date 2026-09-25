import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function InsightNotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-32 text-center">
          <span className="text-[11px] font-mono tracking-tight" style={{ color: "#c8e0f5" }}>
            404 // Article
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-balance">
            This one isn&apos;t written yet
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md mx-auto">
            The article you are looking for is not here. The rest of the writing is still worth a read.
          </p>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 mt-10 px-6 py-3 text-sm font-medium border rounded-full hover:bg-secondary transition-colors"
            style={{ color: "#c8e0f5", borderColor: "#c8e0f5" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to insights
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
