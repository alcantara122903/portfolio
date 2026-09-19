"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MaskRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h2" | "h3" | "span";
}

/** Clip-path reveal — not generic fade-up. */
export function MaskReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: MaskRevealProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    registerGsap();

    const el = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)", autoAlpha: 1 },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, delay]);

  return (
    <Tag
      ref={rootRef as React.RefObject<HTMLDivElement>}
      className={cn(className)}
      style={reducedMotion ? undefined : { clipPath: "inset(0 0 100% 0)" }}
    >
      {children}
    </Tag>
  );
}
