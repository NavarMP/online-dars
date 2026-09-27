"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlayCircle, Clock, ChevronDown } from "lucide-react"

export function SyllabusAccordion({ sessions }: { sessions: any[] }) {
  const [openSessionId, setOpenSessionId] = useState<string | null>(sessions[0]?.id || null)

  const toggleSession = (id: string) => {
    setOpenSessionId(openSessionId === id ? null : id)
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session, index) => {
        const isOpen = openSessionId === session.id
        
        return (
          <div 
            key={session.id} 
            className="bg-canvas border border-hairline hover:border-ink transition-colors rounded-sm overflow-hidden"
          >
            <button
              onClick={() => toggleSession(session.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label shrink-0 transition-colors ${
                  isOpen ? "bg-ink text-on-primary" : "bg-canvas-soft text-text-muted"
                }`}>
                  {index + 1}
                </div>
                <div className="text-body font-[600] text-ink">{session.title}</div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-1.5 text-caption text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>{session.duration_minutes || 45} mins</span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-text-muted"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-2 border-t border-hairline-soft ml-12">
                    <p className="text-body-sm text-text-muted font-[456] leading-relaxed mb-4">
                      {session.description || "In this session, we will cover the foundational concepts related to this chapter. Detailed explanation of the text along with practical applications will be provided."}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-label bg-canvas-soft text-ink px-3 py-1.5 rounded-full">
                        <PlayCircle className="w-4 h-4" />
                        Video Lesson
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
