import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted";
}

const variants = {
  default: "bg-zinc-800/80 text-zinc-200 border-zinc-700/60",
  accent: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  muted: "bg-zinc-900/60 text-zinc-400 border-zinc-800",
};

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
