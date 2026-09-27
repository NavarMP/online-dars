"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom-in";
  delay?: number;
  duration?: number;
  width?: "fit-content" | "100%";
}

export function Reveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.5,
  width = "100%",
}: RevealProps) {
  const getVariants = () => {
    switch (animation) {
      case "fade-up":
        return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
      case "fade-in":
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      case "slide-left":
        return { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } };
      case "slide-right":
        return { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } };
      case "zoom-in":
        return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
      default:
        return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
