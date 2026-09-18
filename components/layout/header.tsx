"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "#works", label: "Selected work", short: "Work", number: "01" },
  { href: "#about", label: "About", short: "About", number: "02" },
  { href: "#testimonials", label: "What clients say", short: "Clients", number: "03" },
  { href: "#awards", label: "Awards & Recognition", short: "Awards", number: "04" },
  { href: "#insights", label: "Insights", short: "Insights", number: "05" },
]

/**
 * Two thresholds, not one. A single threshold makes the nav flip back and forth
 * when you creep across it; engaging later than it releases keeps it settled.
 */
const ENGAGE_AT = 80
const RELEASE_AT = 30

/** Below this the nav never hides - the hero keeps it in view. */
const HIDE_AFTER = 0.9 // of one viewport
/** Ignore the tiny deltas smooth scrolling produces while settling. */
const DIRECTION_DEADZONE = 6
/**
 * Hiding waits for intent rather than reacting to the first downward pixel:
 * the nav leaves after a deliberate push down, and returns on a small nudge up.
 */
const HIDE_INTENT = 64
const SHOW_INTENT = 24

const CTA_GRADIENT = "linear-gradient(135deg, #203eec 0%, #00d4ff 100%)"

/** One wordmark, used by the bar, the pill and the mobile drawer. */
function Wordmark({ size = "text-lg" }: { size?: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[10px] text-white/55 leading-none">©</span>
      <span className={`font-serif italic font-semibold ${size} text-white leading-none`}>Saheer</span>
    </span>
  )
}

/**
 * Both spellings live in the DOM at once. An invisible copy holds the width the
 * box should animate to, while the two visible copies cross-fade over it, so the
 * text dissolves instead of snapping mid-shrink.
 */
function NavLabel({
  item,
  isScrolled,
}: {
  item: (typeof navItems)[number]
  isScrolled: boolean
}) {
  return (
    <span className="relative block">
      <span aria-hidden className="invisible block whitespace-nowrap">
        {isScrolled ? item.short : `${item.label} (${item.number})`}
      </span>

      <span
        className={cn(
          "absolute inset-0 whitespace-nowrap transition-opacity duration-300 ease-out",
          isScrolled ? "opacity-0" : "opacity-100",
        )}
      >
        {item.label}
        <span className="text-xs ml-1 opacity-50">({item.number})</span>
      </span>

      <span
        className={cn(
          "absolute inset-0 whitespace-nowrap transition-opacity duration-300 ease-out",
          isScrolled ? "opacity-100" : "opacity-0",
        )}
      >
        {item.short}
      </span>
    </span>
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const lastY = useRef(0)
  const travel = useRef(0)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setIsScrolled((current) => (current ? y > RELEASE_AT : y > ENGAGE_AT))

      const delta = y - lastY.current
      if (Math.abs(delta) < DIRECTION_DEADZONE) return
      lastY.current = y

      // Distance travelled since the last turn, so a stray pixel cannot flip it
      if (delta > 0 !== travel.current > 0) travel.current = 0
      travel.current += delta

      const pastHero = y > window.innerHeight * HIDE_AFTER
      if (!pastHero) {
        setIsHidden(false)
        return
      }

      if (travel.current > HIDE_INTENT) setIsHidden(true)
      else if (travel.current < -SHOW_INTENT) setIsHidden(false)
    }
    lastY.current = window.scrollY
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Off the home page the sections do not exist yet - let the router handle it
    if (!isHome) {
      setIsMobileMenuOpen(false)
      return
    }

    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const headerOffset = 80 // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    setIsMobileMenuOpen(false)
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Geometry is animated by framer (layout), the skin by CSS. They are kept
  // apart on purpose: a CSS `transition-all` here would fight the transform
  // framer uses to tween the box.
  const hidden = isHidden && !isMobileMenuOpen

  const morph = reduceMotion
    ? { duration: 0 }
    : { duration: 0.62, ease: [0.32, 0.72, 0, 1] as const }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="flex justify-center px-4 md:px-6"
          animate={{ y: hidden ? -110 : 0, opacity: hidden ? 0 : 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  // Eases away without a jolt; comes back a little quicker so
                  // scrolling up feels answered rather than waited on
                  y: hidden
                    ? { duration: 0.75, ease: [0.4, 0, 0.2, 1] }
                    : { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  opacity: hidden ? { duration: 0.55, ease: "easeOut" } : { duration: 0.3, ease: "easeOut" },
                }
          }
          style={{ pointerEvents: hidden ? "none" : "auto" }}
          aria-hidden={hidden}
        >
          <motion.nav
            layout
            transition={morph}
            style={{ borderRadius: 999 }}
            className={cn(
              "flex items-center border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[620ms] ease-out",
              isScrolled
                ? "mt-3 md:mt-4 w-auto gap-3 md:gap-7 py-2 pl-5 md:pl-7 pr-2 bg-[#0d1b2c]/65 border-white/12 backdrop-blur-xl shadow-[0_10px_40px_rgba(4,10,18,0.45)]"
                : "mt-0 w-full max-w-[1280px] justify-between gap-6 py-4 md:py-5 px-2 md:px-6 bg-transparent border-transparent backdrop-blur-none shadow-none",
            )}
          >
            {/* Logo */}
            <motion.div layout="position" transition={morph}>
              <Link href="/" onClick={handleLogoClick} className="block shrink-0">
                <Wordmark size={isScrolled ? "text-lg md:text-xl" : "text-xl"} />
              </Link>
            </motion.div>

            {/* Desktop navigation - labels shorten as the bar contracts */}
            <motion.div
              layout="position"
              transition={morph}
              className={cn("hidden md:flex items-center", isScrolled ? "gap-7" : "gap-8")}
            >
              {navItems.map((item) => (
                <motion.div key={item.href} layout="position" transition={morph}>
                  <Link
                    href={isHome ? item.href : `/${item.href}`}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "block text-sm whitespace-nowrap transition-colors",
                      isScrolled ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <NavLabel item={item} isScrolled={isScrolled} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div layout="position" transition={morph} className="hidden md:block">
              <Link
                href={isHome ? "#contact" : "/#contact"}
                className={cn(
                  "inline-flex items-center justify-center text-sm font-medium rounded-full text-white relative overflow-hidden group whitespace-nowrap transition-[padding,box-shadow] duration-[620ms] ease-out",
                  isScrolled ? "px-6 py-3" : "px-5 py-2.5",
                )}
                style={{ background: CTA_GRADIENT, boxShadow: "0 4px 20px rgba(32, 62, 236, 0.32)" }}
              >
                <span className="relative z-10">Let's Talk</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-[#203eec] to-[#00d4ff]" />
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              layout="position"
              transition={morph}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-full text-white/80 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </motion.nav>
        </motion.div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Wordmark />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 mt-12">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-3xl font-semibold hover:text-muted-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <Link
                href={isHome ? "#contact" : "/#contact"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium rounded-full text-white transition-all hover:shadow-xl relative overflow-hidden group"
                style={{ background: CTA_GRADIENT, boxShadow: "0 4px 20px rgba(32, 62, 236, 0.3)" }}
              >
                <span className="relative z-10">Let's Talk</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-[#203eec] to-[#00d4ff]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
