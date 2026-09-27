export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-[700] leading-none text-hairline mb-4 select-none">
          404
        </div>
        <h1 className="text-heading-3 mb-3">Page Not Found</h1>
        <p className="text-body text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="component-button-primary">
          Return Home
        </a>
      </div>
    </main>
  )
}
