"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") return { error: "Forbidden. You must be an admin to perform this action." }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const status = formData.get('status') as string
  const is_free = formData.get('is_free') === 'true'
  const instructor_id = formData.get('instructor_id') as string || null
  const kutub_id = formData.get('kutub_id') as string || null

  if (!title || !description) {
    return { error: 'Title and description are required' }
  }

  const { error } = await supabase.from("courses").insert({
    title,
    description,
    price,
    status,
    is_free,
    instructor_id,
    kutub_id
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  redirect('/admin/courses')
}

export async function createKitab(formData: FormData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") return { error: "Forbidden. You must be an admin to perform this action." }

  const title = formData.get('title') as string
  const arabic_title = formData.get('arabic_title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const is_featured = formData.get('is_featured') === 'true'

  if (!title || !arabic_title) {
    return { error: 'Title and Arabic Title are required' }
  }

  const { error } = await supabase.from("kutub").insert({
    title,
    arabic_title,
    category,
    description,
    is_featured
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/kutub')
  redirect('/admin/kutub')
}

export async function createInstructor(formData: FormData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") return { error: "Forbidden. You must be an admin to perform this action." }

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const image_url = formData.get('image_url') as string

  if (!name || !bio) {
    return { error: 'Name and Bio are required' }
  }

  const { error } = await supabase.from("instructors").insert({
    name,
    bio,
    image_url: image_url || null
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/instructors')
  redirect('/admin/instructors')
}
