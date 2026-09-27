import MagneticButton from "./components/MagneticButton";

export default function KioskPage() {
  // Fetch the web URL from environment variables, fallback to Vercel URL or '/' if not found
  const getBaseUrl = () => {
    // 1. If deployed to Vercel, prioritize Vercel's provided URLs
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    
    // 2. Prevent using localhost in production if NEXT_PUBLIC_WEB_URL is misconfigured in Vercel
    if (process.env.NEXT_PUBLIC_WEB_URL && !process.env.NEXT_PUBLIC_WEB_URL.includes('localhost')) {
      return process.env.NEXT_PUBLIC_WEB_URL;
    }
    
    // 3. Safe fallback that works everywhere
    return '/';
  };
  const launchUrl = getBaseUrl();

  return (
    <div className="fixed inset-0 z-[100] bg-ink text-canvas flex flex-col items-center justify-center p-6">
      {/* 
        A very clean, minimalist layout. 
        Using standard Mobbin-like variables for styling where possible (bg-ink, text-canvas).
      */}
      <div className="flex flex-col items-center space-y-12">
        <h1 className="text-display text-center">
          Ready to initiate?
        </h1>
        
        <MagneticButton href={launchUrl} />
      </div>
    </div>
  );
}
