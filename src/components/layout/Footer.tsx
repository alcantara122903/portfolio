import { portfolio } from "@/data/portfolio";
import { getYear } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8">
      <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-zinc-200">
            {portfolio.personal.firstName} {portfolio.personal.lastName}
            <span className="text-sky-400">.</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            © {getYear()} · {portfolio.personal.location}
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Next.js · GSAP · Three.js
        </p>
      </Container>
    </footer>
  );
}
