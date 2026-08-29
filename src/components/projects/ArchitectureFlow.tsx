"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const reducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!vertical) {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <FlowBox
              label={step.label}
              highlighted={index === 0 || index === hoveredIndex}
              reducedMotion={reducedMotion}
              pulseId={`${flowId}-${index}`}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
            {index < steps.length - 1 && (
              <span className="text-zinc-600">→</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col", className)}>
      {steps.map((step, index) => {
        const highlighted = index === 0 || index === hoveredIndex;

        return (
          <div key={step.label} className="flex w-full flex-col items-center">
            <FlowBox
              label={step.label}
              highlighted={highlighted}
              reducedMotion={reducedMotion}
              pulseId={`${flowId}-${index}`}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
            {index < steps.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <div className="h-3 w-px bg-zinc-700" />
                <span className="text-[10px] leading-none text-zinc-600">↓</span>
                <div className="h-3 w-px bg-zinc-700" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FlowBox({
  label,
  highlighted,
  reducedMotion,
  pulseId,
  onHover,
  onLeave,
}: {
  label: string;
  highlighted: boolean;
  reducedMotion: boolean;
  pulseId: string;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      className={cn(
        "relative w-full rounded-lg border px-3 py-2 text-center text-[9px] font-semibold uppercase leading-snug tracking-wide transition-colors min-[380px]:text-[10px] sm:px-4 sm:py-2.5 sm:text-[11px]",
        highlighted
          ? "border-sky-500/60 bg-sky-500/5 text-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.08)]"
          : "border-zinc-800/80 bg-zinc-900/40 text-zinc-500",
      )}
      animate={reducedMotion ? undefined : { scale: highlighted ? 1.01 : 1 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {label}
      {!reducedMotion && highlighted && (
        <motion.span
          key={pulseId}
          className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sky-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.div>
  );
}
