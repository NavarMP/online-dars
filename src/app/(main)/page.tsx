import Image from "next/image";
import Link from "next/link";
import { KutubSection } from "@/components/home/kutub-section";
import { InstructorSection } from "@/components/home/instructor-section";
import { createClient } from "@/lib/supabase/server";
import { Parallax } from "@/components/animations/parallax";
import { BackgroundVideo } from "@/components/media/background-video";
import { Reveal } from "@/components/animations/reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { WebGLHoverImage } from "@/components/media/webgl-hover-image";

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
      
      {/* Premium Hero Section with Background Video and Parallax */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white px-6">
        <Parallax speed={0.5}>
          <BackgroundVideo 
            src="https://www.w3schools.com/html/mov_bbb.mp4" 
            overlayOpacity={0.6}
            className="w-[100vw] h-[120vh] absolute top-[-10vh] left-0 pointer-events-none" 
          />
        </Parallax>

        <div className="z-10 flex flex-col items-center text-center max-w-4xl pt-20">
          <Reveal animation="zoom-in" duration={1}>
            <div className="mb-8 flex items-center justify-center">
              <Image 
                src="/dars-typo.svg" 
                alt="'Al-Dars Arabic Typography" 
                width={300} 
                height={120} 
                className="invert"
                priority
              />
            </div>
          </Reveal>

          <Reveal animation="fade-up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-sans tracking-tight font-light mb-6">
              Traditional Knowledge.<br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                Modern Access.
              </span>
            </h1>
          </Reveal>
          
          <Reveal animation="fade-up" delay={0.4}>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 font-light">
              A premium, award-worthy digital experience for accessing classical texts, structured courses, and scholarly insights from Alathurpadi Dars.
            </p>
          </Reveal>
          
          <Reveal animation="fade-up" delay={0.6}>
            <div className="flex items-center justify-center gap-6">
              <MagneticButton>
                <Link href="/courses" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  Explore Courses
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/about" className="px-8 py-4 rounded-full border border-white text-white hover:bg-white/10 transition-colors">
                  About the Dars
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WebGL Showcase Section */}
      <section className="w-full max-w-7xl mx-auto py-32 px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 w-full">
          <Reveal animation="slide-right">
            <h2 className="text-4xl font-bold mb-6">Immersive Learning</h2>
            <p className="text-gray-500 mb-8 text-lg">
              Experience our library of manuscripts through next-generation WebGL interactions, bringing history to life at your fingertips.
            </p>
            <MagneticButton>
              <Link href="/kutub" className="font-semibold underline underline-offset-4">Browse Library</Link>
            </MagneticButton>
          </Reveal>
        </div>
        <div className="flex-1 w-full h-[600px]">
          <Reveal animation="zoom-in" delay={0.2}>
            <WebGLHoverImage 
              image1="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"
              image2="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
              className="w-full h-full rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Featured Kutub Section wrapped in Reveal */}
      <Reveal animation="fade-up" width="100%">
        <KutubSection kutub={featuredKutub || undefined} />
      </Reveal>

      {/* Spacer */}
      <div className="h-32"></div>

      {/* Instructor Section */}
      <Parallax speed={0.9}>
        <Reveal animation="fade-up" width="100%">
          <InstructorSection instructor={instructor || undefined} />
        </Reveal>
      </Parallax>
    </main>
  );
}
