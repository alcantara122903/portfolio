import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted";
}

const variants = {
  default: "bg-white/4 text-zinc-300 border-white/10",
  accent: "bg-sky-400/8 text-sky-300 border-sky-400/20",
  muted: "bg-transparent text-zinc-500 border-white/8",
};

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
