import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { EnrollButton } from "@/components/enroll-button"
import { Clock, BookOpen, Users, Star, PlayCircle, ChevronLeft } from "lucide-react"
import { SyllabusAccordion } from "@/components/courses/syllabus-accordion"

import type { Metadata, ResolvingMetadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: course } = await supabase
    .from("courses")
    .select("title, description, thumbnail_url")
    .eq("id", id)
    .single()

  if (!course) return { title: "Course Not Found" }

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    }
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
      instructors ( name, bio, image_url, title, specialization, years_of_experience ),
      kutub ( title, arabic_title, description, category ),
      course_sessions ( id, title, session_order, duration_minutes, description )
    `)
    .eq("id", id)
    .single()

  if (!course) {
    notFound()
  }

  // Check enrollment
  let isEnrolled = false
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", id)
      .eq("student_id", user.id)
      .single()
    
    if (enrollment) isEnrolled = true
  }

  // Calculate totals
  const sessions = (course.course_sessions || []).sort((a: any, b: any) => a.session_order - b.session_order)
  const totalDuration = sessions.reduce((acc: number, session: any) => acc + (session.duration_minutes || 0), 0)

  return (
    <main className="min-h-screen bg-canvas pb-20">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] min-h-[400px] flex items-end">
        {course.thumbnail_url ? (
          <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12">
          <Link href="/courses" className="inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-ink transition-colors mb-6 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Link>
          
          <div className="flex gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-canvas-soft border border-hairline-soft text-label text-ink capitalize">
              {course.difficulty || 'Intermediate'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-canvas-soft border border-hairline-soft text-label text-ink uppercase tracking-wider">
              {course.kutub?.category || 'General'}
            </span>
          </div>
          
          <h1 className="text-heading-1 md:text-display font-[652] text-ink mb-4 max-w-4xl tracking-tight">
            {course.title}
          </h1>
          <p className="text-body-lg text-text-muted font-[300] max-w-2xl line-clamp-3">
            {course.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-16">
          
          {/* Stats Ribbon */}
          <div className="flex flex-wrap gap-8 py-6 border-y border-hairline-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-ink" />
              </div>
              <div>
                <p className="text-label text-text-muted">Duration</p>
                <p className="text-body font-[600] text-ink">{Math.round(totalDuration / 60)} Hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center shrink-0">
                <PlayCircle className="w-5 h-5 text-ink" />
              </div>
              <div>
                <p className="text-label text-text-muted">Sessions</p>
                <p className="text-body font-[600] text-ink">{sessions.length} Lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-canvas-soft flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-ink" />
              </div>
              <div>
                <p className="text-label text-text-muted">Enrolled</p>
                <p className="text-body font-[600] text-ink">{course.enrollment_count || 0} Students</p>
              </div>
            </div>
          </div>

          {/* About the Text (Kutub) */}
          {course.kutub && (
            <section>
              <h2 className="text-heading-3 font-[652] text-ink mb-6">About the Text</h2>
              <div className="bg-canvas-soft border border-hairline-soft rounded-md p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-heading-4 font-[652] text-ink">{course.kutub.title}</h3>
                  <span className="text-heading-3 font-arabic text-ink">{course.kutub.arabic_title}</span>
                </div>
                <p className="text-body text-text-muted leading-relaxed font-[456]">
                  {course.kutub.description}
                </p>
              </div>
            </section>
          )}

          {/* Instructor Bio */}
          {course.instructors && (
            <section>
              <h2 className="text-heading-3 font-[652] text-ink mb-6">Your Instructor</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {course.instructors.image_url ? (
                  <Image 
                    src={course.instructors.image_url} 
                    alt={course.instructors.name} 
                    width={120} 
                    height={120} 
                    className="rounded-md object-cover grayscale" 
                  />
                ) : (
                  <div className="w-[120px] h-[120px] rounded-md bg-canvas-soft border border-hairline-soft flex items-center justify-center shrink-0">
                    <span className="text-display text-text-muted font-[652]">
                      {course.instructors.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-heading-4 font-[652] text-ink mb-1">{course.instructors.title} {course.instructors.name}</h3>
                  <p className="text-body-sm text-ink mb-4 font-[600]">{course.instructors.specialization}</p>
                  <p className="text-body text-text-muted leading-relaxed font-[456]">
                    {course.instructors.bio}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Syllabus */}
          <section>
            <h2 className="text-heading-3 font-[652] text-ink mb-6">Course Syllabus</h2>
            {sessions.length === 0 ? (
              <p className="text-body text-text-muted bg-canvas-soft p-6 rounded-md border border-hairline-soft">
                The syllabus is currently being finalized.
              </p>
            ) : (
              <SyllabusAccordion sessions={sessions} />
            )}
          </section>

        </div>

        {/* Sidebar / Sticky Checkout */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-[#eab308]">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-body-sm text-ink font-[600]">5.0</span>
              <span className="text-caption text-text-muted">(Reviews)</span>
            </div>
            
            <div className="text-display font-[652] text-ink tracking-tight mb-6">
              {course.is_free ? "Free" : `$${course.price}`}
            </div>
            
            <div className="mb-6">
              <EnrollButton courseId={course.id} isFree={course.is_free} isEnrolled={isEnrolled} />
            </div>
            
            <div className="flex flex-col gap-3 pt-6 border-t border-hairline-soft">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-ink" />
                <span className="text-body-sm text-text-muted">Full lifetime access</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-ink" />
                <span className="text-body-sm text-text-muted">Verified completion certificate</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-ink" />
                <span className="text-body-sm text-text-muted">Access on mobile and desktop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
