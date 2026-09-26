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

export function KutubSection({ kutub = [] }: { kutub?: Kitab[] }) {
  const displayKutub = kutub.map((k, index) => ({ ...k, highlight: index === 0 }));

  if (displayKutub.length === 0) {
    return (
      <section className="py-20 px-6 w-full max-w-7xl mx-auto flex flex-col items-center justify-center border border-dashed border-hairline rounded-sm bg-canvas-soft min-h-[300px]">
        <h2 className="text-heading-3 text-text-muted mb-2">No Classical Texts Yet</h2>
        <p className="text-body-sm text-text-muted mb-4">Add your first Kitab in the Admin Panel to see it featured here.</p>
        <Link href="/admin/kutub/new" className="component-button-outline px-4 py-2 text-body-sm rounded-sm">
          Add Kitab
        </Link>
      </section>
    );
  }

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
                <span className="text-display font-arabic text-ink-soft opacity-20" dir="rtl">
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
