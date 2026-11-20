import { redirect } from "next/navigation"

import { getAdmin } from "@/lib/admin/auth"
import { LoginForm } from "@/components/admin/login-form"

export default async function Login() {
  if (await getAdmin()) redirect("/admin")

  return (
    <div className="mx-auto max-w-sm pt-12">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-neutral-500">For the site’s admin only.</p>
      <LoginForm />
    </div>
  )
}
