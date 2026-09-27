import MagneticButton from "./components/MagneticButton";

export default function KioskPage() {
  // Fetch the web URL from environment variables, fallback to Vercel URL or '/' if not found
  const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_WEB_URL) return process.env.NEXT_PUBLIC_WEB_URL;
    else return '/';
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
