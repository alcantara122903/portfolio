import { cn } from "@/lib/utils";

interface ProjectTechProps {
  technologies: string[];
  className?: string;
}

/** Plain text stack — no chip soup. */
export function ProjectTech({ technologies, className }: ProjectTechProps) {
  return (
    <p className={cn("text-sm leading-relaxed text-zinc-400", className)}>
      {technologies.join(" · ")}
    </p>
  );
}
