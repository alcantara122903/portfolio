"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const STEPS = [
  "Visitor",
  "React Native App",
  "QR / OCR",
  "Laravel REST API",
  "Supabase PostgreSQL",
  "Campus validation",
] as const;

/** Desktop: scroll-scrubbed architecture. Mobile: static list. */
export function NuSecureFlow({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current) return;
    registerGsap();

    if (reducedMotion) {
      stepRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const steps = stepRefs.current.filter(Boolean) as HTMLLIElement[];
        gsap.set(steps, { autoAlpha: 0.28 });
        gsap.set(fillRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
        });

        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "bottom 35%",
            scrub: 0.4,
            onUpdate: (self) => {
              const p = self.progress;
              if (fillRef.current) {
                gsap.set(fillRef.current, { scaleY: p });
              }
              steps.forEach((step, i) => {
                const threshold = i / steps.length;
                const active = p >= threshold;
                gsap.set(step, {
                  autoAlpha: active ? 1 : 0.28,
                  x: active ? 0 : -6,
                });
              });
            },
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    mm.add("(max-width: 768px)", () => {
      stepRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 1, x: 0 });
      });
      if (fillRef.current) gsap.set(fillRef.current, { scaleY: 1 });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <p className="text-sm font-medium text-zinc-300">System flow</p>
      <p className="mt-2 hidden text-sm text-zinc-500 md:block">
        Scroll to follow a visitor through the stack.
      </p>

      <div className="relative mt-6 pl-6">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />
        <div
          ref={fillRef}
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top scale-y-100 bg-[var(--accent)] md:scale-y-0"
        />

        <ol className="space-y-0">
          {STEPS.map((step, i) => (
            <li
              key={step}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="relative flex gap-4 border-b border-white/6 py-3.5 last:border-b-0 md:opacity-[0.28]"
            >
              <span className="absolute -left-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-[var(--accent)]/60 bg-[var(--background)]" />
              <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-zinc-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-snug text-zinc-200 sm:text-[15px]">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
