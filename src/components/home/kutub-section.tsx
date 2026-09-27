"use client"

import { useRef, useState, useMemo } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { KitabCard } from "./kitab-card"

type Kitab = {
  id?: string
  title: string
  arabic_title: string
  category: string
  description: string
  is_featured?: boolean
}

export function KutubSection({ kutub = [] }: { kutub?: Kitab[] }) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const categories = useMemo(() => {
    if (!kutub) return []
    const cats = new Set(kutub.map(k => k.category))
    return ["All", ...Array.from(cats)]
  }, [kutub])

  const filteredKutub = activeCategory === "All" 
    ? kutub 
    : kutub?.filter(k => k.category === activeCategory) || []

  // Dynamically adjust scroll container height based on item count
  // to ensure scroll speed feels consistent regardless of library size.
  const itemsCount = (kutub?.length || 0) + 1; // kitabs + "Discover More" card
  const sectionHeight = 
    itemsCount <= 2 ? "150vh" : 
    itemsCount === 3 ? "200vh" : 
    itemsCount === 4 ? "250vh" : "300vh";

  // Using calc(-100% + 100vw) ensures the track perfectly stops when its right edge
  // hits the right side of the screen, regardless of how many items exist!
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "calc(-100% + 100vw)"])

  if (!kutub || kutub.length === 0) {
    return (
      <section className="py-20 px-6 w-full max-w-7xl mx-auto flex flex-col items-center justify-center border border-dashed border-hairline rounded-sm bg-canvas-soft min-h-[300px]">
        <h2 className="text-heading-3 text-text-muted mb-2">No Classical Texts Yet</h2>
        <p className="text-body-sm text-text-muted mb-4">Add your first Kitab in the Admin Panel to see it featured here.</p>
        <Link href="/admin/kutub/new" className="component-button-outline px-4 py-2 text-body-sm rounded-sm">
          Add Kitab
        </Link>
      </section>
    );
  }

  return (
    <section ref={targetRef} className="relative bg-surface w-full" style={{ height: sectionHeight }}>
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-ink/5 rounded-full blur-[150px]" />
        </div>

        {/* Introduction Text Block (Stays left as cards scroll) */}
        <div className="absolute left-6 md:left-24 top-1/4 max-w-md z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-heading-1 font-[500] text-ink mb-6 tracking-tight">
              The Classical <br />
              <span className="text-text-muted italic font-light">Library.</span>
            </h2>
            <p className="text-body-lg text-text-muted font-light mb-8 leading-relaxed">
              Explore foundational texts of the Islamic tradition. From Fiqh to Arabic linguistics, our digital library preserves and presents the core syllabus of traditional study.
            </p>

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-[500] transition-all border
                      ${activeCategory === cat 
                        ? "bg-ink text-canvas border-ink" 
                        : "bg-transparent border-hairline-soft text-text-muted hover:border-ink hover:text-ink"}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <Link 
              href="/kutub" 
              className="inline-flex items-center gap-3 text-body-sm font-medium text-ink hover:text-accent transition-colors pointer-events-auto"
            >
              Explore Full Library 
              <span className="h-[1px] w-8 bg-current" />
            </Link>
          </motion.div>
        </div>

        {/* Horizontally Scrolling Track */}
        {/* We use w-max and min-w-[100vw] so the calc(-100% + 100vw) logic works perfectly */}
        <motion.div style={{ x }} className="flex gap-8 px-6 md:pl-[40vw] pr-24 items-center h-full pt-16 w-max min-w-[100vw]">
          {filteredKutub.map((kitab, index) => (
            <KitabCard key={kitab.id || index} kitab={kitab} index={index} />
          ))}
          
          {/* View More Card */}
          <motion.div 
            className="w-[300px] h-[500px] shrink-0 rounded-4 border border-dashed border-hairline bg-canvas/30 backdrop-blur-sm flex flex-col items-center justify-center group cursor-pointer hover:bg-canvas transition-colors"
            whileHover={{ scale: 0.98 }}
          >
            <Link href="/kutub" className="flex flex-col items-center gap-4 text-center p-8">
              <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center group-hover:scale-110 group-hover:bg-ink group-hover:text-canvas transition-all duration-300">
                <span className="text-2xl font-light">+</span>
              </div>
              <div>
                <h3 className="text-heading-3 mb-2 text-ink">Discover More</h3>
                <p className="text-body-sm text-text-muted">Browse the complete collection of classical texts.</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
