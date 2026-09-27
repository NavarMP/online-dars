import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { CoursesCarousel } from "@/components/home/courses-carousel"
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
    .order("created_at", { ascending: false })
    .limit(6)

  // Fetch featured Kutub for the library section
  const { data: featuredKutub } = await supabase
    .from("kutub")
    .select("*")
    .eq("is_featured", true)
    .limit(4)

  // Fetch Hero Config from dynamic page_sections
  const { data: heroSection } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_route", "/")
    .eq("section_name", "hero")
    .single()
    
  const heroVideoUrl = (heroSection?.content as any)?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"

  return (
    <main className="min-h-screen flex flex-col w-full overflow-hidden bg-canvas">
      {/* 1. Hero Section */}
      <HeroSection videoUrl={heroVideoUrl} />

      {/* 2. Stats Counters */}
      <StatsSection />

      {/* 3. Featured Courses Carousel */}
      {courses && courses.length > 0 && (
        <CoursesCarousel courses={courses} />
      )}

      {/* 4. Immersive Library (reusing KutubSection but with Reveal) */}
      <section className="py-section-lg border-b border-hairline-soft bg-canvas">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <Reveal animation="slide-right">
            <h2 className="text-heading-2 font-[652] text-ink mb-4">The Classical Library.</h2>
            <p className="text-body-lg text-text-muted font-[300] max-w-2xl">
              Explore foundational texts of the Islamic tradition. From Fiqh to Arabic linguistics, our digital library preserves and presents the core syllabus of traditional study.
            </p>
          </Reveal>
        </div>
        <Reveal animation="fade-up" width="100%">
          <KutubSection kutub={featuredKutub || undefined} />
        </Reveal>
      </section>

      {/* 5. Testimonials */}
      <TestimonialsSection />

      {/* 6. Call to Action */}
      <CtaSection />
    </main>
  )
}
