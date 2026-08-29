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
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-sky-500/40 bg-sky-500/10 text-sky-300"
          : "border-zinc-700/70 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600",
        className,
      )}
    >
      {label}
    </span>
  );
}
