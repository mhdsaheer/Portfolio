import Image from "next/image"

const photos = [
  { src: "/images/saheer_portrait.png", alt: "Muhammed Saheer", tall: true },
  { src: "/images/designer.png", alt: "The desk most of this gets built at", tall: false },
  { src: "/images/portfolio_kinetic_ui.png", alt: "Kinetic UI motion study", tall: false },
  { src: "/images/work-crypto.png", alt: "Crypto trading interface", tall: true },
  { src: "/images/portfolio_vanguard_brand.png", alt: "Vanguard brand system", tall: false },
  { src: "/images/work-fashion.png", alt: "Fashion commerce interface", tall: true },
]

/**
 * A continuous band of work and workspace shots closing the page. The list is
 * rendered twice so the track can translate a clean -50% and loop seamlessly;
 * the duplicate is hidden from assistive tech.
 */
export function PhotoStrip() {
  return (
    <section aria-label="Photographs" className="py-12 md:py-20 overflow-hidden">
      <div className="group flex w-max animate-marquee gap-4 md:gap-6 hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4 md:gap-6" aria-hidden={copy === 1 || undefined}>
            {photos.map((photo) => (
              <figure
                key={photo.src}
                className={`relative shrink-0 overflow-hidden rounded-[1.5rem] border border-border bg-secondary ${
                  photo.tall ? "w-[16rem] md:w-[20rem] aspect-[3/4]" : "w-[22rem] md:w-[28rem] aspect-[4/3]"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={copy === 1 ? "" : photo.alt}
                  fill
                  sizes="(min-width: 768px) 28rem, 22rem"
                  className="object-cover object-center"
                />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
