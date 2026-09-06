"use client";

import { useRef } from "react";
import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
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
    <section id="process" ref={sectionRef} className="relative">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="From problem to working system."
        />

        <ProcessScrollScene progressRef={progressRef} />

        <div className="mt-16 grid gap-0 border-t border-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.process.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.08}>
              <div className="border-b border-white/8 p-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
                <span className="font-mono text-xs text-sky-400/70">
                  {step.number}
                </span>
                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
