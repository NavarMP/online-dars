"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function InstructorSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="py-section-lg px-lg w-full max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xxl items-center">
        {/* Cinematic Portrait Tile */}
        <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:ml-0 rounded-md overflow-hidden bg-canvas-soft border border-hairline-soft">
          <motion.div style={{ y }} className="absolute inset-0 scale-110">
            <Image 
              src="/Usthad.png" 
              alt="Usthad C K Abdurahman Faizy" 
              fill 
              className="object-cover grayscale" // Grayscale per Mobbin instructions
            />
          </motion.div>
          
          <div className="absolute bottom-md left-1/2 -translate-x-1/2 w-[calc(100%-32px)] text-center bg-[rgba(115,115,115,0.56)] backdrop-blur-md rounded-full py-xs px-sm text-on-primary">
            <span className="text-label block">Usthad C K Abdurahman Faizy, Aripra</span>
          </div>
        </div>

        {/* Biography & Credential Block */}
        <div className="flex flex-col space-y-md md:pl-lg">
          <div className="flex items-center gap-sm mb-sm text-text-muted">
            <span className="w-12 h-[1px] bg-hairline" />
            <span className="text-caption uppercase tracking-wider">The Academic Authority</span>
          </div>
          
          <h2 className="text-heading-2">
            Guided by tradition.<br />
            Rooted in scholarship.
          </h2>
          
          <p className="text-body text-text-muted mt-md max-w-lg">
            Under the guidance of Usthad C K Abdurahman Faizy, Alathurpadi Dars has cultivated generations of scholars. His profound mastery of classical texts ensures that every course remains deeply anchored in authentic Islamic jurisprudence and theology.
          </p>
          
          <div className="pt-lg flex items-center gap-md">
            <Link href="/instructors/ck-abdurahman-faizy" className="bg-canvas-soft text-ink text-link rounded-full px-md h-[48px] flex items-center justify-center hover:bg-hairline-soft transition-colors">
              View Profile ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
