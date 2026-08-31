"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: "subtle" | "medium";
}

export function ScrollReveal3D({
  children,
  className,
  depth = "medium",
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.45"],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    depth === "subtle" ? [10, 0] : [16, 0],
  );
  const y = useTransform(scrollYProgress, [0, 1], depth === "subtle" ? [24, 0] : [36, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.85, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("[perspective:1200px]", className)}>
      <motion.div
        style={{
          rotateX,
          y,
          opacity,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
