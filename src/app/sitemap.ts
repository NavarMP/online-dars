import { MetadataRoute } from 'next'
import { createClient } from "@/lib/supabase/server"
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Fetch dynamic routes
  const { data: courses } = await supabase.from('courses').select('id, updated_at').eq('status', 'published')
  
  const courseUrls = (courses || []).map((course) => ({
    url: `https://aldars.com/courses/${course.id}`,
    lastModified: new Date(course.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://aldars.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://aldars.com/courses',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://aldars.com/kutub',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://aldars.com/instructors',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://aldars.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...courseUrls,
  ]
}
