"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

import { useIntroDone } from "@/hooks/use-intro-done"

export function Hero() {
  const introDone = useIntroDone()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 relative overflow-hidden">


      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-4 pb-4 md:pt-10 md:pb-4 z-10">
        <div className="max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-muted-foreground mb-6 text-lg font-normal"
          >
            I'm Muhammed Saheer, 
          </motion.p>

          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate={introDone ? "visible" : "hidden"}
            className="text-6xl sm:text-7xl lg:text-[96px] font-semibold tracking-tight leading-[1.05] flex flex-col items-start gap-1"
          >
            <motion.span variants={lineVariants} className="block text-white font-sans font-extrabold">
              Designer.
            </motion.span>
            <motion.span variants={lineVariants} className="block text-white font-sans font-extrabold">
              Developer.
            </motion.span>
            <motion.span 
              variants={lineVariants} 
              className="block font-serif italic font-normal text-4xl sm:text-5xl lg:text-[72px] text-[#c8e0f5] mt-2 relative"
              style={{
                textShadow: "0 0 40px rgba(200, 224, 245, 0.15)",
              }}
            >
              who removes friction
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            className="mt-8 max-w-xl leading-relaxed text-left text-lg text-zinc-300 ml-0"
          >
            I craft intelligent, intuitive AI-powered products using vibe coding, generative design tools, and
            cutting-edge AI technologies. Let's build the future of human-AI interaction together.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
            className="flex flex-row items-start gap-4 mt-10"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white rounded-full transition-all relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #203eec 0%, #00d4ff 100%)",
                boxShadow: "0 4px 20px rgba(32, 62, 236, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(32, 62, 236, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(32, 62, 236, 0.3)"
              }}
            >
              Let's Talk
            </Link>
            <Link
              href="#works"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium transition-colors hover:text-white"
              style={{ color: "#c8e0f5" }}
            >
              View Works
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
