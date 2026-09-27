"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, User, LogOut, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { signout } from "@/app/actions/auth"

type UserData = {
  id: string
  email?: string
  full_name?: string
  role?: string
  avatar_url?: string
} | null

export function NavigationDock() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [user, setUser] = React.useState<UserData>(null)
  const [loading, setLoading] = React.useState(true)
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Fetch auth state on client
  React.useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", authUser.id)
          .single()
        
        setUser({
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name || authUser.email?.split("@")[0],
          role: profile?.role || "student",
          avatar_url: profile?.avatar_url,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (previous && latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/kutub", label: "Kutub" },
    { href: "/instructors", label: "Instructors" },
    { href: "/about", label: "About" },
  ]

  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")

  return (
    <>
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <nav className="pointer-events-auto flex items-center justify-between bg-canvas/80 backdrop-blur-xl px-2 py-2 rounded-full shadow-sm border border-hairline/50 w-full max-w-4xl">
          {/* Logo Section */}
          <div className="flex items-center gap-2 px-3">
            <Link href="/" className="flex items-center gap-2 text-ink hover:opacity-80 transition-opacity">
              <Image src="/logo.svg" alt="Suffa Logo" width={24} height={24} className="dark:invert" />
              <span className="text-link font-[700] hidden sm:block">الصفة</span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-full text-body-sm font-[500] transition-colors ${
                  pathname === item.href 
                    ? "text-ink bg-canvas-soft" 
                    : "text-text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-canvas-soft transition-colors text-ink"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Auth State */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-1">
                    {user.role === "admin" && (
                      <Link 
                        href="/admin" 
                        className="hidden sm:flex items-center gap-1 text-body-sm text-text-muted hover:text-ink px-2 py-1.5 rounded-full hover:bg-canvas-soft transition-colors"
                        title="Admin Panel"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <Link 
                      href="/account" 
                      className="flex items-center gap-2 bg-canvas-soft hover:bg-hairline-soft text-ink rounded-full px-3 h-9 transition-colors"
                    >
                      {user.avatar_url ? (
                        <Image src={user.avatar_url} alt="" width={20} height={20} className="rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-text-muted" />
                      )}
                      <span className="text-body-sm font-[500] hidden sm:block max-w-[100px] truncate">
                        {user.full_name}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    <Link 
                      href="/login" 
                      className="text-body-sm font-[500] text-text-muted hover:text-ink px-3 py-1.5 rounded-full hover:bg-canvas-soft transition-colors"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-primary text-on-primary text-body-sm font-[500] rounded-full px-4 h-9 flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-canvas-soft transition-colors text-ink"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-canvas/95 backdrop-blur-xl pt-28 px-6"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex flex-col gap-2"
            >
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * (i + 1) }}
                >
                  <Link
                    href={item.href}
                    className={`block py-3 text-heading-3 font-[600] transition-colors ${
                      pathname === item.href ? "text-ink" : "text-text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-hairline mt-4 pt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/account" className="flex items-center gap-3 py-2 text-body text-ink font-[500]">
                      <User className="w-5 h-5 text-text-muted" />
                      My Learning
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" className="flex items-center gap-3 py-2 text-body text-ink font-[500]">
                        <Shield className="w-5 h-5 text-text-muted" />
                        Admin Panel
                      </Link>
                    )}
                    <form action={signout}>
                      <button type="submit" className="flex items-center gap-3 py-2 text-body text-text-muted hover:text-ink transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="component-button-outline w-full text-center">Log in</Link>
                    <Link href="/signup" className="component-button-primary w-full text-center">Sign up</Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
