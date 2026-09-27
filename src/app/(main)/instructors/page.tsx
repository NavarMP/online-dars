import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export const metadata = {
  title: "Instructors | Suffa Online",
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
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-[1536px] mx-auto">
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="text-heading-1 md:text-display font-[652] tracking-tight mb-6 text-ink">
          Our Scholars.
        </h1>
        <p className="text-body-lg text-text-muted max-w-2xl font-[300]">
          Learn from esteemed scholars with verified chains of transmission (Isnad) in classical Islamic sciences. Each instructor brings decades of traditional study and teaching experience.
        </p>
      </div>

      {error ? (
        <div className="bg-[#ef4444]/10 text-[#ef4444] p-4 rounded-sm text-center">
          Failed to load instructors: {error.message}
        </div>
      ) : !instructors || instructors.length === 0 ? (
        <div className="border border-dashed border-hairline-soft rounded-md bg-canvas-soft py-24 flex flex-col items-center justify-center">
          <h2 className="text-heading-3 text-ink font-[652] mb-2">Instructors Coming Soon</h2>
          <p className="text-body text-text-muted">Instructor profiles are currently being updated.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {instructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="group bg-canvas border border-hairline-soft rounded-md overflow-hidden hover:border-hairline hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/5] relative bg-canvas-soft overflow-hidden">
                {instructor.image_url ? (
                  <Image 
                    src={instructor.image_url} 
                    alt={instructor.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-canvas-soft">
                    <span className="text-display text-text-muted font-[652] opacity-50">
                      {instructor.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-caption text-ink font-[600] uppercase tracking-wider mb-1 block">
                    {instructor.title}
                  </span>
                  <h3 className="text-heading-3 font-[652] text-ink mb-1">{instructor.name}</h3>
                  <p className="text-body-sm text-ink font-[600]">{instructor.specialization}</p>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-body-sm text-text-muted font-[456] line-clamp-4 leading-relaxed mb-6 flex-grow">
                  {instructor.bio || "Esteemed instructor at Alathurpadi Dars."}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-hairline-soft mt-auto">
                  <span className="text-caption text-text-muted">
                    {instructor.years_of_experience ? `${instructor.years_of_experience}+ Years Experience` : "Verified Scholar"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
