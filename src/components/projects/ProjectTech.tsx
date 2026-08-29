import { TechChip } from "@/components/ui/TechChip";
import { cn } from "@/lib/utils";

interface ProjectTechProps {
  technologies: string[];
  className?: string;
}

export function ProjectTech({ technologies, className }: ProjectTechProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {technologies.map((tech) => (
        <TechChip key={tech} label={tech} />
      ))}
    </div>
  );
}
