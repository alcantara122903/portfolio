"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Max pixel pull — keep subtle for editorial UI */
  strength?: number;
}

/**
 * GSAP Demo Hub pattern: Magnetic Button via quickTo + overwrite.
 * Adapted for restrained portfolio CTAs (not elastic bounce).
 * @see https://demos.gsap.com/demo/magnetic-button-overwrite-modes/
 */
export function MagneticButton({
  children,
  className,
  strength = 0.28,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isCoarse = useMediaQuery("(hover: none), (pointer: coarse)");

  useEffect(() => {
    if (reducedMotion || isCoarse || !ref.current) return;
    registerGsap();

    const el = ref.current;
    const xTo = gsap.quickTo(el, "x", {
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;
      xTo(x);
      yTo(y);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reducedMotion, isCoarse, strength]);

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}
