import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { ArchitectureFlow } from "@/components/projects/ArchitectureFlow";
import { Button } from "@/components/ui/Button";
import { DownloadResumeButton } from "@/components/ui/DownloadResumeButton";
import { GMAIL_COMPOSE_URL } from "@/lib/contact";

const project = portfolio.projects.find((p) => p.id === "nu-secure");

export const metadata: Metadata = {
  title: "NU-SECURE Case Study | Ivan Alcantara",
  description:
    "Case study of NU-SECURE — a smart visitor monitoring system spanning React Native, Laravel, and Supabase.",
};

export default function NuSecureCaseStudyPage() {
  if (!project) {
    return null;
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
          <div className="flex flex-wrap gap-2">
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={16} />
                Live Site
              </Button>
            )}
            <Button href={GMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer">
              Contact Me
            </Button>
          </div>
        </Container>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-zinc-800/60 py-16 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(56,189,248,0.12),transparent_45%)]"
            aria-hidden="true"
          />
          <Container className="relative">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-400/80">
              Featured Capstone · Case Study
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-zinc-400">{project.subtitle}</p>
            <p className="mt-2 text-sm text-zinc-500">{project.role}</p>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-zinc-300">
              {project.summary}
            </p>
          </Container>
        </section>

        {project.outcomes && (
          <section className="py-14 sm:py-16">
            <Container>
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                What I Delivered
              </h2>
              <ul className="mt-6 max-w-3xl space-y-4">
                {project.outcomes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base leading-relaxed text-zinc-300"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-sky-400"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        )}

        <section className="border-y border-zinc-800/60 py-14 sm:py-16">
          <Container>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              System Architecture
            </h2>
            <div className="mt-8 max-w-4xl">
              <ArchitectureFlow
                flowId="nu-secure-case-architecture"
                steps={project.architecture}
              />
            </div>
            {project.webStackLayers && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.webStackLayers.map((layer) => (
                  <div key={layer.layer} className="border-t border-zinc-800 pt-4">
                    <p className="text-[11px] uppercase tracking-widest text-sky-400/80">
                      {layer.layer}
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">{layer.technology}</p>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>

        <section className="py-14 sm:py-16">
          <Container>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Screens
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                project.screenshotSrc && {
                  src: project.screenshotSrc,
                  alt: "NU-SECURE mobile guard experience",
                  label: "Mobile",
                },
                project.webScreenshot && {
                  src: project.webScreenshot.src,
                  alt: project.webScreenshot.alt,
                  label: project.webScreenshot.label,
                },
              ]
                .filter(Boolean)
                .map((shot) => {
                  const item = shot as {
                    src: string;
                    alt: string;
                    label: string;
                  };
                  return (
                    <figure key={item.src} className="min-w-0">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <figcaption className="mt-3 text-xs uppercase tracking-widest text-zinc-500">
                        {item.label}
                      </figcaption>
                    </figure>
                  );
                })}
            </div>
          </Container>
        </section>

        <section className="border-t border-zinc-800/60 py-14 sm:py-16">
          <Container>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Scope of Work
            </h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {project.contributions.map((section) => (
                <div key={section.title}>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-400/80">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-sky-400/70"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-14 flex flex-col gap-3 border-t border-zinc-800 pt-10 sm:flex-row sm:flex-wrap">
              <Button href={GMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer">
                Email About an Internship
              </Button>
              <DownloadResumeButton variant="secondary" />
              <Button href="/#projects" variant="outline">
                More Projects
              </Button>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
