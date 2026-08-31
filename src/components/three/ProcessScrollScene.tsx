"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ProcessCanvas = dynamic(
  () =>
    import("@/components/three/ProcessScrollCanvas").then(
      (m) => m.ProcessScrollCanvas,
    ),
  { ssr: false },
);

interface ProcessScrollSceneProps {
  progressRef: React.MutableRefObject<number>;
}

export function ProcessScrollScene({ progressRef }: ProcessScrollSceneProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (reducedMotion || isMobile) return null;

  return (
    <div
      className="relative pointer-events-none mb-10 hidden h-44 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-950/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_40px_-16px_rgba(56,189,248,0.15)] md:block lg:h-52"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.08)_0%,transparent_60%)]" />
      <ProcessCanvas progressRef={progressRef} />
    </div>
  );
}
