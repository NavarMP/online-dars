import Image from "next/image"

export const metadata = {
  title: "About Us | 'ilm Online Dars",
  description: "Learn about the rich history and vision of Alathurpadi Dars.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto font-sans">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-24">
        <span className="inline-block px-3 py-1 bg-canvas-soft border border-hairline rounded-full text-label text-ink mb-6 animate-[fadeIn_0.8s_ease-out_forwards]">
          Our Legacy
        </span>
        <h1 className="text-display tracking-tight mb-6 max-w-4xl animate-[fadeIn_1s_ease-out_forwards]">
          A Century of Preserving Sacred Knowledge.
        </h1>
        <p className="text-body-lg text-text-muted max-w-2xl animate-[fadeIn_1.2s_ease-out_forwards]">
          Alathurpadi Dars stands as a beacon of traditional Islamic scholarship, transmitting knowledge through an unbroken chain to the modern era.
        </p>
      </section>

      {/* Story Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-heading-2 mb-6">The Essence of Dars</h2>
          <p className="text-body text-text-muted mb-4">
            The traditional Dars system represents more than just a method of education; it is a spiritual and intellectual inheritance. Students do not merely memorize texts; they absorb the character, wisdom, and profound understanding of their teachers.
          </p>
          <p className="text-body text-text-muted">
            Through the careful study of Fiqh, Aqidah, Tasawwuf, and Arabic linguistics, we cultivate minds capable of navigating contemporary challenges while remaining deeply rooted in orthodoxy.
          </p>
        </div>
        <div className="order-1 md:order-2 aspect-square relative bg-canvas-soft border border-hairline rounded-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-text-muted/30">
            [Historical Image Placeholder]
          </div>
        </div>
      </section>

      {/* Stats / Impact */}
      <section className="bg-ink text-canvas rounded-4 p-12 md:p-24 flex flex-col md:flex-row justify-between gap-12 mb-32">
        <div className="max-w-md">
          <h2 className="text-heading-2 text-canvas mb-4">Our Global Impact</h2>
          <p className="text-body-sm text-canvas/70">
            By bringing the traditional Dars online, we have opened the doors of classical scholarship to seekers across the globe, breaking geographical boundaries.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:gap-16">
          <div>
            <div className="text-display text-canvas mb-2">50+</div>
            <div className="text-label text-canvas/70">Classical Texts (Kutub)</div>
          </div>
          <div>
            <div className="text-display text-canvas mb-2">12+</div>
            <div className="text-label text-canvas/70">Esteemed Instructors</div>
          </div>
          <div>
            <div className="text-display text-canvas mb-2">5k+</div>
            <div className="text-label text-canvas/70">Active Students</div>
          </div>
          <div>
            <div className="text-display text-canvas mb-2">100%</div>
            <div className="text-label text-canvas/70">Verified Isnad</div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-heading-2 mb-6">Our Vision</h2>
        <p className="text-body text-text-muted mb-8">
          To create a seamless bridge between ancient wisdom and modern technology, ensuring that the light of traditional scholarship continues to guide humanity for generations to come.
        </p>
        <button className="component-button-primary">
          Join Our Community
        </button>
      </section>
      
    </main>
  )
}
