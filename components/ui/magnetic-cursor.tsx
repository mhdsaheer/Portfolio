"use client"

import { useEffect, useRef, useState } from "react"

type Ripple = { id: number; x: number; y: number }

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isPressing, setIsPressing] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    let animationFrameId: number
    // Where the pointer actually is - the dot never deviates from this
    let pointerX = 0
    let pointerY = 0
    // Where the ring is heading, magnetism included
    let ringTargetX = 0
    let ringTargetY = 0
    let ringX = 0
    let ringY = 0
    let hasMoved = false

    // Selectors for interactive elements
    const interactiveSelectors = [
      "a[href]",
      "button",
      '[data-slot="button"]',
      'input[type="submit"]',
      '[role="button"]',
    ].join(", ")

    const handleMouseMove = (e: MouseEvent) => {
      pointerX = e.clientX
      pointerY = e.clientY
      ringTargetX = pointerX
      ringTargetY = pointerY

      // The dot tracks the pointer 1:1 so aim and click always agree
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
      }

      if (!hasMoved) {
        hasMoved = true
        ringX = pointerX
        ringY = pointerY
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement
      const interactive = target.closest(interactiveSelectors)

      setIsHovering((current) => (current !== Boolean(interactive) ? Boolean(interactive) : current))

      if (interactive) {
        const rect = interactive.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = pointerX - centerX
        const deltaY = pointerY - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // Magnetic effect within 80px radius - ring only, so the dot stays honest
        if (distance < 80) {
          const pullStrength = 0.35
          ringTargetX = pointerX - deltaX * pullStrength
          ringTargetY = pointerY - deltaY * pullStrength
        }
      }
    }

    const animate = () => {
      const ease = 0.22
      ringX += (ringTargetX - ringX) * ease
      ringY += (ringTargetY - ringY) * ease

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Click micro-interaction: the cursor squeezes on press and releases a ripple
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const timeouts: ReturnType<typeof setTimeout>[] = []

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      setIsPressing(true)

      if (prefersReducedMotion) return

      const id = Date.now() + Math.random()
      setRipples((current) => [...current, { id, x: e.clientX, y: e.clientY }])
      timeouts.push(
        setTimeout(() => {
          setRipples((current) => current.filter((ripple) => ripple.id !== id))
        }, 600),
      )
    }

    const handleMouseUp = () => setIsPressing(false)

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("blur", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseUp)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("blur", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseUp)
      timeouts.forEach(clearTimeout)
    }
  }, [])

  const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)"

  return (
    <>
      {/* Main cursor dot - pinned to the real pointer position */}
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block">
        <div
          className="rounded-full bg-white"
          style={{
            width: isHovering ? "14px" : "8px",
            height: isHovering ? "14px" : "8px",
            transform: `translate(-50%, -50%) scale(${isPressing ? 0.55 : 1})`,
            transition: `width 0.2s, height 0.2s, transform 0.25s ${spring}`,
          }}
        />
      </div>

      {/* Outer ring - trails and takes the magnetic pull */}
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference hidden md:block">
        <div
          className="rounded-full border border-white/40"
          style={{
            width: isHovering ? "56px" : "32px",
            height: isHovering ? "56px" : "32px",
            transform: `translate(-50%, -50%) scale(${isPressing ? 0.75 : 1})`,
            transition: `width 0.3s, height 0.3s, transform 0.35s ${spring}`,
          }}
        />
      </div>

      {/* Click ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference hidden md:block"
          style={{ transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0)` }}
        >
          <div className="cursor-ripple rounded-full border border-white/70" />
        </div>
      ))}

      {/* Global cursor style */}
      <style jsx global>{`
        @media (min-width: 768px) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }

        .cursor-ripple {
          width: 24px;
          height: 24px;
          transform: translate(-50%, -50%) scale(0.4);
          opacity: 0.9;
          animation: cursor-ripple 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cursor-ripple {
          to {
            transform: translate(-50%, -50%) scale(2.6);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cursor-ripple {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
