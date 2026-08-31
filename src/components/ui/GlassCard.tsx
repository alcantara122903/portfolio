import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  scrollAnime?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  scrollAnime = false,
}: GlassCardProps) {
  return (
    <div
      data-anime={scrollAnime ? "card" : undefined}
      className={cn(
        "rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60",
        className,
      )}
    >
      {children}
    </div>
  );
}
