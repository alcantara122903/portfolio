"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PATH_D =
  "M12 2 C12 12, 88 8, 88 18 C88 28, 12 32, 12 42 C12 52, 88 56, 88 66 C88 76, 12 80, 12 88 C12 94, 50 96, 50 99";

const CHAPTERS = [
  { id: "home", label: "Signal", at: 0.05 },
  { id: "about", label: "Interface", at: 0.18 },
  { id: "projects", label: "System", at: 0.38 },
  { id: "skills", label: "Network", at: 0.58 },
  { id: "process", label: "Build", at: 0.72 },
  { id: "education", label: "Path", at: 0.84 },
  { id: "contact", label: "Connect", at: 0.94 },
] as const;

/**
 * Continuous system path — DrawSVG scrub (GSAP “Draw a path” demo adapted).
 * @see https://demos.gsap.com/demo/draw-a-path/
 */
export function SystemPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current || !pathRef.current) return;
    registerGsap();

    const path = pathRef.current;
    const length = path.getTotalLength();

    if (reducedMotion) {
      gsap.set(path, { drawSVG: "100%" });
      if (pulseRef.current) pulseRef.current.style.opacity = "0";
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(path, { drawSVG: "0%" });

        const updatePulse = (p: number) => {
          if (!pulseRef.current || !pathRef.current) return;
          const pt = pathRef.current.getPointAtLength(
            Math.max(0, Math.min(1, p)) * length,
          );
          gsap.set(pulseRef.current, {
            attr: { cx: pt.x, cy: pt.y },
            opacity: p > 0.02 && p < 0.98 ? 1 : 0,
          });
        };

        const updateLabel = (p: number) => {
          if (!labelRef.current) return;
          let current: string = CHAPTERS[0].label;
          for (const chapter of CHAPTERS) {
            if (p >= chapter.at) current = chapter.label;
          }
          if (labelRef.current.textContent !== current) {
            labelRef.current.textContent = current;
          }
        };

        gsap.to(path, {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            onUpdate: (self) => {
              updatePulse(self.progress);
              updateLabel(self.progress);
            },
          },
        });

        CHAPTERS.forEach((chapter) => {
          const el = document.getElementById(chapter.id);
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => {
              if (labelRef.current) labelRef.current.textContent = chapter.label;
            },
            onEnterBack: () => {
              if (labelRef.current) labelRef.current.textContent = chapter.label;
            },
          });
        });
      }, rootRef);

      return () => ctx.revert();
    });

    mm.add("(max-width: 768px)", () => {
      gsap.set(path, { drawSVG: "12%" });
      if (pulseRef.current) pulseRef.current.style.opacity = "0";
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full opacity-[0.55] max-md:opacity-25"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={PATH_D}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.35"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="var(--accent)"
          strokeWidth="0.45"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.55}
        />
        <circle
          ref={pulseRef}
          r="0.9"
          fill="var(--accent)"
          opacity={0}
        />
      </svg>

      <p
        ref={labelRef}
        className="absolute bottom-6 left-4 hidden font-mono text-[10px] tracking-[0.22em] text-zinc-600 md:block"
      >
        Signal
      </p>
    </div>
  );
}
