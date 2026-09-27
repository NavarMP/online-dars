"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [displayValue, setDisplayValue] = useState(0)
  
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    mass: 1,
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
  }, [springValue])

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-8">
      <span className="text-display font-[652] text-ink tracking-tight mb-2">
        {displayValue}{value > 500 ? "+" : ""}
      </span>
      <span className="text-body text-text-muted font-[456] text-center">{label}</span>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="w-full py-section bg-canvas border-b border-hairline-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-hairline-soft">
          <Counter value={12} label="Classical Texts" />
          <Counter value={45} label="Course Sessions" />
          <Counter value={850} label="Active Students" />
          <Counter value={4} label="Expert Instructors" />
        </div>
      </div>
    </section>
  )
}
