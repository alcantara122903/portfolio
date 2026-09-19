import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

/** Compact GitHub row — not a full chapter. */
export function GitHubStrip() {
  const github = portfolio.socials.find((s) => s.icon === "github");
  if (!github) return null;

  return (
    <section className="!py-10" data-gsap="section">
      <Container>
        <div className="flex flex-col gap-4 border-y border-white/8 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-200">
              Public work on GitHub
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              alcantara122903 - repos and experiments
            </p>
          </div>
          <Button
            href={github.href}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub
          </Button>
        </div>
      </Container>
    </section>
  );
}
