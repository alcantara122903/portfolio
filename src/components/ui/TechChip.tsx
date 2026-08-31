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
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium tracking-wide transition-colors",
        active
          ? "border-sky-400/50 bg-sky-400/10 text-sky-300 shadow-[0_0_20px_-8px_rgba(56,189,248,0.45)]"
          : "border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-sky-500/30 hover:text-zinc-100",
        className,
      )}
    >
      {label}
    </span>
  );
}
