"use client";

import { useEffect, useRef } from "react";
import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export function ProcessSection() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion || isMobile || !pinRef.current) return;
    registerGsap();

    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(steps, { autoAlpha: 0.25, y: 20 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (fillRef.current) {
            fillRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      },
    });

    steps.forEach((step, i) => {
      if (i === 0) return;
      const start = i / steps.length;
      tl.to(
        steps[i - 1],
        { autoAlpha: 0.25, y: -16, duration: 0.15 },
        start - 0.02,
      );
      tl.fromTo(
        step,
        { autoAlpha: 0.25, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.18 },
        start,
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reducedMotion, isMobile]);

  return (
    <section id="process" ref={sectionRef} className="relative" data-gsap="section">
      {reducedMotion || isMobile ? (
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="From problem to working system."
          />
          <div className="mt-14 divide-y divide-white/8 border-y border-white/8">
            {portfolio.process.map((step) => (
              <div key={step.number} className="py-8">
                <span className="font-mono text-xs text-sky-400/70">
                  {step.number}
                </span>
                <h3 className="font-display mt-3 text-xl font-semibold text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      ) : (
        <div ref={pinRef} className="flex h-dvh flex-col justify-center">
          <Container>
            <SectionHeading
              eyebrow="Process"
              title="From problem to working system."
              subtitle="Scroll through each phase — the system comes together step by step."
            />

            <div className="relative mt-14 min-h-[220px]">
              {portfolio.process.map((step, index) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={cn(
                    "absolute inset-x-0 top-0 max-w-2xl border-t border-white/8 pt-8",
                    index === 0 ? "opacity-100" : "opacity-25",
                  )}
                >
                  <span className="font-mono text-sm text-sky-400/80">
                    {step.number}
                  </span>
                  <h3 className="font-display mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
                    {step.description}
                  </p>
                </div>
              ))}
              <div className="invisible border-t border-transparent pt-8">
                <span className="font-mono text-sm">00</span>
                <h3 className="font-display mt-4 text-3xl sm:text-4xl">
                  Test & Improve
                </h3>
                <p className="mt-4 text-base sm:text-lg">
                  Test workflows, troubleshoot problems, identify edge cases,
                  and improve usability.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <div className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                <span>Build path</span>
                <span>Scroll</span>
              </div>
              <div className="h-[2px] overflow-hidden rounded-full bg-white/8">
                <div
                  ref={fillRef}
                  className="h-full origin-left bg-linear-to-r from-sky-500 to-cyan-200"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <div className="mt-4 flex gap-3">
                {portfolio.process.map((step) => (
                  <span
                    key={step.number}
                    className="font-mono text-[10px] text-zinc-600"
                  >
                    {step.number} {step.title}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}
    </section>
  );
}
