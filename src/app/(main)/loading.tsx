export default function MainLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-hairline border-t-ink rounded-full animate-spin" />
        <p className="text-body-sm text-text-muted animate-pulse">Loading...</p>
      </div>
    </main>
  )
}
