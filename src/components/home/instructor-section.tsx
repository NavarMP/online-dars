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
    <section ref={containerRef} className="py-30 px-6 w-full max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] text-center bg-[rgba(115,115,115,0.56)] backdrop-blur-md rounded-full py-2 px-3 text-on-primary">
            <span className="text-label block">Usthad C K Abdurahman Faizy, Aripra</span>
          </div>
        </div>

        {/* Biography & Credential Block */}
        <div className="flex flex-col space-y-4 md:pl-6">
          <div className="flex items-center gap-3 mb-3 text-text-muted">
            <span className="w-12 h-[1px] bg-hairline" />
            <span className="text-caption uppercase tracking-wider">The Academic Authority</span>
          </div>
          
          <h2 className="text-heading-2">
            Guided by tradition.<br />
            Rooted in scholarship.
          </h2>
          
          <p className="text-body text-text-muted mt-4 max-w-md">
            Under the guidance of Usthad C K Abdurahman Faizy, Alathurpadi Dars has cultivated generations of scholars. His profound mastery of classical texts ensures that every course remains deeply anchored in authentic Islamic jurisprudence and theology.
          </p>
          
          <div className="pt-6 flex items-center gap-4">
            <Link href="/instructors/ck-abdurahman-faizy" className="bg-canvas-soft text-ink text-link rounded-full px-4 h-[48px] flex items-center justify-center hover:bg-hairline-soft transition-colors">
              View Profile ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
