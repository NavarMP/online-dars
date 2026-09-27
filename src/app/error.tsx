"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mx-auto mb-6">
          <span className="text-heading-3">!</span>
        </div>
        <h1 className="text-heading-3 mb-3">Something went wrong</h1>
        <p className="text-body text-text-muted mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="component-button-primary">
            Try again
          </button>
          <a href="/" className="component-button-outline">
            Return Home
          </a>
        </div>
      </div>
    </main>
  )
}
