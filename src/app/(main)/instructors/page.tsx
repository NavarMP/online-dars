import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export const metadata = {
  title: "Instructors | 'ilm Online Dars",
  description: "Meet the esteemed scholars and instructors at Alathurpadi Dars.",
}

export default async function InstructorsPage() {
  const supabase = await createClient()

  // Fetch instructors from the database
  const { data: instructors, error } = await supabase
    .from("instructors")
    .select("*")
    .order("created_at", { ascending: true })

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-display font-sans tracking-tight mb-4 animate-[fadeIn_1s_ease-out_forwards]">
          Our Instructors
        </h1>
        <p className="text-body-lg text-text-muted max-w-2xl animate-[fadeIn_1.2s_ease-out_forwards]">
          Learn from esteemed scholars with verified chains of transmission (Isnad) in classical Islamic sciences.
        </p>
      </div>

      {error ? (
        <div className="bg-[#ef4444]/10 text-[#ef4444] p-4 rounded-sm text-center">
          Failed to load instructors: {error.message}
        </div>
      ) : !instructors || instructors.length === 0 ? (
        <div className="border border-dashed border-hairline rounded-sm bg-canvas-soft py-20 flex flex-col items-center justify-center">
          <h2 className="text-heading-3 text-text-muted mb-2">Instructors Coming Soon</h2>
          <p className="text-body-sm text-text-muted">Instructor profiles are currently being updated.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="group bg-canvas border border-hairline rounded-4 overflow-hidden hover:border-ink/20 transition-all duration-300"
            >
              <div className="aspect-[4/5] relative bg-field overflow-hidden">
                {instructor.image_url ? (
                  <Image 
                    src={instructor.image_url} 
                    alt={instructor.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-canvas to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-heading-3 text-ink mb-1">{instructor.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-body-sm text-text-muted line-clamp-4">
                  {instructor.bio || "Esteemed instructor at Alathurpadi Dars."}
                </p>
                <button className="mt-6 text-link text-ink hover:text-text-muted transition-colors">
                  View Full Profile ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
