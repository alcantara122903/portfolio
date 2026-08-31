"use client";

import { useEffect, useRef } from "react";
import { Check, FileText, Globe } from "lucide-react";
import { animate, createScope, onScroll, stagger } from "animejs";
import type { Project } from "@/types/portfolio";
import { ANIME_DURATION, ANIME_EASE } from "@/lib/anime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArchitectureFlow } from "@/components/projects/ArchitectureFlow";
import { ProjectScreenshots } from "@/components/projects/ProjectScreenshots";
import { ProjectTech } from "@/components/projects/ProjectTech";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ProjectShowcaseProps {
  project: Project;
  index?: number;
}

export function ProjectShowcase({ project, index = 0 }: ProjectShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isFeatured = project.featured;
  const isCompact = project.compact;

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const scope = createScope({ root: rootRef }).add(() => {
      animate('[data-project="block"]', {
        opacity: [0, 1],
        y: [22, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        delay: stagger(90),
        autoplay: onScroll({
          target: rootRef.current!,
          enter: "bottom top+=12%",
        }),
      });
    });

    return () => scope.revert();
  }, [reducedMotion, project.id]);

  return (
    <article
      ref={rootRef}
      id={project.id}
      className={cn(
        "relative border-t border-zinc-800/70 pt-12 sm:pt-16",
        isFeatured && "border-sky-500/20",
        isCompact && "pt-10 sm:pt-12",
      )}
    >
      {isFeatured && (
        <div
          className="pointer-events-none absolute -left-4 top-12 h-40 w-px bg-linear-to-b from-sky-400/70 via-sky-400/20 to-transparent sm:-left-6"
          aria-hidden="true"
        />
      )}

      <header
        data-project="block"
        className={cn(
          "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
          !reducedMotion && "opacity-0",
        )}
      >
        <div className="min-w-0 max-w-2xl">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] text-sky-400/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              {isFeatured
                ? "Featured Capstone"
                : project.label ?? "Project"}
            </p>
          </div>

          <h3
            className={cn(
              "text-balance font-semibold tracking-tight text-zinc-50",
              isCompact
                ? "text-2xl sm:text-3xl"
                : "text-3xl sm:text-4xl lg:text-[2.75rem]",
            )}
          >
            {project.title}
          </h3>
          <p className="mt-2 text-base text-zinc-400 sm:text-lg">
            {project.subtitle}
          </p>
          <p className="mt-1 text-sm text-zinc-500">{project.role}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {project.caseStudyPath && (
            <Button href={project.caseStudyPath} variant="primary">
              <FileText size={16} />
              Case Study
            </Button>
          )}
          {project.liveUrl && (
            <Button
              href={project.liveUrl}
              variant={project.caseStudyPath ? "outline" : "primary"}
              target="_blank"
              rel="noopener noreferrer"
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
            >
              <GitHubIcon size={16} />
              GitHub
            </Button>
          )}
        </div>
      </header>

      <div
        data-project="block"
        className={cn("mt-8 max-w-3xl", !reducedMotion && "opacity-0")}
      >
        <p className="text-base leading-relaxed text-zinc-400">
          {project.summary}
        </p>
        {project.reflection && (
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            {project.reflection}
          </p>
        )}
        {project.team && (
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            {project.team}. {project.teamNotes}
          </p>
        )}
      </div>

      {project.outcomes && project.outcomes.length > 0 && (
        <div
          data-project="block"
          className={cn("mt-8 max-w-3xl", !reducedMotion && "opacity-0")}
        >
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-400/80">
            Outcomes
          </h4>
          <ul className="space-y-3">
            {project.outcomes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300"
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
      )}

      {!isCompact && (
        <div
          data-project="block"
          className={cn(
            "mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-16",
            !reducedMotion && "opacity-0",
          )}
        >
          <div>
            {project.screenshotSrc && project.additionalScreenshots?.length ? (
              <ProjectScreenshots project={project} section="mobile" />
            ) : (
              <ProjectScreenshots project={project} featured={isFeatured} />
            )}
          </div>

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              System Architecture
            </p>
            <ArchitectureFlow
              flowId={`${project.id}-architecture`}
              steps={project.architecture}
            />
          </div>
        </div>
      )}

      {isCompact && project.screenshotSrc && (
        <div
          data-project="block"
          className={cn("mt-8 max-w-lg", !reducedMotion && "opacity-0")}
        >
          <ProjectScreenshots project={project} featured={false} />
        </div>
      )}

      {!isCompact && project.webScreenshot && project.additionalScreenshots?.length ? (
        <div
          data-project="block"
          className={cn("mt-12", !reducedMotion && "opacity-0")}
        >
          <ProjectScreenshots project={project} section="web" />
        </div>
      ) : null}

      {!isCompact && (
        <div
          data-project="block"
          className={cn(
            "mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12",
            !reducedMotion && "opacity-0",
          )}
        >
          {project.contributions.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-400/80">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
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
      )}

      {isCompact &&
        project.contributions.map((section) => (
          <div
            key={section.title}
            data-project="block"
            className={cn("mt-8 max-w-2xl", !reducedMotion && "opacity-0")}
          >
            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-400/80">
              {section.title}
            </h4>
            <p className="text-sm leading-relaxed text-zinc-400">
              {section.items.join(" · ")}
            </p>
          </div>
        ))}

      {project.features && project.features.length > 0 && !isCompact && (
        <div
          data-project="block"
          className={cn("mt-12", !reducedMotion && "opacity-0")}
        >
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Features
          </h4>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
            {project.features.join(" · ")}
          </p>
        </div>
      )}

      <div
        data-project="block"
        className={cn("mt-10", !reducedMotion && "opacity-0")}
      >
        <ProjectTech technologies={project.technologies} />
      </div>
    </article>
  );
}
