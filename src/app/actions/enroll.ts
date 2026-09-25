"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select('is_free, price')
    .eq('id', courseId)
    .single()

  if (!course) {
    return { error: 'Course not found' }
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', user.id)
    .single()

  if (existingEnrollment) {
    redirect(`/account`)
  }

  // Create Dummy Order if not free
  if (!course.is_free) {
    const { error: orderError } = await supabase.from('orders').insert({
      student_id: user.id,
      course_id: courseId,
      amount: course.price,
      status: 'completed' // Mocking an instantly successful payment
    })
    if (orderError) return { error: 'Payment failed' }
  }

  // Create Enrollment
  const { error: enrollError } = await supabase.from('enrollments').insert({
    student_id: user.id,
    course_id: courseId,
    progress: 0
  })

  if (enrollError) {
    return { error: 'Failed to enroll' }
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath('/account')
  redirect(`/account`)
}
