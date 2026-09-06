"use client";

import { useEffect, useRef } from "react";
import { FileText, Globe, ArrowUpRight } from "lucide-react";
import { animate, createScope, onScroll } from "animejs";
import type { Project } from "@/types/portfolio";
import { ANIME_DURATION, ANIME_EASE } from "@/lib/anime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
  const isFeatured = Boolean(project.featured);
  const isCompact = Boolean(project.compact);

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const scope = createScope({ root: rootRef }).add(() => {
      animate('[data-project="block"]', {
        opacity: [0, 1],
        y: [18, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        autoplay: onScroll({
          target: rootRef.current!,
          enter: "bottom top+=14%",
        }),
      });
    });

    return () => scope.revert();
  }, [reducedMotion, project.id]);

  return (
    <article
      ref={rootRef}
      id={project.id}
      data-gsap="project"
      className={cn(
        "relative border-t border-white/8",
        isFeatured ? "pt-14 sm:pt-20" : "pt-12 sm:pt-14",
      )}
    >
      {/* Header */}
      <header
        data-project="block"
        className={cn(
          "grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12",
          !reducedMotion && "opacity-0",
        )}
      >
        <div className="min-w-0 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-zinc-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              {isFeatured
                ? "Featured"
                : project.label ?? "Project"}
            </span>
          </div>

          <h3
            className={cn(
              "font-display font-semibold tracking-tight text-zinc-50",
              isFeatured
                ? "text-3xl sm:text-4xl lg:text-5xl"
                : "text-2xl sm:text-3xl",
            )}
          >
            {project.title}
          </h3>

          <p className="mt-3 text-base text-zinc-400 sm:text-lg">
            {project.subtitle}
          </p>
          <p className="mt-2 text-sm text-zinc-600">{project.role}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.caseStudyPath && (
            <Button href={project.caseStudyPath} variant="primary">
              Case Study
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
              Live
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

      {/* Story */}
      <div
        data-project="block"
        className={cn(
          "mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14",
          !reducedMotion && "opacity-0",
        )}
      >
        <div className="lg:col-span-7">
          <p className="max-w-2xl text-[15px] leading-[1.75] text-zinc-400 sm:text-base">
            {project.summary}
          </p>

          {project.reflection && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">
              {project.reflection}
            </p>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <ol className="mt-8 max-w-2xl space-y-4 border-t border-white/8 pt-8">
              {project.outcomes.map((item, i) => (
                <li key={item} className="flex gap-4 text-sm leading-relaxed text-zinc-300">
                  <span className="font-mono text-[11px] text-sky-400/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          )}

          {isCompact &&
            project.contributions[0] && (
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-500">
                {project.contributions[0].items.join(" · ")}
              </p>
            )}
        </div>

        <div className="lg:col-span-5">
          {project.architecture.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                Flow
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {project.architecture.map((step) => step.label).join(" → ")}
              </p>
            </div>
          )}

          {!isCompact && project.contributions.length > 0 && (
            <div className="mt-8 border-t border-white/8 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                Scope
              </p>
              <div className="mt-4 space-y-5">
                {project.contributions.slice(0, 2).map((section) => (
                  <div key={section.title}>
                    <p className="text-xs text-zinc-500">{section.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {section.items.slice(0, 5).join(" · ")}
                      {section.items.length > 5 ? " · …" : ""}
                    </p>
                  </div>
                ))}
              </div>
              {project.caseStudyPath && (
                <a
                  href={project.caseStudyPath}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-sky-400/90 transition-colors hover:text-sky-300"
                >
                  <FileText size={14} />
                  Full case study
                </a>
              )}
            </div>
          )}

          {project.team && (
            <p className="mt-8 text-xs leading-relaxed text-zinc-600">
              {project.team}
              {project.teamNotes ? ` · ${project.teamNotes}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Tech */}
      <div
        data-project="block"
        className={cn("mt-8 sm:mt-10", !reducedMotion && "opacity-0")}
      >
        <ProjectTech technologies={project.technologies} />
      </div>
    </article>
  );
}
