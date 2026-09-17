"use client"

import { useEffect, useState } from "react"

/**
 * The scene and the library are served from our own origin.
 *
 * UnicornStudio's own loader pulls the library from a third-party CDN and then
 * fetches the scene from storage.googleapis.com with a `v=${Date.now()}` cache
 * buster, so neither is ever reused between loads. Self-hosting removes two
 * cross-origin handshakes and lets the browser cache both.
 */
const LIB_SRC = "/unicorn/unicornStudio.umd.js"
const SCENE_SRC = "/unicorn/scene.json"
const PROJECT_ID = "tnAhw4e67txvvqrBP7oz"
const ELEMENT_ID = "mesh-canvas"

declare global {
  interface Window {
    UnicornStudio?: {
      addScene: (config: Record<string, unknown>) => Promise<{ destroy?: () => void } | undefined>
      init: () => void
    }
  }
}

let libPromise: Promise<void> | null = null

function loadLibrary() {
  if (window.UnicornStudio) return Promise.resolve()

  if (!libPromise) {
    libPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${LIB_SRC}"]`)
      if (existing) {
        existing.addEventListener("load", () => resolve())
        existing.addEventListener("error", () => reject(new Error("UnicornStudio failed to load")))
        return
      }

      const script = document.createElement("script")
      script.src = LIB_SRC
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("UnicornStudio failed to load"))
      document.head.appendChild(script)
    })
  }

  return libPromise
}

export function UnicornBackground() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let scene: { destroy?: () => void } | undefined

    const start = async () => {
      try {
        await loadLibrary()
        if (cancelled || !window.UnicornStudio) return

        // filePath is fetched as-is, so this stays same-origin and cacheable
        scene = await window.UnicornStudio.addScene({
          elementId: ELEMENT_ID,
          filePath: SCENE_SRC,
          fps: 60,
          scale: 1,
          dpi: 1.5,
          lazyLoad: false,
          altText: "",
          ariaLabel: "",
        })

        if (!cancelled) setIsReady(true)
      } catch {
        // Fall back to the library's own loader, which reads data-us-project
        try {
          window.UnicornStudio?.init()
          if (!cancelled) setIsReady(true)
        } catch {
          // Leave the flat background in place rather than an empty canvas
        }
      }
    }

    start()

    return () => {
      cancelled = true
      scene?.destroy?.()
    }
  }, [])

  return (
    <div
      id={ELEMENT_ID}
      data-us-project={PROJECT_ID}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: isReady ? 1 : 0,
        transition: "opacity 600ms ease-out",
      }}
    />
  )
}
