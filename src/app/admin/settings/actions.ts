"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveHeroVideo(formData: FormData) {
  const supabase = await createClient();
  const videoUrl = formData.get("videoUrl") as string;
  
  if (!videoUrl) return { error: "Video URL is required" };

  // Check if hero section exists
  const { data: existing } = await supabase
    .from("page_sections")
    .select("id, content")
    .eq("page_route", "/")
    .eq("section_name", "hero")
    .single();

  if (existing) {
    const updatedContent = { ...(existing.content as Record<string, any>), videoUrl };
    const { error } = await supabase
      .from("page_sections")
      .update({ content: updatedContent })
      .eq("id", existing.id);
      
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("page_sections")
      .insert({
        page_route: "/",
        section_name: "hero",
        content: { videoUrl },
        entrance_animation: "fade-in"
      });
      
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  
  return { success: true };
}

export async function deleteHeroVideo(videoUrl: string) {
  const supabase = await createClient();

  // If it's a supabase storage URL, try to delete the file
  if (videoUrl.includes("/storage/v1/object/public/media/")) {
    const objectPath = videoUrl.split("/storage/v1/object/public/media/")[1];
    if (objectPath) {
      await supabase.storage.from("media").remove([objectPath]);
    }
  }

  // Check if hero section exists and clear the URL
  const { data: existing } = await supabase
    .from("page_sections")
    .select("id, content")
    .eq("page_route", "/")
    .eq("section_name", "hero")
    .single();

  if (existing) {
    const updatedContent = { ...(existing.content as Record<string, any>), videoUrl: "" };
    await supabase
      .from("page_sections")
      .update({ content: updatedContent })
      .eq("id", existing.id);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: true };
}

export async function saveCoursesConfig(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const layout = formData.get("layout") as string;
  const backgroundStyle = formData.get("backgroundStyle") as string;
  const animationSpeed = formData.get("animationSpeed") as string;
  
  const content = {
    title,
    subtitle,
    layout,
    backgroundStyle,
    animationSpeed
  };

  const { data: existing } = await supabase
    .from("page_sections")
    .select("id, content")
    .eq("page_route", "/")
    .eq("section_name", "courses")
    .single();

  if (existing) {
    const updatedContent = { ...(existing.content as Record<string, any>), ...content };
    const { error } = await supabase
      .from("page_sections")
      .update({ content: updatedContent })
      .eq("id", existing.id);
      
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("page_sections")
      .insert({
        page_route: "/",
        section_name: "courses",
        content,
        entrance_animation: "fade-up"
      });
      
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  
  return { success: true };
}

export async function saveStatsConfig(content: any) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("page_sections")
    .select("id, content")
    .eq("page_route", "/")
    .eq("section_name", "stats")
    .single();

  if (existing) {
    const updatedContent = { ...(existing.content as Record<string, any>), ...content };
    const { error } = await supabase
      .from("page_sections")
      .update({ content: updatedContent })
      .eq("id", existing.id);
      
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("page_sections")
      .insert({
        page_route: "/",
        section_name: "stats",
        content,
        entrance_animation: "fade-up"
      });
      
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  
  return { success: true };
}
