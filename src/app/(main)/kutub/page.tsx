import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { searchParamsCache } from "@/lib/search-params"
import { LibrarySidebar } from "@/components/filters/library-sidebar"
import { SortDropdown } from "@/components/filters/sort-dropdown"
export const metadata = {
  title: "Kutub Library | Suffa Online Dars",
  description: "Explore our collection of classical Islamic texts.",
}

export default async function KutubPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const { category: activeCategory, q: searchQuery, sort } = searchParamsCache.parse(resolvedSearchParams)
  
  const supabase = await createClient()

  // 1. Fetch categories for the filter sidebar
  const { data: categories } = await supabase
    .from("kutub_categories")
    .select("name")
    .neq("is_archived", true)
    .order("name")

  // 2. Fetch kutub based on selected category (if any)
  let query = supabase.from("kutub").select("*").neq("is_archived", true)
  
  if (activeCategory && activeCategory !== "All") {
    query = query.eq("category", activeCategory)
  }

  if (searchQuery) {
    // Search both English and Arabic titles
    query = query.or(`title.ilike.%${searchQuery}%,arabic_title.ilike.%${searchQuery}%`)
  }

  // Sorting
  switch (sort) {
    case 'popular':
    case 'price_asc':
    case 'price_desc':
    case 'duration_asc':
    case 'duration_desc':
      // Map sort options that aren't applicable to kutub to 'latest'
      query = query.order("created_at", { ascending: false })
      break;
    default:
      if (sort === 'a_z') {
        query = query.order("title", { ascending: true })
      } else if (sort === 'z_a') {
        query = query.order("title", { ascending: false })
      } else {
        query = query.order("created_at", { ascending: false })
      }
      break;
  }

  const { data: kutub, error } = await query

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-[1536px] mx-auto flex flex-col lg:flex-row gap-16">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <LibrarySidebar categories={categories || []} />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-heading-1 md:text-display font-[652] tracking-tight mb-4 text-ink">
              {activeCategory && activeCategory !== 'All' ? `${activeCategory} Texts` : 'The Library.'}
            </h1>
            <p className="text-body-lg text-text-muted font-[300] max-w-2xl">
              Browse and explore our curated collection of classical texts taught at the Dars. Each text is digitized and paired with structured lessons.
            </p>
          </div>
          <div className="shrink-0">
            <SortDropdown 
              options={[
                { value: 'latest', label: 'Newly Added' },
                { value: 'a_z', label: 'Alphabetical (A-Z)' },
                { value: 'z_a', label: 'Alphabetical (Z-A)' },
              ]}
            />
          </div>
        </div>

        {error ? (
          <div className="bg-[#ef4444]/10 text-[#ef4444] p-4 rounded-sm">
            Failed to load library: {error.message}
          </div>
        ) : !kutub || kutub.length === 0 ? (
          <div className="border border-dashed border-hairline-soft rounded-sm bg-canvas-soft py-24 flex flex-col items-center justify-center text-center">
            <BookOpen className="w-12 h-12 text-text-muted mb-4 opacity-50" />
            <h2 className="text-heading-3 font-[652] text-ink mb-2">No texts found</h2>
            <p className="text-body text-text-muted max-w-md mx-auto">
              {activeCategory ? `We couldn't find any texts in the ${activeCategory} category.` : 'The library is currently empty.'}
            </p>
            {activeCategory && (
              <Link href="/kutub" className="component-button-outline mt-6">
                Clear Filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {kutub.map((kitab) => (
              <div key={kitab.id} className="group bg-canvas border border-hairline-soft hover:border-hairline hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-md p-8 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <span className="text-[160px] font-arabic leading-none">{kitab.arabic_title?.charAt(0) || 'ك'}</span>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-flex bg-canvas-soft border border-hairline-soft text-ink text-caption font-[600] uppercase tracking-wider px-3 py-1 rounded-full">
                      {kitab.category}
                    </span>
                  </div>
                  
                  <h3 className="text-heading-3 font-[652] text-ink mb-2 group-hover:text-primary transition-colors pr-8">
                    {kitab.title}
                  </h3>
                  
                  <h4 className="text-heading-4 font-arabic text-ink opacity-70 mb-4" dir="rtl">
                    {kitab.arabic_title}
                  </h4>
                  
                  <p className="text-body-sm text-text-muted font-[456] line-clamp-3">
                    {kitab.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-hairline-soft relative z-10">
                  <Link href={`/courses?category=${encodeURIComponent(kitab.category)}`} className="inline-flex items-center gap-2 text-link text-ink hover:text-text-muted transition-colors group/link">
                    View Related Courses
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}
