"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";

let smootherRegistered = false;

function registerSmoother() {
  registerGsap();
  if (smootherRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollSmoother);
  smootherRegistered = true;
}

/**
 * Desktop smooth scroll (GSAP ScrollSmoother).
 * Disabled on touch / reduced-motion — keeps native scroll there.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    if (!wrapperRef.current || !contentRef.current) return;

    registerSmoother();

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 0.75,
      effects: false,
      normalizeScroll: false,
      ignoreMobileResize: true,
      smoothTouch: false,
    });

    return () => {
      smoother.kill();
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) {
    return <>{children}</>;
  }

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="relative z-10">
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
