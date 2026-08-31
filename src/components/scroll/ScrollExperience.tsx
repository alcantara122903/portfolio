"use client";

import { ScrollAmbientScene } from "@/components/three/ScrollAmbientScene";
import { AnimeScrollEffects } from "@/components/scroll/AnimeScrollEffects";

export function ScrollExperience() {
  return (
    <>
      <ScrollAmbientScene />
      <AnimeScrollEffects />
    </>
  );
}
