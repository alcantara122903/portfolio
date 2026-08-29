import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
  const featured = portfolio.projects.filter((p) => p.featured);
  const others = portfolio.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Systems I've Built"
            subtitle="Academic projects focused on real workflows — from mobile interfaces to APIs and databases."
          />
        </Reveal>

        <div className="mt-14 space-y-16">
          {featured.map((project) => (
            <ProjectShowcase key={project.id} project={project} />
          ))}

          {others.map((project) => (
            <ProjectShowcase key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
