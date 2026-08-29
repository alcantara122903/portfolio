"use client";

import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";

export function ProcessSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="process" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title="FROM PROBLEM TO WORKING SYSTEM."
          />
        </Reveal>

        <div className="relative mt-14">
          <div
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-linear-to-r from-transparent via-sky-500/30 to-transparent lg:block"
            aria-hidden="true"
          />
          {!reducedMotion && (
            <motion.div
              className="absolute left-0 top-1/2 hidden h-px w-24 -translate-y-1/2 bg-sky-400 lg:block"
              animate={{ x: ["0%", "800%"] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              aria-hidden="true"
            />
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolio.process.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.1}>
                <GlassCard hover className="relative h-full">
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
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
