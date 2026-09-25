"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function NavigationDock() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = React.useState(false)
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (previous && latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: -100 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-xl left-0 right-0 z-50 flex justify-center px-md pointer-events-none"
    >
      <nav className="pointer-events-auto flex items-center justify-between bg-canvas-soft/80 backdrop-blur-md px-xs py-xs rounded-full shadow-sm border border-hairline w-full max-w-4xl">
        {/* Logo Section */}
        <div className="flex items-center gap-xs px-sm">
          <Link href="/" className="flex items-center gap-xs text-ink hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="'ilm Logo" width={24} height={24} className="dark:invert" />
            <span className="text-link font-[700] hidden sm:block">علم</span>
          </Link>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-md">
          {[
            { href: "/courses", label: "Courses" },
            { href: "/kutub", label: "Kutub" },
            { href: "/instructors", label: "Instructors" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-link transition-colors ${
                pathname === item.href ? "text-ink" : "text-text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-xs">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === "dark" || (theme === "system" && systemTheme === "dark") ? "light" : "dark")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-canvas transition-colors text-ink"
              aria-label="Toggle theme"
            >
              {(theme === "dark" || (theme === "system" && systemTheme === "dark")) ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
          <Link 
            href="/login" 
            className="hidden sm:flex text-link text-ink hover:text-text-muted px-sm"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary text-on-primary text-link rounded-full px-md h-10 flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </motion.div>
  )
}
