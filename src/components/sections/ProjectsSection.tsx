import { portfolio } from "@/data/portfolio";
import { Reveal } from "@/components/animations/Reveal";
import { ScrollReveal3D } from "@/components/animations/ScrollReveal3D";
import { Container } from "@/components/layout/Container";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection() {
  const featured = portfolio.projects.filter((p) => p.featured);
  const others = portfolio.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
            eyebrow="Projects"
            title="Systems I've Built"
            subtitle="Academic projects focused on real workflows — from mobile interfaces to APIs and databases."
          />

        <div className="mt-14 space-y-16">
          {featured.map((project) => (
            <ScrollReveal3D key={project.id}>
              <ProjectShowcase project={project} />
            </ScrollReveal3D>
          ))}

          {others.map((project) => (
            <ScrollReveal3D key={project.id} depth="subtle">
              <ProjectShowcase project={project} />
            </ScrollReveal3D>
          ))}
        </div>
      </Container>
    </section>
  );
}
