"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signup } from "@/app/actions/auth"

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await signup(formData)
      return result || { error: "" }
    },
    { error: "" }
  )

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-canvas">
      <div className="w-full max-w-md bg-canvas-soft rounded-md p-8 shadow-sm border border-hairline-soft">
        <div className="text-center mb-8">
          <h1 className="text-heading-3 mb-2">Join Alathurpadi Dars</h1>
          <p className="text-body-sm text-text-muted">Create an account to begin your journey.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-label text-ink" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
              placeholder="Abdullah bin Tariq"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label text-ink" htmlFor="email">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-label text-ink" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="text-caption text-on-primary bg-[#ef4444] p-2 rounded-sm mt-2">
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="component-button-primary w-full mt-3 disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-8 text-center text-body-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-link text-ink hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
