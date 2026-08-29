import { portfolio } from "@/data/portfolio";
import { getYear } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950">
      <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-200">
            {portfolio.personal.firstName} {portfolio.personal.lastName} ©{" "}
            {getYear()}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Designed & Built with curiosity.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {portfolio.personal.location}
          </p>
        </div>
        <p className="text-xs tracking-wide text-zinc-600">
          TypeScript • Next.js • Three.js
        </p>
      </Container>
    </footer>
  );
}
