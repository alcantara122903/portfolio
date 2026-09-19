import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function GitHubSection() {
  const github = portfolio.socials.find((s) => s.icon === "github");

  return (
    <section data-gsap="section">
      <Container>
        <SectionHeading
          eyebrow="Source"
          title="Public work lives on GitHub."
          subtitle="Repos, experiments, and the systems behind this portfolio."
        />

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/8 pt-8">
          {github && (
            <Button
              href={github.href}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub
            </Button>
          )}
          <p className="text-sm text-zinc-500">
            {portfolio.personal.fullName} · alcantara122903
          </p>
        </div>
      </Container>
    </section>
  );
}
