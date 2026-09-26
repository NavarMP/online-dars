import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export const metadata = {
  title: "Kutub Library | 'ilm Online Dars",
  description: "Explore our collection of classical Islamic texts.",
}

// Next.js server components can access searchParams
export default async function KutubPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()

  // 1. Fetch categories for the filter sidebar
  const { data: categories } = await supabase
    .from("kutub_categories")
    .select("name")
    .order("name")

  // 2. Fetch kutub based on selected category (if any)
  let query = supabase.from("kutub").select("*").order("created_at", { ascending: false })
  
  const activeCategory = resolvedSearchParams?.category
  if (activeCategory && activeCategory !== "all") {
    query = query.eq("category", activeCategory)
  }

  const { data: kutub, error } = await query

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-32">
          <h2 className="text-body font-semibold mb-6">Categories</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link 
                href="/kutub" 
                className={`text-body-sm transition-colors ${
                  !activeCategory || activeCategory === 'all' 
                    ? "text-ink font-medium" 
                    : "text-text-muted hover:text-ink"
                }`}
              >
                All Texts
              </Link>
            </li>
            {categories?.map((cat) => (
              <li key={cat.name}>
                <Link 
                  href={`/kutub?category=${encodeURIComponent(cat.name)}`}
                  className={`text-body-sm transition-colors ${
                    activeCategory === cat.name 
                      ? "text-ink font-medium" 
                      : "text-text-muted hover:text-ink"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-12">
          <h1 className="text-display font-sans tracking-tight mb-4">
            {activeCategory && activeCategory !== 'all' ? `${activeCategory} Texts` : 'The Library'}
          </h1>
          <p className="text-body text-text-muted">
            Browse and explore our curated collection of classical texts taught at the Dars.
          </p>
        </div>

        {error ? (
          <div className="bg-[#ef4444]/10 text-[#ef4444] p-4 rounded-sm">
            Failed to load library: {error.message}
          </div>
        ) : !kutub || kutub.length === 0 ? (
          <div className="border border-dashed border-hairline rounded-sm bg-canvas-soft py-20 flex flex-col items-center justify-center">
            <h2 className="text-heading-3 text-text-muted mb-2">No texts found</h2>
            <p className="text-body-sm text-text-muted">
              {activeCategory ? `We couldn't find any texts in the ${activeCategory} category.` : 'The library is currently empty.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kutub.map((kitab) => (
              <div key={kitab.id} className="bg-canvas border border-hairline rounded-4 p-6 hover:border-ink/20 transition-colors flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block bg-canvas-soft border border-hairline text-ink text-label px-2 py-1 rounded-sm">
                      {kitab.category}
                    </span>
                    <span className="text-heading-3 font-serif text-ink opacity-70" dir="rtl">
                      {kitab.arabic_title}
                    </span>
                  </div>
                  <h3 className="text-heading-3 mb-2">{kitab.title}</h3>
                  <p className="text-body-sm text-text-muted line-clamp-3">
                    {kitab.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-hairline">
                  <Link href={`/courses?kitab=${kitab.id}`} className="text-link text-ink hover:text-text-muted transition-colors">
                    Find Related Courses ↗
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
