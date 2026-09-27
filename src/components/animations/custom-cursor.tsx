"use client";

import { motion } from "framer-motion";
import { useEffect, useState, createContext, useContext, ReactNode } from "react";

interface CursorContextType {
  cursorType: string;
  setCursorType: (type: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: "default",
  setCursorType: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorType, setCursorType] = useState("default");

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
      <CustomCursor cursorType={cursorType} />
    </CursorContext.Provider>
  );
}

export const useCursor = () => useContext(CursorContext);

function CustomCursor({ cursorType }: { cursorType: string }) {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Quick trick to detect hover over clickable elements globally
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "1px solid rgba(100, 100, 100, 0.5)",
      mixBlendMode: "difference" as const,
    },
    pointer: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(255, 255, 255, 1)",
      border: "1px solid transparent",
      mixBlendMode: "difference" as const,
    },
    play: { // For hover over videos
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "white",
    },
  };

  // Determine active variant based on global hover state vs context
  let activeVariant = cursorType;
  if (cursorType === "default" && isHovering) {
    activeVariant = "pointer";
  }

  // Only render custom cursor on desktop devices (non-touch)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <motion.div
      variants={variants}
      animate={activeVariant}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold"
      }}
    >
      {activeVariant === "play" && <span>Play</span>}
    </motion.div>
  );
}
