"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, onScroll, stagger } from "animejs";
import { ANIME_DURATION, ANIME_EASE } from "@/lib/anime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ArchitectureFlowProps {
  steps: { label: string }[];
  className?: string;
  vertical?: boolean;
  flowId?: string;
}

export function ArchitectureFlow({
  steps,
  className,
  vertical = true,
  flowId = "flow",
}: ArchitectureFlowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const scope = createScope({ root: rootRef }).add(() => {
      animate('[data-flow="step"]', {
        opacity: [0, 1],
        y: [12, 0],
        duration: ANIME_DURATION.fast,
        ease: ANIME_EASE.outSoft,
        delay: stagger(70),
        autoplay: onScroll({
          target: rootRef.current!,
          enter: "bottom top+=18%",
        }),
      });
    });

    return () => scope.revert();
  }, [reducedMotion, steps, flowId]);

  if (!vertical) {
    return (
      <div ref={rootRef} className={cn("flex flex-wrap items-center gap-2", className)}>
        {steps.map((step, index) => (
          <div key={`${flowId}-${step.label}`} className="flex items-center gap-2">
            <FlowStep label={step.label} index={index} accent={index === 0} />
            {index < steps.length - 1 && (
              <span className="text-sky-500/40" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("flex w-full flex-col gap-0", className)}>
      {steps.map((step, index) => (
        <div
          key={`${flowId}-${step.label}`}
          data-flow="step"
          className={cn(
            "flex w-full flex-col items-stretch",
            !reducedMotion && "opacity-0",
          )}
        >
          <FlowStep label={step.label} index={index} accent={index === 0} />
          {index < steps.length - 1 && (
            <div className="flex justify-center py-1.5" aria-hidden="true">
              <div className="h-5 w-px bg-linear-to-b from-sky-400/40 to-zinc-800" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FlowStep({
  label,
  index,
  accent,
}: {
  label: string;
  index: number;
  accent: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors sm:px-4",
        accent
          ? "bg-sky-400/8 text-sky-200 ring-1 ring-sky-400/30"
          : "bg-transparent text-zinc-400 ring-1 ring-zinc-800/60 hover:ring-zinc-700/80",
      )}
    >
      <span
        className={cn(
          "font-mono text-[10px] tabular-nums",
          accent ? "text-sky-400" : "text-zinc-600",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-left text-[10px] font-medium uppercase leading-snug tracking-[0.12em] sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}
