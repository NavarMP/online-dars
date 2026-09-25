import Image from "next/image";
import Link from "next/link";
import { KutubSection } from "@/components/home/kutub-section";
import { InstructorSection } from "@/components/home/instructor-section";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured Kutub (limit to 3 for design)
  const { data: featuredKutub } = await supabase
    .from("kutub")
    .select("*")
    .eq("is_featured", true)
    .limit(3);

  // Fetch a primary instructor (e.g. the first one or a specific one)
  const { data: instructor } = await supabase
    .from("instructors")
    .select("*")
    .limit(1)
    .single();

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center w-full max-w-4xl mx-auto pt-[160px] pb-30 px-6">
        
        {/* Animated Wordmark/Logo */}
        <div className="mb-8 flex items-center justify-center opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          <Image 
            src="/dars-typo.svg" 
            alt="'ilm Arabic Typography" 
            width={240} 
            height={90} 
            className="dark:invert"
            priority
          />
        </div>

        <h1 className="text-display font-sans tracking-tight max-w-3xl">
          Traditional Knowledge. Modern Access.
        </h1>
        
        <p className="text-body-lg text-text-muted max-w-2xl mt-4">
          A premium, award-worthy digital experience for accessing classical texts, structured courses, and scholarly insights from Alathurpadi Dars.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-8 pt-6">
          <Link href="/courses" className="component-button-primary hover:opacity-90 transition-opacity">
            Explore Courses
          </Link>
          <Link href="/about" className="component-button-outline hover:bg-canvas-soft transition-colors">
            About the Dars
          </Link>
        </div>
      </section>

      {/* Featured Kutub Section */}
      <KutubSection kutub={featuredKutub || undefined} />

      {/* Spacer */}
      <div className="h-20"></div>

      {/* Instructor Section */}
      <InstructorSection instructor={instructor || undefined} />
    </main>
  );
}
