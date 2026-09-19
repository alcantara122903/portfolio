"use client";

import { FileText, Globe, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { ProjectTech } from "@/components/projects/ProjectTech";
import { ProjectScreenshots } from "@/components/projects/ProjectScreenshots";
import { NuSecureFlow } from "@/components/motion/NuSecureFlow";
import { TipunoTrack } from "@/components/motion/TipunoTrack";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ProjectShowcaseProps {
  project: Project;
  index?: number;
}

export function ProjectShowcase({ project, index = 0 }: ProjectShowcaseProps) {
  const isFeatured = Boolean(project.featured);
  const isTipuno = project.id === "tipuno";

  return (
    <article
      id={project.id}
      data-gsap="project"
      data-story={isFeatured ? "nu-secure" : isTipuno ? "tipuno" : "project"}
      className={cn(
        "relative border-t border-white/8",
        isFeatured ? "pt-14 sm:pt-20" : "pt-12 sm:pt-14",
      )}
    >
      <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
        <div className="min-w-0 max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-sm text-zinc-400">
            <span className="font-mono text-[11px] tabular-nums text-zinc-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              {isFeatured
                ? "Capstone case study"
                : (project.label ?? "Project")}
            </span>
          </div>

          <h3
            className={cn(
              "font-display font-semibold tracking-tight text-zinc-50",
              isFeatured
                ? "text-3xl sm:text-4xl lg:text-[2.75rem]"
                : "text-2xl sm:text-3xl",
            )}
          >
            {project.title}
          </h3>

          <p className="mt-3 text-base text-zinc-400 sm:text-lg">
            {project.subtitle}
          </p>
          <p className="mt-2 text-sm text-zinc-500">{project.role}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.caseStudyPath && (
            <Button href={project.caseStudyPath} variant="primary">
              Case study
              <ArrowUpRight size={14} />
            </Button>
          )}
          {project.liveUrl && (
            <Button
              href={project.liveUrl}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe size={14} />
              Live site
            </Button>
          )}
          {project.githubUrl && (
            <Button
              href={project.githubUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon size={14} />
              Code
            </Button>
          )}
        </div>
      </header>

      {isFeatured ? (
        <div className="mt-10 space-y-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-10 lg:col-span-6">
              <div>
                <h4 className="text-sm font-medium text-zinc-300">Problem</h4>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-zinc-400">
                  {project.summary}
                </p>
              </div>

              {project.outcomes && project.outcomes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-300">
                    My contribution
                  </h4>
                  <ol className="mt-4 max-w-2xl space-y-4">
                    {project.outcomes.map((item, i) => (
                      <li
                        key={item}
                        className="flex gap-4 text-sm leading-relaxed text-zinc-300"
                      >
                        <span className="font-mono text-[11px] text-zinc-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {project.contributions[0] && (
                <div className="border-t border-white/8 pt-8">
                  <h4 className="text-sm font-medium text-zinc-300">Scope</h4>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
                    {project.contributions[0].items.slice(0, 6).join(" / ")}
                  </p>
                  {project.caseStudyPath && (
                    <a
                      href={project.caseStudyPath}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm text-[var(--accent)] transition-colors hover:text-sky-200"
                    >
                      <FileText size={14} />
                      Full case study
                    </a>
                  )}
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-zinc-300">Stack</h4>
                <div className="mt-4">
                  <ProjectTech technologies={project.technologies} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <NuSecureFlow />
            </div>
          </div>

          <div className="border-t border-white/8 pt-10">
            <h4 className="mb-6 text-sm font-medium text-zinc-300">
              Product UI
            </h4>
            <ProjectScreenshots project={project} section="single" />
          </div>
        </div>
      ) : isTipuno ? (
        <div className="mt-10 space-y-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h4 className="text-sm font-medium text-zinc-300">Overview</h4>
              <p className="mt-3 text-[15px] leading-[1.75] text-zinc-400">
                {project.summary}
              </p>
              {project.reflection && (
                <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                  {project.reflection}
                </p>
              )}
              <div className="mt-6">
                <ProjectTech technologies={project.technologies} />
              </div>
            </div>
            <div className="lg:col-span-8">
              <TipunoTrack />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-[15px] leading-[1.75] text-zinc-400">
              {project.summary}
            </p>
            {project.reflection && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
                {project.reflection}
              </p>
            )}
          </div>
          <div className="lg:col-span-5">
            <ProjectTech technologies={project.technologies} />
          </div>
        </div>
      )}
    </article>
  );
}
