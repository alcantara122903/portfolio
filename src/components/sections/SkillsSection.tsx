"use client";

import { useState } from "react";
import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { ScrollReveal3D } from "@/components/animations/ScrollReveal3D";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChip } from "@/components/ui/TechChip";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  const [activeFlow, setActiveFlow] = useState(portfolio.skillFlows[0]?.id ?? "");

  const currentFlow = portfolio.skillFlows.find((f) => f.id === activeFlow);

  return (
    <section id="skills" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
            eyebrow="Tech Stack"
            title="THE TOOLS BEHIND THE BUILD."
          />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                Core Development Skills
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {portfolio.skills.map((category) => (
                  <GlassCard key={category.title} hover scrollAnime>
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-sky-400/80">
                      {category.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((item) => (
                        <TechChip key={item} label={item} />
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="space-y-8">
              <ScrollReveal3D depth="subtle">
                <Reveal delay={0.15}>
                  <GlassCard>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
                  Technology Relationships
                </h3>
                <div className="mb-6 flex flex-wrap gap-2">
                  {portfolio.skillFlows.map((flow) => (
                    <button
                      key={flow.id}
                      type="button"
                      onClick={() => setActiveFlow(flow.id)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                        activeFlow === flow.id
                          ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-700",
                      )}
                    >
                      {flow.steps[0]}
                    </button>
                  ))}
                </div>
                {currentFlow && (
                  <div className="flex flex-col items-start gap-2">
                    {currentFlow.steps.map((step, i) => (
                      <div key={step} className="flex flex-col items-start">
                        <TechChip label={step} active />
                        {i < currentFlow.steps.length - 1 && (
                          <span className="ml-4 py-1 text-xs text-zinc-600">
                            ↓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                  </GlassCard>
                </Reveal>
              </ScrollReveal3D>

              <ScrollReveal3D depth="subtle">
                <Reveal delay={0.2}>
                  <GlassCard>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
                  Portfolio Build Stack
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-zinc-500">
                  Built with Next.js and TypeScript — demonstrated through this
                  portfolio itself.
                </p>
                <div className="space-y-3">
                  {portfolio.portfolioStack.map((item) => (
                    <div key={item.category} className="flex flex-wrap items-center gap-2">
                      <span className="w-24 text-xs uppercase tracking-wider text-zinc-500">
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
                  </GlassCard>
                </Reveal>
              </ScrollReveal3D>
          </div>
        </div>
      </Container>
    </section>
  );
}
