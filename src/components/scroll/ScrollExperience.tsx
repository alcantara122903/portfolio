"use client";

import dynamic from "next/dynamic";
import { GsapPageEffects } from "@/components/gsap/GsapPageEffects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";

const ScrollParticlesField = dynamic(
  () =>
    import("@/components/motion/ScrollParticlesField").then(
      (m) => m.ScrollParticlesField,
    ),
  { ssr: false },
);

/** One background system only — particles. No MotionPath chrome. */
export function ScrollExperience() {
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");

  return (
    <>
      {!reducedMotion && !isMobile && <ScrollParticlesField />}
      {!reducedMotion && !isMobile && <GsapPageEffects />}
    </>
  );
}
