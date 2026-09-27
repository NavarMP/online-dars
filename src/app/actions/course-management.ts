"use server"

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSession(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const course_id = formData.get('course_id') as string
  const title = formData.get('title') as string
  const video_url = formData.get('video_url') as string
  const session_order = parseInt(formData.get('session_order') as string) || 0

  if (!course_id || !title) return { error: "Course ID and Title are required" }

  const { error } = await supabase.from('course_sessions').insert({
    course_id,
    title,
    video_url,
    session_order
  })

  if (error) return { error: error.message }
  
  revalidatePath(`/admin/courses/${course_id}`)
  return { success: true }
}

export async function createMaterial(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const course_id = formData.get('course_id') as string
  const session_id = formData.get('session_id') as string || null
  const title = formData.get('title') as string
  const file_url = formData.get('file_url') as string
  const type = formData.get('type') as string

  if (!course_id || !title || !file_url || !type) {
    return { error: "Required fields are missing" }
  }

  const { error } = await supabase.from('materials').insert({
    course_id,
    session_id,
    title,
    file_url,
    type
  })

  if (error) return { error: error.message }
  
  revalidatePath(`/admin/courses/${course_id}`)
  return { success: true }
}

export async function updateSessionOrder(sessions: { id: string, session_order: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Perform a batch update by calling supabase multiple times or using an upsert
  // Since supabase-js doesn't have a native bulk update without upserting all fields, we will do a loop of updates.
  // In a real prod app with many rows, we'd use a postgres function or upsert, but for < 100 sessions this is perfectly fine.
  
  for (const session of sessions) {
    const { error } = await supabase
      .from('course_sessions')
      .update({ session_order: session.session_order })
      .eq('id', session.id)
      
    if (error) return { error: error.message }
  }

  // We don't have the course_id here easily without fetching it, but the client will handle state.
  return { success: true }
}
