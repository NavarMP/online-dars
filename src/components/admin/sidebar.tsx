"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  GraduationCap,
  CreditCard
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/kutub", label: "Kutub Library", icon: FileText },
  { href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-hairline bg-canvas h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-hairline">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <span className="font-bold tracking-tight text-title">علم Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-3 text-body-3 transition-colors ${
                isActive 
                  ? "bg-canvas-soft text-ink font-[600]" 
                  : "text-text-muted hover:bg-canvas-soft hover:text-ink"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-hairline">
        <form action="/auth/signout" method="post">
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-3 text-body-3 text-text-muted hover:bg-canvas-soft hover:text-ink transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
