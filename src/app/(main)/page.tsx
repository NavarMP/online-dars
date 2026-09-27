import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { PremiumCoursesSection } from "@/components/home/premium-courses"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CtaSection } from "@/components/home/cta-section"
import { KutubSection } from "@/components/home/kutub-section"
import { Reveal } from "@/components/animations/reveal"

export const metadata = {
  title: "Suffa | Authentic Islamic Scholarship",
  description: "A premium digital experience for accessing classical texts and structured courses from Alathurpadi Dars.",
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured courses for the carousel
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      id, 
      title, 
      description, 
      thumbnail_url,
      difficulty,
      duration_minutes,
      course_sessions(count)
    `)
    .eq("status", "published")
    .neq("is_archived", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Fetch featured Kutub for the library section
  const { data: featuredKutub } = await supabase
    .from("kutub")
    .select("*")
    .eq("is_featured", true)
    .neq("is_archived", true)
    .limit(4)

  // Fetch Hero Config from dynamic page_sections
  const { data: heroSection } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_route", "/")
    .eq("section_name", "hero")
    .single()
    
  const heroVideoUrl = (heroSection?.content as any)?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"

  // Fetch Courses Config from dynamic page_sections
  const { data: coursesSection } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_route", "/")
    .eq("section_name", "courses")
    .single()

  return (
    <main className="min-h-screen flex flex-col w-full overflow-hidden bg-canvas">
      {/* 1. Hero Section */}
      <HeroSection videoUrl={heroVideoUrl} />

      {/* 2. Stats Counters */}
      <StatsSection />

      {/* 3. Featured Courses Carousel */}
      {courses && courses.length > 0 && (
        <PremiumCoursesSection courses={courses} config={coursesSection?.content as any} />
      )}

      {/* 4. Immersive Library (Cinematic Horizontal Scroll) */}
      <KutubSection kutub={featuredKutub || undefined} />

      {/* 5. Testimonials */}
      <TestimonialsSection />

      {/* 6. Call to Action */}
      <CtaSection />
    </main>
  )
}
