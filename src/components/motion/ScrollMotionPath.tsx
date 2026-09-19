"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";

let motionRegistered = false;

function ensureMotionPath() {
  registerGsap();
  if (motionRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(MotionPathPlugin);
  motionRegistered = true;
}

const WAYPOINTS = [
  { id: "01", label: "Signal" },
  { id: "02", label: "Interface" },
  { id: "03", label: "System" },
  { id: "04", label: "Network" },
  { id: "05", label: "Build" },
  { id: "06", label: "Connect" },
] as const;

/**
 * MotionPath waypoints scrubbed to scroll (down & up).
 * @see https://demos.gsap.com/demo/motionpath-waypoints/
 */
export function ScrollMotionPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const travelerRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    if (!rootRef.current || !pathRef.current || !travelerRef.current) return;

    ensureMotionPath();

    const path = pathRef.current;
    const traveler = travelerRef.current;
    const dots =
      rootRef.current.querySelectorAll<SVGCircleElement>("[data-wp-dot]");

    const ctx = gsap.context(() => {
      const len = path.getTotalLength();

      dots.forEach((dot, i) => {
        const t = dots.length <= 1 ? 0 : i / (dots.length - 1);
        const pt = path.getPointAtLength(t * len);
        gsap.set(dot, { attr: { cx: pt.x, cy: pt.y }, opacity: 0.25 });
      });

      gsap.set(path, { drawSVG: "0%" });

      // Traveler rides the path with scroll (reverses when scrolling up)
      gsap.to(traveler, {
        ease: "none",
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;

            dots.forEach((dot, i) => {
              const t = dots.length <= 1 ? 0 : i / (dots.length - 1);
              const active = Math.abs(p - t) < 0.07;
              const passed = p >= t - 0.01;
              gsap.set(dot, {
                opacity: active ? 1 : passed ? 0.55 : 0.22,
                attr: { r: active ? 1.45 : 0.9 },
              });
            });

            if (labelRef.current) {
              const idx = Math.min(
                WAYPOINTS.length - 1,
                Math.round(p * (WAYPOINTS.length - 1)),
              );
              const next = `${WAYPOINTS[idx].id} ${WAYPOINTS[idx].label}`;
              if (labelRef.current.textContent !== next) {
                labelRef.current.textContent = next;
              }
            }
          },
        },
      });

      gsap.to(path, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M14 4 C22 14, 8 24, 24 34 C40 44, 12 54, 30 64 C48 74, 16 84, 48 96"
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="0.35"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRef}
          d="M14 4 C22 14, 8 24, 24 34 C40 44, 12 54, 30 64 C48 74, 16 84, 48 96"
          stroke="var(--accent)"
          strokeWidth="0.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.6}
        />

        {WAYPOINTS.map((wp) => (
          <circle
            key={wp.id}
            data-wp-dot
            r="0.9"
            fill="var(--accent)"
            opacity={0.25}
          />
        ))}

        <circle
          ref={travelerRef}
          r="1.35"
          fill="var(--accent)"
          cx="14"
          cy="4"
        />
      </svg>

      <p
        ref={labelRef}
        className="absolute bottom-6 right-5 font-mono text-[10px] tracking-[0.2em] text-zinc-600 md:right-8"
      >
        01 Signal
      </p>
    </div>
  );
}
