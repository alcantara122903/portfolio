"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SignalCanvas = dynamic(
  () =>
    import("@/components/three/GsapSignalCanvas").then(
      (m) => m.GsapSignalCanvas,
    ),
  { ssr: false },
);

const SECTION_PHASE: Record<string, number> = {
  home: 0,
  about: 0.2,
  projects: 0.45,
  skills: 0.6,
  process: 0.7,
  education: 0.8,
  contact: 1,
};

export function GsapSignalScene() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const progressRef = useRef(0);
  const phaseRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const veilRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    registerGsap();

    const proxy = { progress: 0, phase: 0 };
    const tween = gsap.to(proxy, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (veilRef.current) {
            veilRef.current.style.opacity = String(0.5 + self.progress * 0.32);
          }
          if (glowRef.current) {
            const scale = 0.88 + self.progress * 0.4;
            const y = self.progress * 14;
            glowRef.current.style.transform = `translate(-50%, calc(-40% + ${y}vh)) scale(${scale})`;
            glowRef.current.style.opacity = String(
              0.22 + self.progress * 0.2 + phaseRef.current * 0.08,
            );
          }
          if (canvasWrapRef.current) {
            canvasWrapRef.current.style.opacity = String(
              0.32 + Math.sin(self.progress * Math.PI) * 0.18,
            );
          }
        },
      },
    });

    const sectionTriggers = Object.entries(SECTION_PHASE).map(
      ([id, phase]) =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => {
            gsap.to(proxy, {
              phase,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                phaseRef.current = proxy.phase;
              },
            });
          },
          onEnterBack: () => {
            gsap.to(proxy, {
              phase,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                phaseRef.current = proxy.phase;
              },
            });
          },
        }),
    );

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      gsap.to(mouseRef.current, {
        x,
        y,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      sectionTriggers.forEach((t) => t.kill());
      window.removeEventListener("mousemove", onMove);
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div ref={canvasWrapRef} className="absolute inset-0 opacity-40">
        <SignalCanvas
          progressRef={progressRef}
          mouseRef={mouseRef}
          phaseRef={phaseRef}
        />
      </div>

      <div
        ref={glowRef}
        className="absolute left-1/2 top-[40%] h-[48vmax] w-[48vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(14,165,233,0.04)_38%,transparent_70%)] opacity-30 will-change-transform"
      />

      <div
        ref={veilRef}
        className="absolute inset-0 bg-linear-to-b from-[#07090d]/70 via-[#07090d]/50 to-[#07090d]/94 opacity-60"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,13,0.4)_62%,rgba(7,9,13,0.96)_100%)]" />
    </div>
  );
}
