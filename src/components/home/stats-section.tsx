"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"

function Counter({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
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
        {displayValue}{suffix || ""}
      </span>
      <span className="text-body text-text-muted font-[456] text-center">{label}</span>
    </div>
  )
}

export function StatsSection({ config }: { config?: any }) {
  const statsList = config?.stats || [
    { id: "1", value: 12, label: "Classical Texts", suffix: "" },
    { id: "2", value: 45, label: "Course Sessions", suffix: "" },
    { id: "3", value: 850, label: "Active Students", suffix: "+" },
    { id: "4", value: 4, label: "Expert Instructors", suffix: "" },
  ];

  const gridCols = Math.min(4, statsList.length);

  return (
    <section className="w-full py-section bg-canvas border-b border-hairline-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-8 divide-x divide-hairline-soft`}>
          {statsList.map((stat: any) => (
            <Counter 
              key={stat.id} 
              value={stat.value} 
              label={stat.label} 
              suffix={stat.suffix} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
