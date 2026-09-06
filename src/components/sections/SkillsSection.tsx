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
        translateY: [20, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        delay: stagger(60, { start: 60 }),
        autoplay: onScroll({
          target: '[data-skill="grid"]',
          enter: "bottom top+=18%",
        }),
      });

      animate('[data-skill="panel"]', {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        autoplay: onScroll({
          target: '[data-skill="side"]',
          enter: "bottom top+=16%",
        }),
      });
    });

    return () => scope.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !flowListRef.current) return;

    const nodes = flowListRef.current.querySelectorAll(
      '[data-skill="flow-step"]',
    );
    if (!nodes.length) return;

    utils.set(nodes, { opacity: 0, translateY: 10 });

    const animation = animate(nodes, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: ANIME_DURATION.fast,
      ease: ANIME_EASE.out,
      delay: stagger(70),
    });

    return () => {
      animation.revert();
    };
  }, [activeFlow, reducedMotion]);

  return (
    <section id="skills" ref={rootRef} className="relative overflow-hidden" data-gsap="section">
      <Container className="relative">
        <SectionHeading
          eyebrow="Skills"
          title="The tools behind the build."
          subtitle="A practical toolkit for shipping mobile and web systems — from interfaces to APIs and databases."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-skill="grid">
            <div className="space-y-0 divide-y divide-white/8 border-y border-white/8">
              {portfolio.skills.map((category, index) => (
                <article
                  key={category.title}
                  data-skill="card"
                  className={cn("py-6", !reducedMotion && "opacity-0")}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-mono text-[10px] text-sky-400/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                      {category.title}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <TechChip key={item} label={item} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-10 lg:col-span-5" data-skill="side">
            <div
              data-skill="panel"
              className={cn(
                "border-t border-white/8 pt-6",
                !reducedMotion && "opacity-0",
              )}
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Stack flows
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Switch a path to see how tools connect in real projects.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {portfolio.skillFlows.map((flow) => (
                  <button
                    key={flow.id}
                    type="button"
                    onClick={() => setActiveFlow(flow.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      activeFlow === flow.id
                        ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                        : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-200",
                    )}
                  >
                    {flow.steps[0]}
                  </button>
                ))}
              </div>

              {currentFlow && (
                <div ref={flowListRef} className="mt-6 space-y-3">
                  {currentFlow.steps.map((step, i) => (
                    <div
                      key={`${currentFlow.id}-${step}`}
                      data-skill="flow-step"
                      className="flex items-center gap-3"
                    >
                      <span className="font-mono text-[10px] text-zinc-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <TechChip label={step} active={i === 0} />
                      {i < currentFlow.steps.length - 1 && (
                        <span className="text-zinc-700">→</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              data-skill="panel"
              className={cn(
                "border-t border-white/8 pt-6",
                !reducedMotion && "opacity-0",
              )}
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                This portfolio
              </h3>
              <div className="mt-5 space-y-4">
                {portfolio.portfolioStack.map((item) => (
                  <div key={item.category} className="flex flex-wrap gap-2">
                    <span className="w-full font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600 sm:w-24 sm:shrink-0 sm:pt-1.5">
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
