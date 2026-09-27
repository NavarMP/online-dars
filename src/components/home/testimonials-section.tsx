"use client"

import { motion } from "framer-motion"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Abdullah R.",
    role: "Student",
    quote: "The Fathul Mueen masterclass transformed my understanding of Shafi'i fiqh. The structured approach and the Ustadh's deep insights make complex rulings accessible.",
  },
  {
    id: 2,
    name: "Ahmad K.",
    role: "Alim Course Graduate",
    quote: "I've studied the Alfiyyah before, but Ustadh Ibrahim's methodology connected the dots I had missed. The platform itself is remarkably smooth and distraction-free.",
  },
  {
    id: 3,
    name: "Zainab F.",
    role: "Student",
    quote: "Finding authentic traditional knowledge online is difficult. Suffa not only provides authentic transmission but does so through a beautifully designed, modern interface.",
  },
  {
    id: 4,
    name: "Omar M.",
    role: "Researcher",
    quote: "The library of Kutub is an invaluable resource. The clarity of the texts and the logical progression of the courses set a new standard for online Islamic education.",
  },
  {
    id: 5,
    name: "Hassan T.",
    role: "Student",
    quote: "The session on Aqeedatut-Tahawiyyah cleared so many doubts I had. The ability to track progress and pick up exactly where I left off is fantastic.",
  },
  {
    id: 6,
    name: "Bilal S.",
    role: "Imam",
    quote: "I recommend this platform to all my congregants. It bridges the gap between the classical madrasa system and the modern student perfectly.",
  }
]

export function TestimonialsSection() {
  return (
    <section className="w-full py-section-lg bg-canvas border-b border-hairline-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-heading-2 font-[652] text-ink mb-4"
          >
            The votes are in.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-text-muted font-[300]"
          >
            Join hundreds of students deepening their understanding of classical texts through our structured digital dars.
          </motion.p>
        </div>

        {/* Masonry Grid (simulated with CSS columns) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="break-inside-avoid bg-canvas border border-hairline-soft rounded-sm p-6"
            >
              <p className="text-body text-ink font-[456] mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canvas-soft border border-hairline-soft flex items-center justify-center shrink-0">
                  <span className="text-label text-text-muted font-[600]">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-link text-ink font-[600]">{testimonial.name}</p>
                  <p className="text-body-sm text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
