import type { WorkFileSource } from "@/lib/project-content"

/**
 * The work files as they were written before the admin existed, in the order
 * the index shows them. Kept only so scripts/seed-projects.ts can copy them
 * into Supabase; delete this file once that is done.
 */
export const workFiles: WorkFileSource[] = [
  {
    slug: "havana-foods-menu",
    title: "Havana Foods menu",
    kind: "Tri-fold menu",
    services: ["Branding"],
    year: "2026",
    format: "image",
    src: "/images/work-havana-menu-1.jpg",
    cover: "/images/work-havana-menu-cover.jpg",
    alt: "The outside of the Havana Foods tri-fold menu: the fork mark and Havana Caters & Events on the cover, a sadya on a banana leaf on the red centre panel, and roties and vegetarian dishes on the flap",
    more: [
      {
        src: "/images/work-havana-menu-2.jpg",
        alt: "The inside of the menu opened flat, deep red, listing dry and grilled dishes, mutton and beef, rice and fish beside plates of grilled chicken, fish curry and ghee rice",
      },
      {
        src: "/images/work-havana-menu-3.jpg",
        alt: "The folded menu showing its white cover with the Havana mark, lying beside a second copy opened to the red inside spread",
      },
      {
        src: "/images/work-havana-menu-4.jpg",
        alt: "Two copies of the menu side by side, one showing the white outside panels and the other the red inside spread",
      },
    ],
  },
  {
    slug: "calesto-catalogue",
    title: "Calesto Inspace catalogue",
    kind: "Product catalogue",
    services: ["Branding"],
    year: "2026",
    format: "image",
    src: "/images/work-calesto-catalogue-1.jpg",
    cover: "/images/work-calesto-catalogue-cover.jpg",
    alt: "The Calesto catalogue open to a spread headed Feel The Art Of Sitting, with a black mesh office chair reclined across both pages",
    more: [
      {
        src: "/images/work-calesto-catalogue-2.jpg",
        alt: "The catalogue open flat from above on the Workstation spread, a navy and white desk system photographed in a high-rise office",
      },
      {
        src: "/images/work-calesto-catalogue-3.jpg",
        alt: "A page mid-turn showing an orange leather executive chair, above a page of four visitor chairs under the heading Revitalize your work",
      },
      {
        src: "/images/work-calesto-catalogue-4.jpg",
        alt: "The catalogue with its navy cover rolled back, open to a full-page photo of green office cubicles titled Contemporary Workstation",
      },
      {
        src: "/images/work-calesto-catalogue-5.jpg",
        alt: "The catalogue lying face down and open, showing the navy front and back covers with the white Calesto Inspace logo on each",
      },
      {
        src: "/images/work-calesto-catalogue-6.jpg",
        alt: "Three copies of the catalogue stacked, back cover up, navy with the Calesto Inspace logo and contact details",
      },
      {
        src: "/images/work-calesto-catalogue-7.jpg",
        alt: "Three copies of the catalogue fanned out, showing the navy front cover with the white Calesto Inspace logo",
      },
    ],
  },
  {
    slug: "juiso-packaging",
    title: "Juiso logo, packaging & poster",
    kind: "Logo design, packaging & signage",
    services: ["Branding"],
    year: "2026",
    format: "image",
    src: "/images/work-juiso-takeaway.jpg",
    alt: "Juiso takeaway packaging on a steel counter: blue and cream fry sleeves spilling fries, and three burger boxes with round sauce windows, printed with the Juiso logo and sticker-style food illustrations",
    more: [
      {
        src: "/images/work-juiso-poster.jpg",
        alt: "A backlit blue Juiso poster on a tiled restaurant wall reading Squeeze the day! above a juice cup, a burger and citrus slices, glowing on the counters below",
      },
      {
        src: "/images/work-juiso-logo.jpg",
        alt: "The Juiso logo: the name in rounded cream letters inside a thick blue sticker outline, followed by a blue dot, on white",
      },
    ],
  },
  {
    slug: "new-year-2026-posts",
    title: "New Year 2026 posts",
    kind: "Social media posts",
    services: ["Branding"],
    year: "2025",
    format: "image",
    src: "/images/work-new-year-febno.jpg",
    cover: "/images/work-new-year-technodot.jpg",
    alt: "A Febno Technologies New Year post: Happy New Year in white script over a large 2026, a robotic hand reaching up beneath it and a ribbon of colour sweeping across a black background, with the line Together through trust and technology",
    more: [
      {
        src: "/images/work-new-year-technodot.jpg",
        alt: "A Technodot Academy New Year post: a woman in a VR headset reaching out beneath a large white 2026, happy new year written across it in thin script, on deep navy, with the line New Skills, New Mindset, New Year",
      },
    ],
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
