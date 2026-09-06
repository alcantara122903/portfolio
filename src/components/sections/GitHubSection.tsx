"use client";

import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GitHubSection() {
  return (
    <section data-gsap="section">
      <Container>
        <SectionHeading
          eyebrow="Developer"
          title="Code. Test. Learn. Repeat."
        />

        <Reveal delay={0.1} className="mt-12 max-w-2xl border-t border-white/8 pt-8">
          <div className="font-mono text-sm">
            <div className="space-y-4">
              {portfolio.terminal.map((line, index) => {
                const isLast = index === portfolio.terminal.length - 1;
                return (
                  <div key={line.command}>
                    <p className="text-zinc-600">
                      <span className="text-sky-400/70">→</span> {line.command}
                    </p>
                    <p className="mt-1 text-zinc-300">
                      {line.output}
                      {isLast && (
                        <span
                          className="terminal-cursor ml-0.5 inline-block h-3.5 w-1.5 bg-sky-400/80 align-middle"
                          aria-hidden="true"
                        />
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
