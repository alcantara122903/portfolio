"use client";

import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
  const featured = portfolio.projects.filter((p) => p.featured);
  const supporting = portfolio.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative">
      <Container className="relative">
        <SectionHeading
          eyebrow="Projects"
          title="Systems I've built."
          subtitle="One featured case study, then supporting work that built the fundamentals."
        />

        <div className="mt-12 sm:mt-16">
          {featured.map((project, index) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {supporting.length > 0 && (
          <div className="mt-6">
            <p className="border-t border-white/8 pt-12 font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-600 sm:pt-16">
              Supporting work
            </p>
            {supporting.map((project, index) => (
              <ProjectShowcase
                key={project.id}
                project={project}
                index={featured.length + index}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
