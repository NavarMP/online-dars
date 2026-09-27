"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BackgroundVideoProps {
  src: string;
  poster?: string;
  scrubOnScroll?: boolean;
  className?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

export function BackgroundVideo({
  src,
  poster,
  scrubOnScroll = false,
  className = "w-full h-screen",
  overlayColor = "#000000",
  overlayOpacity = 0.4,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrubOnScroll || !videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    
    // Ensure video metadata is loaded before trying to scrub its duration
    const setupScrub = () => {
      gsap.to(video, {
        currentTime: video.duration || 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // Pin for 2 viewport heights while scrubbing
          scrub: true,
          pin: true,
        },
      });
    };

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener('loadedmetadata', setupScrub);
      return () => video.removeEventListener('loadedmetadata', setupScrub);
    }
  }, [scrubOnScroll]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} 
      />
      
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={!scrubOnScroll}
        loop={!scrubOnScroll}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>
  );
}
