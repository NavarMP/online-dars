import Image from "next/image";
import Link from "next/link";
import { KutubSection } from "@/components/home/kutub-section";
import { InstructorSection } from "@/components/home/instructor-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center w-full max-w-4xl mx-auto pt-[160px] pb-section-lg px-lg">
        
        {/* Animated Wordmark/Logo */}
        <div className="mb-xl flex items-center justify-center opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
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
        
        <p className="text-body-lg text-text-muted max-w-2xl mt-md">
          A premium, award-worthy digital experience for accessing classical texts, structured courses, and scholarly insights from Alathurpadi Dars.
        </p>
        
        <div className="flex items-center justify-center gap-md mt-xl pt-lg">
          <Link href="/courses" className="component-button-primary hover:opacity-90 transition-opacity">
            Explore Courses
          </Link>
          <Link href="/about" className="component-button-outline hover:bg-canvas-soft transition-colors">
            About the Dars
          </Link>
        </div>
      </section>

      {/* Featured Kutub Section */}
      <KutubSection />

      {/* Spacer */}
      <div className="h-section"></div>

      {/* Instructor Section */}
      <InstructorSection />
    </main>
  );
}
