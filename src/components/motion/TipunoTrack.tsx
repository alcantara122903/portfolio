"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const STAGES = [
  "Customer",
  "Account",
  "Appointment",
  "Shop",
  "Cart",
  "Checkout",
  "Inventory",
] as const;

/** Vertical scroll drives horizontal transaction workflow for Tipuno. */
export function TipunoTrack({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current || !trackRef.current) return;
    registerGsap();

    if (reducedMotion) {
      if (fillRef.current) gsap.set(fillRef.current, { scaleX: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const track = trackRef.current!;
        const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
        const maxX = () =>
          Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);

        gsap.set(fillRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(stages, { autoAlpha: 0.4 });

        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 65%",
            end: "bottom 30%",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(track, { x: -maxX() * p });
              if (fillRef.current) gsap.set(fillRef.current, { scaleX: p });

              const idx = Math.min(
                stages.length - 1,
                Math.floor(p * stages.length),
              );
              stages.forEach((stage, i) => {
                gsap.set(stage, {
                  autoAlpha: i === idx ? 1 : i < idx ? 0.55 : 0.35,
                });
              });
            },
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    mm.add("(max-width: 768px)", () => {
      if (fillRef.current) gsap.set(fillRef.current, { scaleX: 1 });
      stageRefs.current.forEach((el) => {
        if (el) gsap.set(el, { autoAlpha: 1 });
      });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={cn(className)}>
      <p className="text-sm font-medium text-zinc-300">Transaction flow</p>
      <p className="mt-2 text-sm text-zinc-600">
        Keep scrolling — the workflow moves with you.
      </p>

      <div className="mt-5 h-px overflow-hidden bg-white/8">
        <div
          ref={fillRef}
          className="h-full origin-left scale-x-0 bg-[var(--accent)]"
        />
      </div>

      <div className="mt-4 overflow-hidden border-y border-white/8 py-6">
        <div
          ref={trackRef}
          className="flex w-max gap-0 will-change-transform"
        >
          {STAGES.map((stage, i) => (
            <div
              key={stage}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              className="flex w-[9.5rem] shrink-0 items-start gap-3 sm:w-[11rem]"
              style={{ opacity: reducedMotion ? 1 : 0.4 }}
            >
              <div>
                <p className="font-mono text-[10px] tabular-nums text-zinc-600">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{stage}</p>
              </div>
              {i < STAGES.length - 1 && (
                <span
                  className="mt-6 font-mono text-[10px] text-zinc-700"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
