"use client";

import { useEffect, useRef } from "react";
import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const HOLD_SECONDS = 2.4;

export function ProcessSection() {
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");
  const panelRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = useRef(0);
  const goToRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    if (reducedMotion || isMobile || !panelRef.current) return;
    registerGsap();

    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLButtonElement[];
    const total = steps.length;

    gsap.set(steps, { autoAlpha: 0, y: 24 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0 });
    gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left center" });
    labels.forEach((label, i) => {
      gsap.set(label, { color: i === 0 ? "#7dd3fc" : "#52525b" });
    });
    activeIndex.current = 0;

    const showStep = (index: number, force = false) => {
      if (!force && index === activeIndex.current) return;
      activeIndex.current = index;
      steps.forEach((step, i) => {
        gsap.to(step, {
          autoAlpha: i === index ? 1 : 0,
          y: i === index ? 0 : i < index ? -18 : 18,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      });
      labels.forEach((label, i) => {
        gsap.to(label, {
          color: i === index ? "#7dd3fc" : "#52525b",
          duration: 0.25,
          overwrite: true,
        });
      });
    };

    const proxy = { p: 0 };
    const tl = gsap.timeline({
      paused: true,
      repeat: -1,
      onUpdate: () => {
        if (fillRef.current) {
          gsap.set(fillRef.current, { scaleX: proxy.p });
        }
      },
    });

    for (let i = 0; i < total; i++) {
      tl.call(() => showStep(i));
      tl.fromTo(
        proxy,
        { p: i / total },
        {
          p: (i + 1) / total,
          duration: HOLD_SECONDS,
          ease: "none",
        },
      );
    }

    const goTo = (index: number) => {
      const next = ((index % total) + total) % total;
      showStep(next, true);
      proxy.p = next / total;
      gsap.set(fillRef.current, { scaleX: proxy.p });
      tl.seek(next * HOLD_SECONDS);
      tl.play();
    };
    goToRef.current = goTo;

    const trigger = ScrollTrigger.create({
      trigger: panelRef.current,
      start: "top 75%",
      end: "bottom 25%",
      onEnter: () => {
        tl.restart();
      },
      onEnterBack: () => {
        tl.play();
      },
      onLeave: () => {
        tl.pause();
      },
      onLeaveBack: () => {
        tl.pause(0);
        showStep(0, true);
        proxy.p = 0;
        gsap.set(fillRef.current, { scaleX: 0 });
        labels.forEach((label, i) => {
          gsap.set(label, { color: i === 0 ? "#7dd3fc" : "#52525b" });
        });
      },
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, [reducedMotion, isMobile]);

  const goNext = () => {
    goToRef.current(activeIndex.current + 1);
  };

  const list = (
    <div className="mt-14 divide-y divide-white/8 border-y border-white/8">
      {portfolio.process.map((step) => (
        <div key={step.number} className="py-8">
          <span className="font-mono text-xs text-sky-400/70">{step.number}</span>
          <h3 className="font-display mt-3 text-xl font-semibold text-zinc-100">
            {step.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <section id="process" className="relative" data-gsap="section">
      {reducedMotion || isMobile ? (
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="From problem to working system."
          />
          {list}
        </Container>
      ) : (
        <div
          ref={panelRef}
          role="button"
          tabIndex={0}
          aria-label="Build path — click for next step"
          onClick={goNext}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              goNext();
            }
          }}
          className="flex min-h-dvh cursor-pointer flex-col justify-center py-16"
        >
          <Container>
            <SectionHeading
              eyebrow="Process"
              title="From problem to working system."
              subtitle="Auto-plays — click anywhere for the next step."
            />

            <div className="relative mt-14 min-h-[240px] overflow-hidden">
              {portfolio.process.map((step, index) => (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="absolute inset-x-0 top-0 max-w-2xl border-t border-white/10 pt-8"
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    visibility: index === 0 ? "visible" : "hidden",
                  }}
                  aria-hidden={index !== 0}
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
              <div className="invisible border-t pt-8" aria-hidden="true">
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
                <span>Click or auto</span>
              </div>
              <div className="h-[2px] overflow-hidden rounded-full bg-white/8">
                <div
                  ref={fillRef}
                  className="h-full origin-left scale-x-0 bg-linear-to-r from-sky-500 to-cyan-200"
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {portfolio.process.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    ref={(el) => {
                      labelRefs.current[index] = el;
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToRef.current(index);
                    }}
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:text-sky-200",
                      index === 0 ? "text-sky-300" : "text-zinc-600",
                    )}
                  >
                    {step.number} {step.title}
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}
    </section>
  );
}
