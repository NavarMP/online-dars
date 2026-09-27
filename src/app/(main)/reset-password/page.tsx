"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus("error")
    } else {
      setStatus("sent")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-canvas">
      <div className="w-full max-w-md bg-canvas-soft rounded-md p-8 shadow-sm border border-hairline-soft">
        {status === "sent" ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-ink text-on-primary flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-heading-3 mb-3">Check Your Email</h1>
            <p className="text-body text-text-muted mb-6">
              We've sent a password reset link to <strong className="text-ink">{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <Link href="/login" className="text-link text-ink hover:underline">
              ← Back to Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-heading-3 mb-2">Reset Password</h1>
              <p className="text-body-sm text-text-muted">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-label text-ink" htmlFor="reset-email">Email address</label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              {status === "error" && (
                <div className="text-caption text-on-primary bg-[#ef4444] p-2 rounded-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="component-button-primary w-full mt-3 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-8 text-center text-body-sm text-text-muted">
              Remember your password?{" "}
              <Link href="/login" className="text-link text-ink hover:underline">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
