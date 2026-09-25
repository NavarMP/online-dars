# PROJECT BRIEF: 'ilm (علم) — Online Dars Platform
## For: Google Antigravity Agent
## Client: Alathurpadi Dars Students Association (ADSA)

---

## 1. PROJECT IDENTITY

**Product name:** 'ilm — علم (Arabic for "knowledge")
**Tagline (draft, refine during build):** "Traditional Knowledge. Modern Access."
**Parent organization:** Alathurpadi Dars Students Association (ADSA)
**Academic authority:** Usthad C K Abdurahman Faizy, Aripra
**Reference institution:** Alathurpadi Dars — https://en.wikipedia.org/wiki/Alathurpadi_Dars
**Existing web presence:** https://alathurpadidars.in/

This is not a generic LMS. It is a premium, award-worthy digital experience for accessing traditional Islamic seminary (Dars) education — classical texts (kutub), structured courses, and study materials — built for a global audience that includes scholars, students, and the Alathurpadi Dars alumni network.

The design and interaction quality must be benchmarked against Awwwards Site-of-the-Day tier work — think agency portfolio sites, Awwwards nominees, Locomotive Scroll / Lenis-driven experiences — NOT a typical course marketplace like Udemy or Coursera. The academic content is traditional and reverent; the digital execution should feel cutting-edge, cinematic, and tactile.

---

## 2. BRAND & CONTENT CONTEXT

- Organization: Alathurpadi Dars Students Association (ADSA)
- Contact email: alathurpadidars@gmail.com
- WhatsApp (direct): https://api.whatsapp.com/send?phone=919074525205
- WhatsApp Channel: https://whatsapp.com/channel/0029VaEKsh01t90eFbaYwN1h
- Instagram: https://www.instagram.com/alathurpadi_dars/
- Facebook: https://www.facebook.com/alathurpadidars
- X (Twitter): https://x.com/alathurpadidars
- YouTube: https://www.youtube.com/alathurpadidars

**Funun**
- Fiqh
- Nahw & Sarf
- Hadith
- Tafsir
- (Agent should design the data model to accommodate an extensible catalog of funun, not hardcode this list — treat these as seed/example data only.)

**Sample kutub (classical texts) to model course/content structure around:**
- Mutafarrid
- Fat'h al-Mu'in
- Tafsir al-Jalalayn
- (Agent should design the data model to accommodate an extensible catalog of kutub, not hardcode this list — treat these as seed/example data only.)

**Content types the platform must support:**
- Free courses
- Paid courses
- Standalone study materials (PDFs, notes, audio, video lessons)
- Instructor/Usthad profiles (starting with Usthad C K Abdurahman Faizy, Aripra)
- Class/cohort structures (a "Dars" style class may have a syllabus, sessions, and enrolled students — not just linear video lectures)
- Course completion certificates (see Section 4.8)

---

## 3. TECHNOLOGY STACK (mandatory)

- **Framework:** Next.js (App Router, latest stable version — use Server Components by default, Client Components only where interactivity/animation requires it)
- **Backend/DB/Auth/Storage:** Supabase (Postgres, Auth, Row Level Security, Storage for course materials/media)
- **Styling:** Tailwind CSS (utility-first, with a custom design token layer — see Section 6)
- **Animation:** GSAP (with ScrollTrigger) and/or Framer Motion for component-level motion; Lenis (or Locomotive Scroll) for smooth scrolling
- **State/data fetching:** React Server Components + Supabase client; use TanStack Query or SWR only where client-side reactivity is genuinely needed
- **Internationalization:** next-intl or next-i18next (agent to choose based on App Router compatibility) — must support RTL layout switching for Arabic
- **Deployment target:** Vercel-compatible (assume Vercel unless told otherwise)
- **Type safety:** TypeScript throughout, strict mode enabled

Agent should scaffold the project with a clean, scalable folder structure (feature-based or route-based grouping under `app/`), and set up Supabase schema via migrations (not manual dashboard edits) so the schema is version-controlled and reviewable.

---

