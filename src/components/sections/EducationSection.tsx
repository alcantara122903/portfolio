import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EducationSection() {
  return (
    <section id="journey" className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Journey" title="Education" />

        <div className="relative mt-14">
          <div
            className="absolute bottom-0 left-1.75 top-0 w-px bg-zinc-800 sm:left-2.75"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {portfolio.education.map((entry, index) => (
              <Reveal key={entry.institution} delay={index * 0.1}>
                <div
                  data-anime="timeline-item"
                  className="relative flex gap-6 sm:gap-8"
                >
                  <div
                    data-anime="timeline-dot"
                    className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-sky-500/60 bg-zinc-950 sm:h-4 sm:w-4"
                  />
                  <div className="pb-2">
                    <p className="text-xs font-medium uppercase tracking-widest text-sky-400/80">
                      {entry.period}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-100">
                      {entry.institution}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300">{entry.degree}</p>
                    {entry.specialization && (
                      <p className="mt-1 text-sm text-zinc-500">
                        Specialization: {entry.specialization}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-zinc-500">
                      {entry.location}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
