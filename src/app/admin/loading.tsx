export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-hairline border-t-ink rounded-full animate-spin" />
        <p className="text-body-sm text-text-muted animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
