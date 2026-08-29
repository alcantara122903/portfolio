import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  label: string;
  className?: string;
}

export function StatusIndicator({ label, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm text-zinc-400",
        className,
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  );
}
