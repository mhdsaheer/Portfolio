import "server-only"

import { createHash } from "node:crypto"
import { isIPv4, isIPv6 } from "node:net"

import { headers } from "next/headers"

import type { createSessionClient } from "@/lib/supabase/server"

/*
 * The rate limit on the admin sign-in. Attempts are counted in Postgres
 * (supabase/migrations/0005_login_attempts.sql), not in memory: each serverless
 * instance has its own memory, and loses it between requests.
 */

type SessionClient = Awaited<ReturnType<typeof createSessionClient>>

export type LoginAttempt = { ok: true; clear: () => Promise<void> } | { ok: false; error: string }

/**
 * Counts one sign-in attempt from this visitor's address on this email, or
 * refuses it once a limit is reached. After a successful sign-in, call clear()
 * so the attempts that led up to it stop counting.
 *
 * If Supabase can't be asked, the sign-in is refused too: a limit that turns
 * itself off whenever something breaks isn't much of a limit.
 */
export async function recordLoginAttempt(supabase: SessionClient, email: string): Promise<LoginAttempt> {
  const address = addressOf((await headers()).get("x-forwarded-for"))
  const keys = { hashed_ip: sha256(address), hashed_email: sha256(email.toLowerCase()) }

  const { data: wait, error } = await supabase.rpc("login_attempt", keys)
  if (error || typeof wait !== "number") {
    console.error("Login rate limit: Supabase couldn't count the attempt", error)
    return { ok: false, error: "Sign-in isn't available right now. Try again later." }
  }

  if (wait > 0) {
    const minutes = Math.ceil(wait / 60)
    return { ok: false, error: `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` }
  }

  return {
    ok: true,
    async clear() {
      const { error } = await supabase.rpc("clear_login_attempts", keys)
      // The sign-in has already worked; at worst its attempts count for 15 more minutes
      if (error) console.error("Login rate limit: couldn't clear attempts after signing in", error)
    },
  }
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

/**
 * Whose attempt this is, from x-forwarded-for. On Vercel that header holds the
 * visitor's address alone, and Vercel overwrites whatever the visitor sends,
 * so it can't be faked. Requests without it share one "unknown" allowance.
 *
 * IPv6 is counted per /64, the block one home or phone is usually given -
 * otherwise a single visitor could hop between billions of addresses.
 */
function addressOf(forwardedFor: string | null) {
  const ip = forwardedFor?.split(",")[0].trim() ?? ""
  if (isIPv4(ip)) return ip
  if (!isIPv6(ip)) return "unknown"

  // An IPv4 visitor seen through IPv6 (::ffff:1.2.3.4) is still that IPv4 address
  const mapped = /^::ffff:([\d.]+)$/i.exec(ip)?.[1]
  if (mapped && isIPv4(mapped)) return mapped

  // Write out the zero groups "::" stands for, then keep the first four (64 bits).
  // A dotted IPv4 ending ("64:ff9b::1.2.3.4") takes up two groups.
  const [head, tail] = ip.toLowerCase().split("::")
  const left = head ? head.split(":") : []
  const right = tail ? tail.split(":") : []
  const zeros = Math.max(0, 8 - left.length - right.length - (ip.includes(".") ? 1 : 0))
  const groups = tail === undefined ? left : [...left, ...Array<string>(zeros).fill("0"), ...right]
  return `${groups.slice(0, 4).map((group) => group.replace(/^0+(?=.)/, "")).join(":")}::/64`
}
