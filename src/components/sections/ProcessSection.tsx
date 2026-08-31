"use client";

import { useRef } from "react";
import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { ScrollReveal3D } from "@/components/animations/ScrollReveal3D";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessScrollScene } from "@/components/three/ProcessScrollScene";
import { useScrollProgressRef } from "@/hooks/useScrollProgressRef";

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef } = useScrollProgressRef(sectionRef, [
    "start 0.85",
    "end 0.25",
  ]);

  return (
    <section id="process" ref={sectionRef} className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="FROM PROBLEM TO WORKING SYSTEM."
        />

        <ProcessScrollScene progressRef={progressRef} />

        <div className="relative mt-14">
          <div
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-linear-to-r from-transparent via-sky-500/30 to-transparent lg:block"
            aria-hidden="true"
          />
          <div
            data-anime="process-beam"
            className="absolute left-0 top-1/2 hidden h-px w-24 -translate-y-1/2 bg-sky-400 lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolio.process.map((step, index) => (
              <ScrollReveal3D key={step.number} depth="subtle">
                <Reveal delay={index * 0.1}>
                  <GlassCard hover scrollAnime className="relative h-full">
                    <span className="text-3xl font-light text-zinc-700">
                      {step.number}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold uppercase tracking-wide text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {step.description}
                    </p>
                  </GlassCard>
                </Reveal>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
