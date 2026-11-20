"use client"

import { useActionState } from "react"

import { signIn, type LoginState } from "@/app/admin/actions"
import { Field } from "@/components/admin/fields"
import { BUTTON_PRIMARY, INPUT } from "@/components/admin/styles"

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {})

  return (
    <form action={action} className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" required className={INPUT} />
      </Field>
      <Field label="Password" htmlFor="password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={INPUT} />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button type="submit" className={`${BUTTON_PRIMARY} w-full justify-center`} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}
