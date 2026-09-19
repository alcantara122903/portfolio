"use client";

import { useEffect, useRef } from "react";
import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Process as accumulating system complexity:
 * Understand (point) → Design (structure) → Build (connections) → Test (loop)
 * Scroll progress drives which stage is dominant.
 */
export function ProcessSection() {
  const rootRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    registerGsap();

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const steps = rootRef.current!.querySelectorAll<HTMLElement>(
          "[data-process-step]",
        );
        const marks = rootRef.current!.querySelectorAll<HTMLElement>(
          "[data-process-mark]",
        );

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
            start: "top 60%",
            end: "bottom 40%",
            scrub: 0.4,
            onUpdate: (self) => {
              const p = self.progress;
              if (fillRef.current) gsap.set(fillRef.current, { scaleY: p });

              steps.forEach((step, i) => {
                const start = i / steps.length;
                const end = (i + 1) / steps.length;
                const active = p >= start;
                const dominant = p >= start && p < end;

                gsap.set(step, {
                  autoAlpha: active ? (dominant ? 1 : 0.45) : 0.22,
                  x: active ? 0 : -8,
                });

                const mark = marks[i];
                if (mark) {
                  gsap.set(mark, {
                    scale: dominant ? 1.35 : active ? 1 : 0.7,
                    backgroundColor: dominant
                      ? "var(--accent)"
                      : active
                        ? "rgba(94,184,232,0.45)"
                        : "rgba(255,255,255,0.12)",
                  });
                }
              });
            },
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <section
      id="process"
      ref={rootRef}
      className="relative"
      data-gsap="section"
      data-story="process"
    >
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="From problem to working system."
          subtitle="Scroll — each stage stays visible as the path gains structure."
        />

        <div className="relative mt-14 pl-8 sm:pl-10">
          <div className="absolute bottom-4 left-[11px] top-4 w-px bg-white/10 sm:left-[15px]" />
          <div
            ref={fillRef}
            className="absolute left-[11px] top-4 h-[calc(100%-2rem)] w-px origin-top scale-y-0 bg-[var(--accent)] sm:left-[15px]"
          />

          <ol className="space-y-0">
            {portfolio.process.map((step) => (
              <li
                key={step.number}
                data-process-step
                className={cn(
                  "relative border-b border-white/8 py-8 last:border-b-0",
                  reducedMotion ? "opacity-100" : "opacity-30",
                )}
              >
                <span
                  data-process-mark
                  className="absolute -left-8 top-10 h-2.5 w-2.5 rounded-full bg-white/12 sm:-left-10"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] tabular-nums text-zinc-600">
                  {step.number}
                </span>
                <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