## 4. CORE FEATURE REQUIREMENTS

### 4.1 Awwwards-tier design language
- Every major section should have a distinct, art-directed layout — avoid generic "hero + 3-column features + testimonials + footer" templates.
- Use asymmetric grids, oversized typography, generous negative space, and layered depth (parallax layers, floating elements).
- Custom cursor states (see 4.6) and micro-interactions on every interactive element — no default browser hover states left unstyled.
- Design should feel "premium and reverent" — this is Islamic scholarly content, so avoid gimmicky/loud effects that clash with the subject matter's dignity. Aim for elegant, confident, cinematic motion — not flashy for its own sake.

### 4.2 Dynamic content & advanced admin panel
- Full CMS-style admin panel (role-gated via Supabase Auth + RLS) for ADSA staff to:
  - Create/edit/publish courses, kutub, classes, and study materials
  - Upload and manage **all media assets dynamically** — course thumbnails, instructor photos, banners, promotional graphics, additional logos/marks, etc. — via Supabase Storage. Beyond the seed assets listed in Section 4.9, no future asset should require a code change or redeploy to add.
  - Manage instructors/Usthads (profile, bio, credentials, photo)
  - Set course pricing, free/paid toggle, and enrollment rules
  - Manage students/enrollments, view progress, issue/revoke certificates (see 4.8)
  - Manage translations/content per language (English, Malayalam, Arabic)
  - View basic analytics (enrollments, active students, revenue if paid courses are enabled)
- Admin panel should have its own distinct, efficient, no-nonsense UI (dashboard-style, data-dense, fast) — contrast intentionally with the cinematic public site. Clarity and speed matter more than spectacle here.

### 4.3 Full responsiveness
- Fluid, tested breakpoints from small mobile (320px) through ultra-wide desktop (1920px+).
- Fluid typography (clamp()-based) and fluid spacing scales rather than fixed breakpoint jumps.
- Touch targets, tap states, and mobile-specific interaction patterns must be first-class, not an afterthought of the desktop design.

