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
