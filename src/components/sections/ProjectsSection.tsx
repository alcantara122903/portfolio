"use client";

import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
  const projects = portfolio.projects;

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(56,189,248,0.04),transparent_40%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Projects"
          title="Systems I've Built"
          subtitle="Academic projects focused on real workflows — from mobile interfaces to APIs and databases."
        />

        <div className="mt-6 space-y-4 sm:mt-8">
          {projects.map((project, index) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
