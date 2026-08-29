import type { Project } from "@/types/portfolio";
import { ExternalLink, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/animations/Reveal";
import { ArchitectureFlow } from "@/components/projects/ArchitectureFlow";
import { ProjectScreenshots } from "@/components/projects/ProjectScreenshots";
import { ProjectTech } from "@/components/projects/ProjectTech";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

interface ProjectShowcaseProps {
  project: Project;
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const isFeatured = project.featured;

  return (
    <article
      id={project.id}
      className={
        isFeatured
          ? "rounded-3xl border border-zinc-800/80 bg-linear-to-b from-zinc-900/60 to-zinc-950/40 p-6 sm:p-8 lg:p-10"
          : "rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8"
      }
    >
      <Reveal>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {project.label && (
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-sky-400/80">
                {project.label}
              </p>
            )}
            {isFeatured && (
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-sky-400">
                Featured Capstone Project
              </p>
            )}
            <h3 className="text-2xl font-semibold text-zinc-50 sm:text-3xl lg:text-4xl">
              {project.title}
            </h3>
            <p className="mt-2 text-base text-zinc-400">{project.subtitle}</p>
            <p className="mt-1 text-sm text-zinc-500">{project.role}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:mt-0">
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 shrink-0 lg:mt-0"
              >
                <Globe size={16} />
                Live Website
              </Button>
            )}
            {project.githubUrl && (
              <Button
                href={project.githubUrl}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 shrink-0 lg:mt-0"
              >
                <GitHubIcon size={16} />
                View on GitHub
              </Button>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-400">
          {project.summary}
        </p>
        {project.team && (
          <p className="mt-3 text-sm text-zinc-500">
            {project.team}. {project.teamNotes}
          </p>
        )}
      </Reveal>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
        <Reveal delay={0.15}>
          {project.screenshotSrc && project.additionalScreenshots?.length ? (
            <ProjectScreenshots project={project} section="mobile" />
          ) : (
            <ProjectScreenshots project={project} featured={isFeatured} />
          )}
        </Reveal>

        <Reveal delay={0.2}>
          <div className="h-full">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
              System Architecture
            </p>
            <div className="flex min-h-[320px] flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 sm:min-h-[360px] sm:p-6">
              <ArchitectureFlow
                flowId={`${project.id}-architecture`}
                steps={project.architecture}
                className="flex-1"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {project.webScreenshot && project.additionalScreenshots?.length && (
        <Reveal delay={0.22} className="mt-8">
          <ProjectScreenshots project={project} section="web" />
        </Reveal>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {project.contributions.map((section) => (
          <Reveal key={section.title} delay={0.25}>
            <GlassCard hover>
              <h4 className="mb-3 text-sm font-medium text-zinc-200">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <ExternalLink
                      size={14}
                      className="mt-0.5 shrink-0 text-sky-500/60"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {project.features && (
        <Reveal delay={0.3} className="mt-8">
          <h4 className="mb-3 text-sm font-medium text-zinc-300">Features</h4>
          <div className="flex flex-wrap gap-2">
            {project.features.map((feature) => (
              <span
                key={feature}
                className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.35} className="mt-8">
        <ProjectTech technologies={project.technologies} />
      </Reveal>
    </article>
  );
}
