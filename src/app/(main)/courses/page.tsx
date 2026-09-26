import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Courses | 'ilm",
  description: "Explore our collection of traditional Islamic courses.",
}

export default async function CoursesPage() {
  const supabase = await createClient()
  
  // Fetch courses with their related kutub and instructors
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      description,
      price,
      is_free,
      instructors ( name ),
      kutub ( title, category )
    `)
    .eq("status", "published")

  return (
    <main className="min-h-screen pt-30 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-heading-1 mb-4">Course Catalog.</h1>
        <p className="text-body-lg text-text-muted max-w-2xl">
          Deepen your understanding through structured, traditional study paths guided by our esteemed scholars.
        </p>
      </div>
      
      {/* Filters Placeholder */}
      <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
        <button className="bg-canvas text-ink px-4 py-2 rounded-full border border-ink text-label transition-colors">All Courses</button>
        <button className="bg-canvas-soft text-text-muted hover:text-ink px-4 py-2 rounded-full text-label transition-colors">Fiqh</button>
        <button className="bg-canvas-soft text-text-muted hover:text-ink px-4 py-2 rounded-full text-label transition-colors">Aqidah</button>
        <button className="bg-canvas-soft text-text-muted hover:text-ink px-4 py-2 rounded-full text-label transition-colors">Free</button>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="bg-canvas-soft rounded-md p-12 text-center border border-hairline-soft">
          <h2 className="text-heading-3 mb-2">No courses available yet</h2>
          <p className="text-body text-text-muted">Check back soon as we digitize more of the Dars curriculum.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group flex flex-col bg-canvas border border-hairline-soft rounded-md overflow-hidden hover:border-hairline transition-colors">
              <div className="aspect-video bg-canvas-soft relative">
                {/* Placeholder thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-105 transition-transform duration-500">
                  <Image src="/logo.svg" alt="Course Thumbnail" width={48} height={48} className="dark:invert" />
                </div>
                {course.is_free && (
                  <div className="absolute top-4 right-4 bg-accent text-on-primary px-3 py-1 rounded-full text-label">
                    Free
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[rgba(115,115,115,0.1)] text-ink text-label px-2 py-1 rounded-sm uppercase tracking-wider">
                    {course.kutub?.category || "General"}
                  </span>
                </div>
                <h3 className="text-heading-4 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-body-sm text-text-muted line-clamp-2 mb-4">{course.description}</p>
                <div className="mt-auto pt-4 border-t border-hairline-soft flex items-center justify-between">
                  <span className="text-label text-ink">{course.instructors?.name || "Multiple Instructors"}</span>
                  <span className="text-label font-bold text-ink">{course.is_free ? "Free" : `$${course.price}`}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
