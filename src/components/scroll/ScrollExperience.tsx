"use client";

import dynamic from "next/dynamic";
import { GsapPageEffects } from "@/components/gsap/GsapPageEffects";
import { ScrollMotionPath } from "@/components/motion/ScrollMotionPath";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ScrollParticlesField = dynamic(
  () =>
    import("@/components/motion/ScrollParticlesField").then(
      (m) => m.ScrollParticlesField,
    ),
  { ssr: false },
);

/**
 * One unique theme: canvas particles (loader + homepage)
 * + MotionPath traveler scrubbed to scroll.
 */
export function ScrollExperience() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <ScrollParticlesField />
      <ScrollMotionPath />
      {!reducedMotion && <GsapPageEffects />}
    </>
  );
}
