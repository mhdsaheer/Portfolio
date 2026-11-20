import type { ServicesSource } from "@/lib/settings-content"

/**
 * The services as they were written before the admin existed. Kept only so
 * scripts/seed-settings.ts can copy them into Supabase; delete this file once
 * that is done.
 */
export const services: ServicesSource = [
  {
    title: "Front-End Development",
    skills: ["React.js", "Next.js", "JavaScript (ES6+)", "HTML5 & CSS3", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Back-End & CMS",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Strapi CMS", "Moodle"],
  },
  {
    title: "UI/UX Design",
    skills: ["Figma", "Adobe XD", "Responsive Design", "Cross-Browser Compatibility", "Canva", "Notion"],
  },
  {
    title: "Branding & Identity",
    skills: ["Logo Design", "Brand Identity", "Photoshop", "Illustrator", "InDesign"],
  },
]
