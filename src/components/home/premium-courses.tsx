"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Clock, BookOpen, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/animations/tilt-card";

interface PremiumCoursesSectionProps {
  courses: any[];
  config?: {
    title?: string;
    subtitle?: string;
    layout?: string;
    backgroundStyle?: string;
    animationSpeed?: string;
  };
}

export function PremiumCoursesSection({ courses, config }: PremiumCoursesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  
  // Destructure config with defaults
  const title = config?.title || "Master the Sciences.";
  const subtitle = config?.subtitle || "Structured pathways through the foundational texts of Islamic jurisprudence, theology, and linguistics.";
  const layout = config?.layout || "3d-carousel";
  const bgStyle = config?.backgroundStyle || "canvas";
  const animSpeed = config?.animationSpeed || "normal";

  // Animation values based on speed
  const staggerDelay = animSpeed === "fast" ? 0.05 : animSpeed === "slow" ? 0.2 : 0.1;
  const animDuration = animSpeed === "fast" ? 0.3 : animSpeed === "slow" ? 0.8 : 0.5;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [courses]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredCourses = activeFilter === "all" 
    ? courses 
    : courses.filter(c => c.difficulty === activeFilter);

  // Dynamic styles
  let sectionClasses = "w-full py-section-lg overflow-hidden transition-colors duration-1000 relative ";
  if (bgStyle === "canvas") sectionClasses += "bg-canvas-soft";
  if (bgStyle === "dark-premium") sectionClasses += "bg-zinc-950 text-white";
  if (bgStyle === "gradient-glow") sectionClasses += "bg-gradient-to-br from-canvas-soft via-canvas to-primary/5";
  if (bgStyle === "glassmorphism") sectionClasses += "bg-canvas-soft/80 backdrop-blur-2xl";

  const isDark = bgStyle === "dark-premium";

  return (
    <section className={sectionClasses}>
      {/* Background Decorators */}
      {bgStyle === "gradient-glow" && (
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2 opacity-60" />
      )}

      <div className="max-w-[1536px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: animDuration, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-caption font-[600] mb-6 ${isDark ? 'bg-white/10 text-white/80' : 'bg-primary/10 text-primary'}`}>
              <Sparkles className="w-3.5 h-3.5" /> Premium Curricula
            </div>
            <h2 className={`text-heading-2 font-[652] mb-4 ${isDark ? 'text-white' : 'text-ink'}`}>{title}</h2>
            <p className={`text-body-lg font-[300] ${isDark ? 'text-white/60' : 'text-text-muted'}`}>
              {subtitle}
            </p>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 mt-8 overflow-x-auto scrollbar-hide pb-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    // Reset scroll
                    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-[500] capitalize transition-all border whitespace-nowrap
                    ${activeFilter === filter 
                      ? (isDark ? "bg-white text-black border-white" : "bg-ink text-canvas border-ink") 
                      : (isDark ? "bg-transparent border-white/10 text-white/70 hover:border-white/30 hover:text-white" : "bg-transparent border-hairline-soft text-text-muted hover:border-ink hover:text-ink")}
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
          
          {layout !== "bento-grid" && layout !== "stack" && filteredCourses.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <button 
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${isDark ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-hairline text-ink bg-canvas hover:bg-canvas-soft shadow-sm'}`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${isDark ? 'border-white/10 text-white bg-white/5 hover:bg-white/10' : 'border-hairline text-ink bg-canvas hover:bg-canvas-soft shadow-sm'}`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="py-20 text-center text-text-muted">
             No courses found for the selected difficulty level.
          </div>
        ) : layout === "bento-grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.slice(0, 6).map((course, index) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * staggerDelay, duration: animDuration, ease: "easeOut" }}
                key={course.id}
                className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <CourseCard course={course} isDark={isDark} isPremium={true} />
              </motion.div>
            ))}
          </div>
        ) : layout === "stack" ? (
          <div className="flex flex-col gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * staggerDelay, duration: animDuration }}
                key={course.id}
              >
                <CourseCardHorizontal course={course} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Default to Carousel (Standard or 3D) */
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 pt-4 -mx-6 px-6 lg:-mx-12 lg:px-12 ${layout === '3d-carousel' ? 'perspective-1000' : ''}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * staggerDelay, duration: animDuration, type: "spring", stiffness: 100 }}
                key={course.id}
                className="min-w-[320px] md:min-w-[420px] w-[80vw] max-w-[420px] snap-center flex-shrink-0"
              >
                {layout === "3d-carousel" ? (
                  <TiltCard>
                    <CourseCard course={course} isDark={isDark} isPremium={true} />
                  </TiltCard>
                ) : (
                  <CourseCard course={course} isDark={isDark} isPremium={false} />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CourseCard({ course, isDark, isPremium }: { course: any, isDark: boolean, isPremium: boolean }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block h-full outline-none">
      <div className={`h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-500 
        ${isDark 
          ? 'bg-zinc-900 border border-white/10 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
          : 'bg-canvas border border-hairline-soft hover:border-hairline hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]'}
      `}>
        
        {/* Image Container with Parallax Effect */}
        <div className="w-full h-56 relative overflow-hidden flex items-center justify-center bg-canvas-soft">
          {course.thumbnail_url ? (
            <Image 
              src={course.thumbnail_url} 
              alt={course.title} 
              fill 
              className={`object-cover transition-transform duration-1000 ${isPremium ? 'group-hover:scale-110 group-hover:rotate-1' : 'group-hover:scale-105'}`} 
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-zinc-800 to-zinc-900' : 'from-canvas-soft to-hairline-soft'} opacity-80`} />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-[652] tracking-wide backdrop-blur-md shadow-lg
              ${isDark ? 'bg-black/50 text-white border border-white/10' : 'bg-white/80 text-ink border border-hairline/50'}
            `}>
              {course.difficulty || 'Intermediate'}
            </span>
          </div>
        </div>

        <div className="p-7 flex flex-col flex-grow relative z-10">
          <h3 className={`text-heading-4 font-[652] mb-3 line-clamp-2 transition-colors duration-300
            ${isDark ? 'text-white group-hover:text-primary' : 'text-ink group-hover:text-primary'}
          `}>
            {course.title}
          </h3>
          <p className={`text-body-sm mb-6 line-clamp-2 flex-grow font-[456] leading-relaxed
            ${isDark ? 'text-white/60' : 'text-text-muted'}
          `}>
            {course.description}
          </p>
          
          <div className={`flex items-center justify-between pt-5 border-t mt-auto
            ${isDark ? 'border-white/10' : 'border-hairline-soft'}
          `}>
            <div className={`flex items-center gap-5 text-caption font-[500]
              ${isDark ? 'text-white/50' : 'text-text-muted'}
            `}>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.course_sessions?.[0]?.count || 0} Sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{Math.round((course.duration_minutes || 0) / 60)}h</span>
              </div>
            </div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110
              ${isDark ? 'bg-white/5 text-white group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(var(--color-primary),0.5)]' : 'bg-canvas-soft text-ink group-hover:bg-ink group-hover:text-canvas'}
            `}>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CourseCardHorizontal({ course, isDark }: { course: any, isDark: boolean }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block w-full outline-none">
      <div className={`flex flex-col md:flex-row rounded-2xl overflow-hidden transition-all duration-500 
        ${isDark 
          ? 'bg-zinc-900 border border-white/10 hover:border-white/20' 
          : 'bg-canvas border border-hairline-soft hover:border-hairline hover:shadow-lg'}
      `}>
        <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
           {course.thumbnail_url ? (
            <Image 
              src={course.thumbnail_url} 
              alt={course.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-zinc-800 to-zinc-900' : 'from-canvas-soft to-hairline-soft'} opacity-80`} />
          )}
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center flex-grow">
           <h3 className={`text-heading-3 font-[652] mb-3 transition-colors duration-300
            ${isDark ? 'text-white group-hover:text-primary' : 'text-ink group-hover:text-primary'}
          `}>
            {course.title}
          </h3>
          <p className={`text-body-md mb-6 max-w-2xl font-[456] leading-relaxed
            ${isDark ? 'text-white/60' : 'text-text-muted'}
          `}>
            {course.description}
          </p>
          <div className="flex items-center gap-4">
             <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-[652] tracking-wide
              ${isDark ? 'bg-white/10 text-white' : 'bg-canvas-soft text-ink'}
            `}>
              {course.difficulty || 'Intermediate'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
