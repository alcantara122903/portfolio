"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SystemCanvas = dynamic(
  () =>
    import("@/components/three/ScrollSystemCanvas").then(
      (m) => m.ScrollSystemCanvas,
    ),
  { ssr: false },
);

/**
 * Full-page 3D system background — camera travels through architecture as you scroll.
 * Desktop only; SVG atmosphere covers mobile.
 */
export function ScrollSystemBackground() {
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");
  const progressRef = useRef(0);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    registerGsap();

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => st.kill();
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.55]">
        <SystemCanvas progressRef={progressRef} />
      </div>
      {/* Keep content readable without killing the 3D */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,13,0.72)_0%,rgba(10,11,13,0.45)_28%,rgba(10,11,13,0.28)_50%,rgba(10,11,13,0.55)_100%)]" />
    </div>
  );
}
