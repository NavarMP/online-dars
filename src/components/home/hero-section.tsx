"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export function HeroSection({ videoUrl }: { videoUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom Mobbin-like ease out
      },
    }),
  }

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-white pt-16"
    >
      {/* Parallax Video Background */}
      <motion.div 
        style={{ y, opacity }} 
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full opacity-40"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6 mt-12">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mb-8 flex items-center justify-center"
        >
          <Image 
            src="/dars-typo.svg" 
            alt="Suffa Arabic Typography" 
            width={120} 
            height={48} 
            className="invert w-32 md:w-48 opacity-80"
            priority
          />
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-heading-1 md:text-display tracking-tight text-white mb-6 max-w-4xl font-[652]"
        >
          Traditional Knowledge.<br />
          <span className="text-white/60">Modern Access.</span>
        </motion.h1>
        
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-body-lg text-white/70 max-w-2xl mb-12 font-[300]"
        >
          A premium, award-worthy digital experience for accessing classical texts, structured courses, and scholarly insights from Alathurpadi Dars.
        </motion.p>
        
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/courses" className="px-8 py-4 rounded-full bg-white text-zinc-950 text-link font-[600] hover:bg-zinc-100 transition-colors w-full sm:w-auto">
            Explore Courses
          </Link>
          <Link href="/about" className="px-8 py-4 rounded-full border border-white/30 text-white text-link font-[600] hover:bg-white/10 transition-colors w-full sm:w-auto">
            About the Dars
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-caption text-white/50 tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}
