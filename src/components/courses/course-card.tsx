"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import React from "react";
import { GenerativeCover } from "./generative-cover";
import { formatCurrency } from "@/lib/currency";

export function CourseCard({ course }: { course: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(useMotionTemplate`${mouseY}deg`, springConfig);
  const rotateY = useSpring(useMotionTemplate`${mouseX}deg`, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    // Calculate rotation (-5 to 5 degrees)
    const rX = ((mouseYPos / height) - 0.5) * -10;
    const rY = ((mouseXPos / width) - 0.5) * 10;
    
    mouseX.set(rY);
    mouseY.set(rX);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Link 
      href={`/courses/${course.id}`} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col h-full perspective-1000"
      style={{ perspective: 1000 }}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex flex-col h-full bg-canvas/80 backdrop-blur-sm border border-hairline-soft hover:border-hairline hover:border-ink/20 rounded-xl overflow-hidden transition-colors duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:bg-canvas"
      >
        {/* Thumbnail */}
        <div 
          className="w-full h-56 bg-canvas-soft border-b border-hairline-soft relative overflow-hidden flex items-center justify-center"
          style={{ transform: "translateZ(30px)" }} // Pop out effect
        >
          {course.thumbnail_url ? (
            <Image 
              src={course.thumbnail_url} 
              alt={course.title} 
              fill 
              className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" 
            />
          ) : (
            <GenerativeCover title={course.title} seed={course.id} />
          )}
          
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2" style={{ transform: "translateZ(40px)" }}>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-canvas/90 backdrop-blur-md text-caption text-ink font-[600] border border-hairline-soft shadow-sm capitalize">
              {course.difficulty || 'Intermediate'}
            </span>
            {course.is_free && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/90 backdrop-blur-md text-caption text-on-primary font-[600] shadow-sm">
                Free
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow relative" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-canvas-soft text-ink text-caption px-2.5 py-1 rounded-md uppercase tracking-widest font-[652] text-[10px]">
              {course.kutub?.category || "General"}
            </span>
          </div>
          <h3 className="text-heading-4 font-[652] mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-body-sm text-text-muted line-clamp-2 mb-6 flex-grow font-[400] leading-relaxed">
            {course.description}
          </p>
          
          <div className="mt-auto pt-5 border-t border-hairline-soft flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-caption text-text-muted mb-0.5">Instructor</span>
              <span className="text-label text-ink font-[600]">{course.instructors?.name || "Multiple"}</span>
            </div>
            {!course.is_free && (
              <div className="flex flex-col items-end">
                <span className="text-caption text-text-muted mb-0.5">Price</span>
                <span className="text-label text-ink font-[600]">{formatCurrency(course.price)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-hairline-soft/50">
            <div className="flex items-center gap-4 text-caption text-text-muted font-[500]">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{course.course_sessions?.[0]?.count || 0} Sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{Math.round((course.duration_minutes || 0) / 60)}h</span>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-canvas border border-hairline-soft flex items-center justify-center group-hover:bg-ink group-hover:border-ink group-hover:text-canvas transition-all duration-300">
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
