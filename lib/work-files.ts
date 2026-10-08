import type { ServiceFilter } from "@/lib/case-studies"

/**
 * Work that is shown rather than written up - a logo sheet, a screen set, a
 * poster. Each opens straight from the index: images in the page's own viewer,
 * links in a new tab. Anything that needs the story told belongs in
 * lib/case-studies.ts instead; the one PDF is the old portfolio, ARCHIVE_PDF.
 */
export type WorkFile = {
  slug: string
  title: string
  /** What the piece is, in a word or two - "Brand identity", "Pitch deck". */
  kind: string
  services: ServiceFilter[]
  year: string
  /** Decides how it opens: the viewer for images, a new tab for links. */
  format: "image" | "link"
  /** The file under /public, or the address for a link. */
  src: string
  /** A cover for the card. A link without one gets a lettered cover. */
  cover?: string
  /** What the image shows, for anyone who cannot see it. Images only. */
  alt?: string
}

// DEMO: stand-ins built from what is already in /public. Swap each for your own
// files - drop them in /public/work and point `src` at them.
export const workFiles: WorkFile[] = [
  {
    slug: "vanguard-brand-system",
    title: "Vanguard brand system",
    kind: "Brand identity",
    services: ["Branding"],
    year: "2024",
    format: "image",
    src: "/images/portfolio_vanguard_brand.png",
    alt: "Vanguard brand system",
  },
  {
    slug: "kinetic-ui",
    title: "Kinetic UI",
    kind: "Motion study",
    services: ["UI/UX"],
    year: "2024",
    format: "image",
    src: "/images/portfolio_kinetic_ui.png",
    alt: "Kinetic UI motion study",
  },
  {
    slug: "aether-os",
    title: "Aether OS",
    kind: "Interface concept",
    services: ["UI/UX"],
    year: "2023",
    format: "image",
    src: "/images/portfolio_aether_os.png",
    alt: "Aether OS interface concept",
  },
  {
    slug: "glow-poster-series",
    title: "Glow poster series",
    kind: "Poster series",
    services: ["Branding"],
    year: "2023",
    format: "image",
    src: "/images/bg-2.png",
    alt: "A violet arc of light over black, from a poster series",
  },
  {
    slug: "github",
    title: "Open-source work",
    kind: "Code on GitHub",
    services: ["Development"],
    year: "2025",
    format: "link",
    src: "https://github.com/mhdsaheer",
  },
]

/** The old portfolio, kept whole as one PDF. DEMO: points at the sample file. */
export const ARCHIVE_PDF = "/demo/sample.pdf"
