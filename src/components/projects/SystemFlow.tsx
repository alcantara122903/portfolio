import { cn } from "@/lib/utils";

interface SystemFlowProps {
  steps: string[];
  className?: string;
}

/** Editorial system path — hairline nodes, not cards. */
export function SystemFlow({ steps, className }: SystemFlowProps) {
  return (
    <ol
      className={cn(
        "flex flex-col gap-0 border-l border-white/10 pl-0",
        className,
      )}
      aria-label="System flow"
    >
      {steps.map((step, index) => (
        <li
          key={`${step}-${index}`}
          className="relative flex gap-4 border-b border-white/6 py-3 last:border-b-0 sm:py-3.5"
        >
          <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-zinc-600">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm leading-snug text-zinc-300 sm:text-[15px]">
            {step}
          </span>
          {index < steps.length - 1 && (
            <span
              className="absolute -bottom-px left-7 hidden text-[10px] text-zinc-700 sm:block"
              aria-hidden="true"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
