"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Clock, BookOpen } from "lucide-react"

export function CoursesCarousel({ courses }: { courses: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [courses])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="w-full py-section-lg bg-canvas-soft overflow-hidden">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-heading-2 font-[652] text-ink mb-4">Master the Sciences.</h2>
            <p className="text-body-lg text-text-muted font-[300]">
              Structured pathways through the foundational texts of Islamic jurisprudence, theology, and linguistics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center bg-canvas text-ink hover:bg-canvas-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center bg-canvas text-ink hover:bg-canvas-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-6 px-6 lg:-mx-12 lg:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              key={course.id}
              className="min-w-[320px] md:min-w-[400px] w-[80vw] max-w-[400px] snap-start flex-shrink-0"
            >
              <Link href={`/courses/${course.id}`} className="group block h-full">
                <div className="h-full flex flex-col bg-canvas border border-hairline-soft hover:border-hairline rounded-md overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  
                  {/* Thumbnail / Placeholder */}
                  <div className="w-full h-48 bg-canvas-soft border-b border-hairline-soft relative overflow-hidden flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-canvas-soft to-hairline-soft opacity-50" />
                    )}
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-canvas/80 backdrop-blur-md text-label text-ink font-[600] border border-hairline-soft/50 shadow-sm">
                        {course.difficulty || 'Intermediate'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-heading-4 font-[652] text-ink mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-body-sm text-text-muted mb-6 line-clamp-2 flex-grow">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-hairline-soft mt-auto">
                      <div className="flex items-center gap-4 text-caption text-text-muted">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.course_sessions?.[0]?.count || 0} Sessions</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{Math.round((course.duration_minutes || 0) / 60)}h</span>
                        </div>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center group-hover:bg-ink group-hover:text-on-primary transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
