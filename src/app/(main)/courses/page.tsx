import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, ChevronRight } from "lucide-react"

export const metadata = {
  title: "Courses | Suffa",
  description: "Explore our collection of traditional Islamic courses.",
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; difficulty?: string; q?: string }>
}) {
  const resolvedParams = await searchParams
  const category = resolvedParams.category
  const difficulty = resolvedParams.difficulty
  const query = resolvedParams.q

  const supabase = await createClient()

  // Fetch categories for the filter
  const { data: categories } = await supabase
    .from("kutub_categories")
    .select("name")
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
      instructors ( name ),
      kutub ( title, category ),
      course_sessions ( count )
    `)
    .eq("status", "published")

  if (category && category !== "All") {
    // We need to filter by the related kutub category
    // PostgREST syntax for filtering on related tables can be tricky. 
    // We'll filter in JS for simplicity if the dataset is small, or use an inner join.
    // For now, we'll fetch all and filter in JS if category is set.
  }

  if (difficulty && difficulty !== "All") {
    supabaseQuery = supabaseQuery.eq("difficulty", difficulty.toLowerCase())
  }

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`)
  }

  const { data: rawCourses } = await supabaseQuery.order("created_at", { ascending: false })
  
  let courses = rawCourses || []

  if (category && category !== "All") {
    courses = courses.filter((c: any) => c.kutub?.category === category)
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-[1536px] mx-auto">
      <div className="mb-12 max-w-3xl">
        <h1 className="text-heading-1 font-[652] tracking-tight mb-4 text-ink">Course Catalog.</h1>
        <p className="text-body-lg text-text-muted font-[300]">
          Deepen your understanding through structured, traditional study paths guided by our esteemed scholars.
        </p>
      </div>
      
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-12">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Link 
            href={`/courses?${new URLSearchParams({ ...resolvedParams, category: "All" }).toString()}`}
            className={`px-4 py-2 rounded-full text-label transition-colors whitespace-nowrap ${
              !category || category === "All" ? "bg-ink text-on-primary" : "bg-canvas-soft text-text-muted hover:text-ink"
            }`}
          >
            All Categories
          </Link>
          {categories?.map((cat) => (
            <Link 
              key={cat.name}
              href={`/courses?${new URLSearchParams({ ...resolvedParams, category: cat.name }).toString()}`}
              className={`px-4 py-2 rounded-full text-label transition-colors whitespace-nowrap ${
                category === cat.name ? "bg-ink text-on-primary" : "bg-canvas-soft text-text-muted hover:text-ink"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-2">
          <Link 
            href={`/courses?${new URLSearchParams({ ...resolvedParams, difficulty: "beginner" }).toString()}`}
            className={`px-4 py-2 rounded-full text-label transition-colors border ${
              difficulty === "beginner" ? "bg-canvas border-ink text-ink" : "bg-canvas-soft border-hairline-soft text-text-muted hover:text-ink hover:border-hairline"
            }`}
          >
            Beginner
          </Link>
          <Link 
            href={`/courses?${new URLSearchParams({ ...resolvedParams, difficulty: "intermediate" }).toString()}`}
            className={`px-4 py-2 rounded-full text-label transition-colors border ${
              difficulty === "intermediate" ? "bg-canvas border-ink text-ink" : "bg-canvas-soft border-hairline-soft text-text-muted hover:text-ink hover:border-hairline"
            }`}
          >
            Intermediate
          </Link>
          <Link 
            href={`/courses?${new URLSearchParams({ ...resolvedParams, difficulty: "advanced" }).toString()}`}
            className={`px-4 py-2 rounded-full text-label transition-colors border ${
              difficulty === "advanced" ? "bg-canvas border-ink text-ink" : "bg-canvas-soft border-hairline-soft text-text-muted hover:text-ink hover:border-hairline"
            }`}
          >
            Advanced
          </Link>
        </div>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="bg-canvas-soft border border-hairline-soft rounded-md p-24 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-12 h-12 text-text-muted mb-4 opacity-50" />
          <h2 className="text-heading-3 mb-2 font-[652]">No courses found</h2>
          <p className="text-body text-text-muted max-w-md mx-auto">
            We couldn't find any courses matching your selected filters. Try clearing your filters or check back later.
          </p>
          {(category || difficulty || query) && (
            <Link href="/courses" className="component-button-outline mt-6">
              Clear Filters
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: any) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group flex flex-col h-full bg-canvas border border-hairline-soft hover:border-hairline rounded-md overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {/* Thumbnail */}
              <div className="w-full h-48 bg-canvas-soft border-b border-hairline-soft relative overflow-hidden flex items-center justify-center">
                {course.thumbnail_url ? (
                  <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-canvas-soft to-hairline-soft opacity-50" />
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-canvas/80 backdrop-blur-md text-label text-ink font-[600] border border-hairline-soft/50 shadow-sm capitalize">
                    {course.difficulty || 'Intermediate'}
                  </span>
                  {course.is_free && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/90 backdrop-blur-md text-label text-on-primary font-[600] shadow-sm">
                      Free
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-canvas-soft text-ink text-caption px-2 py-1 rounded-sm uppercase tracking-wider font-[600]">
                    {course.kutub?.category || "General"}
                  </span>
                </div>
                <h3 className="text-heading-4 font-[652] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-body-sm text-text-muted line-clamp-2 mb-6 flex-grow font-[456]">
                  {course.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-hairline-soft">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-caption text-text-muted mb-0.5">Instructor</span>
                      <span className="text-label text-ink font-[600]">{course.instructors?.name || "Multiple"}</span>
                    </div>
                    {!course.is_free && (
                      <div className="flex flex-col items-end">
                        <span className="text-caption text-text-muted mb-0.5">Price</span>
                        <span className="text-label text-ink font-[600]">${course.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-caption text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.course_sessions?.[0]?.count || 0} Sessions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round((course.duration_minutes || 0) / 60)}h</span>
                      </div>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-canvas-soft flex items-center justify-center group-hover:bg-ink group-hover:text-on-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
