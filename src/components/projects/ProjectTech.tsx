import { TechChip } from "@/components/ui/TechChip";
import { cn } from "@/lib/utils";

interface ProjectTechProps {
  technologies: string[];
  className?: string;
}

export function ProjectTech({ technologies, className }: ProjectTechProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {technologies.map((tech) => (
        <TechChip key={tech} label={tech} />
      ))}
    </div>
  );
}
