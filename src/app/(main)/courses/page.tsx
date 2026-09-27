import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, ChevronRight, Search } from "lucide-react"
import { Reveal } from "@/components/animations/reveal"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { Parallax } from "@/components/animations/parallax"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { SortDropdown } from "@/components/filters/sort-dropdown"
import { ActiveFilters } from "@/components/filters/active-filters"
import { searchParamsCache } from "@/lib/search-params"
import { CourseCard } from "@/components/courses/course-card"

export const metadata = {
  title: "Courses | Suffa",
  description: "Explore our collection of traditional Islamic courses.",
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  // Parse params with nuqs cache
  const { category, difficulty, price, q, sort } = searchParamsCache.parse(resolvedParams)

  const supabase = await createClient()

  // Fetch categories for the filter
  const { data: categories } = await supabase
    .from("kutub_categories")
    .select("name")
    .neq("is_archived", true)
    .order("name")

  // Build the query
  let supabaseQuery = supabase
    .from("courses")
    .select(`
      id,
      title,
      description,
      price,
      is_free,
      thumbnail_url,
      difficulty,
      duration_minutes,
      enrollment_count,
      instructors!inner ( name ),
      kutub!inner ( title, category ),
      course_sessions ( count )
    `)
    .eq("status", "published")
    .neq("is_archived", true)

  // Filtering
  if (category && category !== "All") {
    supabaseQuery = supabaseQuery.eq("kutub.category", category)
  }

  if (difficulty) {
    supabaseQuery = supabaseQuery.eq("difficulty", difficulty)
  }

  if (price === "free") {
    supabaseQuery = supabaseQuery.eq("is_free", true)
  } else if (price === "paid") {
    supabaseQuery = supabaseQuery.eq("is_free", false)
  }

  if (q) {
    supabaseQuery = supabaseQuery.ilike("title", `%${q}%`)
  }

  // Sorting
  switch (sort) {
    case 'popular':
      supabaseQuery = supabaseQuery.order("enrollment_count", { ascending: false })
      break
    case 'price_asc':
      supabaseQuery = supabaseQuery.order("price", { ascending: true })
      break
    case 'price_desc':
      supabaseQuery = supabaseQuery.order("price", { ascending: false })
      break
    case 'duration_asc':
      supabaseQuery = supabaseQuery.order("duration_minutes", { ascending: true })
      break
    case 'duration_desc':
      supabaseQuery = supabaseQuery.order("duration_minutes", { ascending: false })
      break
    case 'latest':
    default:
      supabaseQuery = supabaseQuery.order("created_at", { ascending: false })
      break
  }

  const { data: rawCourses } = await supabaseQuery
  
  let courses = rawCourses || []

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* Interactive Canvas Hero */}
      <Parallax speed={0.5}>
        <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-ink">
          {/* Abstract background mesh */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-primary rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-accent rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          </div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
            <Reveal animation="fade-up" duration={0.8}>
              <h1 className="text-heading-1 md:text-display font-[652] tracking-tighter mb-6 text-on-primary">
                Master the Sacred Sciences
              </h1>
            </Reveal>
            <Reveal animation="fade-up" delay={0.2} duration={0.8}>
              <p className="text-body-lg text-on-primary/80 font-[300] max-w-2xl mx-auto">
                Deepen your understanding through structured, traditional study paths guided by our esteemed scholars.
              </p>
            </Reveal>
          </div>
        </div>
      </Parallax>

      <div className="max-w-[1536px] mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar categories={categories || []} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <ActiveFilters />
            
            <div className="ml-auto flex items-center gap-4">
              <SortDropdown 
                options={[
                  { value: 'latest', label: 'Latest Added' },
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'price_asc', label: 'Price: Low to High' },
                  { value: 'price_desc', label: 'Price: High to Low' },
                  { value: 'duration_asc', label: 'Duration: Short to Long' },
                  { value: 'duration_desc', label: 'Duration: Long to Short' },
                ]}
              />
            </div>
          </div>

          {!courses || courses.length === 0 ? (
            <div className="bg-canvas-soft border border-hairline-soft rounded-md p-24 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-12 h-12 text-text-muted mb-4 opacity-50" />
              <h2 className="text-heading-3 mb-2 font-[652]">No courses found</h2>
              <p className="text-body text-text-muted max-w-md mx-auto">
                We couldn't find any courses matching your selected filters. Try clearing your filters or check back later.
              </p>
              {(category !== 'All' || difficulty || q || price !== 'all') && (
                <Link href="/courses" className="component-button-outline mt-6">
                  Clear Filters
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course: any, index: number) => (
                <Reveal key={course.id} animation="fade-up" delay={index * 0.1}>
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
