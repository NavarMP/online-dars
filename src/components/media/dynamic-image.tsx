"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

interface DynamicImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  blurhash?: string; // If using a blurhash from the CMS
  className?: string;
  priority?: boolean;
}

export function DynamicImage({
  src,
  alt,
  width,
  height,
  fill = false,
  blurhash,
  className = "",
  priority = false,
}: DynamicImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}>
      {blurhash && !isLoaded && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center filter blur-xl scale-110"
          style={{ backgroundImage: `url(${blurhash})` }}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
          className={`object-cover ${fill ? "absolute inset-0 w-full h-full" : ""}`}
          style={{ 
            width: fill ? "100%" : "auto", 
            height: fill ? "100%" : "auto" 
          }}
        />
      </motion.div>
    </div>
  );
}
