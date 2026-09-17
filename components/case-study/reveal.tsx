"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: "div" | "section" | "li" | "figure"
}

export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Tag = as as React.ElementType

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[6px]"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
