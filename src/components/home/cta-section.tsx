"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="w-full py-section-lg bg-canvas border-b border-hairline-soft overflow-hidden relative">
      {/* Abstract geometric background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ink rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ink rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-heading-1 md:text-display font-[652] text-ink mb-6 tracking-tight"
        >
          Begin your journey.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-body-lg text-text-muted font-[300] mb-12 max-w-2xl mx-auto"
        >
          Join Alathurpadi Dars online and access centuries of authentic Islamic scholarship through our meticulously structured courses.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="px-8 py-4 rounded-full bg-ink text-on-primary text-link font-[600] hover:bg-ink-soft transition-colors w-full sm:w-auto flex items-center justify-center gap-2 group">
            Start Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/courses" className="px-8 py-4 rounded-full border border-hairline text-ink text-link font-[600] hover:bg-canvas-soft transition-colors w-full sm:w-auto">
            Browse Curriculum
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
