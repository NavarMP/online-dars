import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/animations/reveal";
import { ReactNode } from "react";

interface DynamicSectionProps {
  pageRoute: string;
  sectionName: string;
  children: ReactNode;
  fallbackAnimation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom-in";
}

export async function DynamicSection({ 
  pageRoute, 
  sectionName, 
  children,
  fallbackAnimation = "fade-up" 
}: DynamicSectionProps) {
  const supabase = await createClient();

  const { data: sectionConfig } = await supabase
    .from("page_sections")
    .select("entrance_animation, animation_delay")
    .eq("page_route", pageRoute)
    .eq("section_name", sectionName)
    .single();

  const animation = sectionConfig?.entrance_animation || fallbackAnimation;
  const delay = sectionConfig?.animation_delay || 0;

  // If the admin selected "none", we don't wrap it in Reveal
  if (animation === "none") {
    return <section className="w-full relative">{children}</section>;
  }

  return (
    <section className="w-full relative">
      <Reveal animation={animation as any} delay={Number(delay)}>
        {children}
      </Reveal>
    </section>
  );
}
