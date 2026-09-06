import { cn } from "@/lib/utils";

interface TechChipProps {
  label: string;
  className?: string;
  active?: boolean;
}

export function TechChip({ label, className, active }: TechChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight transition-colors",
        active
          ? "border-sky-400/35 bg-sky-400/10 text-sky-300"
          : "border-white/8 bg-transparent text-zinc-400 hover:border-white/16 hover:text-zinc-200",
        className,
      )}
    >
      {label}
    </span>
  );
}
