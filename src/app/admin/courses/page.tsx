import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal, Eye, BookOpen } from "lucide-react"
import { ArchiveCourseButton } from "@/components/admin/archive-course-button"

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q

  const supabase = await createClient()
  
  let supabaseQuery = supabase
    .from("courses")
    .select("*, instructors(name), kutub(title)")

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`)
  }

  const { data: courses } = await supabaseQuery.order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-heading-2 font-[652] tracking-tight mb-2">Courses</h1>
          <p className="text-body-sm text-text-muted font-[456]">Manage the platform's course catalog and curriculum.</p>
        </div>
        <Link href="/admin/courses/new" className="component-button-primary flex items-center gap-2 h-10 px-4 rounded-sm shrink-0">
          <Plus className="w-4 h-4" />
          New Course
        </Link>
      </div>

      <div className="bg-canvas border border-hairline-soft rounded-md shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-hairline-soft flex items-center gap-4 bg-canvas-soft/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              defaultValue={query}
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-hairline-soft rounded-sm text-body-sm outline-none focus:border-ink transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-canvas border border-hairline-soft rounded-sm text-body-sm text-ink hover:bg-canvas-soft transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm whitespace-nowrap">
            <thead className="bg-canvas-soft/50 border-b border-hairline-soft text-text-muted text-caption uppercase tracking-wider font-[600]">
              <tr>
                <th className="py-4 px-6 font-[600]">Course</th>
                <th className="py-4 px-6 font-[600]">Kitab</th>
                <th className="py-4 px-6 font-[600]">Instructor</th>
                <th className="py-4 px-6 font-[600]">Status</th>
                <th className="py-4 px-6 font-[600]">Price</th>
                <th className="py-4 px-6 font-[600] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!courses || courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center mb-3">
                        <Search className="w-5 h-5 text-text-muted opacity-50" />
                      </div>
                      <p className="text-body font-[600] text-ink mb-1">No courses found</p>
                      <p className="text-body-sm font-[456]">Try adjusting your search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course: any) => (
                  <tr key={course.id} className="border-b border-hairline-soft last:border-0 hover:bg-canvas-soft/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-canvas-soft border border-hairline flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                          {course.thumbnail_url ? (
                            <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-text-muted opacity-50" />
                          )}
                        </div>
                        <Link href={`/admin/courses/${course.id}`} className="font-[600] text-ink hover:text-primary transition-colors line-clamp-1 max-w-[260px] flex items-center gap-2">
                          {course.title}
                          {course.is_archived && (
                            <span className="text-[10px] uppercase tracking-wider bg-canvas-soft border border-hairline px-1.5 py-0.5 rounded-sm text-text-muted">
                              Archived
                            </span>
                          )}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-muted font-[456]">
                      <span className="line-clamp-1 max-w-[200px]">{course.kutub?.title || "—"}</span>
                    </td>
                    <td className="py-4 px-6 font-[456] text-ink">{course.instructors?.name || "Unassigned"}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption font-[600] tracking-wide uppercase ${
                        course.status === 'published' 
                          ? 'bg-ink text-on-primary' 
                          : 'bg-canvas-soft border border-hairline-soft text-text-muted'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-[600] text-ink">
                      {course.is_free ? (
                        <span className="text-[#10b981]">Free</span>
                      ) : (
                        `$${course.price}`
                      )}
                    </td>
                    <td className="py-4 px-6 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArchiveCourseButton id={course.id} isArchived={course.is_archived === true} />
                      <Link href={`/courses/${course.id}`} target="_blank" className="p-2 text-text-muted hover:text-ink hover:bg-canvas rounded-sm transition-colors" title="View Public Page">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/courses/${course.id}`} className="p-2 text-text-muted hover:text-ink hover:bg-canvas rounded-sm transition-colors" title="Edit Course">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-text-muted hover:text-[#ef4444] hover:bg-canvas rounded-sm transition-colors" title="Delete Course">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {courses && courses.length > 0 && (
          <div className="p-4 border-t border-hairline-soft bg-canvas flex items-center justify-between text-body-sm text-text-muted font-[456]">
            <span>Showing {courses.length} results</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 rounded-sm border border-hairline-soft opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1 rounded-sm border border-hairline-soft opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
