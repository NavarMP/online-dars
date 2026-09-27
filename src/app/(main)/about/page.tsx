"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const timelineEvents = [
    {
      year: "1924",
      title: "The Foundation",
      description: "Alathurpadi Dars was established by eminent scholars to preserve traditional Islamic sciences in the region."
    },
    {
      year: "1950",
      title: "Expansion of Curriculum",
      description: "Advanced texts in logic (Mantiq) and rhetoric (Balagha) were formally integrated into the standard syllabus."
    },
    {
      year: "1998",
      title: "The Grand Library",
      description: "A centralized repository of classical manuscripts and rare prints was established, becoming a hub for researchers."
    },
    {
      year: "2026",
      title: "Digital Transformation",
      description: "Launch of the Suffa online platform, making centuries of scholarship accessible globally with verified Isnad."
    }
  ]

  return (
    <main className="min-h-screen bg-canvas overflow-hidden pb-32">
      
      {/* Hero Section */}
      <section ref={containerRef} className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
          <Image 
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070" 
            alt="Historical Library" 
            fill 
            className="object-cover opacity-20 grayscale"
            priority
          />
        </motion.div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-ink text-on-primary rounded-full text-caption font-[600] uppercase tracking-widest mb-8"
          >
            Our Legacy
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-heading-1 md:text-[80px] leading-[1.1] font-[652] tracking-tight mb-8 text-ink"
          >
            A Century of Sacred Knowledge.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-body-lg text-text-muted max-w-2xl font-[300]"
          >
            Alathurpadi Dars stands as a beacon of traditional Islamic scholarship, transmitting knowledge through an unbroken chain to the modern era.
          </motion.p>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-canvas to-transparent" />
      </section>

      {/* Story Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-heading-2 font-[652] text-ink mb-6 tracking-tight">The Essence of Dars</h2>
            <div className="flex flex-col gap-6 text-body-lg text-text-muted font-[300] leading-relaxed">
              <p>
                The traditional Dars system represents more than just a method of education; it is a spiritual and intellectual inheritance. Students do not merely memorize texts; they absorb the character, wisdom, and profound understanding of their teachers.
              </p>
              <p>
                Through the careful study of Fiqh, Aqidah, Tasawwuf, and Arabic linguistics, we cultivate minds capable of navigating contemporary challenges while remaining deeply rooted in orthodoxy.
              </p>
            </div>
          </div>
          <div className="relative aspect-square rounded-md overflow-hidden bg-canvas-soft border border-hairline-soft group">
            <Image 
              src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1000" 
              alt="Traditional Learning" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-hairline-soft">
        <div className="text-center mb-16">
          <h2 className="text-heading-2 font-[652] text-ink mb-4 tracking-tight">Our History</h2>
          <p className="text-body-lg text-text-muted font-[300]">The evolution of scholarship at Alathurpadi.</p>
        </div>
        
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-hairline-soft -translate-x-1/2" />
          
          <div className="flex flex-col gap-16">
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-ink rounded-full -translate-x-1/2 border-4 border-canvas z-10" />
                
                {/* Content */}
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${
                  index % 2 === 0 ? "md:text-left md:pr-16" : "md:text-right md:pl-16"
                }`}>
                  <span className="text-heading-1 font-[652] text-text-muted/20 absolute top-0 -z-10 -translate-y-1/4">
                    {event.year}
                  </span>
                  <div className="text-caption text-ink font-[600] uppercase tracking-widest mb-2">
                    {event.year}
                  </div>
                  <h3 className="text-heading-3 font-[652] text-ink mb-3">{event.title}</h3>
                  <p className="text-body text-text-muted font-[456] leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Impact */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-ink rounded-md p-12 md:p-24 flex flex-col lg:flex-row justify-between gap-16 items-center relative overflow-hidden">
          {/* Abstract circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-on-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-full lg:w-1/3 relative z-10">
            <h2 className="text-heading-2 font-[652] text-on-primary mb-6 tracking-tight">Global Impact</h2>
            <p className="text-body-lg text-on-primary/70 font-[300]">
              By bringing the traditional Dars online, we have opened the doors of classical scholarship to seekers across the globe, breaking geographical boundaries while maintaining rigorous academic standards.
            </p>
          </div>
          
          <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <div className="flex flex-col items-center lg:items-start border-l border-on-primary/10 pl-6">
              <div className="text-heading-1 font-[652] text-on-primary mb-2">50<span className="text-on-primary/50">+</span></div>
              <div className="text-caption text-on-primary/70 font-[600] uppercase tracking-wider">Classical Texts</div>
            </div>
            <div className="flex flex-col items-center lg:items-start border-l border-on-primary/10 pl-6">
              <div className="text-heading-1 font-[652] text-on-primary mb-2">12<span className="text-on-primary/50">+</span></div>
              <div className="text-caption text-on-primary/70 font-[600] uppercase tracking-wider">Instructors</div>
            </div>
            <div className="flex flex-col items-center lg:items-start border-l border-on-primary/10 pl-6">
              <div className="text-heading-1 font-[652] text-on-primary mb-2">5k<span className="text-on-primary/50">+</span></div>
              <div className="text-caption text-on-primary/70 font-[600] uppercase tracking-wider">Students</div>
            </div>
            <div className="flex flex-col items-center lg:items-start border-l border-on-primary/10 pl-6">
              <div className="text-heading-1 font-[652] text-on-primary mb-2">100<span className="text-on-primary/50">%</span></div>
              <div className="text-caption text-on-primary/70 font-[600] uppercase tracking-wider">Verified Isnad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="text-center max-w-3xl mx-auto px-6">
        <h2 className="text-heading-2 font-[652] text-ink mb-6 tracking-tight">The Vision Forward</h2>
        <p className="text-body-lg text-text-muted font-[300] mb-12">
          To create a seamless bridge between ancient wisdom and modern technology, ensuring that the light of traditional scholarship continues to guide humanity for generations to come.
        </p>
        <Link href="/courses" className="inline-flex items-center gap-2 component-button-primary group">
          Begin Learning
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
      
    </main>
  )
}
