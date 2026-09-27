"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // 1 is normal speed, 0 is static, <1 is slower (parallax down), >1 is faster (parallax up)
  id?: string;
}

export function Parallax({ children, speed = 1, id = "parallax" }: ParallaxProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const yValue = (1 - speed) * 100; // e.g. speed 0.5 -> y moves by 50px (relative to viewport)
    
    gsap.to(targetRef.current, {
      y: `${yValue}vh`,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top bottom", // when the top of the trigger hits the bottom of the viewport
        end: "bottom top",   // when the bottom of the trigger hits the top of the viewport
        scrub: true,
      },
    });
  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} id={id} style={{ overflow: "hidden", position: "relative" }}>
      <div ref={targetRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
