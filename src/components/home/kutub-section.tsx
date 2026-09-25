"use client"

import Link from "next/link"

type Kitab = {
  id?: string
  title: string
  arabic_title: string
  category: string
  description: string
  is_featured?: boolean
  highlight?: boolean
}

const FEATURED_KUTUB: Kitab[] = [
  {
    title: "Fat'h al-Mu'in",
    arabic_title: "فتح المعين",
    category: "Fiqh",
    description: "The universally accepted manual of Shafi'i jurisprudence.",
    highlight: true,
  },
  {
    title: "Tafsir al-Jalalayn",
    arabic_title: "تفسير الجلالين",
    category: "Tafsir",
    description: "The classic, accessible exegesis of the Holy Qur'an.",
    highlight: false,
  },
  {
    title: "Mutafarrid",
    arabic_title: "متفرد",
    category: "Aqidah",
    description: "Advanced theological discussions and principles.",
    highlight: false,
  }
]

export function KutubSection({ kutub = [] }: { kutub?: Kitab[] }) {
  const displayKutub = kutub.length > 0 ? kutub.map((k, index) => ({ ...k, highlight: index === 0 })) : FEATURED_KUTUB;

  return (
    <section className="py-20 px-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <h2 className="text-heading-1 tracking-tight">
          Classical Texts.
        </h2>
        <Link href="/kutub" className="text-link text-text-muted hover:text-ink mt-3 md:mt-0 transition-colors">
          Explore Library ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {displayKutub.map((kitab, index) => (
          <div 
            key={kitab.id || kitab.title} 
            className={`
              relative p-6 rounded-4 border
              ${kitab.highlight 
                ? 'bg-canvas-soft border-transparent md:col-span-6 min-h-[400px]' 
                : 'bg-canvas border-hairline-soft md:col-span-3 min-h-[400px] flex flex-col justify-between'
              }
            `}
          >
            {kitab.highlight && (
              <div className="absolute top-6 right-6 bg-accent text-on-primary text-label px-3 py-1 rounded-full">
                Featured
              </div>
            )}
            
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="inline-block bg-[rgba(115,115,115,0.1)] text-ink text-label px-2 py-1 rounded-3 mb-4">
                  {kitab.category}
                </span>
                <h3 className="text-heading-3 mb-2">{kitab.title}</h3>
                <p className="text-body-3 text-text-muted line-clamp-3">{kitab.description}</p>
              </div>

              <div className="mt-8">
                <span className="text-display font-serif text-ink-soft opacity-20" dir="rtl">
                  {kitab.arabic_title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
