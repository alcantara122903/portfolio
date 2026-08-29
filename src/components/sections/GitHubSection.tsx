"use client";

import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GitHubSection() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Developer"
            title="CODE. TEST. LEARN. REPEAT."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 font-mono text-sm shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="ml-2 text-xs text-zinc-600">terminal</span>
            </div>
            <div className="space-y-3 p-6 sm:p-8">
              {portfolio.terminal.map((line, index) => {
                const isLast = index === portfolio.terminal.length - 1;
                return (
                  <div key={line.command}>
                    <p className="text-zinc-500">
                      <span className="text-sky-400/80">&gt;</span>{" "}
                      {line.command}
                    </p>
                    <p className="mt-1 text-zinc-300">
                      {line.output}
                      {isLast && (
                        <span
                          className="terminal-cursor ml-0.5 inline-block h-4 w-2 bg-sky-400/80 align-middle"
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
