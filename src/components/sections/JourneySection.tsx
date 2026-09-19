"use client";

import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Education + certification in one calm section. */
export function JourneySection() {
  const cert = portfolio.certification;

  return (
    <section id="education" data-gsap="section" data-story="education">
      <Container>
        <SectionHeading
          eyebrow="Background"
          title="Education and credentials"
        />

        <div className="mt-12 divide-y divide-white/8 border-y border-white/8">
          {portfolio.education.map((entry) => (
            <div
              key={entry.institution}
              className="grid gap-3 py-8 sm:grid-cols-[10rem_1fr] sm:gap-10"
            >
              <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
                {entry.period.replace("—", "-").replace("–", "-")}
              </p>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-100">
                  {entry.institution.replace("–", "-")}
                </h3>
                <p className="mt-2 text-sm text-zinc-300">{entry.degree}</p>
                {entry.specialization && (
                  <p className="mt-1 text-sm text-zinc-500">
                    Specialization: {entry.specialization}
                  </p>
                )}
                <p className="mt-2 text-sm text-zinc-500">{entry.location}</p>
              </div>
            </div>
          ))}

          <div className="grid gap-3 py-8 sm:grid-cols-[10rem_1fr] sm:gap-10">
            <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
              Credential
            </p>
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-100">
                {cert.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                {cert.issuer.replace("·", "/")}
              </p>
              <p className="mt-3 text-sm text-zinc-500">
                Issued {cert.issued} - valid until {cert.validUntil}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
