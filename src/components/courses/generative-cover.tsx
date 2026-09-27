export function GenerativeCover({ title, seed, className = "" }: { title: string; seed: string, className?: string }) {
  // Simple deterministic hash based on seed/id
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 2) % 360;
  
  return (
    <div 
      className={`absolute inset-0 overflow-hidden flex items-center justify-center p-6 ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue1}, 20%, 15%), hsl(${hue2}, 30%, 10%))`
      }}
    >
      {/* Decorative abstract shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={`M0,100 C${(hash%50)+20},${(hash%30)+30} ${(hash%60)+40},${(hash%40)+10} 100,0 L100,100 Z`} fill={`hsl(${hue1}, 50%, 50%)`} />
        <circle cx={hash % 100} cy={(hash * 2) % 100} r={(hash % 20) + 10} fill={`hsl(${hue2}, 50%, 50%)`} />
      </svg>
      <div className="relative z-10 text-center">
        <span className="font-[652] text-display opacity-10 tracking-tighter uppercase leading-none">
          {title.substring(0, 2)}
        </span>
      </div>
    </div>
  );
}
