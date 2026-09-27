export const metadata = {
  title: "Privacy Policy | Suffa",
  description: "Privacy Policy for the Suffa Online Dars.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-heading-1 mb-8">Privacy Policy.</h1>
      <p className="text-body-sm text-text-muted mb-12">Last updated: September 2026</p>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-heading-4 mb-3">1. Information We Collect</h2>
          <p className="text-body text-text-muted leading-relaxed mb-4">
            We collect the following types of information when you use the Suffa Online Dars Platform:
          </p>
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li className="text-body text-text-muted"><strong className="text-ink">Account Information:</strong> Name, email address, and password when you create an account.</li>
            <li className="text-body text-text-muted"><strong className="text-ink">Usage Data:</strong> Course progress, session completions, and interaction patterns to improve our educational offerings.</li>
            <li className="text-body text-text-muted"><strong className="text-ink">Payment Information:</strong> Payment details are processed by our secure third-party payment partners. We do not store credit card information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">2. How We Use Your Information</h2>
          <p className="text-body text-text-muted leading-relaxed">
            Your information is used to provide and improve the Platform, deliver course content, track learning progress, process payments, communicate important updates, and ensure the security of your account. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">3. Data Storage & Security</h2>
          <p className="text-body text-text-muted leading-relaxed">
            Your data is stored securely using industry-standard encryption and hosted on Supabase infrastructure. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">4. Cookies</h2>
          <p className="text-body text-text-muted leading-relaxed">
            We use essential cookies to maintain your authenticated session and remember your preferences (such as theme settings). We do not use tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">5. Your Rights</h2>
          <p className="text-body text-text-muted leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time. You can update your profile information through your account settings. To request account deletion, please contact us directly.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">6. Third-Party Services</h2>
          <p className="text-body text-text-muted leading-relaxed">
            We use the following third-party services: Supabase (authentication and database), and Vercel (hosting). Each of these services has its own privacy policy governing the use of your data.
          </p>
        </section>

        <section>
          <h2 className="text-heading-4 mb-3">7. Contact</h2>
          <p className="text-body text-text-muted leading-relaxed">
            For privacy-related inquiries, please contact us at{" "}
            <a href="mailto:info@alathurpadidars.com" className="text-ink hover:underline">info@alathurpadidars.com</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
