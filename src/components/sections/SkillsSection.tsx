"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope, onScroll, stagger, utils } from "animejs";
import { portfolio } from "@/data/portfolio";
import { ANIME_DURATION, ANIME_EASE } from "@/lib/anime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChip } from "@/components/ui/TechChip";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const flowListRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeFlow, setActiveFlow] = useState(
    portfolio.skillFlows[0]?.id ?? "",
  );

  const currentFlow = portfolio.skillFlows.find((f) => f.id === activeFlow);

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const scope = createScope({ root: rootRef.current }).add(() => {
      animate('[data-skill="card"]', {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        delay: stagger(70, { start: 80 }),
        autoplay: onScroll({
          target: '[data-skill="grid"]',
          enter: "bottom top+=18%",
        }),
      });

      animate('[data-skill="chip"]', {
        opacity: [0, 1],
        scale: [0.92, 1],
        duration: ANIME_DURATION.fast,
        ease: ANIME_EASE.out,
        delay: stagger(28, { start: 180 }),
        autoplay: onScroll({
          target: '[data-skill="grid"]',
          enter: "bottom top+=14%",
        }),
      });

      animate('[data-skill="panel"]', {
        opacity: [0, 1],
        translateX: [24, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        delay: stagger(120),
        autoplay: onScroll({
          target: '[data-skill="side"]',
          enter: "bottom top+=16%",
        }),
      });

      animate('[data-skill="rail"]', {
        scaleY: [0, 1],
        ease: ANIME_EASE.outSoft,
        duration: ANIME_DURATION.slow,
        autoplay: onScroll({
          target: '[data-skill="grid"]',
          enter: "bottom top+=20%",
        }),
      });
    });

    return () => scope.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !flowListRef.current) return;

    const nodes = flowListRef.current.querySelectorAll('[data-skill="flow-step"]');
    if (!nodes.length) return;

    utils.set(nodes, { opacity: 0, translateY: 14 });

    const animation = animate(nodes, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: ANIME_DURATION.fast,
      ease: ANIME_EASE.out,
      delay: stagger(90),
    });

    return () => {
      animation.revert();
    };
  }, [activeFlow, reducedMotion]);

  return (
    <section
      id="skills"
      ref={rootRef}
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(56,189,248,0.07),transparent_45%),radial-gradient(ellipse_at_90%_70%,rgba(56,189,248,0.04),transparent_40%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Tech Stack"
          title="THE TOOLS BEHIND THE BUILD."
          subtitle="A practical toolkit for shipping mobile and web systems — from interfaces to APIs and databases."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" data-skill="grid">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-sky-400/50" />
              <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Core Development Skills
              </h3>
            </div>

            <div className="relative">
              <div
                data-skill="rail"
                className="absolute bottom-3 left-[11px] top-3 hidden w-px origin-top bg-linear-to-b from-sky-400/50 via-sky-500/15 to-transparent sm:block"
                aria-hidden="true"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {portfolio.skills.map((category, index) => (
                  <article
                    key={category.title}
                    data-skill="card"
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 transition-colors hover:border-sky-500/25 hover:bg-zinc-900/50",
                      index % 2 === 0 ? "sm:translate-y-0" : "sm:mt-4",
                    )}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-sky-400/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 className="text-[11px] font-medium uppercase tracking-[0.16em] text-sky-300/90">
                        {category.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((item) => (
                        <span key={item} data-skill="chip">
                          <TechChip label={item} />
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-5" data-skill="side">
            <div
              data-skill="panel"
              className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 sm:p-6"
            >
              <div
                className="pointer-events-none absolute -right-8 top-6 h-24 w-24 rotate-12 border border-sky-400/15"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-10 top-16 h-10 w-10 rotate-45 border border-sky-400/20"
                aria-hidden="true"
              />

              <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Technology Relationships
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Switch a stack to see how the tools connect in real projects.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {portfolio.skillFlows.map((flow) => (
                  <button
                    key={flow.id}
                    type="button"
                    onClick={() => setActiveFlow(flow.id)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                      activeFlow === flow.id
                        ? "border-sky-400/45 bg-sky-400/10 text-sky-300"
                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                    )}
                  >
                    {flow.steps[0]}
                  </button>
                ))}
              </div>

              {currentFlow && (
                <div ref={flowListRef} className="mt-6 space-y-0">
                  {currentFlow.steps.map((step, i) => (
                    <div
                      key={`${currentFlow.id}-${step}`}
                      data-skill="flow-step"
                      className="flex flex-col items-start"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-sky-500/30 bg-sky-500/10 font-mono text-[10px] text-sky-300">
                          {i + 1}
                        </span>
                        <TechChip label={step} active />
                      </div>
                      {i < currentFlow.steps.length - 1 && (
                        <div className="ml-3 flex h-6 items-center">
                          <span className="h-full w-px bg-linear-to-b from-sky-400/50 to-sky-400/10" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              data-skill="panel"
              className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-linear-to-b from-zinc-900/50 to-zinc-950/80 p-5 sm:p-6"
            >
              <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Portfolio Build Stack
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Built with Next.js and TypeScript — demonstrated through this
                portfolio itself.
              </p>

              <div className="mt-5 space-y-2.5">
                {portfolio.portfolioStack.map((item) => (
                  <div
                    key={item.category}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-800/70 bg-zinc-950/50 px-3 py-2.5"
                  >
                    <span className="w-24 shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-sky-400/70">
                      {item.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.items.map((tech) => (
                        <TechChip key={tech} label={tech} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
