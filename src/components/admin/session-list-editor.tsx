"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, PlayCircle } from "lucide-react"
import { updateSessionOrder } from "@/app/actions/course-management"
import { toast } from "sonner"

interface Session {
  id: string
  title: string
  session_order: number
  description?: string
  video_url?: string
}

function SortableSessionItem({ session }: { session: Session }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-field border-b border-hairline-soft last:border-0 flex items-center justify-between gap-4 group ${
        isDragging ? 'opacity-50 shadow-md relative z-10' : 'hover:bg-canvas transition-colors'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-text-muted hover:text-ink cursor-grab active:cursor-grabbing rounded-sm"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-1">
          <span className="font-[600] text-body-sm text-ink group-hover:text-primary transition-colors">
            {session.session_order}. {session.title}
          </span>
          {session.description && (
            <span className="text-caption text-text-muted line-clamp-1 max-w-md">{session.description}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {session.video_url && (
          <span className="flex items-center gap-1.5 text-caption font-[600] bg-canvas-soft px-2.5 py-1 rounded-full text-text-muted border border-hairline-soft">
            <PlayCircle className="w-3 h-3" /> Video
          </span>
        )}
      </div>
    </li>
  )
}

export function SessionListEditor({ initialSessions, courseId }: { initialSessions: Session[], courseId: string }) {
  const [sessions, setSessions] = useState(initialSessions.sort((a, b) => a.session_order - b.session_order))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSessions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Re-assign order numbers
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          session_order: index + 1
        }))
        
        // Save to DB in background
        updateSessionOrder(updatedItems.map(i => ({ id: i.id, session_order: i.session_order })))
          .then(res => {
            if (res?.error) toast.error("Failed to save order")
            else toast.success("Order saved")
          })
          
        return updatedItems
      })
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center text-body-sm text-text-muted font-[456]">
        No modules have been added to this course yet.
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sessions.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <ul className="bg-field">
          {sessions.map((session) => (
            <SortableSessionItem key={session.id} session={session} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
