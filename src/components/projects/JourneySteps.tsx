import { cn } from "@/lib/utils";

interface JourneyStepsProps {
  steps: string[];
  className?: string;
}

/** Horizontal journey for Tipuno — different rhythm from NU-SECURE list flow. */
export function JourneySteps({ steps, className }: JourneyStepsProps) {
  return (
    <ol
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7",
        className,
      )}
      aria-label="Customer journey"
    >
      {steps.map((step, index) => (
        <li key={`${step}-${index}`} className="min-w-0">
          <p className="font-mono text-[10px] tabular-nums text-zinc-600">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm font-medium leading-snug text-zinc-200">
            {step}
          </p>
          {index < steps.length - 1 && (
            <p className="mt-2 hidden font-mono text-[10px] text-zinc-700 lg:block">
              →
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
