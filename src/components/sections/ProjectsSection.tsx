"use client";

import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
  const projects = portfolio.projects;

  return (
    <section id="projects" className="relative">
      <Container className="relative">
        <SectionHeading
          eyebrow="Projects"
          title="Systems I've built."
          subtitle="Start with NU-SECURE — then supporting work that built the fundamentals behind it."
        />

        <div className="mt-10 space-y-2 sm:mt-12">
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
