"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PATH_D =
  "M20 2 C20 10, 8 14, 8 22 C8 30, 32 34, 32 44 C32 54, 8 58, 8 68 C8 78, 28 84, 20 92 C16 96, 20 98, 20 100";

const CHAPTERS = [
  { id: "home", label: "Signal", at: 0.04 },
  { id: "about", label: "Interface", at: 0.16 },
  { id: "projects", label: "System", at: 0.36 },
  { id: "skills", label: "Network", at: 0.56 },
  { id: "process", label: "Build", at: 0.7 },
  { id: "education", label: "Path", at: 0.82 },
  { id: "contact", label: "Connect", at: 0.93 },
] as const;

/**
 * Scroll-synced atmosphere: grid drift + system path + chapter field.
 * Moves with scroll progress — the background of the story.
 */
export function ScrollAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseARef = useRef<SVGCircleElement>(null);
  const pulseBRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current || !pathRef.current) return;
    registerGsap();

    const path = pathRef.current;
    const length = path.getTotalLength();

    if (reducedMotion) {
      gsap.set(path, { drawSVG: "100%" });
      gsap.set([pulseARef.current, pulseBRef.current], { opacity: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(path, { drawSVG: "0%" });
        gsap.set([pulseARef.current, pulseBRef.current], { opacity: 0 });

        const placePulse = (
          el: SVGCircleElement | null,
          p: number,
          opacity: number,
        ) => {
          if (!el || !pathRef.current) return;
          const pt = pathRef.current.getPointAtLength(
            Math.max(0, Math.min(1, p)) * length,
          );
          gsap.set(el, {
            attr: { cx: pt.x, cy: pt.y },
            opacity,
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

        ScrollTrigger.create({
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => {
            const p = self.progress;

            gsap.set(path, { drawSVG: `${p * 100}%` });

            placePulse(pulseARef.current, p, p > 0.02 && p < 0.98 ? 1 : 0);
            placePulse(
              pulseBRef.current,
              Math.max(0, p - 0.08),
              p > 0.1 && p < 0.98 ? 0.45 : 0,
            );

            if (gridRef.current) {
              gsap.set(gridRef.current, {
                y: p * -120,
              });
            }

            if (washRef.current) {
              gsap.set(washRef.current, {
                yPercent: -8 + p * 28,
                opacity: 0.55 + Math.sin(p * Math.PI) * 0.25,
              });
            }

            updateLabel(p);
          },
        });

        CHAPTERS.forEach((chapter) => {
          const el = document.getElementById(chapter.id);
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => {
              if (labelRef.current) {
                labelRef.current.textContent = chapter.label;
              }
            },
            onEnterBack: () => {
              if (labelRef.current) {
                labelRef.current.textContent = chapter.label;
              }
            },
          });
        });
      }, rootRef);

      return () => ctx.revert();
    });

    mm.add("(max-width: 768px)", () => {
      gsap.set(path, { drawSVG: "18%" });
      gsap.set([pulseARef.current, pulseBRef.current], { opacity: 0 });
      if (washRef.current) gsap.set(washRef.current, { opacity: 0.35 });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Scroll-traveling wash — softer when 3D is present */}
      <div
        ref={washRef}
        className="absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(94,184,232,0.04),transparent_68%)] max-md:bg-[radial-gradient(circle,rgba(94,184,232,0.07),transparent_68%)] max-md:opacity-40 md:opacity-30"
      />

      {/* Technical grid — mobile / fallback only (3D owns desktop depth) */}
      <div
        ref={gridRef}
        className="absolute inset-[-20%] opacity-[0.04] md:opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(242,242,240,0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(242,242,240,0.9) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* System path — mobile fallback only (desktop uses ScrollMotionPath) */}
      <svg
        className="absolute left-[4%] top-0 h-full w-16 opacity-70 md:hidden"
        viewBox="0 0 40 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={PATH_D}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="var(--accent)"
          strokeWidth="0.85"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.7}
        />
        <circle ref={pulseARef} r="1.4" fill="var(--accent)" opacity={0} />
        <circle ref={pulseBRef} r="0.9" fill="var(--accent)" opacity={0} />
      </svg>

      {/* Right edge tick marks */}
      <div className="absolute bottom-0 right-6 top-0 hidden w-px bg-white/[0.04] lg:block">
        <div className="absolute left-1/2 top-[12%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="absolute left-1/2 top-[38%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="absolute left-1/2 top-[62%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="absolute left-1/2 top-[88%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15" />
      </div>

      <p
        ref={labelRef}
        className="absolute bottom-6 left-4 font-mono text-[10px] tracking-[0.24em] text-zinc-600 md:hidden"
      >
        Signal
      </p>
    </div>
  );
}
