import { RESUME_FILENAME } from "@/lib/contact"
import { documentUrl } from "@/lib/documents"
import { getProfile } from "@/lib/settings-data"

/**
 * The resume, at the address it has always had - links already sent out keep
 * working, and always get the current file. Which file that is comes from the
 * admin (the `profile` setting); the PDF itself lives in Supabase Storage.
 *
 * Passed through rather than redirected, so the address bar stays on this
 * site and the download is named properly.
 */
export async function GET() {
  const { resume } = await getProfile()

  const file = await fetch(documentUrl(resume.path), { cache: "no-store" })
  if (!file.ok || !file.body) {
    console.error(`Resume: Supabase answered ${file.status} for ${resume.path}`)
    return new Response("The resume is unavailable right now. Please try again shortly.", { status: 502 })
  }

  return new Response(file.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${RESUME_FILENAME}"`,
      // Vercel's edge keeps a copy for a minute, so a new upload is live within one
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
    },
  })
}
