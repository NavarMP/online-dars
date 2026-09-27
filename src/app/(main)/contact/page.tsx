"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, this would send to an API endpoint
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="inline-block px-3 py-1 bg-canvas-soft border border-hairline rounded-full text-label text-ink mb-6">
          Get in Touch
        </span>
        <h1 className="text-display tracking-tight mb-4 max-w-3xl">
          We'd Love to Hear From You.
        </h1>
        <p className="text-body-lg text-text-muted max-w-2xl">
          Whether you have a question about our courses, need technical support, or want to collaborate — we're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-canvas-soft border border-hairline rounded-md p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-ink text-on-primary flex items-center justify-center mx-auto mb-6">
                <Send className="w-7 h-7" />
              </div>
              <h2 className="text-heading-3 mb-3">Message Sent!</h2>
              <p className="text-body text-text-muted">
                JazakAllah Khair for reaching out. We'll get back to you within 24 hours, insha'Allah.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-label text-ink font-[600]" htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label text-ink font-[600]" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label text-ink font-[600]" htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow"
                  placeholder="How can we help?"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label text-ink font-[600]" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  className="bg-field text-ink rounded-sm px-4 py-3 outline-none focus:ring-2 focus:ring-ink transition-shadow resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" className="component-button-primary w-full mt-2">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-8 lg:pl-8">
          <div>
            <h2 className="text-heading-4 mb-6">Other Ways to Reach Us</h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-label text-ink mb-1">Email</p>
                  <a href="mailto:info@alathurpadidars.com" className="text-body-sm text-text-muted hover:text-ink transition-colors">
                    info@alathurpadidars.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-label text-ink mb-1">WhatsApp</p>
                  <a href="https://api.whatsapp.com/send?phone=919074525205" className="text-body-sm text-text-muted hover:text-ink transition-colors">
                    +91 907 452 5205
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-canvas-soft border border-hairline flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-label text-ink mb-1">Location</p>
                  <p className="text-body-sm text-text-muted">
                    Alathurpadi Dars<br />
                    Kerala, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ink text-on-primary rounded-md p-8">
            <h3 className="text-heading-4 text-on-primary mb-3">Follow Us</h3>
            <p className="text-body-sm text-on-primary/70 mb-6">
              Stay connected for updates, new courses, and live sessions.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/alathurpadi_dars/" target="_blank" rel="noopener noreferrer" className="text-on-primary/70 hover:text-on-primary transition-colors text-body-sm">
                Instagram
              </a>
              <a href="https://www.youtube.com/alathurpadidars" target="_blank" rel="noopener noreferrer" className="text-on-primary/70 hover:text-on-primary transition-colors text-body-sm">
                YouTube
              </a>
              <a href="https://api.whatsapp.com/send?phone=919074525205" target="_blank" rel="noopener noreferrer" className="text-on-primary/70 hover:text-on-primary transition-colors text-body-sm">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
