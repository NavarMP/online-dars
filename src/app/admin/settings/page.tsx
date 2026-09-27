import { createClient } from "@/lib/supabase/server";
import { HeroVideoManager } from "./hero-video-manager";
import { CoursesManager } from "./courses-manager";
import { Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  
  // Fetch existing hero section
  const { data: heroSection } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_route", "/")
    .eq("section_name", "hero")
    .single();
    
  // Fetch courses section config
  const { data: coursesSection } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_route", "/")
    .eq("section_name", "courses")
    .single();
    
  const currentVideoUrl = (heroSection?.content as any)?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-heading-2 font-[652] tracking-tight mb-2">Platform Settings</h1>
        <p className="text-body-sm text-text-muted font-[456]">Manage global platform configurations and visual assets.</p>
      </div>

      <div className="flex flex-col gap-12">
        
        {/* General Details (Split Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-heading-4 font-[652] text-ink mb-2">General Info</h2>
            <p className="text-body-sm text-text-muted font-[456]">Update the primary details of your instance.</p>
          </div>
          <div className="md:col-span-2 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Platform Name</label>
              <input 
                type="text" 
                defaultValue="Suffa Online Dars"
                className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-caption text-text-muted font-[600] uppercase tracking-wider">Support Email</label>
              <input 
                type="email" 
                defaultValue="info@alathurpadidars.com"
                className="bg-field border border-hairline-soft rounded-sm px-4 py-3 text-body-sm outline-none focus:border-ink transition-colors font-[456]"
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button className="component-button-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-hairline-soft w-full" />

        {/* Hero Video Section (Split Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-heading-4 font-[652] text-ink mb-2">Landing Page</h2>
            <p className="text-body-sm text-text-muted font-[456]">Manage the visual assets for the homepage hero section.</p>
          </div>
          <div className="md:col-span-2 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm flex flex-col gap-6">
            <HeroVideoManager currentVideoUrl={currentVideoUrl} />
          </div>
        </div>

        <div className="h-px bg-hairline-soft w-full" />

        {/* Courses Section (Split Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-heading-4 font-[652] text-ink mb-2">Courses Section</h2>
            <p className="text-body-sm text-text-muted font-[456]">Manage the premium presentation and animations for the featured courses on the homepage.</p>
          </div>
          <div className="md:col-span-2 bg-canvas border border-hairline-soft rounded-md p-8 shadow-sm flex flex-col gap-6">
            <CoursesManager currentConfig={coursesSection?.content} />
          </div>
        </div>

      </div>
    </div>
  )
}
