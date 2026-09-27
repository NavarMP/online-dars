"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

type Kitab = {
  id?: string
  title: string
  arabic_title: string
  category: string
  description: string
  is_featured?: boolean
}

export function KitabCard({ kitab, index }: { kitab: Kitab; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const rotateX = useMotionTemplate`${mouseYSpring.get() * -15}deg`
  const rotateY = useMotionTemplate`${mouseXSpring.get() * 15}deg`

  // Subtle background glow based on mouse position
  const background = useMotionTemplate`radial-gradient(
    400px circle at ${useMotionTemplate`${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%`},
    var(--color-primary-soft),
    transparent 80%
  )`

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-[350px] md:w-[450px] h-[500px] shrink-0 rounded-4 border border-white/5 bg-canvas/40 backdrop-blur-md overflow-hidden group cursor-pointer"
    >
      {/* Dynamic Shine/Glow Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background }}
      />
      
      {/* Oversized Arabic Typography Background */}
      <div 
        className="absolute -right-12 -top-12 text-[180px] md:text-[220px] font-arabic leading-none text-ink-soft opacity-[0.03] pointer-events-none select-none transition-transform duration-700 group-hover:scale-110" 
        dir="rtl"
      >
        {kitab.arabic_title}
      </div>

      <div className="relative h-full flex flex-col justify-between p-8 z-10" style={{ transform: "translateZ(30px)" }}>
        
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-hairline-soft bg-canvas/50 text-label text-text-muted backdrop-blur-sm">
            {kitab.category}
          </span>
          {kitab.is_featured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-label backdrop-blur-sm shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.2)]">
              Featured
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="mt-auto">
          <div className="mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <span className="text-display font-arabic text-ink/80 text-4xl block mb-4" dir="rtl">
              {kitab.arabic_title}
            </span>
          </div>
          
          <h3 className="text-heading-2 text-ink tracking-tight mb-3 font-semibold group-hover:text-accent transition-colors duration-300">
            {kitab.title}
          </h3>
          <p className="text-body-lg text-text-muted line-clamp-3 leading-relaxed mb-6 font-light">
            {kitab.description}
          </p>

          <Link href={`/kutub/${kitab.id || ''}`} className="inline-flex items-center gap-2 text-body-sm text-ink font-medium group/btn">
            Explore Kitab
            <span className="w-8 h-8 rounded-full bg-surface border border-hairline flex items-center justify-center group-hover/btn:bg-ink group-hover/btn:text-canvas transition-all duration-300 group-hover/btn:scale-110">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
