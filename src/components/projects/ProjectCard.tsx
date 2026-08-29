import { ProjectTech } from "@/components/projects/ProjectTech";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  role: string;
  summary: string;
  technologies: string[];
  label?: string;
}

export function ProjectCard({
  title,
  subtitle,
  role,
  summary,
  technologies,
  label,
}: ProjectCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6">
      {label && (
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-sky-400/80">
          {label}
        </p>
      )}
      <h3 className="text-xl font-semibold text-zinc-50">{title}</h3>
      <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
      <p className="mt-1 text-xs text-zinc-500">{role}</p>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{summary}</p>
      <ProjectTech technologies={technologies} className="mt-5" />
    </article>
  );
}
