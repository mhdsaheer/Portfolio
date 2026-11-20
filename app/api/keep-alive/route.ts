import { createPublicClient } from "@/lib/supabase/public"

/**
 * Called once a day by Vercel Cron (vercel.json). Supabase pauses a free
 * project after a week without activity, and the public pages are static, so
 * normal visits never reach it - this one small query is the activity.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET`, so nobody else can call it.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { error } = await createPublicClient().from("insights").select("slug").limit(1)
  if (error) return Response.json({ ok: false, error: error.message }, { status: 502 })

  return Response.json({ ok: true, at: new Date().toISOString() })
}
