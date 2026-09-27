export const metadata = {
  title: "Terms of Service | Suffa",
  description: "Terms of Service for the Suffa Online Dars.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-heading-1 mb-8">Terms of Service.</h1>
      <p className="text-body-sm text-text-muted mb-12">Last updated: September 2026</p>

      <div className="prose prose-neutral max-w-none flex flex-col gap-8">
        <section>
          <h2 className="text-heading-4 mb-3">1. Acceptance of Terms</h2>
          <p className="text-body text-text-muted leading-relaxed">
            By accessing and using the Suffa Online Dars Platform ("the Platform"), operated by the Alathurpadi Dars Students Association (ADSA), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">2. Description of Service</h2>
          <p className="text-body text-text-muted leading-relaxed">
            The Platform provides online access to traditional Islamic education resources including courses, study materials, and scholarly content. We offer both free and paid courses in subjects including but not limited to Fiqh, Aqidah, Tafsir, Hadith, and Arabic linguistics.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">3. User Accounts</h2>
          <p className="text-body text-text-muted leading-relaxed">
            You must create an account to access certain features of the Platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">4. Course Enrollment & Access</h2>
          <p className="text-body text-text-muted leading-relaxed">
            Upon enrollment in a course (free or paid), you are granted a personal, non-transferable license to access the course content for your own educational use. You may not share, redistribute, or commercially exploit any course materials without explicit written permission from ADSA.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">5. Payments & Refunds</h2>
          <p className="text-body text-text-muted leading-relaxed">
            Paid courses require payment at the time of enrollment. Payments are processed securely through our payment partners. We offer a 7-day refund policy for paid courses if you have completed less than 20% of the course content.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">6. Intellectual Property</h2>
          <p className="text-body text-text-muted leading-relaxed">
            All content on the Platform, including but not limited to video lectures, study materials, course structures, and design elements, is the intellectual property of ADSA and its instructors. Unauthorized reproduction or distribution is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">7. Code of Conduct</h2>
          <p className="text-body text-text-muted leading-relaxed">
            Users are expected to engage respectfully with the learning community. Harassment, discrimination, or disruptive behavior will result in account suspension. Users must treat all instructors and fellow students with the dignity and respect befitting a place of sacred knowledge.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">8. Contact</h2>
          <p className="text-body text-text-muted leading-relaxed">
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:info@alathurpadidars.com" className="text-ink hover:underline">info@alathurpadidars.com</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