### 4.4 Theme provider
- Modes: **System default (default)**, Light, Dark.
- Implement via a proper theme provider (e.g., `next-themes`) with no flash-of-incorrect-theme on load.
- Design full color token systems for both light and dark modes — dark mode should not be an inverted afterthought; treat it as a primary, intentionally designed mode (this platform's likely default aesthetic leans dark, minimal, and premium per brand direction).

### 4.5 Language selector
- Languages: **English (default)**, Malayalam (ml), Arabic (ar).
- Arabic must trigger full RTL layout mirroring — not just text direction, but mirrored layout logic, icons, and animation directions where relevant.
- Persist language preference (cookie or localStorage + Supabase user profile if logged in).
- All course/content metadata should be translatable at the data layer (i18n-aware schema), not just static UI strings.

### 4.6 Scroll, cursor, and hover effects
- Smooth/inertia scrolling site-wide (Lenis recommended for Next.js compatibility).
- Scroll-triggered reveal animations, parallax layers, and pinned/sticky storytelling sections (e.g., hero, "About the Dars" section, featured kutub showcase).
- Custom cursor: default state, hover-expand state over interactive elements, magnetic button effects on key CTAs.
- All effects must respect `prefers-reduced-motion` and degrade gracefully — accessibility is non-negotiable, not optional polish.

### 4.7 Navigation pattern
- **Mobile:** Floating dock-style navigation (macOS-dock-inspired) fixed at bottom, with icon-based primary actions (Home, Courses, Search, Profile/Account, Menu).
- **Desktop:** Full navigation menu (header-based or off-canvas mega-menu), with the same information architecture as the mobile dock but expanded with labels, dropdowns for course categories, and language/theme switchers visible in the nav bar.
- Both must animate in/out smoothly on scroll direction change (hide on scroll down, reveal on scroll up) or remain persistently accessible — agent to choose based on what best fits the overall motion design, but must be consistent and intentional.

### 4.8 Certificates
- Students who complete a course (defined as: all required lessons/sessions marked complete, and any required assessment passed if applicable) are eligible for a **completion certificate**.
- Certificate should be a generated, downloadable artifact (PDF) containing: student name, course/kutub title, instructor (Usthad) name, ADSA branding, completion date, and a unique certificate ID/verification code.
- Build a simple public verification route (e.g., `/verify/[certificateId]`) so a certificate's authenticity can be checked by anyone with the code.
- Admin panel must allow staff to view issued certificates and manually revoke/reissue one if needed.
- Certificate design should match the platform's premium visual identity, not a generic template — treat it as a brand touchpoint (students will likely share these).

### 4.9 Dummy payment integration (placeholder, non-production)
- Paid courses need a working **checkout flow end-to-end**, but the actual payment processor is not yet decided by the client.
- Implement a **mock/dummy payment provider**:
  - A checkout screen matching the final visual design (card entry UI or a simple "Simulate Payment" flow — agent's choice, favor something that looks realistic rather than an obvious test stub).
  - On "successful" dummy payment, the system should behave exactly as it would with a real gateway: create an order record, mark enrollment as active, trigger any confirmation email/notification hook, and grant course access.
  - Abstract the payment logic behind a clean interface/adapter (e.g., a `PaymentProvider` interface) so swapping in a real provider (Razorpay, Stripe, PayPal, etc.) later is a drop-in replacement, not a rebuild. Do not hardcode "dummy" logic directly into checkout components.
  - Clearly log/flag in code comments and any relevant admin UI that this is a placeholder integration, not production-ready payment processing.

---

## 5. INFORMATION ARCHITECTURE (proposed — agent may refine)

- `/` — Home (hero, mission, featured kutub, featured Usthad, CTA to explore courses)
- `/courses` — Course catalog (filterable by free/paid, subject, level, instructor)
- `/courses/[slug]` — Course detail (syllabus, instructor, enrollment/checkout flow, preview materials)
- `/kutub` — Classical text library (Mutafarrid, Fat'h al-Mu'in, Tafsir al-Jalalayn, etc.), each linkable to related courses/classes
- `/instructors` and `/instructors/[slug]` — Usthad profiles, starting with C K Abdurahman Faizy, Aripra
- `/about` — About ADSA, About Alathurpadi Dars (drawing from the Wikipedia reference and existing site), mission/history
- `/materials` — Study materials library (downloadable/streamable resources, filterable)
- `/account` — Student dashboard: enrolled courses, progress, downloads, certificates
- `/verify/[certificateId]` — Public certificate verification page
- `/admin/*` — Admin panel (protected route group, role-gated)
- `/contact` — Contact info + embedded links to WhatsApp, WhatsApp Channel, Instagram, Facebook, X, YouTube
- Auth routes: `/login`, `/signup`, `/reset-password` (Supabase Auth UI, custom-styled to match brand — do not use unstyled default Supabase Auth components)

---

## 6. VISUAL & DESIGN DIRECTION

- **Overall mood:** Premium, minimal, dark-leaning by default, with culturally resonant Islamic/Arabic typographic and geometric motifs used tastefully (subtle geometric patterns, calligraphic accents for the 'ilm/علم mark, not literal clip-art).
- **Typography:** Pair a refined serif or high-contrast display typeface for headlines with a clean, highly legible sans-serif for body text. Include a proper Arabic typeface (e.g., a well-hinted Naskh or modern Arabic type) for Arabic-language content — do not fake Arabic type with a Latin font.
- **Color system:** Build a token-based palette (primary, secondary, accent, neutral scale, semantic colors for success/warning/error) for both light and dark themes. Consider deep, dignified tones (deep greens, gold/amber accents, ink blacks, warm off-whites) that read as scholarly and premium rather than "startup SaaS blue."
- **Logo/wordmark:** 'ilm — علم should be treated as a core visual element — consider an animated logo mark/reveal on load.

---

## 7. SEED ASSETS (already provided in project directory)

The following files are already present in the working directory and should be used directly rather than recreated or replaced with placeholders:

| File | Intended use |
|---|---|
| `logo.svg` | Primary 'ilm platform logo/mark |
| `dars-typo.svg` | Dars-related typographic/wordmark asset |
| `adsa-logo.svg` | Alathurpadi Dars Students Association logo |
| `usthad.png` | Photo of Usthad C K Abdurahman Faizy, Aripra (instructor profile) |

- These four assets should be wired into the appropriate places immediately: `logo.svg` in nav/header/favicon generation, `adsa-logo.svg` in footer/about/certificate branding, `dars-typo.svg` wherever the Dars wordmark/typographic identity is called for (hero, about section, etc.), and `usthad.png` on the instructor profile for Usthad C K Abdurahman Faizy.
- **All other imagery/media** (course thumbnails, additional instructor photos, banners, gallery content, promotional graphics, etc.) should be treated as dynamic content, uploaded and managed later through the admin panel's media management (Section 4.2) via Supabase Storage — do not hardcode or hunt for placeholder stock imagery for these.

---

## 8. DATA MODEL CONSIDERATIONS (Supabase)

Design normalized tables (with RLS policies) covering at minimum:
- `profiles` (extends Supabase auth.users — role: student/instructor/admin)
- `instructors` (Usthad profiles)
- `kutub` (classical texts — title, transliteration, Arabic title, description, category)
- `courses` (linked to kutub optionally, instructor, price, free/paid flag, status)
- `course_sessions` / `lessons` (structured content units within a course)
- `materials` (standalone downloadable/streamable resources)
- `enrollments` (student ↔ course, progress tracking)
- `certificates` (student ↔ course, issue date, unique verification ID, status: active/revoked)
- `orders` / `payments` (order records generated by the payment adapter, including the dummy provider — see 4.9)
- `translations` or an i18n JSON column strategy for multilingual content fields

Agent should write this as versioned SQL migrations, not ad hoc dashboard changes, and document RLS policies clearly (students can only see their own enrollments/progress/certificates; admins have elevated access; public content and certificate verification are readable by the anon role where appropriate).

---

## 9. NON-NEGOTIABLE QUALITY BARS

1. **Accessibility:** WCAG AA minimum. All animations respect `prefers-reduced-motion`. Full keyboard navigation. Proper ARIA labeling, especially given RTL/multilingual complexity.
2. **Performance:** Despite the heavy animation ambition, Core Web Vitals must stay healthy — lazy-load below-the-fold animation logic, use `next/image`, code-split animation-heavy sections, avoid layout shift.
3. **SEO:** Proper metadata, OpenGraph tags per course/kutub/instructor page, sitemap, structured data (Course schema markup where applicable) — this platform should be discoverable by students searching for these specific texts and this specific Usthad.
4. **i18n correctness:** No hardcoded English strings in components; all UI copy routed through the translation system. RTL must be pixel-tested, not just direction-flipped by the browser default.
5. **Admin usability:** Non-technical ADSA staff must be able to publish content without developer help — favor clear forms, previews, and validation over raw JSON editing.

---

## 10. DELIVERABLE EXPECTATIONS FOR THE AGENT

When executing this brief, please:
1. Propose the initial architecture/folder structure and Supabase schema before generating large amounts of UI code, so it can be reviewed.
2. Build incrementally: scaffold → design system/tokens → core layout (nav/dock/theme/language) → home page → course catalog/detail → checkout (dummy payment) → certificates → admin panel → auth/account flows.
3. Wire in the seed assets from Section 7 immediately rather than using stand-in placeholders for the logo, ADSA mark, Dars typography, or Usthad's photo.
4. Flag any point where a real business decision is needed (actual payment provider choice, real pricing, final copywriting) rather than silently inventing final-looking business logic — the payment integration in particular is explicitly a placeholder to be swapped later (Section 4.9).
5. Keep the reverent, scholarly tone of the subject matter in mind when generating any placeholder copy — this is religious educational content tied to a real institution and a named living scholar (Usthad C K Abdurahman Faizy, Aripra); avoid caricature or inaccuracy.
