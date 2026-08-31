"use client";

import { ScrollAmbientScene } from "@/components/three/ScrollAmbientScene";
import { AnimeScrollEffects } from "@/components/scroll/AnimeScrollEffects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollExperience() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (reducedMotion) return null;

  return (
    <>
      {!isMobile && <ScrollAmbientScene />}
      {!isMobile && <AnimeScrollEffects />}
    </>
  );
}
