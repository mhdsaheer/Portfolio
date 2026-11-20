/**
 * The public half of the Supabase connection. Both values are safe in the
 * browser: the publishable key can only do what Row Level Security allows
 * (supabase/migrations/0001_insights.sql), which for visitors is reading
 * published articles.
 */
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).",
    )
  }

  return { url, key }
}
