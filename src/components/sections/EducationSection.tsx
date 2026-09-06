import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EducationSection() {
  return (
    <section id="education" data-gsap="section">
      <Container>
        <SectionHeading eyebrow="Education" title="Academic path." />

        <div className="mt-14 divide-y divide-white/8 border-y border-white/8">
          {portfolio.education.map((entry, index) => (
            <Reveal key={entry.institution} delay={index * 0.08}>
              <div
                data-anime="timeline-item"
                className="grid gap-3 py-8 sm:grid-cols-[10rem_1fr] sm:gap-10"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-400/80">
                  {entry.period}
                </p>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-100">
                    {entry.institution}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300">{entry.degree}</p>
                  {entry.specialization && (
                    <p className="mt-1 text-sm text-zinc-500">
                      Specialization: {entry.specialization}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-zinc-600">{entry.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
