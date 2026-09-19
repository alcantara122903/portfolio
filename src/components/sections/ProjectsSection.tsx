"use client";

import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
  const featured = portfolio.projects.filter((p) => p.featured);
  const supporting = portfolio.projects.filter(
    (p) => !p.featured && p.id !== "about-me",
  );
  const aboutMe = portfolio.projects.find((p) => p.id === "about-me");

  return (
    <section id="projects" className="relative" data-gsap="section" data-story="projects">
      <Container className="relative">
        <SectionHeading
          eyebrow="Work"
          title="Selected work"
          subtitle="NU-SECURE first, then the project that built the fundamentals."
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
            <p className="border-t border-white/8 pt-12 font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500 sm:pt-16">
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

        {aboutMe?.liveUrl && (
          <p className="mt-14 border-t border-white/8 pt-8 text-sm text-zinc-500">
            Earlier practice site:{" "}
            <a
              href={aboutMe.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-200 hover:underline"
            >
              About Me (anime portfolio)
            </a>
            {" - "}not part of the Systems Lab work.
          </p>
        )}
      </Container>
    </section>
  );
}
