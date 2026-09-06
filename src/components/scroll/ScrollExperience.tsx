"use client";

import { GsapSignalScene } from "@/components/gsap/GsapSignalScene";
import { GsapPageEffects } from "@/components/gsap/GsapPageEffects";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollExperience() {
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");

  if (reducedMotion || isMobile) return null;

  return (
    <>
      <GsapSignalScene />
      <GsapPageEffects />
    </>
  );
}
