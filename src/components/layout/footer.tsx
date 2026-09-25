import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-ink text-on-primary rounded-t-md px-lg py-section mt-section-lg w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-xl">
        
        {/* Brand Area */}
        <div className="flex flex-col gap-md max-w-xs">
          <div className="flex items-center gap-xs">
            <Image src="/logo.svg" alt="'ilm Logo" width={32} height={32} className="invert" />
            <span className="text-heading-4 tracking-tight">علم</span>
          </div>
          <p className="text-text-faint text-body-sm">
            Traditional Knowledge. Modern Access.<br />
            Brought to you by Alathurpadi Dars Students Association (ADSA).
          </p>
          <div className="mt-sm flex gap-md">
            <Link href="https://api.whatsapp.com/send?phone=919074525205" className="text-text-muted hover:text-on-primary transition-colors text-body-sm">
              WhatsApp
            </Link>
            <Link href="https://www.instagram.com/alathurpadi_dars/" className="text-text-muted hover:text-on-primary transition-colors text-body-sm">
              Instagram
            </Link>
            <Link href="https://www.youtube.com/alathurpadidars" className="text-text-muted hover:text-on-primary transition-colors text-body-sm">
              YouTube
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-xl">
          <div className="flex flex-col gap-sm">
            <span className="text-label text-text-faint mb-xs">Platform</span>
            <Link href="/courses" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Courses</Link>
            <Link href="/kutub" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Library</Link>
            <Link href="/materials" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Study Materials</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="text-label text-text-faint mb-xs">Organization</span>
            <Link href="/about" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">About Dars</Link>
            <Link href="/instructors" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Instructors</Link>
            <Link href="/contact" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="text-label text-text-faint mb-xs">Legal</span>
            <Link href="/terms" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-body-sm text-text-muted hover:text-on-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-xl pt-lg border-t border-ink-soft flex items-center justify-between">
        <span className="text-caption text-text-faint">© {new Date().getFullYear()} Alathurpadi Dars Students Association.</span>
        <div className="flex items-center gap-xs">
          <Image src="/adsa-logo.svg" alt="ADSA" width={24} height={24} className="opacity-50 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  )
}
