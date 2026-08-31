"use client";

import dynamic from "next/dynamic";
import { useScrollProgressRef } from "@/hooks/useScrollProgressRef";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const AmbientCanvas = dynamic(
  () =>
    import("@/components/three/ScrollAmbientCanvas").then(
      (m) => m.ScrollAmbientCanvas,
    ),
  { ssr: false },
);

export function ScrollAmbientScene() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { progressRef } = useScrollProgressRef();

  if (reducedMotion || isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/40 via-transparent to-zinc-950/60" />
      <AmbientCanvas progressRef={progressRef} />
    </div>
  );
}
