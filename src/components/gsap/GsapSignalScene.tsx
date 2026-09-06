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

export function GsapSignalScene() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const veilRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    registerGsap();

    const proxy = { progress: 0 };
    const tween = gsap.to(proxy, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (veilRef.current) {
            const opacity = 0.55 + self.progress * 0.28;
            veilRef.current.style.opacity = String(opacity);
          }
          if (glowRef.current) {
            const scale = 0.9 + self.progress * 0.35;
            const y = self.progress * 12;
            glowRef.current.style.transform = `translate(-50%, calc(-42% + ${y}vh)) scale(${scale})`;
            glowRef.current.style.opacity = String(0.28 + self.progress * 0.18);
          }
        },
      },
    });

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      gsap.to(mouseRef.current, {
        x,
        y,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener("mousemove", onMove);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.id === "gsap-signal-progress") t.kill();
      });
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-40">
        <SignalCanvas progressRef={progressRef} mouseRef={mouseRef} />
      </div>

      <div
        ref={glowRef}
        className="absolute left-1/2 top-[42%] h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,rgba(14,165,233,0.04)_35%,transparent_68%)] opacity-40 will-change-transform"
      />

      <div
        ref={veilRef}
        className="absolute inset-0 bg-linear-to-b from-[#07090d]/75 via-[#07090d]/55 to-[#07090d]/92 opacity-70"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,13,0.45)_65%,rgba(7,9,13,0.95)_100%)]" />
    </div>
  );
}
